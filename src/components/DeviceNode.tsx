"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { DeviceData, Port } from "@/lib/types";
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

// 같은 단자(커넥터) 유형끼리 모이도록 정렬 — 첫 등장 순서는 유지(안정).
function groupByConnector(ports: Port[]): Port[] {
  const order: string[] = [];
  const buckets = new Map<string, Port[]>();
  for (const p of ports) {
    const key = p.connector ?? "~none";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(p);
  }
  return order.flatMap((k) => buckets.get(k)!);
}

const HANDLE_BASE = "!h-2.5 !w-2.5 !border-2 !border-white";

export default function DeviceNode({ data, selected }: NodeProps<Node<DeviceData>>) {
  const style = CATEGORY_STYLE[data.category] ?? CATEGORY_STYLE.pc;
  const left = groupByConnector(data.ports.filter((p) => p.direction === "in"));
  const right = groupByConnector(data.ports.filter((p) => p.direction !== "in"));

  return (
    <div
      className={`min-w-[180px] rounded-lg border bg-white text-xs shadow-sm transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
      }`}
    >
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
