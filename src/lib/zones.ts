// 장소(구획) 프리셋과 색상. 방송실/앰프실/무대/강대상/청중석 등을 러프한 박스로.

export interface ZonePreset {
  key: string;
  label: string;
  color: string;
}

export const ZONE_PRESETS: ZonePreset[] = [
  { key: "broadcast", label: "방송실", color: "indigo" },
  { key: "amp", label: "앰프실", color: "violet" },
  { key: "stage", label: "무대", color: "amber" },
  { key: "pulpit", label: "강대상", color: "rose" },
  { key: "audience", label: "청중석", color: "sky" },
  { key: "empty", label: "구획", color: "slate" },
];

export interface ZoneColor {
  bg: string;
  border: string;
  label: string;
}

// 반투명 배경(/40)이라 위에 올린 장비가 비쳐 보인다.
export const ZONE_COLORS: Record<string, ZoneColor> = {
  indigo: { bg: "bg-indigo-100/40", border: "border-indigo-300", label: "bg-indigo-100 text-indigo-700" },
  violet: { bg: "bg-violet-100/40", border: "border-violet-300", label: "bg-violet-100 text-violet-700" },
  amber: { bg: "bg-amber-100/40", border: "border-amber-300", label: "bg-amber-100 text-amber-800" },
  rose: { bg: "bg-rose-100/40", border: "border-rose-300", label: "bg-rose-100 text-rose-700" },
  sky: { bg: "bg-sky-100/40", border: "border-sky-300", label: "bg-sky-100 text-sky-700" },
  slate: { bg: "bg-slate-100/50", border: "border-slate-300", label: "bg-slate-100 text-slate-700" },
};

export const ZONE_COLOR_OPTIONS: { value: string; label: string }[] = [
  { value: "indigo", label: "남색" },
  { value: "violet", label: "보라" },
  { value: "amber", label: "황색" },
  { value: "rose", label: "분홍" },
  { value: "sky", label: "하늘" },
  { value: "slate", label: "회색" },
];

export const ZONE_DEFAULT_SIZE = { w: 260, h: 170 };
