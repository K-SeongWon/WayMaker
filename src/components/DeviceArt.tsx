import type { DeviceCategory } from "@/lib/types";

// 모델/폼팩터별 스타일라이즈 일러스트. 실제 제품 사진 복제가 아니라 식별 가능한
// 단순화 표현(IP 안전). 포트 결선은 노드 본문에서 그대로 처리되고, 이 아트는
// "무엇인지 한눈에" 보이게 하는 배너 역할.

// 모델 키(프리셋 key) → 아트 키 (히어로 장비 전용)
const MODEL_ART: Record<string, string> = {
  "behringer-x32-compact": "mixer",
  "behringer-sd16": "stagebox",
  "jbl-eon615": "speaker-pa",
  "passive-delay-speaker": "speaker-pa",
  "behringer-f1220d": "monitor-wedge",
  "behringer-b1200d-pro": "subwoofer",
  "sennheiser-xs1": "mic-handheld",
  "akg-c1000s": "mic-pencil",
  "gooseneck-condenser": "mic-gooseneck",
  "kannals-mw-620": "wireless-rx",
  "dual-passive-di": "di-box",
  "yamaha-p225": "keyboard",
  "yamaha-dgx220": "keyboard",
  "blackmagic-atem-mini-pro": "video-switcher",
  "hdmi-matrix-4x2": "matrix",
  "ptz-camera": "camera-ptz",
  "philips-projector": "projector",
  "stage-monitor-tv": "display",
  "xlr-lan-extender": "rack-io",
};

// 카테고리 기본 아트 (모델 매핑이 없을 때)
const CATEGORY_DEFAULT_ART: Record<DeviceCategory, string> = {
  mixer: "mixer",
  stagebox: "stagebox",
  speaker: "speaker-pa",
  monitor_speaker: "monitor-wedge",
  subwoofer: "subwoofer",
  mic: "mic-handheld",
  wireless: "wireless-rx",
  di: "di-box",
  instrument: "keyboard",
  camera: "camera-ptz",
  video_mixer: "video-switcher",
  video_matrix: "matrix",
  projector: "projector",
  display: "display",
  network: "rack-io",
  pc: "display",
};

export function artKeyFor(category: DeviceCategory, modelKey?: string): string {
  return (modelKey && MODEL_ART[modelKey]) || CATEGORY_DEFAULT_ART[category] || "box";
}

const FILL = { fill: "currentColor", fillOpacity: 0.07 } as const;

