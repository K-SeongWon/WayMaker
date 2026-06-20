import type { DeviceCategory } from "@/lib/types";

// 카테고리별 스타일라이즈 아이콘 + 색상. 장비가 "무엇인지" 한눈에 보이도록.
// (모델별 정밀 외형은 후속 단계에서 보강)

export const CATEGORY_STYLE: Record<DeviceCategory, { header: string; icon: string }> = {
  mixer: { header: "bg-indigo-50 text-indigo-700", icon: "text-indigo-600" },
  stagebox: { header: "bg-violet-50 text-violet-700", icon: "text-violet-600" },
  speaker: { header: "bg-orange-50 text-orange-700", icon: "text-orange-600" },
  monitor_speaker: { header: "bg-orange-50 text-orange-700", icon: "text-orange-600" },
  subwoofer: { header: "bg-amber-50 text-amber-800", icon: "text-amber-700" },
  mic: { header: "bg-rose-50 text-rose-700", icon: "text-rose-600" },
  wireless: { header: "bg-rose-50 text-rose-700", icon: "text-rose-600" },
  di: { header: "bg-yellow-50 text-yellow-800", icon: "text-yellow-700" },
  instrument: { header: "bg-emerald-50 text-emerald-700", icon: "text-emerald-600" },
  camera: { header: "bg-cyan-50 text-cyan-700", icon: "text-cyan-600" },
  video_mixer: { header: "bg-cyan-50 text-cyan-700", icon: "text-cyan-600" },
  video_matrix: { header: "bg-teal-50 text-teal-700", icon: "text-teal-600" },
  projector: { header: "bg-sky-50 text-sky-700", icon: "text-sky-600" },
  display: { header: "bg-sky-50 text-sky-700", icon: "text-sky-600" },
  network: { header: "bg-slate-100 text-slate-700", icon: "text-slate-600" },
  pc: { header: "bg-slate-100 text-slate-700", icon: "text-slate-600" },
};

function iconPaths(category: DeviceCategory) {
  switch (category) {
    case "mic":
    case "wireless":
      // 마이크: 캡슐 + 스탠드
      return (
        <>
          <rect x="6.5" y="1.5" width="3" height="8" rx="1.5" />
          <path d="M4.5 7.5a3.5 3.5 0 0 0 7 0" />
          <line x1="8" y1="11" x2="8" y2="13.5" />
          <line x1="5.5" y1="14.5" x2="10.5" y2="14.5" />
        </>
      );
    case "speaker":
    case "monitor_speaker":
    case "subwoofer":
      // 스피커: 캐비닛 + 우퍼/트위터
      return (
        <>
          <rect x="3.5" y="1.5" width="9" height="13" rx="1" />
          <circle cx="8" cy="9.5" r="2.6" />
          <circle cx="8" cy="4" r="1" />
        </>
      );
    case "mixer":
      // 믹서: 페이더 3개
      return (
        <>
          <line x1="4.5" y1="2.5" x2="4.5" y2="13.5" />
          <line x1="8" y1="2.5" x2="8" y2="13.5" />
          <line x1="11.5" y1="2.5" x2="11.5" y2="13.5" />
          <rect x="3.2" y="9" width="2.6" height="2.2" rx="0.5" />
          <rect x="6.7" y="4.5" width="2.6" height="2.2" rx="0.5" />
          <rect x="10.2" y="7" width="2.6" height="2.2" rx="0.5" />
        </>
      );
    case "stagebox":
      // 스테이지박스: 랙 + 단자 점들
      return (
        <>
          <rect x="2" y="3.5" width="12" height="9" rx="1" />
          <circle cx="4.8" cy="8" r="0.9" />
          <circle cx="8" cy="8" r="0.9" />
          <circle cx="11.2" cy="8" r="0.9" />
        </>
      );
    case "di":
      // DI 박스: 작은 박스 + 단자
      return (
        <>
          <rect x="3.5" y="4" width="9" height="8" rx="1" />
          <circle cx="6" cy="8" r="0.9" />
          <circle cx="10" cy="8" r="0.9" />
        </>
      );
    case "instrument":
      // 건반
      return (
        <>
          <rect x="2" y="4.5" width="12" height="7" rx="1" />
          <line x1="5" y1="4.5" x2="5" y2="9" />
          <line x1="8" y1="4.5" x2="8" y2="9" />
          <line x1="11" y1="4.5" x2="11" y2="9" />
        </>
      );
    case "camera":
      // 카메라: 본체 + 렌즈
      return (
        <>
          <rect x="2" y="4" width="9" height="8" rx="1" />
          <circle cx="6.5" cy="8" r="2" />
          <path d="M11 6.5 L14 5 V11 L11 9.5 Z" />
        </>
      );
    case "video_mixer":
    case "video_matrix":
      // 비디오: 화면 + 스위치
      return (
        <>
          <rect x="2" y="3" width="12" height="8" rx="1" />
          <line x1="8" y1="3" x2="8" y2="11" />
          <line x1="5" y1="13.5" x2="11" y2="13.5" />
        </>
      );
    case "projector":
      // 프로젝터: 본체 + 빔
      return (
        <>
          <rect x="2" y="5" width="8" height="6" rx="1" />
          <circle cx="6" cy="8" r="1.8" />
          <path d="M10 6.5 L14 4.5 M10 9.5 L14 11.5" />
        </>
      );
    case "display":
      // 디스플레이: TV
      return (
        <>
          <rect x="2" y="2.5" width="12" height="8.5" rx="1" />
          <line x1="5.5" y1="13.5" x2="10.5" y2="13.5" />
        </>
      );
    case "network":
      // 네트워크: 포트 + 분기
      return (
        <>
          <rect x="2" y="6.5" width="12" height="5" rx="1" />
          <line x1="8" y1="6.5" x2="8" y2="3" />
          <line x1="4.5" y1="3" x2="11.5" y2="3" />
          <line x1="4.5" y1="3" x2="4.5" y2="6.5" />
          <line x1="11.5" y1="3" x2="11.5" y2="6.5" />
        </>
      );
    case "pc":
    default:
      // PC: 모니터
      return (
        <>
          <rect x="2" y="3" width="12" height="8" rx="1" />
          <line x1="6" y1="13.5" x2="10" y2="13.5" />
          <line x1="8" y1="11" x2="8" y2="13.5" />
        </>
      );
  }
}

export default function CategoryIcon({
  category,
  className = "",
}: {
  category: DeviceCategory;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {iconPaths(category)}
    </svg>
  );
}
