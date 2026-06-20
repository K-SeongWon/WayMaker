"use client";

import { useCallback, useMemo } from "react";
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
import ExportPanel from "./ExportPanel";
import { getPreset, deviceDataFromPreset } from "@/lib/devices";
import { ZONE_PRESETS, ZONE_DEFAULT_SIZE } from "@/lib/zones";
import { computeFlow } from "@/lib/flow";
import type { DeviceNodeT, ZoneNodeT } from "@/lib/types";
import { useWayMapStore, nextDeviceId, nextZoneId } from "@/store/waymapStore";

const nodeTypes: NodeTypes = { device: DeviceNode, zone: ZoneNode };

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

  // 신호 흐름: 흐름 모드 + 장비 선택 시, 그 장비가 연결된 경로를 계산
  const flow = useMemo(() => {
    if (!flowMode || !selectedId) return null;
    const sel = nodes.find((n) => n.id === selectedId);
    if (!sel || sel.type !== "device") return null;
    return computeFlow(selectedId, edges);
  }, [flowMode, selectedId, nodes, edges]);

  // 표시용 엣지: 흐름 경로는 애니메이션+강조, 그 외는 디밍. 편집 선택 엣지는 파란 강조.
  const renderEdges = useMemo(
    () =>
      edges.map((e) => {
        let ne = e;
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

  // 표시용 노드: 흐름에 포함되지 않은 노드는 디밍
  const renderNodes = useMemo(
    () =>
      flow
        ? nodes.map((n) =>
            flow.nodeIds.has(n.id)
              ? n
              : { ...n, style: { ...n.style, opacity: 0.25 } },
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

      // 장소(구획) 드롭
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

      // 장비 드롭
      const preset = getPreset(key);
      if (!preset) return;
      const node: DeviceNodeT = {
        id: nextDeviceId(),
        type: "device",
        position,
        zIndex: 1,
        data: deviceDataFromPreset(preset),
      };
      addDevice(node);
    },
    [screenToFlowPosition, addDevice, addZone],
  );

  return (
    <div className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={renderNodes}
        edges={renderEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
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
            <input
              type="checkbox"
              checked={flowMode}
              onChange={toggleFlowMode}
            />
            신호 흐름 보기
            <span className="text-gray-400">(장비 클릭)</span>
          </label>
        </Panel>
        <ExportPanel />
      </ReactFlow>
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
