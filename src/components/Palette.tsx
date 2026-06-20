"use client";

import type { PresetKey } from "@/lib/devicePresets";

const ITEMS: { key: PresetKey; label: string; hint: string }[] = [
  { key: "mic", label: "🎤 마이크", hint: "출력 1" },
  { key: "mixer", label: "🎛️ X32 Compact", hint: "입력 2 · 출력 2" },
  { key: "speaker", label: "🔊 액티브 스피커", hint: "입력 1 · 스루 1" },
];

export default function Palette() {
  return (
    <aside className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        장비 팔레트
      </h2>
      <p className="mb-3 text-[11px] text-gray-400">캔버스로 끌어다 놓으세요</p>
      <ul className="space-y-2">
        {ITEMS.map((it) => (
          <li
            key={it.key}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/waymaker", it.key);
              e.dataTransfer.effectAllowed = "move";
            }}
            className="cursor-grab rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:border-blue-400 hover:shadow active:cursor-grabbing"
          >
            <div className="font-medium text-gray-800">{it.label}</div>
            <div className="text-[11px] text-gray-400">{it.hint}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
