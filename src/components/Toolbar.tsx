"use client";

import { useRef } from "react";
import { useWayMapStore } from "@/store/waymapStore";
import { deserializeWayMap, downloadWayMap, serializeWayMap } from "@/lib/waymap";

const btn =
  "rounded border border-gray-300 bg-white px-2.5 py-1 text-sm text-gray-700 hover:border-blue-400 hover:bg-blue-50";

export default function Toolbar() {
  const title = useWayMapStore((s) => s.title);
  const setTitle = useWayMapStore((s) => s.setTitle);
  const fileRef = useRef<HTMLInputElement>(null);

  const onExport = () => {
    const { nodes, edges, title } = useWayMapStore.getState();
    downloadWayMap(serializeWayMap(nodes, edges, title));
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일 재선택 허용
    if (!file) return;
    try {
      const doc = JSON.parse(await file.text());
      const { nodes, edges, title } = deserializeWayMap(doc);
      useWayMapStore.getState().replaceAll(nodes, edges, title);
    } catch (err) {
      alert(`불러오기 실패: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    }
  };

  const onNew = () => {
    if (confirm("현재 작업을 비우고 새로 시작할까요?")) {
      useWayMapStore.getState().clear();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="WayMap 제목"
        className="w-44 rounded border border-gray-300 px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
      />
      <button type="button" onClick={onNew} className={btn}>
        새로
      </button>
      <button type="button" onClick={() => fileRef.current?.click()} className={btn}>
        불러오기
      </button>
      <button type="button" onClick={onExport} className={btn}>
        JSON 저장
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        onChange={onImportFile}
        className="hidden"
      />
    </div>
  );
}
