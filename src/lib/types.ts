// WayMaker 도메인 타입 (PROJECT-PLAN §4 WayMap 스키마 기반)

import type { Node } from "@xyflow/react";

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
  | "combo_xlr_trs"
  | "trs"
  | "ts"
  | "rca"
  | "minijack_3p5"
  | "speakon"
  | "banana_binding"
  | "etherCON"
  | "rj45"
  | "usb_a"
  | "usb_b"
  | "usb_c"
  | "hdmi"
  | "sdi_bnc"
  | "vga"
  | "toslink"
  | "midi_din"
  | "iec_power"
  | "dc_power"
  | "euroblock"
  | "unknown";

export interface Port {
  id: string;
  name: string;
  direction: PortDirection;
  signal: SignalType;
  /** 숙련자용 선택 정보 — 초보자는 비워둠 */
  connector?: ConnectorType;
  /** 박스에서 핀을 표시할 쪽. 없으면 방향 기반(in=왼쪽, 그 외 오른쪽) */
  side?: "left" | "right";
}

export type DeviceCategory =
  | "mixer"
  | "stagebox"
  | "speaker"
  | "monitor_speaker"
  | "subwoofer"
  | "mic"
  | "wireless"
  | "di"
  | "instrument"
  | "camera"
  | "video_mixer"
  | "video_matrix"
  | "projector"
  | "display"
  | "network"
  | "pc";

/**
 * React Flow 노드의 data 페이로드.
 * Record<string, unknown> 호환을 위해 인덱스 시그니처를 둔다.
 */
export interface DeviceData {
  label: string;
  category: DeviceCategory;
  model?: string;
  ports: Port[];
  /** 사용자가 등록한 커스텀 아이콘 이미지(data URL, 로컬 전용) */
  image?: string;
  [key: string]: unknown;
}

// 장소(구획) 노드의 data. 방송실/무대/강대상 등 러프한 박스.
export interface ZoneData {
  label: string;
  zoneType?: string;
  color: string; // ZONE_COLORS 키
  [key: string]: unknown;
}

// 캔버스 노드 union (React Flow). 타입으로 device/zone 구분.
export type DeviceNodeT = Node<DeviceData, "device">;
export type ZoneNodeT = Node<ZoneData, "zone">;
export type AppNode = DeviceNodeT | ZoneNodeT;

// 연결선(케이블) 상세 — 모두 선택. 초보자는 비워두고, 숙련자가 채운다.
export interface EdgeDetail {
  displayLabel?: string; // 우리 화면용 라벨
  deviceLabel?: string; // 장비에 적힌 라벨
  connectorFrom?: ConnectorType; // 시작(출발) 끝 단자
  connectorTo?: ConnectorType; // 도착(끝) 단자
  cableLength_m?: number;
  note?: string;
  [key: string]: unknown;
}

// ── WayMap 저장 포맷 (PROJECT-PLAN §4) ───────────────────────────
// 범용 JSON. 우리 웹앱에 다시 불러올 수 있는 표준 문서 형식.

export interface WayMapDevice {
  id: string;
  category: DeviceCategory;
  model?: string;
  label: string;
  position: { x: number; y: number };
  ports: Port[];
  image?: string;
}

export interface WayMapConnection {
  id: string;
  from: { deviceId: string; portId: string | null };
  to: { deviceId: string; portId: string | null };
  detail?: EdgeDetail;
}

export interface WayMapZone {
  id: string;
  label: string;
  zoneType?: string;
  color: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
}

export interface WayMapDoc {
  format: "waymap";
  version: string;
  meta: { title: string; createdAt?: string; appVersion: string };
  devices: WayMapDevice[];
  connections: WayMapConnection[];
  venue?: { zones: WayMapZone[] };
}
