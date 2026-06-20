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
import type { DeviceData } from "@/lib/types";

// 장비 노드 id 생성기. 불러오기 후 충돌을 막기 위해 replaceAll에서 카운터를 동기화한다.
let idCounter = 0;
export const nextDeviceId = () => `d${++idCounter}`;

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
