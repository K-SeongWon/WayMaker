import type { Edge } from "@xyflow/react";
import type { AppNode, DeviceNodeT, WayMapDoc, ZoneNodeT } from "./types";
import { ZONE_DEFAULT_SIZE } from "./zones";

export const WAYMAP_VERSION = "0.1.0";
export const APP_VERSION = "0.1.0";
export const AUTOSAVE_KEY = "waymaker:autosave:v1";

/** React Flow 상태 → WayMap 문서 */
export function serializeWayMap(
  nodes: AppNode[],
  edges: Edge[],
  title: string,
): WayMapDoc {
  const devices = nodes.filter((n): n is DeviceNodeT => n.type === "device");
  const zones = nodes.filter((n): n is ZoneNodeT => n.type === "zone");

  return {
    format: "waymap",
    version: WAYMAP_VERSION,
    meta: {
      title: title.trim() || "제목 없는 WayMap",
      createdAt: new Date().toISOString(),
      appVersion: APP_VERSION,
    },
    devices: devices.map((n) => ({
      id: n.id,
      category: n.data.category,
      model: n.data.model,
      label: n.data.label,
      position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
      ports: n.data.ports,
    })),
    connections: edges.map((e) => ({
      id: e.id,
      from: { deviceId: e.source, portId: e.sourceHandle ?? null },
      to: { deviceId: e.target, portId: e.targetHandle ?? null },
    })),
    venue: zones.length
      ? {
          zones: zones.map((z) => ({
            id: z.id,
            label: z.data.label,
            zoneType: z.data.zoneType,
            color: z.data.color,
            position: { x: Math.round(z.position.x), y: Math.round(z.position.y) },
            size: {
              w: Math.round(z.width ?? z.measured?.width ?? ZONE_DEFAULT_SIZE.w),
              h: Math.round(z.height ?? z.measured?.height ?? ZONE_DEFAULT_SIZE.h),
            },
          })),
        }
      : undefined,
  };
}

/** WayMap 문서 → React Flow 상태 (검증 포함) */
export function deserializeWayMap(doc: unknown): {
  nodes: AppNode[];
  edges: Edge[];
  title: string;
} {
  if (
    !doc ||
    typeof doc !== "object" ||
    (doc as WayMapDoc).format !== "waymap" ||
    !Array.isArray((doc as WayMapDoc).devices) ||
    !Array.isArray((doc as WayMapDoc).connections)
  ) {
    throw new Error("유효한 WayMap 파일이 아닙니다.");
  }
  const d = doc as WayMapDoc;

  // 장소가 먼저 와야 장비 뒤에 렌더된다(zIndex로도 보장).
  const zoneNodes: AppNode[] = (d.venue?.zones ?? []).map((z) => ({
    id: z.id,
    type: "zone",
    position: z.position ?? { x: 0, y: 0 },
    width: z.size?.w ?? ZONE_DEFAULT_SIZE.w,
    height: z.size?.h ?? ZONE_DEFAULT_SIZE.h,
    zIndex: 0,
    data: { label: z.label, zoneType: z.zoneType, color: z.color },
  }));

  const deviceNodes: AppNode[] = d.devices.map((dev) => ({
    id: dev.id,
    type: "device",
    position: dev.position ?? { x: 0, y: 0 },
    zIndex: 1,
    data: {
      label: dev.label,
      category: dev.category,
      model: dev.model,
      ports: dev.ports ?? [],
    },
  }));

  const edges: Edge[] = d.connections.map((c) => ({
    id: c.id,
    source: c.from.deviceId,
    sourceHandle: c.from.portId ?? undefined,
    target: c.to.deviceId,
    targetHandle: c.to.portId ?? undefined,
  }));

  return { nodes: [...zoneNodes, ...deviceNodes], edges, title: d.meta?.title ?? "" };
}

/** WayMap 문서를 .waymap.json 파일로 다운로드 (브라우저 전용) */
export function downloadWayMap(doc: WayMapDoc) {
  const blob = new Blob([JSON.stringify(doc, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe =
    doc.meta.title.replace(/[^\w가-힣 -]/g, "").trim() || "waymap";
  a.href = url;
  a.download = `${safe}.waymap.json`;
  a.click();
  URL.revokeObjectURL(url);
}
