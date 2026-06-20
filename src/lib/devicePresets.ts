import type { DeviceData } from "./types";

// M1 검증용 최소 프리셋. 추후 장비 라이브러리(M7)로 확장.
export type PresetKey = "mic" | "mixer" | "speaker";

export const PRESETS: Record<PresetKey, DeviceData> = {
  mic: {
    label: "마이크",
    category: "instrument",
    ports: [
      { id: "out1", name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" },
    ],
  },
  mixer: {
    label: "X32 Compact",
    category: "mixer",
    model: "behringer-x32-compact",
    ports: [
      { id: "in1", name: "IN 1", direction: "in", signal: "analog_audio", connector: "xlr_f" },
      { id: "in2", name: "IN 2", direction: "in", signal: "analog_audio", connector: "xlr_f" },
      { id: "out_l", name: "MAIN L", direction: "out", signal: "analog_audio", connector: "xlr_m" },
      { id: "out_r", name: "MAIN R", direction: "out", signal: "analog_audio", connector: "xlr_m" },
    ],
  },
  speaker: {
    label: "액티브 스피커",
    category: "speaker",
    ports: [
      { id: "in1", name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f" },
      { id: "thru", name: "THRU", direction: "out", signal: "analog_audio", connector: "xlr_m" },
    ],
  },
};
