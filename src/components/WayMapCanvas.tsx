"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeviceNode from "./DeviceNode";
import { PRESETS, type PresetKey } from "@/lib/devicePresets";
import type { DeviceData } from "@/lib/types";
import { useWayMapStore } from "@/store/waymapStore";

const nodeTypes: NodeTypes = { device: DeviceNode };

let idCounter = 0;
const nextId = () => `d${++idCounter}`;

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<DeviceData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const setSelected = useWayMapStore((s) => s.setSelected);

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge(c, eds)),
    [setEdges],
  );

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
        id: nextId(),
        type: "device",
        position,
        // 프리셋을 깊은 복사해 인스턴스마다 독립적인 포트 배열을 갖게 함
        data: { ...preset, ports: preset.ports.map((p) => ({ ...p })) },
      };
      setNodes((nds) => nds.concat(node));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, n) => setSelected(n as Node<DeviceData>)}
        onPaneClick={() => setSelected(null)}
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
