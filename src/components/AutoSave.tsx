"use client";

import { useEffect, useRef } from "react";
import { useWayMapStore } from "@/store/waymapStore";
import { AUTOSAVE_KEY, deserializeWayMap, serializeWayMap } from "@/lib/waymap";

// 앱 로드 시 localStorage에서 자동 복원하고, 이후 변경을 디바운스 저장한다.
// 렌더링은 하지 않는다(부수효과 전용 컴포넌트).
export default function AutoSave() {
  const loaded = useRef(false);

  useEffect(() => {
    // 1) 복원 (구독 등록 전에 수행 → 복원 자체로는 저장이 트리거되지 않음)
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const { nodes, edges, title } = deserializeWayMap(JSON.parse(raw));
        useWayMapStore.getState().replaceAll(nodes, edges, title);
      }
    } catch {
      // 손상된 자동저장은 무시
    }
    loaded.current = true;

    // 2) 변경 구독 → 디바운스 저장
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useWayMapStore.subscribe((state) => {
      if (!loaded.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const doc = serializeWayMap(state.nodes, state.edges, state.title);
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(doc));
        } catch {
          // 저장 실패는 조용히 무시 (용량 초과 등)
        }
      }, 500);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return null;
}
