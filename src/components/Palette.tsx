"use client";

import {
  CATEGORY_META,
  CATEGORY_ORDER,
  DEVICE_PRESETS,
  type DevicePreset,
} from "@/lib/devices";
import { ZONE_COLORS, ZONE_PRESETS } from "@/lib/zones";
import type { DeviceCategory } from "@/lib/types";
import CategoryIcon, { CATEGORY_STYLE } from "./CategoryIcon";

// 카테고리별로 그룹핑
const GROUPED: { category: DeviceCategory; items: DevicePreset[] }[] =
  CATEGORY_ORDER.map((category) => ({
    category,
    items: DEVICE_PRESETS.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

export default function Palette() {
  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        팔레트
      </h2>
      <p className="mb-3 text-[11px] text-gray-400">캔버스로 끌어다 놓으세요</p>

      {/* 장소(구획) */}
      <div className="mb-4">
        <div className="mb-1 text-[11px] font-semibold text-gray-500">장소 (구획)</div>
        <div className="flex flex-wrap gap-1.5">
          {ZONE_PRESETS.map((z) => {
            const c = ZONE_COLORS[z.color];
            return (
              <div
                key={z.key}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/waymaker", `zone:${z.key}`);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className={`cursor-grab rounded border px-2 py-1 text-[11px] font-medium ${c.border} ${c.label} active:cursor-grabbing`}
              >
                {z.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-1 text-[11px] font-semibold text-gray-500">장비</div>
      <div className="space-y-4">
        {GROUPED.map((group) => (
          <div key={group.category}>
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
              <CategoryIcon
                category={group.category}
                className={CATEGORY_STYLE[group.category].icon}
              />
              {CATEGORY_META[group.category].label}
            </div>
            <ul className="space-y-1.5">
              {group.items.map((preset) => (
                <li
                  key={preset.key}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/waymaker", preset.key);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  title={preset.note}
                  className="cursor-grab rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm shadow-sm hover:border-blue-400 hover:shadow active:cursor-grabbing"
                >
                  <div className="font-medium text-gray-800">{preset.model}</div>
                  <div className="text-[11px] text-gray-400">
                    {preset.brand ? `${preset.brand} · ` : ""}
                    {preset.confidence === "low"
                      ? "일반형(편집)"
                      : preset.confidence === "medium"
                        ? "스펙 추정"
                        : "스펙 확인"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
