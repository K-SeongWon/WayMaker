import type { DeviceCategory, WayMapDoc, WayMapDevice } from "./types";

// WayMapDoc → 자기완결형 인터랙티브 HTML(인라인 CSS/JS, 의존성 0, 오프라인).
// 장비 클릭 시 연결된 결선·장비를 하이라이트한다(오프라인 매뉴얼 + M6 디딤돌).

const HEADER_H = 24;
const PAD_Y = 6;
const ROW_H = 18;
const BOX_W = 190;
const MARGIN = 48;

// 카테고리 헤더 색(라이트 배경/텍스트)
const CATEGORY_HEX: Record<DeviceCategory, [string, string]> = {
  mixer: ["#eef2ff", "#4f46e5"],
  stagebox: ["#f5f3ff", "#7c3aed"],
  speaker: ["#fff7ed", "#ea580c"],
  monitor_speaker: ["#fff7ed", "#ea580c"],
  subwoofer: ["#fffbeb", "#b45309"],
  mic: ["#fff1f2", "#e11d48"],
  wireless: ["#fff1f2", "#e11d48"],
  di: ["#fefce8", "#a16207"],
  instrument: ["#ecfdf5", "#059669"],
  camera: ["#ecfeff", "#0891b2"],
  video_mixer: ["#ecfeff", "#0891b2"],
  video_matrix: ["#f0fdfa", "#0d9488"],
  projector: ["#f0f9ff", "#0284c7"],
  display: ["#f0f9ff", "#0284c7"],
  network: ["#f1f5f9", "#475569"],
  pc: ["#f1f5f9", "#475569"],
};

const ZONE_HEX: Record<string, [string, string]> = {
  indigo: ["#e0e7ff", "#a5b4fc"],
  violet: ["#ede9fe", "#c4b5fd"],
  amber: ["#fef3c7", "#fcd34d"],
  rose: ["#ffe4e6", "#fda4af"],
  sky: ["#e0f2fe", "#7dd3fc"],
  slate: ["#f1f5f9", "#cbd5e1"],
};

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface DevLayout {
  d: WayMapDevice;
  x: number;
  y: number;
  w: number;
  h: number;
  left: { id: string; name: string }[];
  right: { id: string; name: string }[];
}

function buildLayout(doc: WayMapDoc) {
  // 좌표 정규화용 경계 계산
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const devLayouts: DevLayout[] = doc.devices.map((d) => {
    const left = d.ports.filter((p) => p.direction === "in");
    const right = d.ports.filter((p) => p.direction !== "in");
    const rows = Math.max(left.length, right.length, 1);
    const h = HEADER_H + PAD_Y * 2 + rows * ROW_H;
    const x = d.position?.x ?? 0;
    const y = d.position?.y ?? 0;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + BOX_W);
    maxY = Math.max(maxY, y + h);
    return {
      d,
      x,
      y,
      w: BOX_W,
      h,
      left: left.map((p) => ({ id: p.id, name: p.name })),
      right: right.map((p) => ({ id: p.id, name: p.name })),
    };
  });

  const zones = doc.venue?.zones ?? [];
  for (const z of zones) {
    minX = Math.min(minX, z.position.x);
    minY = Math.min(minY, z.position.y);
    maxX = Math.max(maxX, z.position.x + z.size.w);
    maxY = Math.max(maxY, z.position.y + z.size.h);
  }

  if (!isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
  }

  const offX = -minX + MARGIN;
  const offY = -minY + MARGIN;
  const width = maxX - minX + MARGIN * 2;
  const height = maxY - minY + MARGIN * 2;

  return { devLayouts, zones, offX, offY, width, height };
}

function anchor(
  dl: DevLayout,
  portId: string | null,
  offX: number,
  offY: number,
  defaultSide: "left" | "right",
) {
  const li = portId ? dl.left.findIndex((p) => p.id === portId) : -1;
  const ri = portId ? dl.right.findIndex((p) => p.id === portId) : -1;
  let side: "left" | "right";
  let yMid: number;
  if (li >= 0) {
    side = "left";
    yMid = dl.y + HEADER_H + PAD_Y + (li + 0.5) * ROW_H;
  } else if (ri >= 0) {
    side = "right";
    yMid = dl.y + HEADER_H + PAD_Y + (ri + 0.5) * ROW_H;
  } else {
    side = defaultSide;
    yMid = dl.y + dl.h / 2;
  }
  const x = side === "left" ? dl.x : dl.x + dl.w;
  return { x: x + offX, y: yMid + offY, side };
}

