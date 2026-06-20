import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import type {
  AppNode,
  DeviceData,
  DeviceNodeT,
  EdgeDetail,
  Port,
  ZoneData,
  ZoneNodeT,
} from "@/lib/types";

// 장비 노드 id 생성기. 불러오기 후 충돌을 막기 위해 replaceAll에서 카운터를 동기화한다.
let idCounter = 0;
export const nextDeviceId = () => `d${++idCounter}`;

let zoneCounter = 0;
export const nextZoneId = () => `z${++zoneCounter}`;

// 새 포트 id. 프리셋 포트(in1/out1 등)와 겹치지 않도록 'np' 접두사 사용.
let portCounter = 0;
export const nextPortId = () => `np${++portCounter}`;

interface WayMapState {
  nodes: AppNode[];
  edges: Edge[];
  title: string;
  selectedId: string | null;
  selectedEdgeId: string | null;
  flowMode: boolean;

  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  addDevice: (node: DeviceNodeT) => void;
  addZone: (node: ZoneNodeT) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setTitle: (title: string) => void;
  toggleFlowMode: () => void;

  // ── 연결선(케이블) 편집 ──
  updateEdge: (id: string, patch: Partial<EdgeDetail>) => void;
  removeEdge: (id: string) => void;

  // ── 편집 액션 ──
  updateDevice: (id: string, patch: Partial<DeviceData>) => void;
  updateZone: (id: string, patch: Partial<ZoneData>) => void;
  removeNode: (id: string) => void;
  addPort: (deviceId: string, port: Port) => void;
  updatePort: (deviceId: string, portId: string, patch: Partial<Port>) => void;
  removePort: (deviceId: string, portId: string) => void;

  /** 불러오기 결과로 전체 교체 */
  replaceAll: (nodes: AppNode[], edges: Edge[], title: string) => void;
  /** 새 문서 */
  clear: () => void;
}

export const useWayMapStore = create<WayMapState>((set, get) => ({
  nodes: [],
  edges: [],
  title: "",
  selectedId: null,
  selectedEdgeId: null,
  flowMode: true,

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),

  addDevice: (node) => set({ nodes: [...get().nodes, node] }),
  addZone: (node) => set({ nodes: [...get().nodes, node] }),
  // 노드/엣지 선택은 상호 배타
  setSelectedId: (id) => set({ selectedId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedId: null }),
  setTitle: (title) => set({ title }),
  toggleFlowMode: () => set({ flowMode: !get().flowMode }),

  updateEdge: (id, patch) =>
    set({
      edges: get().edges.map((e) => {
        if (e.id !== id) return e;
        const data = { ...(e.data as EdgeDetail | undefined), ...patch };
        const dl = typeof data.displayLabel === "string" ? data.displayLabel.trim() : "";
        return { ...e, data, label: dl || undefined };
      }),
    }),

  removeEdge: (id) =>
    set({
      edges: get().edges.filter((e) => e.id !== id),
      selectedEdgeId: get().selectedEdgeId === id ? null : get().selectedEdgeId,
    }),

  updateDevice: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id && n.type === "device" ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    }),

  updateZone: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id && n.type === "zone" ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    }),

  removeNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedId: get().selectedId === id ? null : get().selectedId,
    }),

  addPort: (deviceId, port) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === deviceId && n.type === "device"
          ? { ...n, data: { ...n.data, ports: [...n.data.ports, port] } }
          : n,
      ),
    }),

  updatePort: (deviceId, portId, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id !== deviceId || n.type !== "device"
          ? n
          : {
              ...n,
              data: {
                ...n.data,
                ports: n.data.ports.map((p) => (p.id === portId ? { ...p, ...patch } : p)),
              },
            },
      ),
    }),

  removePort: (deviceId, portId) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id !== deviceId || n.type !== "device"
          ? n
          : { ...n, data: { ...n.data, ports: n.data.ports.filter((p) => p.id !== portId) } },
      ),
      edges: get().edges.filter(
        (e) =>
          !(
            (e.source === deviceId && e.sourceHandle === portId) ||
            (e.target === deviceId && e.targetHandle === portId)
          ),
      ),
    }),

  replaceAll: (nodes, edges, title) => {
    let maxD = 0;
    let maxZ = 0;
    for (const n of nodes) {
      const dm = /^d(\d+)$/.exec(n.id);
      if (dm) maxD = Math.max(maxD, Number(dm[1]));
      const zm = /^z(\d+)$/.exec(n.id);
      if (zm) maxZ = Math.max(maxZ, Number(zm[1]));
    }
    idCounter = Math.max(idCounter, maxD);
    zoneCounter = Math.max(zoneCounter, maxZ);
    set({ nodes, edges, title, selectedId: null, selectedEdgeId: null });
  },

  clear: () =>
    set({ nodes: [], edges: [], title: "", selectedId: null, selectedEdgeId: null }),
}));
