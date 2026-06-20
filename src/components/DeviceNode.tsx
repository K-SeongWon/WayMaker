"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { DeviceData } from "@/lib/types";

// 포트(핸들)가 달린 장비 노드. 입력은 왼쪽(target), 출력은 오른쪽(source).
export default function DeviceNode({ data, selected }: NodeProps<Node<DeviceData>>) {
  const inputs = data.ports.filter((p) => p.direction === "in" || p.direction === "bidi");
  const outputs = data.ports.filter((p) => p.direction === "out" || p.direction === "bidi");

  return (
    <div
      className={`min-w-[150px] rounded-lg border bg-white text-xs shadow-sm transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
      }`}
    >
      <div className="rounded-t-lg border-b border-gray-200 bg-gray-50 px-3 py-1.5 font-semibold text-gray-800">
        {data.label}
      </div>

      <div className="flex justify-between gap-4 px-3 py-2">
        <div className="flex flex-col gap-1.5">
          {inputs.map((p) => (
            <span key={p.id} className="text-gray-600">
              ● {p.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 text-right">
          {outputs.map((p) => (
            <span key={p.id} className="text-gray-600">
              {p.name} ●
            </span>
          ))}
        </div>
      </div>

      {inputs.map((p, i) => (
        <Handle
          key={p.id}
          id={p.id}
          type="target"
          position={Position.Left}
          style={{ top: `${((i + 1) / (inputs.length + 1)) * 100}%` }}
          className="!h-2.5 !w-2.5 !border-2 !border-white !bg-emerald-500"
        />
      ))}
      {outputs.map((p, i) => (
        <Handle
          key={p.id}
          id={p.id}
          type="source"
          position={Position.Right}
          style={{ top: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
          className="!h-2.5 !w-2.5 !border-2 !border-white !bg-sky-500"
        />
      ))}
    </div>
  );
}
