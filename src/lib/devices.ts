import type {
  ConnectorType,
  DeviceCategory,
  DeviceData,
  DeviceRouting,
  Port,
  PortDirection,
  SignalType,
} from "./types";

// ── 장치 라이브러리 ─────────────────────────────────────────────
// 구조: 장치 "종류(type)" → 그 안의 "모델(model)" 또는 "Default".
//  - 팔레트에는 종류만 노출(디지털 믹서, 유선 마이크 …).
//  - 드롭할 때 내장 제조사/모델을 고르면 실제 스펙대로, Default를 고르면
//    종류별 기본 포트로 노드가 생성된다.
//  - 새 장치는 아래 DEVICE_MODELS 배열에 데이터만 추가하면 됨(시트/PR로 확장 용이).

export interface PortGroup {
  name: string;
  direction: PortDirection;
  signal: SignalType;
  connector?: ConnectorType;
  count?: number; // 기본 1
  channelize?: boolean; // count개에 채널 1..n 부여(스네이크 매칭)
  trunk?: boolean; // 멀티채널 트렁크(예: RJ45)
}

// 장치 종류(팔레트 단위). defaultPorts = "Default" 선택 시 포트.
export interface DeviceTypeDef {
  id: string;
  label: string;
  group: "음향" | "영상" | "네트워크 / 기타";
  category: DeviceCategory; // 아이콘/색상
  defaultPorts: PortGroup[];
  routing?: DeviceRouting;
}

// 특정 제조사/모델 프리셋(한 종류에 속함).
export interface DeviceModelDef {
  key: string;
  typeId: string;
  brand: string;
  model: string;
  ports: PortGroup[];
  routing?: DeviceRouting;
  note?: string;
  confidence?: "high" | "medium" | "low";
}

// 공통 포트 그룹 헬퍼
const POWER: PortGroup = { name: "POWER", direction: "in", signal: "power", connector: "iec_power" };
const DC: PortGroup = { name: "DC IN", direction: "in", signal: "power", connector: "dc_power" };

export const TYPE_GROUP_ORDER: DeviceTypeDef["group"][] = [
  "음향",
  "영상",
  "네트워크 / 기타",
];

