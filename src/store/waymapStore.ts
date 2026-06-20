import { create } from "zustand";
import type { Node } from "@xyflow/react";
import type { DeviceData } from "@/lib/types";

// 캔버스와 속성 패널 간 선택 상태 공유 (Zustand 동작 검증 포함)
interface WayMapState {
  selected: Node<DeviceData> | null;
  setSelected: (node: Node<DeviceData> | null) => void;
}

export const useWayMapStore = create<WayMapState>((set) => ({
  selected: null,
  setSelected: (node) => set({ selected: node }),
}));
