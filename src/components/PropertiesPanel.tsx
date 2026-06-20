"use client";

import { useRef, useState } from "react";
import { nextPortId, useWayMapStore } from "@/store/waymapStore";
import {
  CONNECTOR_OPTIONS,
  DIRECTION_OPTIONS,
  SIGNAL_OPTIONS,
} from "@/lib/portOptions";
import { ZONE_COLOR_OPTIONS } from "@/lib/zones";
import { fileToDataUrl } from "@/lib/image";
import type { ConnectorType, EdgeDetail, Port } from "@/lib/types";
import CategoryIcon, { CATEGORY_STYLE } from "./CategoryIcon";

const field =
  "w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100";
const selectSm =
  "w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none";
const label = "mb-1 block text-[11px] font-medium text-gray-500";
const sectionTitle =
  "text-[11px] font-semibold uppercase tracking-wide text-gray-400";
const ghostBtn =
  "rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 hover:border-blue-400 hover:bg-blue-50";
const deleteBtn =
  "w-full rounded-md border border-red-200 bg-white px-2 py-1.5 text-sm text-red-500 hover:border-red-400 hover:bg-red-50";

function dotColor(dir: Port["direction"]) {
  if (dir === "in") return "bg-emerald-500";
  if (dir === "out") return "bg-sky-500";
  return "bg-amber-500";
}

function effSide(p: Port): "left" | "right" {
  return p.side ?? (p.direction === "in" ? "left" : "right");
}