export const DEVICE_TYPES: DeviceTypeDef[] = [
  // ── 음향 ──
  {
    id: "digital_mixer",
    label: "디지털 오디오 믹서",
    group: "음향",
    category: "mixer",
    defaultPorts: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 8 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      { name: "AES50 A", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "AES50 B", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      POWER,
    ],
  },
  {
    id: "analog_mixer",
    label: "아날로그 오디오 믹서",
    group: "음향",
    category: "mixer",
    defaultPorts: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs", count: 8 },
      { name: "MAIN OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "AUX OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      POWER,
    ],
  },
  {
    id: "stagebox",
    label: "디지털 스테이지박스",
    group: "음향",
    category: "stagebox",
    defaultPorts: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 8 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      { name: "AES50 A", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "AES50 B", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      POWER,
    ],
  },
  {
    id: "wired_mic",
    label: "유선 마이크",
    group: "음향",
    category: "mic",
    defaultPorts: [{ name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" }],
  },
  {
    id: "wireless_mic_rx",
    label: "무선 마이크 수신기",
    group: "음향",
    category: "wireless",
    defaultPorts: [
      { name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "MIX OUT", direction: "out", signal: "analog_audio", connector: "ts" },
      DC,
    ],
  },
  {
    id: "di_box",
    label: "다이렉트 박스 (DI)",
    group: "음향",
    category: "di",
    defaultPorts: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "ts" },
      { name: "THRU", direction: "out", signal: "analog_audio", connector: "ts" },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" },
    ],
  },
  {
    id: "keyboard",
    label: "전자 건반 / 피아노",
    group: "음향",
    category: "instrument",
    defaultPorts: [
      { name: "LINE OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      { name: "PHONES", direction: "out", signal: "analog_audio", connector: "trs" },
      { name: "USB TO HOST", direction: "bidi", signal: "digital_audio", connector: "usb_b" },
      { name: "SUSTAIN", direction: "in", signal: "control", connector: "ts" },
      DC,
    ],
  },
  {
    id: "powered_speaker",
    label: "액티브 스피커",
    group: "음향",
    category: "speaker",
    defaultPorts: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs" },
      { name: "LINK OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" },
      POWER,
    ],
  },
  {
    id: "passive_speaker",
    label: "패시브 스피커",
    group: "음향",
    category: "speaker",
    defaultPorts: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "speakon" },
      { name: "LINK", direction: "out", signal: "analog_audio", connector: "speakon" },
    ],
  },
  {
    id: "monitor_speaker",
    label: "모니터 스피커",
    group: "음향",
    category: "monitor_speaker",
    defaultPorts: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs" },
      { name: "THRU", direction: "out", signal: "analog_audio", connector: "xlr_m" },
      POWER,
    ],
  },
  {
    id: "subwoofer",
    label: "서브우퍼",
    group: "음향",
    category: "subwoofer",
    defaultPorts: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 2 },
      { name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      POWER,
    ],
  },

  // ── 영상 ──
  {
    id: "video_switcher",
    label: "비디오 스위처",
    group: "영상",
    category: "video_mixer",
    defaultPorts: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi", count: 4 },
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi" },
      { name: "USB-C", direction: "out", signal: "video", connector: "usb_c" },
      { name: "ETHERNET", direction: "bidi", signal: "network", connector: "rj45" },
      DC,
    ],
  },
  {
    id: "video_matrix",
    label: "HDMI 매트릭스",
    group: "영상",
    category: "video_matrix",
    defaultPorts: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi", count: 4 },
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi", count: 2 },
      DC,
    ],
  },
  {
    id: "camera",
    label: "카메라",
    group: "영상",
    category: "camera",
    defaultPorts: [
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi" },
      { name: "SDI OUT", direction: "out", signal: "video", connector: "sdi_bnc" },
      { name: "LAN", direction: "bidi", signal: "network", connector: "rj45" },
      DC,
    ],
  },
  {
    id: "projector",
    label: "프로젝터",
    group: "영상",
    category: "projector",
    defaultPorts: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi" },
      { name: "VGA IN", direction: "in", signal: "video", connector: "vga" },
      POWER,
    ],
  },
  {
    id: "display",
    label: "디스플레이 / TV",
    group: "영상",
    category: "display",
    defaultPorts: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi" },
      POWER,
    ],
  },

  // ── 네트워크 / 기타 ──
  {
    id: "xlr_extender",
    label: "XLR 랜 익스텐더",
    group: "네트워크 / 기타",
    category: "network",
    routing: "snake",
    defaultPorts: [
      { name: "XLR", direction: "bidi", signal: "analog_audio", connector: "xlr_f", count: 4, channelize: true },
      { name: "RJ45 (Cat5)", direction: "bidi", signal: "network", connector: "rj45", trunk: true },
    ],
  },
  {
    id: "network_switch",
    label: "네트워크 스위치 / AP",
    group: "네트워크 / 기타",
    category: "network",
    defaultPorts: [
      { name: "LAN", direction: "bidi", signal: "network", connector: "rj45", count: 5 },
      DC,
    ],
  },
  {
    id: "pc",
    label: "PC",
    group: "네트워크 / 기타",
    category: "pc",
    defaultPorts: [
      { name: "LINE OUT", direction: "out", signal: "analog_audio", connector: "trs" },
      { name: "LINE IN", direction: "in", signal: "analog_audio", connector: "trs" },
      { name: "HDMI", direction: "out", signal: "video", connector: "hdmi" },
      { name: "USB", direction: "bidi", signal: "digital_audio", connector: "usb_a", count: 2 },
      { name: "ETHERNET", direction: "bidi", signal: "network", connector: "rj45" },
      POWER,
    ],
  },
];

