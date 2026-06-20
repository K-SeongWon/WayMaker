"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeviceNode from "./DeviceNode";
import ZoneNode from "./ZoneNode";
import { getPreset, deviceDataFromPreset } from "@/lib/devices";
import { ZONE_PRESETS, ZONE_DEFAULT_SIZE } from "@/lib/zones";
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
  const { screenToFlowPosition } = useReactFlow();

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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        onNodeClick={(_, n) => setSelectedId(n.id)}
        onPaneClick={() => setSelectedId(null)}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
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