function SideToggle({
  value,
  onChange,
}: {
  value: "left" | "right";
  onChange: (v: "left" | "right") => void;
}) {
  return (
    <div className="flex shrink-0 overflow-hidden rounded-md border border-gray-300 text-[11px]">
      {(["left", "right"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          title={s === "left" ? "왼쪽에 표시" : "오른쪽에 표시"}
          className={`px-1.5 py-1 ${
            value === s
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {s === "left" ? "좌" : "우"}
        </button>
      ))}
    </div>
  );
}

export default function PropertiesPanel() {
  const node = useWayMapStore(
    (s) => s.nodes.find((n) => n.id === s.selectedId) ?? null,
  );
  const edge = useWayMapStore(
    (s) => s.edges.find((e) => e.id === s.selectedEdgeId) ?? null,
  );
  const nodes = useWayMapStore((s) => s.nodes);
  const updateDevice = useWayMapStore((s) => s.updateDevice);
  const updateZone = useWayMapStore((s) => s.updateZone);
  const removeNode = useWayMapStore((s) => s.removeNode);
  const addPort = useWayMapStore((s) => s.addPort);
  const updatePort = useWayMapStore((s) => s.updatePort);
  const removePort = useWayMapStore((s) => s.removePort);
  const updateEdge = useWayMapStore((s) => s.updateEdge);
  const removeEdge = useWayMapStore((s) => s.removeEdge);

  const [advanced, setAdvanced] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const device = node && node.type === "device" ? node : null;
  const zone = node && node.type === "zone" ? node : null;

  const ed = (edge?.data ?? {}) as EdgeDetail;
  const nodeLabel = (id?: string) => {
    const n = nodes.find((x) => x.id === id);
    return (n?.data as { label?: string } | undefined)?.label ?? id ?? "?";
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !device) return;
    try {
      const url = await fileToDataUrl(file, 320);
      updateDevice(device.id, { image: url });
    } catch {
      alert("이미지를 불러오지 못했습니다.");
    }
  };

  const kind = device ? "장비" : zone ? "장소" : edge ? "연결선" : null;

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          속성{kind ? ` · ${kind}` : ""}
        </h2>
        {device && (
          <label className="flex cursor-pointer items-center gap-1 text-[11px] text-gray-500">
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
            />
            고급
          </label>
        )}
      </div>

      {!node && !edge && (
        <p className="text-sm text-gray-400">
          장비·장소·연결선을 선택하면 정보가 표시됩니다.
        </p>
      )}

      {/* ─────────── 연결선(케이블) ─────────── */}
      {edge && (
        <div className="space-y-3 text-sm">
          <div className="rounded-md bg-white p-2 text-center text-xs text-gray-600 ring-1 ring-gray-200">
            {nodeLabel(edge.source)} <span className="text-gray-400">→</span>{" "}
            {nodeLabel(edge.target)}
          </div>
          <div>
            <span className={label}>표시 라벨 (화면용)</span>
            <input
              className={field}
              value={ed.displayLabel ?? ""}
              placeholder="예: 메인 좌측"
              onChange={(e) =>
                updateEdge(edge.id, { displayLabel: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <span className={label}>장비 라벨 (장비에 적힌 표기)</span>
            <input
              className={field}
              value={ed.deviceLabel ?? ""}
              placeholder="예: OUT L"
              onChange={(e) =>
                updateEdge(edge.id, { deviceLabel: e.target.value || undefined })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className={label}>시작 단자</span>
              <select
                className={field}
                value={ed.connectorFrom ?? ""}
                onChange={(e) =>
                  updateEdge(edge.id, {
                    connectorFrom: (e.target.value as ConnectorType) || undefined,
                  })
                }
              >
                {CONNECTOR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={label}>끝 단자</span>
              <select
                className={field}
                value={ed.connectorTo ?? ""}
                onChange={(e) =>
                  updateEdge(edge.id, {
                    connectorTo: (e.target.value as ConnectorType) || undefined,
                  })
                }
              >
                {CONNECTOR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className={label}>케이블 길이 (m)</span>
              <input
                type="number"
                min={0}
                step={0.5}
                className={field}
                value={ed.cableLength_m ?? ""}
                onChange={(e) =>
                  updateEdge(edge.id, {
                    cableLength_m:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <span className={label}>메모</span>
              <input
                className={field}
                value={ed.note ?? ""}
                onChange={(e) =>
                  updateEdge(edge.id, { note: e.target.value || undefined })
                }
              />
            </div>
          </div>
          <button type="button" onClick={() => removeEdge(edge.id)} className={deleteBtn}>
            연결 삭제
          </button>
        </div>
      )}

      {/* ─────────── 장소(구획) ─────────── */}
      {zone && (
        <div className="space-y-3 text-sm">
          <div>
            <span className={label}>장소 이름</span>
            <input
              className={field}
              value={zone.data.label}
              onChange={(e) => updateZone(zone.id, { label: e.target.value })}
            />
          </div>
          <div>
            <span className={label}>색상</span>
            <select
              className={field}
              value={zone.data.color}
              onChange={(e) => updateZone(zone.id, { color: e.target.value })}
            >
              {ZONE_COLOR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-gray-400">모서리를 끌어 크기를 조절할 수 있습니다.</p>
          <button type="button" onClick={() => removeNode(zone.id)} className={deleteBtn}>
            장소 삭제
          </button>
        </div>
      )}

      {/* ─────────── 장비 ─────────── */}
      {device && (
        <div className="space-y-4 text-sm">
          {/* 기본 정보 */}
          <div className="space-y-2">
            <div>
              <span className={label}>이름</span>
              <input
                className={`${field} font-medium`}
                value={device.data.label}
                onChange={(e) => updateDevice(device.id, { label: e.target.value })}
              />
            </div>

            {/* 아이콘 이미지 */}
            <div>
              <span className={label}>아이콘</span>
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white">
                  {device.data.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={device.data.image}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <CategoryIcon
                      category={device.data.category}
                      className={`h-7 w-7 ${
                        (CATEGORY_STYLE[device.data.category] ?? CATEGORY_STYLE.pc).icon
                      }`}
                    />
                  )}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <button type="button" onClick={() => fileRef.current?.click()} className={ghostBtn}>
                    이미지 등록
                  </button>
                  {device.data.image && (
                    <button
                      type="button"
                      onClick={() => updateDevice(device.id, { image: undefined })}
                      className="text-[11px] text-red-400 hover:text-red-600"
                    >
                      기본 아이콘으로
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                />
              </div>
            </div>

            <div className="text-[11px] text-gray-400">
              카테고리: {device.data.category}
            </div>
            {advanced && (
              <div>
                <span className={label}>모델 키 (선택)</span>
                <input
                  className={field}
                  value={device.data.model ?? ""}
                  placeholder="예: behringer-x32-compact"
                  onChange={(e) =>
                    updateDevice(device.id, { model: e.target.value || undefined })
                  }
                />
              </div>
            )}
          </div>

          {/* 포트 */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className={sectionTitle}>I/O 포트 ({device.data.ports.length})</span>
              <button
                type="button"
                onClick={() =>
                  addPort(device.id, {
                    id: nextPortId(),
                    name: "새 포트",
                    direction: "in",
                    signal: "analog_audio",
                  })
                }
                className={ghostBtn}
              >
                + 추가
              </button>
            </div>

            <ul className="space-y-2">
              {device.data.ports.map((p) => (
                <li key={p.id} className="rounded-lg border border-gray-200 bg-white p-2">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor(p.direction)}`} />
                    <input
                      className="min-w-0 flex-1 rounded-md border border-gray-200 px-1.5 py-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                      value={p.name}
                      onChange={(e) =>
                        updatePort(device.id, p.id, { name: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      title="포트 삭제"
                      onClick={() => removePort(device.id, p.id)}
                      className="shrink-0 rounded-md px-1.5 py-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      className={selectSm}
                      value={p.direction}
                      title="입력 / 출력 / 양방향"
                      onChange={(e) =>
                        updatePort(device.id, p.id, {
                          direction: e.target
                            .value as (typeof DIRECTION_OPTIONS)[number]["value"],
                        })
                      }
                    >
                      {DIRECTION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className={selectSm}
                      value={p.connector ?? ""}
                      title="단자 모양"
                      onChange={(e) =>
                        updatePort(device.id, p.id, {
                          connector: (e.target.value as ConnectorType) || undefined,
                        })
                      }
                    >
                      {CONNECTOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <SideToggle
                      value={effSide(p)}
                      onChange={(s) => updatePort(device.id, p.id, { side: s })}
                    />
                  </div>

                  {advanced && (
                    <select
                      className={`${selectSm} mt-1.5`}
                      value={p.signal}
                      title="신호 종류"
                      onChange={(e) =>
                        updatePort(device.id, p.id, {
                          signal: e.target
                            .value as (typeof SIGNAL_OPTIONS)[number]["value"],
                        })
                      }
                    >
                      {SIGNAL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <button type="button" onClick={() => removeNode(device.id)} className={deleteBtn}>
            장비 삭제
          </button>
        </div>
      )}
    </aside>
  );
}
