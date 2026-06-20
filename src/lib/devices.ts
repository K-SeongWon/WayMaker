import type {
  ConnectorType,
  DeviceCategory,
  DeviceData,
  Port,
  PortDirection,
  SignalType,
} from "./types";

// ── 장비 라이브러리 ─────────────────────────────────────────────
// 프리셋은 포트를 "그룹"(count로 반복)으로 선언하고, 인스턴스화 시 개별 포트로 확장한다.
// 잘 알려진 장비는 제조사/판매처 스펙 기반(아래 sources 주석), 일반/비공개 장비는
// 타입 기반 합리적 기본값(편집 가능). confidence가 medium/low면 사용자가 확인·수정 권장.

export interface PortGroup {
  name: string;
  direction: PortDirection;
  signal: SignalType;
  connector?: ConnectorType;
  count?: number; // 기본 1
}

export interface DevicePreset {
  key: string;
  brand?: string;
  model: string; // 노드 기본 라벨
  category: DeviceCategory;
  ports: PortGroup[];
  note?: string;
  confidence?: "high" | "medium" | "low";
}

export const CATEGORY_META: Record<DeviceCategory, { label: string }> = {
  mixer: { label: "믹서" },
  stagebox: { label: "스테이지박스" },
  speaker: { label: "메인 스피커" },
  monitor_speaker: { label: "모니터 스피커" },
  subwoofer: { label: "서브우퍼" },
  mic: { label: "마이크" },
  wireless: { label: "무선마이크" },
  di: { label: "다이렉트박스" },
  instrument: { label: "악기 / 건반" },
  camera: { label: "카메라" },
  video_mixer: { label: "비디오 믹서" },
  video_matrix: { label: "HDMI 매트릭스" },
  projector: { label: "프로젝터" },
  display: { label: "디스플레이" },
  network: { label: "네트워크" },
  pc: { label: "PC" },
};

export const CATEGORY_ORDER: DeviceCategory[] = [
  "mixer",
  "stagebox",
  "mic",
  "wireless",
  "di",
  "instrument",
  "speaker",
  "monitor_speaker",
  "subwoofer",
  "video_mixer",
  "video_matrix",
  "camera",
  "projector",
  "display",
  "network",
  "pc",
];

