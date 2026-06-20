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
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeviceNode from "./DeviceNode";
import { PRESETS, type PresetKey } from "@/lib/devicePresets";
import type { DeviceData } from "@/lib/types";
import { useWayMapStore, nextDeviceId } from "@/store/waymapStore";

const nodeTypes: NodeTypes = { device: DeviceNode };

function Flow() {
  const nodes = useWayMapStore((s) => s.nodes);
  const edges = useWayMapStore((s) => s.edges);
  const onNodesChange = useWayMapStore((s) => s.onNodesChange);
  const onEdgesChange = useWayMapStore((s) => s.onEdgesChange);
  const onConnect = useWayMapStore((s) => s.onConnect);
  const addDevice = useWayMapStore((s) => s.addDevice);
  const setSelectedId = useWayMapStore((s) => s.setSelectedId);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const key = e.dataTransfer.getData("application/waymaker") as PresetKey;
      const preset = PRESETS[key];
      if (!preset) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const node: Node<DeviceData> = {
        id: nextDeviceId(),
        type: "device",
        position,
        data: { ...preset, ports: preset.ports.map((p) => ({ ...p })) },
      };
      addDevice(node);
    },
    [screenToFlowPosition, addDevice],
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
