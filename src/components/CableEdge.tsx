"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { ConnectorType, EdgeDetail } from "@/lib/types";
import { CONNECTOR_OPTIONS, CONNECTOR_SHORT } from "@/lib/portOptions";
import { useWayMapStore } from "@/store/waymapStore";

// 케이블 한쪽 끝의 단자 설정 배지. 짧은 코드를 보여주고, 위에 투명 select를 겹쳐
// 클릭하면 네이티브 드롭다운으로 단자를 고른다(아이콘+영역 = 설정 컨트롤).
function EndConnector({
  x,
  y,
  value,
  onChange,
}: {
  x: number;
  y: number;
  value?: ConnectorType;
  onChange: (v?: ConnectorType) => void;
}) {
  return (
    <div
      className="nodrag nopan absolute"
      style={{
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        pointerEvents: "all",
      }}
    >
      <span
        className={`flex items-center gap-0.5 rounded border px-1 text-[9px] font-medium shadow-sm ${
          value
            ? "border-blue-300 bg-blue-50 text-blue-700"
            : "border-gray-300 bg-white/90 text-gray-400"
        }`}
        title="케이블 단자 설정"
      >
        <span aria-hidden>⬡</span>
        {value ? CONNECTOR_SHORT[value] ?? value : "단자"}
      </span>
      <select
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value ?? ""}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange((e.target.value as ConnectorType) || undefined)}
        title="케이블 단자 설정"
      >
        <option value="">— 미지정</option>
        {CONNECTOR_OPTIONS.filter((o) => o.value !== "").map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}: EdgeProps) {
  const updateEdge = useWayMapStore((s) => s.updateEdge);
  const setSelectedEdgeId = useWayMapStore((s) => s.setSelectedEdgeId);

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const d = (data ?? {}) as EdgeDetail;
  // 케이블 양 끝점에서 고정 거리만큼만 떨어뜨려 끝부분에 스냅(길이와 무관).
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(22, len * 0.4);
  const ux = dx / len;
  const uy = dy / len;
  const fromX = sourceX + ux * off;
  const fromY = sourceY + uy * off;
  const toX = targetX - ux * off;
  const toY = targetY - uy * off;

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <EndConnector
          x={fromX}
          y={fromY}
          value={d.connectorFrom}
          onChange={(v) => updateEdge(id, { connectorFrom: v })}
        />
        <EndConnector
          x={toX}
          y={toY}
          value={d.connectorTo}
          onChange={(v) => updateEdge(id, { connectorTo: v })}
        />
        {d.displayLabel ? (
          <div
            className="nodrag nopan absolute cursor-pointer rounded bg-white/90 px-1 text-[10px] text-gray-700 shadow-sm"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            onClick={() => setSelectedEdgeId(id)}
          >
            {d.displayLabel}
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  );
}
