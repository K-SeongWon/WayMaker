"use client";

import { useWayMapStore } from "@/store/waymapStore";

export default function PropertiesPanel() {
  const selected = useWayMapStore((s) => s.selected);

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50 p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">속성</h2>

      {!selected ? (
        <p className="text-sm text-gray-400">장비를 선택하면 정보가 표시됩니다.</p>
      ) : (
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[11px] text-gray-400">이름</div>
            <div className="font-medium text-gray-800">{selected.data.label}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400">카테고리 / 모델</div>
            <div className="text-gray-700">
              {selected.data.category}
              {selected.data.model ? ` · ${selected.data.model}` : ""}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[11px] text-gray-400">
              I/O 포트 ({selected.data.ports.length})
            </div>
            <ul className="space-y-1">
              {selected.data.ports.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1"
                >
                  <span className="text-gray-700">{p.name}</span>
                  <span className="text-[11px] text-gray-400">
                    {p.direction} · {p.connector ?? "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