function art(key: string) {
  switch (key) {
    case "mixer":
      return (
        <>
          <rect x="16" y="8" width="128" height="44" rx="3" {...FILL} />
          <rect x="6" y="14" width="10" height="32" rx="1.5" />
          <rect x="146" y="14" width="10" height="32" rx="1.5" />
          <rect x="24" y="14" width="36" height="16" rx="2" />
          <circle cx="72" cy="20" r="3" />
          <circle cx="84" cy="20" r="3" />
          <circle cx="96" cy="20" r="3" />
          <circle cx="132" cy="20" r="3" />
          {[66, 78, 90, 102, 114, 126].map((x) => (
            <g key={x}>
              <line x1={x} y1="34" x2={x} y2="46" />
              <rect x={x - 3} y="38" width="6" height="3" rx="1" />
            </g>
          ))}
        </>
      );
    case "stagebox":
      return (
        <>
          <rect x="16" y="10" width="128" height="40" rx="3" {...FILL} />
          <rect x="6" y="16" width="10" height="28" rx="1.5" />
          <rect x="146" y="16" width="10" height="28" rx="1.5" />
          {[30, 42, 54, 66, 78, 90, 102, 114].map((x) => (
            <g key={x}>
              <circle cx={x} cy="22" r="2.4" />
              <circle cx={x} cy="38" r="2.4" />
            </g>
          ))}
        </>
      );
    case "speaker-pa":
      return (
        <>
          <path d="M50 8 L110 8 L122 52 L38 52 Z" {...FILL} />
          <circle cx="80" cy="36" r="13" />
          <circle cx="80" cy="18" r="4" />
          <line x1="36" y1="26" x2="36" y2="36" />
        </>
      );
    case "monitor-wedge":
      return (
        <>
          <path d="M38 52 L122 52 L122 30 L38 44 Z" {...FILL} />
          <circle cx="78" cy="42" r="9" />
          <circle cx="104" cy="38" r="3" />
        </>
      );
    case "subwoofer":
      return (
        <>
          <rect x="44" y="8" width="72" height="44" rx="2" {...FILL} />
          <circle cx="80" cy="30" r="15" />
          <circle cx="80" cy="30" r="5" />
        </>
      );
    case "mic-handheld":
      return (
        <>
          <circle cx="46" cy="30" r="13" {...FILL} />
          <line x1="40" y1="24" x2="52" y2="24" />
          <line x1="39" y1="30" x2="53" y2="30" />
          <line x1="40" y1="36" x2="52" y2="36" />
          <rect x="56" y="24" width="62" height="12" rx="6" {...FILL} />
          <rect x="118" y="26" width="8" height="8" rx="1" />
        </>
      );
    case "mic-pencil":
      return (
        <>
          <rect x="40" y="24" width="18" height="12" rx="2" {...FILL} />
          <line x1="44" y1="24" x2="44" y2="36" />
          <line x1="49" y1="24" x2="49" y2="36" />
          <rect x="58" y="26" width="60" height="8" rx="4" {...FILL} />
          <rect x="118" y="27" width="7" height="6" rx="1" />
        </>
      );
    case "mic-gooseneck":
      return (
        <>
          <ellipse cx="80" cy="49" rx="20" ry="4" {...FILL} />
          <rect x="72" y="40" width="16" height="8" rx="2" {...FILL} />
          <path d="M80 40 C80 26 102 26 102 14" />
          <circle cx="102" cy="12" r="4" {...FILL} />
        </>
      );
    case "wireless-rx":
      return (
        <>
          <rect x="30" y="20" width="100" height="30" rx="2" {...FILL} />
          <line x1="44" y1="20" x2="36" y2="8" />
          <line x1="116" y1="20" x2="124" y2="8" />
          <rect x="44" y="28" width="26" height="14" rx="1.5" />
          <rect x="90" y="28" width="26" height="14" rx="1.5" />
        </>
      );
    case "di-box":
      return (
        <>
          <rect x="54" y="18" width="52" height="30" rx="2" {...FILL} />
          <circle cx="68" cy="44" r="3" />
          <circle cx="92" cy="44" r="3" />
          <circle cx="80" cy="16" r="3" />
          <rect x="62" y="24" width="36" height="8" rx="1" />
        </>
      );
    case "keyboard":
      return (
        <>
          <rect x="14" y="20" width="132" height="24" rx="2" {...FILL} />
          <rect x="14" y="20" width="22" height="24" rx="2" {...FILL} />
          <circle cx="22" cy="28" r="2" />
          <circle cx="30" cy="28" r="2" />
          {[44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140].map((x) => (
            <line key={x} x1={x} y1="24" x2={x} y2="44" />
          ))}
          {[48, 56, 72, 80, 88, 104, 112, 128, 136].map((x) => (
            <rect key={x} x={x - 2} y="24" width="4" height="10" {...FILL} />
          ))}
        </>
      );
    case "video-switcher":
      return (
        <>
          <rect x="24" y="18" width="112" height="28" rx="2" {...FILL} />
          {[36, 50, 64, 78].map((x) => (
            <rect key={`a${x}`} x={x} y="24" width="9" height="6" rx="1" />
          ))}
          {[36, 50, 64, 78].map((x) => (
            <rect key={`b${x}`} x={x} y="34" width="9" height="6" rx="1" />
          ))}
          <circle cx="112" cy="27" r="3" />
          <circle cx="124" cy="27" r="3" />
          <rect x="104" y="34" width="24" height="6" rx="1" />
        </>
      );
    case "matrix":
      return (
        <>
          <rect x="20" y="14" width="120" height="32" rx="2" {...FILL} />
          {[34, 58, 82, 106].map((x) => (
            <rect key={`i${x}`} x={x} y="19" width="16" height="7" rx="1" />
          ))}
          {[52, 92].map((x) => (
            <rect key={`o${x}`} x={x} y="33" width="16" height="7" rx="1" />
          ))}
        </>
      );
    case "camera-ptz":
      return (
        <>
          <rect x="60" y="44" width="40" height="8" rx="2" {...FILL} />
          <path d="M58 44 a22 22 0 0 1 44 0 Z" {...FILL} />
          <circle cx="80" cy="34" r="9" />
          <circle cx="80" cy="34" r="4" />
        </>
      );
    case "projector":
      return (
        <>
          <polygon points="46,32 20,22 20,42" {...FILL} />
          <rect x="44" y="16" width="80" height="32" rx="3" {...FILL} />
          <circle cx="58" cy="32" r="8" />
          <circle cx="58" cy="32" r="3" />
          <line x1="104" y1="24" x2="116" y2="24" />
          <line x1="104" y1="30" x2="116" y2="30" />
          <line x1="104" y1="36" x2="116" y2="36" />
        </>
      );
    case "display":
      return (
        <>
          <rect x="30" y="10" width="100" height="34" rx="2" {...FILL} />
          <line x1="80" y1="44" x2="80" y2="50" />
          <line x1="66" y1="50" x2="94" y2="50" />
        </>
      );
    case "rack-io":
      return (
        <>
          <rect x="20" y="16" width="120" height="28" rx="2" {...FILL} />
          {[40, 58, 76, 94].map((x) => (
            <circle key={x} cx={x} cy="30" r="4" />
          ))}
          <rect x="112" y="24" width="16" height="12" rx="1" />
        </>
      );
    default:
      return <rect x="20" y="16" width="120" height="28" rx="3" {...FILL} />;
  }
}

export default function DeviceArt({
  category,
  modelKey,
  className = "",
}: {
  category: DeviceCategory;
  modelKey?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 60"
      width="100%"
      height="52"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      {art(artKeyFor(category, modelKey))}
    </svg>
  );
}