export function buildStandaloneHtml(doc: WayMapDoc): string {
  const { devLayouts, zones, offX, offY, width, height } = buildLayout(doc);
  const byId = new Map(devLayouts.map((dl) => [dl.d.id, dl]));

  // 구획
  const zoneHtml = zones
    .map((z) => {
      const [bg, border] = ZONE_HEX[z.color] ?? ZONE_HEX.slate;
      return (
        `<div class="zone" style="left:${z.position.x + offX}px;top:${z.position.y + offY}px;` +
        `width:${z.size.w}px;height:${z.size.h}px;background:${bg}80;border-color:${border}">` +
        `<span class="zone-l" style="background:${bg};color:${border}">${esc(z.label)}</span></div>`
      );
    })
    .join("");

  // 결선(SVG path)
  const edgeHtml = doc.connections
    .map((c) => {
      const s = byId.get(c.from.deviceId);
      const t = byId.get(c.to.deviceId);
      if (!s || !t) return "";
      const a = anchor(s, c.from.portId, offX, offY, "right");
      const b = anchor(t, c.to.portId, offX, offY, "left");
      const dx = Math.max(40, Math.abs(b.x - a.x) / 2);
      const c1x = a.x + (a.side === "right" ? dx : -dx);
      const c2x = b.x + (b.side === "left" ? -dx : dx);
      const d = `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
      return `<path d="${d}" data-s="${esc(c.from.deviceId)}" data-t="${esc(c.to.deviceId)}" />`;
    })
    .join("");

  // 장비
  const devHtml = devLayouts
    .map((dl) => {
      const [bg, fg] = CATEGORY_HEX[dl.d.category] ?? CATEGORY_HEX.pc;
      const leftRows = dl.left
        .map((p) => `<div class="p">▸ ${esc(p.name)}</div>`)
        .join("");
      const rightRows = dl.right
        .map((p) => `<div class="p r">${esc(p.name)} ◂</div>`)
        .join("");
      return (
        `<div class="dev" data-id="${esc(dl.d.id)}" style="left:${dl.x + offX}px;top:${dl.y + offY}px;width:${dl.w}px;height:${dl.h}px">` +
        `<div class="dev-h" style="background:${bg};color:${fg}">${esc(dl.d.label)}</div>` +
        `<div class="dev-b"><div class="col">${leftRows}</div><div class="col">${rightRows}</div></div>` +
        `</div>`
      );
    })
    .join("");

  const title = esc(doc.meta?.title || "WayMap");

  const css = [
    "*{box-sizing:border-box}",
    "body{margin:0;font-family:system-ui,'Malgun Gothic',sans-serif;background:#f8fafc;color:#1f2937}",
    ".bar{padding:10px 16px;border-bottom:1px solid #e5e7eb;background:#fff;display:flex;align-items:baseline;gap:10px;position:sticky;top:0;z-index:10}",
    ".bar b{font-size:15px}.bar small{color:#9ca3af}",
    ".hint{color:#9ca3af;font-size:12px}",
    "#wm{position:relative;margin:16px auto}",
    ".zone{position:absolute;border:2px solid;border-radius:8px;z-index:0}",
    ".zone-l{position:absolute;left:4px;top:4px;font-size:11px;font-weight:600;padding:1px 6px;border-radius:4px}",
    "svg.edges{position:absolute;left:0;top:0;z-index:1;pointer-events:none;overflow:visible}",
    "svg.edges path{fill:none;stroke:#94a3b8;stroke-width:1.5}",
    ".dev{position:absolute;z-index:2;background:#fff;border:1px solid #d1d5db;border-radius:8px;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,.06);cursor:pointer;overflow:hidden}",
    ".dev-h{height:" + HEADER_H + "px;line-height:" + HEADER_H + "px;padding:0 8px;font-weight:600;border-bottom:1px solid #eef0f2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".dev-b{display:flex;justify-content:space-between;padding:" + PAD_Y + "px 8px}",
    ".col{display:flex;flex-direction:column}",
    ".p{height:" + ROW_H + "px;line-height:" + ROW_H + "px;color:#4b5563;white-space:nowrap}",
    ".p.r{text-align:right}",
    "#wm.focus .dev{opacity:.3}",
    "#wm.focus .dev.hi,#wm.focus .dev.sel{opacity:1}",
    "#wm.focus .dev.sel{box-shadow:0 0 0 2px #3b82f6}",
    "#wm.focus svg.edges path{opacity:.08}",
    "#wm.focus svg.edges path.hi{opacity:1;stroke:#2563eb;stroke-width:2.5}",
  ].join("");

  // 인터랙션 스크립트(백틱 미사용)
  const js = [
    "(function(){",
    "var wm=document.getElementById('wm');",
    "function clear(){var a=wm.querySelectorAll('.sel,.hi');for(var i=0;i<a.length;i++){a[i].classList.remove('sel');a[i].classList.remove('hi');}}",
    "function mark(id){var el=wm.querySelector('.dev[data-id=\"'+id+'\"]');if(el)el.classList.add('hi');}",
    "wm.addEventListener('click',function(e){",
    "var dev=e.target.closest?e.target.closest('.dev'):null;",
    "clear();",
    "if(!dev){wm.classList.remove('focus');return;}",
    "wm.classList.add('focus');dev.classList.add('sel');",
    "var id=dev.getAttribute('data-id');",
    "var ps=wm.querySelectorAll('svg.edges path');",
    "for(var i=0;i<ps.length;i++){var p=ps[i];var s=p.getAttribute('data-s'),t=p.getAttribute('data-t');",
    "if(s===id||t===id){p.classList.add('hi');mark(s);mark(t);}}",
    "});",
    "})();",
  ].join("");

  return (
    "<!doctype html><html lang=\"ko\"><head><meta charset=\"utf-8\">" +
    `<meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — WayMap</title>` +
    `<style>${css}</style></head><body>` +
    `<div class="bar"><b>${title}</b><small>WayMap</small><span class="hint">장비를 클릭하면 연결 흐름이 표시됩니다 · 빈 곳을 클릭하면 해제</span></div>` +
    `<div id="wm" style="width:${width}px;height:${height}px">` +
    zoneHtml +
    `<svg class="edges" width="${width}" height="${height}">${edgeHtml}</svg>` +
    devHtml +
    `</div>` +
    `<script>${js}</script>` +
    `</body></html>`
  );
}
