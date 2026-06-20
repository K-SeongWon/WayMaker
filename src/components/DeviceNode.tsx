"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { DeviceData, Port, PortSide } from "@/lib/types";
import { getPreset } from "@/lib/devices";
import CategoryIcon, { CATEGORY_STYLE } from "./CategoryIcon";
import DeviceArt from "./DeviceArt";

// 포트 방향은 신호 흐름(M6 애니메이션)의 핵심 메타데이터다.
//  - in   : 입력 (emerald) / out : 출력 (sky) / bidi : 데이터·양방향 (amber)
// 포트당 핸들은 정확히 1개. 데이터 포트의 양방향 결선은 캔버스의 ConnectionMode.Loose.
function handleColor(dir: Port["direction"]) {
  if (dir === "in") return "!bg-emerald-500";
  if (dir === "out") return "!bg-sky-500";
  return "!bg-amber-500";
}

function sidePosition(side: PortSide): Position {
  return side === "top"
    ? Position.Top
    : side === "bottom"
      ? Position.Bottom
      : side === "left"
        ? Position.Left
        : Position.Right;
}

const HANDLE_BASE = "!h-2.5 !w-2.5 !border-2 !border-white";

export default function DeviceNode({ data, selected }: NodeProps<Node<DeviceData>>) {
  const style = CATEGORY_STYLE[data.category] ?? CATEGORY_STYLE.pc;
  const borderCls = selected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300";

  // ── 실패널형(모델별 레이아웃) ──
  const preset = data.model ? getPreset(data.model) : undefined;
  const layout = preset?.layout;
  const usePanel = layout && data.ports.some((p) => p.pos);

  if (usePanel && layout) {
    return (
      <div
        className={`relative rounded-md border bg-white shadow-sm transition-colors ${borderCls}`}
        style={{ width: layout.w, height: layout.h }}
      >
        {/* 배경 워터마크 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
          <DeviceArt category={data.category} modelKey={data.model} className={style.icon} />
        </div>

        {/* 라벨 */}
        <div
          className={`absolute left-1.5 top-1.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold ${style.header}`}
        >
          <CategoryIcon category={data.category} className={style.icon} />
          <span>{data.label}</span>
        </div>

        {/* 그룹(섹션) 라벨 */}
        {layout.ports.map((pl) => (
          <span
            key={pl.group}
            className="pointer-events-none absolute whitespace-nowrap text-[7px] uppercase tracking-wide text-gray-400"
            style={{
              left: pl.x - 2,
              top: pl.side === "bottom" ? pl.y + 8 : pl.y - 11,
            }}
          >
            {pl.group}
          </span>
        ))}

        {/* 핀(핸들) */}
        {data.ports.map((p) =>
          p.pos ? (
            <Handle
              key={p.id}
              id={p.id}
              type={p.direction === "in" ? "target" : "source"}
              position={sidePosition(p.pos.side)}
              title={`${p.name}${p.connector ? ` · ${p.connector}` : ""}`}
              style={{ left: p.pos.x, top: p.pos.y }}
              className={`${HANDLE_BASE} ${handleColor(p.direction)}`}
            />
          ) : null,
        )}
      </div>
    );
  }

  // ── 기본형(좌/우 목록) ──
  const left = data.ports.filter((p) => p.direction === "in");
  const right = data.ports.filter((p) => p.direction !== "in");

  return (
    <div className={`min-w-[180px] rounded-lg border bg-white text-xs shadow-sm transition-colors ${borderCls}`}>
      <div
        className={`flex items-center gap-1.5 rounded-t-lg border-b border-gray-200 px-2 py-1.5 font-semibold ${style.header}`}
      >
        <CategoryIcon category={data.category} className={style.icon} />
        <span className="truncate">{data.label}</span>
      </div>

      <div className="border-b border-gray-100 bg-white px-2 py-1">
        <DeviceArt category={data.category} modelKey={data.model} className={style.icon} />
      </div>

      <div className="flex justify-between py-2">
        <div className="flex flex-col gap-1.5">
          {left.map((p) => (
            <div key={p.id} className="relative pl-3 pr-1 text-gray-600">
              <Handle
                id={p.id}
                type="target"
                position={Position.Left}
                className={`${HANDLE_BASE} ${handleColor(p.direction)}`}
              />
              ▸ {p.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {right.map((p) => (
            <div key={p.id} className="relative pl-1 pr-3 text-right text-gray-600">
              <Handle
                id={p.id}
                type="source"
                position={Position.Right}
                className={`${HANDLE_BASE} ${handleColor(p.direction)}`}
              />
              {p.direction === "bidi" ? "⇄ " : ""}
              {p.name}
              {p.direction === "out" ? " ▸" : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
