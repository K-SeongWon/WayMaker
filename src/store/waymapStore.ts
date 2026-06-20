import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import type { DeviceData, Port } from "@/lib/types";

// 장비 노드 id 생성기. 불러오기 후 충돌을 막기 위해 replaceAll에서 카운터를 동기화한다.
let idCounter = 0;
export const nextDeviceId = () => `d${++idCounter}`;

// 새 포트 id. 프리셋 포트(in1/out1 등)와 겹치지 않도록 'np' 접두사 사용.
let portCounter = 0;
export const nextPortId = () => `np${++portCounter}`;

interface WayMapState {
  nodes: Node<DeviceData>[];
  edges: Edge[];
  title: string;
  selectedId: string | null;

  onNodesChange: OnNodesChange<Node<DeviceData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  addDevice: (node: Node<DeviceData>) => void;
  setSelectedId: (id: string | null) => void;
  setTitle: (title: string) => void;

  // ── 편집 액션 (M2) ──
  updateDevice: (id: string, patch: Partial<DeviceData>) => void;
  removeDevice: (id: string) => void;
  addPort: (deviceId: string, port: Port) => void;
  updatePort: (deviceId: string, portId: string, patch: Partial<Port>) => void;
  removePort: (deviceId: string, portId: string) => void;

  /** 불러오기 결과로 전체 교체 */
  replaceAll: (nodes: Node<DeviceData>[], edges: Edge[], title: string) => void;
  /** 새 문서 */
  clear: () => void;
}

export const useWayMapStore = create<WayMapState>((set, get) => ({
  nodes: [],
  edges: [],
  title: "",
  selectedId: null,

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),

  addDevice: (node) => set({ nodes: [...get().nodes, node] }),
  setSelectedId: (id) => set({ selectedId: id }),
  setTitle: (title) => set({ title }),

  updateDevice: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    }),

  removeDevice: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedId: get().selectedId === id ? null : get().selectedId,
    }),

  addPort: (deviceId, port) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === deviceId
          ? { ...n, data: { ...n.data, ports: [...n.data.ports, port] } }
          : n,
      ),
    }),

  updatePort: (deviceId, portId, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id !== deviceId
          ? n
          : {
              ...n,
              data: {
                ...n.data,
                ports: n.data.ports.map((p) =>
                  p.id === portId ? { ...p, ...patch } : p,
                ),
              },
            },
      ),
    }),

  removePort: (deviceId, portId) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id !== deviceId
          ? n
          : {
              ...n,
              data: {
                ...n.data,
                ports: n.data.ports.filter((p) => p.id !== portId),
              },
            },
      ),
      // 그 포트에 연결된 결선도 함께 제거
      edges: get().edges.filter(
        (e) =>
          !(
            (e.source === deviceId && e.sourceHandle === portId) ||
            (e.target === deviceId && e.targetHandle === portId)
          ),
      ),
    }),

  replaceAll: (nodes, edges, title) => {
    let max = 0;
    for (const n of nodes) {
      const m = /^d(\d+)$/.exec(n.id);
      if (m) max = Math.max(max, Number(m[1]));
    }
    idCounter = Math.max(idCounter, max);
    set({ nodes, edges, title, selectedId: null });
  },

  clear: () => set({ nodes: [], edges: [], title: "", selectedId: null }),
}));
