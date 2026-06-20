"use client";

import { NodeResizer, type Node, type NodeProps } from "@xyflow/react";
import type { ZoneData } from "@/lib/types";
import { ZONE_COLORS } from "@/lib/zones";

// 장소(구획) 박스. 핸들 없음(결선 대상 아님). 장비보다 뒤(zIndex 0)에 그려진다.
export default function ZoneNode({ data, selected }: NodeProps<Node<ZoneData, "zone">>) {
  const c = ZONE_COLORS[data.color] ?? ZONE_COLORS.slate;

  return (
    <div className={`h-full w-full rounded-md border-2 ${c.border} ${c.bg}`}>
      <NodeResizer
        isVisible={!!selected}
        minWidth={120}
        minHeight={80}
        color="#3b82f6"
      />
      <div
        className={`m-1 inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${c.label}`}
      >
        {data.label}
      </div>
    </div>
  );
}
