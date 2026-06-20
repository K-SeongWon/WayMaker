"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { DeviceData, Port } from "@/lib/types";
import CategoryIcon, { CATEGORY_STYLE } from "./CategoryIcon";

// 포트 방향은 신호 흐름(M6 애니메이션)의 핵심 메타데이터다.
//  - in   : 입력  → 왼쪽 target 핸들 (emerald)
//  - out  : 출력  → 오른쪽 source 핸들 (sky)
//  - bidi : 데이터(양방향, 예: AES50·이더넷) → 오른쪽 source 핸들 (amber)
// 포트당 핸들은 정확히 1개여야 한다(중복 id 금지). 데이터 포트의 양방향 결선은
// 캔버스의 ConnectionMode.Loose 가 처리한다.
function handleColor(dir: Port["direction"]) {
  if (dir === "in") return "!bg-emerald-500";
  if (dir === "out") return "!bg-sky-500";
  return "!bg-amber-500";
}

const HANDLE_BASE = "!h-2.5 !w-2.5 !border-2 !border-white";

export default function DeviceNode({ data, selected }: NodeProps<Node<DeviceData>>) {
  const left = data.ports.filter((p) => p.direction === "in");
  const right = data.ports.filter((p) => p.direction !== "in"); // out + bidi
  const style = CATEGORY_STYLE[data.category] ?? CATEGORY_STYLE.pc;

  // 포트가 많은 장비(예: X32)는 노드 높이를 포트 수에 맞춰 키운다.
  const rows = Math.max(left.length, right.length);
  const minHeight = 44 + rows * 16;

  return (
    <div
      className={`min-w-[170px] rounded-lg border bg-white text-xs shadow-sm transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
      }`}
      style={{ minHeight }}
    >
      <div
        className={`flex items-center gap-1.5 rounded-t-lg border-b border-gray-200 px-2 py-1.5 font-semibold ${style.header}`}
      >
        <CategoryIcon category={data.category} className={style.icon} />
        <span className="truncate">{data.label}</span>
      </div>

      <div className="flex justify-between gap-4 px-3 py-2">
        <div className="flex flex-col gap-1.5">
          {left.map((p) => (
            <span key={p.id} className="text-gray-600">
              ▸ {p.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 text-right">
          {right.map((p) => (
            <span key={p.id} className="text-gray-600">
              {p.direction === "bidi" ? "⇄ " : ""}
              {p.name}
              {p.direction === "out" ? " ▸" : ""}
            </span>
          ))}
        </div>
      </div>

      {left.map((p, i) => (
        <Handle
          key={p.id}
          id={p.id}
          type="target"
          position={Position.Left}
          style={{ top: `${((i + 1) / (left.length + 1)) * 100}%` }}
          className={`${HANDLE_BASE} ${handleColor(p.direction)}`}
        />
      ))}
      {right.map((p, i) => (
        <Handle
          key={p.id}
          id={p.id}
          type="source"
          position={Position.Right}
          style={{ top: `${((i + 1) / (right.length + 1)) * 100}%` }}
          className={`${HANDLE_BASE} ${handleColor(p.direction)}`}
        />
      ))}
    </div>
  );
}
