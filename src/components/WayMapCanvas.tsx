"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Panel,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeviceNode from "./DeviceNode";
import ZoneNode from "./ZoneNode";
import CableEdge from "./CableEdge";
import ExportPanel from "./ExportPanel";
import {
  getType,
  modelsForType,
  deviceDataFromType,
  type DeviceModelDef,
} from "@/lib/devices";
import { ZONE_PRESETS, ZONE_DEFAULT_SIZE } from "@/lib/zones";
import { computeFlow } from "@/lib/flow";
import type { DeviceNodeT, ZoneNodeT } from "@/lib/types";
import { useWayMapStore, nextDeviceId, nextZoneId } from "@/store/waymapStore";

const nodeTypes: NodeTypes = { device: DeviceNode, zone: ZoneNode };
const edgeTypes = { cable: CableEdge };

interface PickerState {
  typeId: string;
  position: { x: number; y: number }; // flow 좌표
  x: number; // 화면(래퍼 기준)
  y: number;
  brand: string | null; // 2단계: 선택한 제조사
}

function Flow() {
  const nodes = useWayMapStore((s) => s.nodes);
  const edges = useWayMapStore((s) => s.edges);
  const onNodesChange = useWayMapStore((s) => s.onNodesChange);
  const onEdgesChange = useWayMapStore((s) => s.onEdgesChange);
  const onConnect = useWayMapStore((s) => s.onConnect);
  const addDevice = useWayMapStore((s) => s.addDevice);
  const addZone = useWayMapStore((s) => s.addZone);
  const setSelectedId = useWayMapStore((s) => s.setSelectedId);
  const setSelectedEdgeId = useWayMapStore((s) => s.setSelectedEdgeId);
  const selectedId = useWayMapStore((s) => s.selectedId);
  const selectedEdgeId = useWayMapStore((s) => s.selectedEdgeId);
  const flowMode = useWayMapStore((s) => s.flowMode);
  const toggleFlowMode = useWayMapStore((s) => s.toggleFlowMode);
  const { screenToFlowPosition } = useReactFlow();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [picker, setPicker] = useState<PickerState | null>(null);

  const flow = useMemo(() => {
    if (!flowMode || !selectedId) return null;
    const sel = nodes.find((n) => n.id === selectedId);
    if (!sel || sel.type !== "device") return null;
    return computeFlow(selectedId, nodes, edges);
  }, [flowMode, selectedId, nodes, edges]);

  const renderEdges = useMemo(
    () =>
      edges.map((e) => {
        let ne = { ...e, type: "cable" as const };
        if (flow) {
          ne = flow.edgeIds.has(e.id)
            ? { ...ne, animated: true, style: { ...ne.style, stroke: "#10b981", strokeWidth: 2.5 } }
            : { ...ne, animated: false, style: { ...ne.style, opacity: 0.12 } };
        }
        if (e.id === selectedEdgeId) {
          ne = { ...ne, style: { ...ne.style, stroke: "#2563eb", strokeWidth: 2.5 } };
        }
        return ne;
      }),
    [edges, flow, selectedEdgeId],
  );

  const renderNodes = useMemo(
    () =>
      flow
        ? nodes.map((n) =>
            flow.nodeIds.has(n.id) ? n : { ...n, style: { ...n.style, opacity: 0.25 } },
          )
        : nodes,
    [nodes, flow],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const key = e.dataTransfer.getData("application/waymaker");
      if (!key) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      // 장소(구획)
      if (key.startsWith("zone:")) {
        const preset = ZONE_PRESETS.find((p) => p.key === key.slice(5));
        if (!preset) return;
        const node: ZoneNodeT = {
          id: nextZoneId(),
          type: "zone",
          position,
          width: ZONE_DEFAULT_SIZE.w,
          height: ZONE_DEFAULT_SIZE.h,
          zIndex: 0,
          data: { label: preset.label, zoneType: preset.key, color: preset.color },
        };
        addZone(node);
        return;
      }

      // 장치 종류 → 모델 선택 팝업
      if (key.startsWith("type:")) {
        const typeId = key.slice(5);
        if (!getType(typeId)) return;
        const rect = wrapperRef.current?.getBoundingClientRect();
        const x = Math.min(
          rect ? e.clientX - rect.left : e.clientX,
          (rect?.width ?? 9999) - 232,
        );
        const y = rect ? e.clientY - rect.top : e.clientY;
        setPicker({ typeId, position, x: Math.max(8, x), y, brand: null });
      }
    },
    [screenToFlowPosition, addZone],
  );

  const createDevice = useCallback(
    (modelKey?: string) => {
      if (!picker) return;
      const data = deviceDataFromType(picker.typeId, modelKey);
      if (data) {
        const node: DeviceNodeT = {
          id: nextDeviceId(),
          type: "device",
          position: picker.position,
          zIndex: 1,
          data,
        };
        addDevice(node);
      }
      setPicker(null);
    },
    [picker, addDevice],
  );

  // 모델을 제조사별로 묶기
  const pickerModels = useMemo(() => {
    if (!picker) return [] as { brand: string; items: DeviceModelDef[] }[];
    const list = modelsForType(picker.typeId);
    const order: string[] = [];
    const by = new Map<string, DeviceModelDef[]>();
    for (const m of list) {
      if (!by.has(m.brand)) {
        by.set(m.brand, []);
        order.push(m.brand);
      }
      by.get(m.brand)!.push(m);
    }
    return order.map((b) => ({ brand: b, items: by.get(b)! }));
  }, [picker]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={renderNodes}
        edges={renderEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, n) => setSelectedId(n.id)}
        onEdgeClick={(_, e) => setSelectedEdgeId(e.id)}
        onPaneClick={() => setSelectedId(null)}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
        <Panel position="top-left">
          <label className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/90 px-2 py-1 text-[11px] text-gray-600 shadow-sm backdrop-blur">
            <input type="checkbox" checked={flowMode} onChange={toggleFlowMode} />
            신호 흐름 보기
            <span className="text-gray-400">(장비 클릭)</span>
          </label>
        </Panel>
        <ExportPanel />
      </ReactFlow>

      {/* 모델 선택 팝업 */}
      {picker && (
        <>
          <div className="absolute inset-0 z-20" onClick={() => setPicker(null)} />
          <div
            className="absolute z-30 max-h-[70%] w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 text-sm shadow-xl"
            style={{ left: picker.x, top: picker.y }}
          >
            {!picker.brand ? (
              // 1단계: 제조사 선택 (+ 기본 장치)
              <>
                <div className="px-1.5 py-1 text-xs font-semibold text-gray-700">
                  {getType(picker.typeId)?.label}
                  <span className="ml-1 text-[10px] font-normal text-gray-400">제조사 선택</span>
                </div>
                <button
                  type="button"
                  onClick={() => createDevice()}
                  className="w-full rounded-md px-2 py-1.5 text-left text-gray-700 hover:bg-blue-50"
                >
                  기본 장치 <span className="text-[11px] text-gray-400">(Default)</span>
                </button>
                {pickerModels.map((g) => (
                  <button
                    key={g.brand}
                    type="button"
                    onClick={() => setPicker({ ...picker, brand: g.brand })}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-gray-700 hover:bg-blue-50"
                  >
                    <span>{g.brand}</span>
                    <span className="text-[11px] text-gray-400">{g.items.length} ›</span>
                  </button>
                ))}
                {pickerModels.length === 0 && (
                  <div className="px-1.5 py-1 text-[11px] text-gray-400">
                    내장 모델 없음 — 기본 장치로 추가하세요.
                  </div>
                )}
              </>
            ) : (
              // 2단계: 선택한 제조사의 모델
              <>
                <button
                  type="button"
                  onClick={() => setPicker({ ...picker, brand: null })}
                  className="mb-0.5 flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-gray-400">‹</span> {picker.brand}
                </button>
                {(pickerModels.find((g) => g.brand === picker.brand)?.items ?? []).map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => createDevice(m.key)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-gray-700 hover:bg-blue-50"
                  >
                    <span>{m.model}</span>
                    {m.confidence && m.confidence !== "high" && (
                      <span className="text-[10px] text-gray-400">
                        {m.confidence === "low" ? "추정" : "확인필요"}
                      </span>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function WayMapCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