// 우리 교회 장비 우선. 출처는 조사된 제조사/판매처 스펙(2026-06-20 기준).
export const DEVICE_PRESETS: DevicePreset[] = [
  // ── 믹서 / 스테이지박스 (Behringer, 출처: behringerwiki/Sweetwater/Thomann) ──
  {
    key: "behringer-x32-compact",
    brand: "Behringer",
    model: "X32 Compact",
    category: "mixer",
    confidence: "high",
    note: "로컬 16 마이크 입력 / 8 XLR 출력, AES50 A·B, ULTRANET(P16), AES/EBU, 카드 슬롯.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 16 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      { name: "AUX IN", direction: "in", signal: "analog_audio", connector: "trs", count: 6 },
      { name: "AUX OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 6 },
      { name: "AES50 A", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "AES50 B", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "AES/EBU OUT", direction: "out", signal: "digital_audio", connector: "xlr_m" },
      { name: "ULTRANET P16", direction: "out", signal: "digital_audio", connector: "rj45" },
      { name: "카드 슬롯", direction: "bidi", signal: "digital_audio", connector: "unknown" },
      { name: "MIDI IN", direction: "in", signal: "control", connector: "midi_din" },
      { name: "MIDI OUT", direction: "out", signal: "control", connector: "midi_din" },
      { name: "USB REC", direction: "bidi", signal: "digital_audio", connector: "usb_a" },
      { name: "ETHERNET", direction: "bidi", signal: "network", connector: "rj45" },
      { name: "PHONES", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },
  {
    key: "behringer-sd16",
    brand: "Behringer",
    model: "SD16",
    category: "stagebox",
    confidence: "high",
    note: "16 MIDAS 프리앰프 입력 / 8 XLR 출력, AES50 A·B, ULTRANET(P16) 허브.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 16 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 8 },
      { name: "AES50 A", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "AES50 B", direction: "bidi", signal: "digital_audio", connector: "etherCON" },
      { name: "ULTRANET P16", direction: "out", signal: "digital_audio", connector: "rj45" },
      { name: "USB (펌웨어)", direction: "in", signal: "control", connector: "usb_b" },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },

  // ── 마이크 ──
  {
    key: "sennheiser-xs1",
    brand: "Sennheiser",
    model: "XS 1",
    category: "mic",
    confidence: "high",
    note: "다이나믹 보컬 마이크(카디오이드), 패시브. 본체 XLR(수) 출력.",
    ports: [{ name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" }],
  },
  {
    key: "akg-c1000s",
    brand: "AKG",
    model: "C1000 S",
    category: "mic",
    confidence: "high",
    note: "소형 콘덴서(카디오이드), 팬텀 9~52V 또는 배터리. 성가대용. XLR(수) 출력.",
    ports: [{ name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" }],
  },
  {
    key: "gooseneck-condenser",
    model: "구즈넥 콘덴서 마이크",
    category: "mic",
    confidence: "medium",
    note: "강대상용 구즈넥 콘덴서(팬텀 필요). 일반형 — 실제 모델에 맞게 편집.",
    ports: [{ name: "OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" }],
  },

  // ── 무선마이크 ──
  {
    key: "kannals-mw-620",
    brand: "KANNALS",
    model: "MW-620 (무선 수신기)",
    category: "wireless",
    confidence: "low",
    note: "공개 스펙 없음 — 일반 2채널 UHF 수신기로 모델링(밸런스 출력 2 + 믹스 출력 1). 실제 단자에 맞게 편집.",
    ports: [
      { name: "OUT (밸런스)", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "MIX OUT", direction: "out", signal: "analog_audio", connector: "ts" },
      { name: "DC IN", direction: "in", signal: "power", connector: "dc_power" },
    ],
  },

  // ── 다이렉트 박스 ──
  {
    key: "dual-passive-di",
    model: "듀얼 패시브 DI (위치스 브룸스틱)",
    category: "di",
    confidence: "low",
    note: "2채널 패시브 다이렉트 박스(일반형). 입력 2, 패러렐 스루 2, XLR 출력 2.",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "ts", count: 2 },
      { name: "THRU", direction: "out", signal: "analog_audio", connector: "ts", count: 2 },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
    ],
  },

  // ── 악기 / 건반 (Yamaha, 출처: Yamaha 스펙/매뉴얼) ──
  {
    key: "yamaha-p225",
    brand: "Yamaha",
    model: "P-225",
    category: "instrument",
    confidence: "high",
    note: "전자 피아노. 전용 AUX OUT(L/R) 라인 출력 + PHONES 2, USB TO HOST, 서스테인.",
    ports: [
      { name: "AUX OUT", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      { name: "PHONES", direction: "out", signal: "analog_audio", connector: "trs", count: 2 },
      { name: "USB TO HOST", direction: "bidi", signal: "digital_audio", connector: "usb_b" },
      { name: "SUSTAIN", direction: "in", signal: "control", connector: "trs" },
      { name: "DC IN", direction: "in", signal: "power", connector: "dc_power" },
    ],
  },
  {
    key: "yamaha-dgx220",
    brand: "Yamaha",
    model: "DGX-220",
    category: "instrument",
    confidence: "medium",
    note: "포터블 키보드. PHONES/OUTPUT 겸용 잭(라인 출력 겸용), USB TO HOST, 서스테인.",
    ports: [
      { name: "PHONES/OUT", direction: "out", signal: "analog_audio", connector: "trs" },
      { name: "USB TO HOST", direction: "bidi", signal: "digital_audio", connector: "usb_b" },
      { name: "SUSTAIN", direction: "in", signal: "control", connector: "ts" },
      { name: "DC IN", direction: "in", signal: "power", connector: "dc_power" },
    ],
  },

  // ── 스피커 / 모니터 / 서브 (출처: JBL/Behringer 스펙) ──
  {
    key: "jbl-eon615",
    brand: "JBL",
    model: "EON615",
    category: "speaker",
    confidence: "high",
    note: "액티브 메인 2-way. 콤보 XLR/TRS 입력 2 + XLR 루프스루 2. 블루투스(무선).",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs", count: 2 },
      { name: "LINK OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },
  {
    key: "passive-delay-speaker",
    model: "소형 패시브 딜레이 스피커",
    category: "speaker",
    confidence: "low",
    note: "패시브(앰프 필요). 입력 1 + 패러렐 링크 1. 단자는 speakON 가정 — 실제에 맞게 편집.",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "speakon" },
      { name: "LINK", direction: "out", signal: "analog_audio", connector: "speakon" },
    ],
  },
  {
    key: "behringer-f1220d",
    brand: "Behringer",
    model: "EUROLIVE F1220D",
    category: "monitor_speaker",
    confidence: "medium",
    note: "액티브 모니터 웨지(2채널 내장 믹서). XLR 마이크 입력 + 콤보 라인 입력 + XLR 링크 출력.",
    ports: [
      { name: "IN", direction: "in", signal: "analog_audio", connector: "xlr_f" },
      { name: "LINE IN", direction: "in", signal: "analog_audio", connector: "combo_xlr_trs" },
      { name: "LINK OUT", direction: "out", signal: "analog_audio", connector: "xlr_m" },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },
  {
    key: "behringer-b1200d-pro",
    brand: "Behringer",
    model: "B1200D-PRO",
    category: "subwoofer",
    confidence: "high",
    note: "액티브 서브(스테레오 크로스오버 내장). 입력 A/B, 하이패스 출력 A/B, 풀레인지 스루 A/B.",
    ports: [
      { name: "INPUT", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 2 },
      { name: "OUT (하이패스)", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "THRU", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 2 },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },

  // ── 비디오 (출처: Blackmagic 스펙) ──
  {
    key: "blackmagic-atem-mini-pro",
    brand: "Blackmagic Design",
    model: "ATEM Mini Pro",
    category: "video_mixer",
    confidence: "high",
    note: "HDMI 입력 4 / 출력 1, USB-C 웹캠 출력, 이더넷(스트리밍/제어), 3.5mm 마이크 입력 2.",
    ports: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi", count: 4 },
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi" },
      { name: "USB-C (웹캠)", direction: "out", signal: "video", connector: "usb_c" },
      { name: "ETHERNET", direction: "bidi", signal: "network", connector: "rj45" },
      { name: "MIC IN", direction: "in", signal: "analog_audio", connector: "minijack_3p5", count: 2 },
      { name: "DC IN", direction: "in", signal: "power", connector: "dc_power" },
    ],
  },
  {
    key: "hdmi-matrix-4x2",
    model: "HDMI 4x2 매트릭스",
    category: "video_matrix",
    confidence: "medium",
    note: "일반 HDMI 매트릭스 스위치. 입력 4 / 출력 2.",
    ports: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi", count: 4 },
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi", count: 2 },
      { name: "POWER", direction: "in", signal: "power", connector: "dc_power" },
    ],
  },
  {
    key: "ptz-camera",
    model: "PTZ 카메라",
    category: "camera",
    confidence: "medium",
    note: "일반 PTZ 카메라. HDMI/SDI 출력 + 랜(PoE·제어). 실제 모델에 맞게 편집.",
    ports: [
      { name: "HDMI OUT", direction: "out", signal: "video", connector: "hdmi" },
      { name: "SDI OUT", direction: "out", signal: "video", connector: "sdi_bnc" },
      { name: "LAN (PoE/제어)", direction: "bidi", signal: "network", connector: "rj45" },
      { name: "DC IN", direction: "in", signal: "power", connector: "dc_power" },
    ],
  },
  {
    key: "philips-projector",
    brand: "Philips",
    model: "빔 프로젝터",
    category: "projector",
    confidence: "low",
    note: "일반 프로젝터(영상 입력 싱크). HDMI/VGA 입력. 실제 모델에 맞게 편집.",
    ports: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi" },
      { name: "VGA IN", direction: "in", signal: "video", connector: "vga" },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },
  {
    key: "stage-monitor-tv",
    model: "스테이지 모니터 TV",
    category: "display",
    confidence: "low",
    note: "무대 모니터용 디스플레이(HDMI 입력).",
    ports: [
      { name: "HDMI IN", direction: "in", signal: "video", connector: "hdmi" },
      { name: "POWER", direction: "in", signal: "power", connector: "iec_power" },
    ],
  },

  // ── 네트워크 / 익스텐더 ──
  {
    key: "xlr-lan-extender-tx",
    model: "4ch XLR 랜 익스텐더 — 송신부",
    category: "network",
    confidence: "low",
    note: "XLR 마이크 4채널을 Cat5(RJ45) 한 가닥으로 전송하는 익스텐더의 송신부.",
    ports: [
      { name: "XLR IN", direction: "in", signal: "analog_audio", connector: "xlr_f", count: 4 },
      { name: "RJ45 (전송)", direction: "out", signal: "analog_audio", connector: "rj45" },
    ],
  },
  {
    key: "xlr-lan-extender-rx",
    model: "4ch XLR 랜 익스텐더 — 수신부",
    category: "network",
    confidence: "low",
    note: "송신부에서 받은 Cat5(RJ45)를 다시 XLR 4채널로 분배하는 수신부.",
    ports: [
      { name: "RJ45 (수신)", direction: "in", signal: "analog_audio", connector: "rj45" },
      { name: "XLR OUT", direction: "out", signal: "analog_audio", connector: "xlr_m", count: 4 },
    ],
  },
];

const PRESET_BY_KEY = new Map(DEVICE_PRESETS.map((p) => [p.key, p]));

export function getPreset(key: string): DevicePreset | undefined {
  return PRESET_BY_KEY.get(key);
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
      out.push({
        id,
        name,
        direction: g.direction,
        signal: g.signal,
        connector: g.connector,
      });
    }
  }
  return out;
}

/** 프리셋으로부터 캔버스 노드 data 생성 */
export function deviceDataFromPreset(p: DevicePreset): DeviceData {
  return {
    label: p.model,
    category: p.category,
    model: p.key,
    ports: expandPorts(p.ports),
  };
}
