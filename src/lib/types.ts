// WayMaker 도메인 타입 (PROJECT-PLAN §4 WayMap 스키마 기반, M1 최소 버전)

export type PortDirection = "in" | "out" | "bidi";

export type SignalType =
  | "analog_audio"
  | "digital_audio"
  | "network"
  | "video"
  | "power"
  | "control";

export type ConnectorType =
  | "xlr_m"
  | "xlr_f"
  | "trs"
  | "speakon"
  | "banana"
  | "etherCON"
  | "rj45"
  | "usb_c"
  | "hdmi"
  | "unknown";

export interface Port {
  id: string;
  name: string;
  direction: PortDirection;
  signal: SignalType;
  /** 숙련자용 선택 정보 — 초보자는 비워둠 */
  connector?: ConnectorType;
}

export type DeviceCategory =
  | "mixer"
  | "pc"
  | "speaker"
  | "instrument"
  | "di"
  | "wireless"
  | "stagebox"
  | "network";

/**
 * React Flow 노드의 data 페이로드.
 * Record<string, unknown> 호환을 위해 인덱스 시그니처를 둔다.
 */
export interface DeviceData {
  label: string;
  category: DeviceCategory;
  model?: string;
  ports: Port[];
  [key: string]: unknown;
}
