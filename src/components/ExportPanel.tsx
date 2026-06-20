"use client";

import { useState } from "react";
import { Panel, getNodesBounds, useReactFlow } from "@xyflow/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useWayMapStore } from "@/store/waymapStore";
import { serializeWayMap } from "@/lib/waymap";
import { buildStandaloneHtml } from "@/lib/exportHtml";

const PAD = 48; // 다이어그램 가장자리 여백(px)

const btn =
  "rounded border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50";

export default function ExportPanel() {
  const { getNodes } = useReactFlow();
  const title = useWayMapStore((s) => s.title);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const safeName =
    title.replace(/[^\w가-힣 -]/g, "").trim() || "waymap";

  function currentHtml(): string | null {
    const { nodes, edges, title: t } = useWayMapStore.getState();
    if (!nodes.length) {
      alert("내보낼 내용이 없습니다. 장비나 장소를 추가하세요.");
      return null;
    }
    return buildStandaloneHtml(serializeWayMap(nodes, edges, t));
  }

  function onHtml() {
    const html = currentHtml();
    if (!html) return;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onCopyHtml() {
    const html = currentHtml();
    if (!html) return;
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([html], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(html);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      alert(`복사 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    }
  }

  // 노드 영역을 1:1로 캡처해 PNG dataURL 반환
  async function capture(): Promise<{ url: string; w: number; h: number } | null> {
    const nodes = getNodes();
    if (!nodes.length) {
      alert("내보낼 내용이 없습니다. 장비나 장소를 추가하세요.");
      return null;
    }
    const bounds = getNodesBounds(nodes);
    const w = Math.ceil(bounds.width + PAD * 2);
    const h = Math.ceil(bounds.height + PAD * 2);
    const viewport = document.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement | null;
    if (!viewport) return null;

    const url = await toPng(viewport, {
      backgroundColor: "#ffffff",
      width: w,
      height: h,
      pixelRatio: 2,
      style: {
        width: `${w}px`,
        height: `${h}px`,
        transform: `translate(${-bounds.x + PAD}px, ${-bounds.y + PAD}px) scale(1)`,
      },
    });
    return { url, w, h };
  }

  async function onPng() {
    setBusy(true);
    try {
      const r = await capture();
      if (!r) return;
      const a = document.createElement("a");
      a.href = r.url;
      a.download = `${safeName}.png`;
      a.click();
    } catch (e) {
      alert(`내보내기 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    } finally {
      setBusy(false);
    }
  }

  async function onPdf(format: "a4" | "a3") {
    setBusy(true);
    try {
      const r = await capture();
      if (!r) return;
      const orientation = r.w >= r.h ? "landscape" : "portrait";
      const pdf = new jsPDF({ orientation, unit: "mm", format });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;
      const ratio = Math.min(availW / r.w, availH / r.h);
      const imgW = r.w * ratio;
      const imgH = r.h * ratio;
      const x = (pageW - imgW) / 2;
      const y = (pageH - imgH) / 2;
      pdf.addImage(r.url, "PNG", x, y, imgW, imgH);
      // 출처 표기(ASCII — jsPDF 기본 폰트는 한글 미지원이라 제목은 파일명으로)
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text("Made with WayMaker", pageW - margin, pageH - 5, { align: "right" });
      pdf.save(`${safeName}.pdf`);
    } catch (e) {
      alert(`내보내기 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel position="top-right">
      <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white/90 p-1 shadow-sm backdrop-blur">
        <span className="self-center px-1 text-[11px] text-gray-400">내보내기</span>
        <button type="button" disabled={busy} onClick={onPng} className={btn}>
          PNG
        </button>
        <button type="button" disabled={busy} onClick={() => onPdf("a4")} className={btn}>
          PDF A4
        </button>
        <button type="button" disabled={busy} onClick={() => onPdf("a3")} className={btn}>
          PDF A3
        </button>
        <span className="mx-0.5 h-4 w-px self-center bg-gray-200" />
        <button type="button" disabled={busy} onClick={onHtml} className={btn}>
          HTML
        </button>
        <button type="button" disabled={busy} onClick={onCopyHtml} className={btn}>
          {copied ? "복사됨" : "HTML 복사"}
        </button>
      </div>
    </Panel>
  );
}