// X32 공통 디지털/제어 포트(아날로그 in/out 외)
const x32Digital: PortGroup[] = [
  { name: "AES50 A", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
  { name: "AES50 B", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
  { name: "AES/EBU OUT", direction: "out", signal: "digital_audio", connector: "xlr_m" },
  { name: "ULTRANET P16", direction: "out", signal: "digital_audio", connector: "rj45" },
  { name: "카드 슬롯", direction: "bidi", signal: "digital_audio", connector: "unknown" },
  { name: "MIDI IN", direction: "in", signal: "control", connector: "midi_din" },
  { name: "MIDI OUT", direction: "out", signal: "control", connector: "midi_din" },
  { name: "ETHERNET", direction: "bidi", signal: "network", connector: "rj45" },
  { name: "PHONES", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
  POWER,
];

export const DEVICE_MODELS: DeviceModelDef[] = [
  // 디지털 믹서 — Behringer X32 시리즈 (출처: behringerwiki/Sweetwater/Thomann)
  {
    key: "behringer-x32-full",
    typeId: "digital_mixer",
    brand: "Behringer",
    model: "X32 (Full)",
    confidence: "medium",
    note: "32 로컬 마이크 입력 / 16 XLR 출력.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 32 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 16 },
      { name: "AUX IN", direction: "in", signal: "analog_audio", connector: "trs", count: 6 },
      { name: "AUX OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 6 },
      ...x32Digital,
    ],
  },
  {
    key: "behringer-x32-compact",
    typeId: "digital_mixer",
    brand: "Behringer",
    model: "X32 Compact",
    confidence: "high",
    note: "16 마이크 입력 / 8 XLR 출력.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 16 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      { name: "AUX IN", direction: "in", signal: "analog_audio", connector: "trs", count: 6 },
      { name: "AUX OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 6 },
      ...x32Digital,
    ],
  },
  {
    key: "behringer-x32-producer",
    typeId: "digital_mixer",
    brand: "Behringer",
    model: "X32 Producer",
    confidence: "medium",
    note: "랙형. 16 마이크 입력 / 8 XLR 출력.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 16 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      ...x32Digital,
    ],
  },
  {
    key: "behringer-x32-rack",
    typeId: "digital_mixer",
    brand: "Behringer",
    model: "X32 Rack",
    confidence: "medium",
    note: "랙형. 16 마이크 입력 / 8 XLR 출력.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 16 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      ...x32Digital,
    ],
  },

  // 스테이지박스
  {
    key: "behringer-sd16",
    typeId: "stagebox",
    brand: "Behringer",
    model: "SD16",
    confidence: "high",
    note: "16 MIDAS 프리앰프 입력 / 8 XLR 출력, AES50 A·B, ULTRANET 허브.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 16 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      { name: "AES50 A", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "AES50 B", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "ULTRANET P16", direction: "out", signal: "digital_audio", connector: "rj45" },
      { name: "USB (펌웨어)", direction: "in", signal: "control", connector: "usb_b" },
      POWER,
    ],
  },

  // 유선 마이크
  {
    key: "sennheiser-xs1",
    typeId: "wired_mic",
    brand: "Sennheiser",
    model: "XS 1",
    confidence: "high",
    note: "다이나믹 보컬(카디오이드), 패시브, XLR(수) 출력.",
    ports: [{ name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" }],
  },
  {
    key: "akg-c1000s",
    typeId: "wired_mic",
    brand: "AKG",
    model: "C1000 S",
    confidence: "high",
    note: "소형 콘덴서(카디오이드), 팬텀/배터리. XLR(수) 출력.",
    ports: [{ name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" }],
  },

  // 무선 마이크 수신기
  {
    key: "kannals-mw-620",
    typeId: "wireless_mic_rx",
    brand: "KANNALS",
    model: "MW-620",
    confidence: "low",
    note: "공개 스펙 없음 — 일반 2채널 UHF 수신기로 모델링. 실제 단자에 맞게 편집.",
    ports: [
      { name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "MIX OUT", direction: "out", signal: "analog_audio", connector: "ts" },
      DC,
    ],
  },

  // 다이렉트 박스
  {
    key: "witches-broomstick-dual-di",
    typeId: "di_box",
    brand: "위치스",
    model: "브룸스틱 듀얼 DI",
    confidence: "low",
    note: "2채널 패시브 DI(일반형). 입력 2, 스루 2, XLR 출력 2.",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "ts", count: 2 },
      { name: "THRU", direction: "out", signal: "analog_audio", connector: "ts", count: 2 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
    ],
  },

  // 건반
  {
    key: "yamaha-p225",
    typeId: "keyboard",
    brand: "Yamaha",
    model: "P-225",
    confidence: "high",
    note: "전자 피아노. 전용 AUX OUT(L/R), PHONES 2, USB TO HOST, 서스테인.",
    ports: [
      { name: "AUX OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      { name: "PHONES", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      { name: "USB TO HOST", direction: "bidi", signal: "digital_audio", connector: "usb_b" },
      { name: "SUSTAIN", direction: "in", signal: "control", connector: "trs" },
      DC,
    ],
  },
  {
    key: "yamaha-dgx220",
    typeId: "keyboard",
    brand: "Yamaha",
    model: "DGX-220",
    confidence: "medium",
    note: "포터블 키보드. PHONES/OUTPUT 겸용, USB TO HOST, 서스테인.",
    ports: [
      { name: "PHONES/OUT", direction: "out", signal: "analog_audio", connector: "trs" },
      { name: "USB TO HOST", direction: "bidi", signal: "digital_audio", connector: "usb_b" },
      { name: "SUSTAIN", direction: "in", signal: "control", connector: "ts" },
      DC,
    ],
  },

  // 스피커류
  {
    key: "jbl-eon615",
    typeId: "powered_speaker",
    brand: "JBL",
    model: "EON615",
    confidence: "high",
    note: "액티브 2-way. 콤보 XLR/TRS 입력 2 + XLR 루프스루 2. 블루투스.",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs", count: 2 },
      { name: "LINK OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      POWER,
    ],
  },
  {
    key: "behringer-f1220d",
    typeId: "monitor_speaker",
    brand: "Behringer",
    model: "EUROLIVE F1220D",
    confidence: "medium",
    note: "액티브 모니터 웨지. XLR 마이크 입력 + 콤보 라인 입력 + XLR 링크 출력.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f" },
      { name: "LINE IN", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs" },
      { name: "LINK OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" },
      POWER,
    ],
  },
  {
    key: "behringer-b1200d-pro",
    typeId: "subwoofer",
    brand: "Behringer",
    model: "B1200D-PRO",
    confidence: "high",
    note: "액티브 서브(스테레오 크로스오버). 입력 A/B, 하이패스 출력 A/B, 풀레인지 스루 A/B.",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 2 },
      { name: "OUT (하이패스)", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "THRU", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      POWER,
    ],
  },

  // 비디오
  {
    key: "blackmagic-atem-mini-pro",
    typeId: "video_switcher",
    brand: "Blackmagic Design",
    model: "ATEM Mini Pro",
    confidence: "high",
    note: "HDMI 입력 4 / 출력 1, USB-C 웹캠, 이더넷, 3.5mm 마이크 입력 2.",
    ports: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi", count: 4 },
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi" },
      { name: "USB-C (웹캠)", direction: "out", signal: "video", connector: "usb_c" },
      { name: "ETHERNET", direction: "bidi", signal: "network", connector: "rj45" },
      { name: "MIC IN", direction: "in", signal: "analog_audio", connector: "minijack_3p5", count: 2 },
      DC,
    ],
  },
];

const TYPE_BY_ID = new Map(DEVICE_TYPES.map((t) => [t.id, t]));
const MODEL_BY_KEY = new Map(DEVICE_MODELS.map((m) => [m.key, m]));

export function getType(id: string): DeviceTypeDef | undefined {
  return TYPE_BY_ID.get(id);
}

export function getModel(key: string): DeviceModelDef | undefined {
  return MODEL_BY_KEY.get(key);
}

export function modelsForType(typeId: string): DeviceModelDef[] {
  return DEVICE_MODELS.filter((m) => m.typeId === typeId);
}

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "p"
  );
}

