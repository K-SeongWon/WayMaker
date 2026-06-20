"use client";

import { DEVICE_TYPES, TYPE_GROUP_ORDER, type DeviceTypeDef } from "@/lib/devices";
import { ZONE_COLORS, ZONE_PRESETS } from "@/lib/zones";
import CategoryIcon, { CATEGORY_STYLE } from "./CategoryIcon";

const GROUPED = TYPE_GROUP_ORDER.map((group) => ({
  group,
  items: DEVICE_TYPES.filter((t) => t.group === group),
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

      {/* 장치 종류 */}
      <div className="space-y-4">
        {GROUPED.map((g) => (
          <div key={g.group}>
            <div className="mb-1 text-[11px] font-semibold text-gray-500">{g.group}</div>
            <ul className="space-y-1.5">
              {g.items.map((t: DeviceTypeDef) => (
                <li
                  key={t.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/waymaker", `type:${t.id}`);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className="flex cursor-grab items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm shadow-sm hover:border-blue-400 hover:shadow active:cursor-grabbing"
                >
                  <CategoryIcon
                    category={t.category}
                    className={CATEGORY_STYLE[t.category].icon}
                  />
                  <span className="font-medium text-gray-800">{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
