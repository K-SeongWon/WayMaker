import type { ConnectorType, PortDirection, SignalType } from "./types";

// 편집 UI용 한글 라벨 옵션. 값은 도메인 타입과 일치한다.

export const DIRECTION_OPTIONS: { value: PortDirection; label: string }[] = [
  { value: "in", label: "입력" },
  { value: "out", label: "출력" },
  { value: "bidi", label: "데이터 (양방향·AES50/이더넷)" },
];

export const SIGNAL_OPTIONS: { value: SignalType; label: string }[] = [
  { value: "analog_audio", label: "아날로그 오디오" },
  { value: "digital_audio", label: "디지털 오디오" },
  { value: "network", label: "네트워크" },
  { value: "video", label: "비디오" },
  { value: "power", label: "전원" },
  { value: "control", label: "컨트롤" },
];

// connector는 선택 항목(미지정 가능)이라 빈 값을 첫 옵션으로 둔다.
export const CONNECTOR_OPTIONS: { value: ConnectorType | ""; label: string }[] = [
  { value: "", label: "— 미지정" },
  { value: "xlr_m", label: "XLR (수)" },
  { value: "xlr_f", label: "XLR (암)" },
  { value: "trs", label: "TRS 55" },
  { value: "speakon", label: "스피콘" },
  { value: "banana", label: "바나나" },
  { value: "etherCON", label: "이더콘" },
  { value: "rj45", label: "RJ45" },
  { value: "usb_c", label: "USB-C" },
  { value: "hdmi", label: "HDMI" },
  { value: "unknown", label: "기타" },
];