/** 포트 그룹을 개별 포트로 확장(고유 id 부여) */
export function expandPorts(groups: PortGroup[]): Port[] {
  const out: Port[] = [];
  const used = new Set<string>();
  for (const g of groups) {
    const n = g.count ?? 1;
    for (let i = 1; i <= n; i++) {
      const name = n > 1 ? `${g.name} ${i}` : g.name;
      const base = slug(name);
      let id = base;
      let k = 1;
      while (used.has(id)) id = `${base}-${k++}`;
      used.add(id);
      const port: Port = {
        id,
        name,
        direction: g.direction,
        signal: g.signal,
        connector: g.connector,
      };
      if (g.channelize) port.channel = i;
      if (g.trunk) port.trunk = true;
      out.push(port);
    }
  }
  return out;
}

/**
 * 종류 + (선택)모델로 캔버스 노드 data 생성.
 * modelKey 없으면 종류의 Default 포트로.
 */
export function deviceDataFromType(typeId: string, modelKey?: string): DeviceData | null {
  const type = TYPE_BY_ID.get(typeId);
  if (!type) return null;

  if (modelKey) {
    const m = MODEL_BY_KEY.get(modelKey);
    if (m) {
      const routing = m.routing ?? type.routing;
      return {
        label: `${m.brand} ${m.model}`,
        category: type.category,
        model: m.key,
        ports: expandPorts(m.ports),
        ...(routing ? { routing } : {}),
      };
    }
  }

  return {
    label: type.label,
    category: type.category,
    model: undefined,
    ports: expandPorts(type.defaultPorts),
    ...(type.routing ? { routing: type.routing } : {}),
  };
}
