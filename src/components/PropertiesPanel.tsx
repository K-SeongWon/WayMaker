"use client";

import { useState } from "react";
import { nextPortId, useWayMapStore } from "@/store/waymapStore";
import {
  CONNECTOR_OPTIONS,
  DIRECTION_OPTIONS,
  SIGNAL_OPTIONS,
} from "@/lib/portOptions";
import { ZONE_COLOR_OPTIONS } from "@/lib/zones";
import type { ConnectorType, EdgeDetail } from "@/lib/types";

const field =
  "w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-800 focus:border-blue-400 focus:outline-none";
const label = "text-[11px] text-gray-400";
const deleteBtn =
  "w-full rounded border border-red-200 bg-white px-2 py-1.5 text-sm text-red-500 hover:border-red-400 hover:bg-red-50";

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

  const device = node && node.type === "device" ? node : null;
  const zone = node && node.type === "zone" ? node : null;

  const ed = (edge?.data ?? {}) as EdgeDetail;
  const nodeLabel = (id?: string) => {
    const n = nodes.find((x) => x.id === id);
    return (n?.data as { label?: string } | undefined)?.label ?? id ?? "?";
  };

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          속성
        </h2>
        {device && (
          <label className="flex items-center gap-1 text-[11px] text-gray-500">
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

      {/* 연결선(케이블) 편집 */}
      {edge && (
        <div className="space-y-3 text-sm">
          <div>
            <div className={label}>연결</div>
            <div className="text-gray-700">
              {nodeLabel(edge.source)} → {nodeLabel(edge.target)}
            </div>
          </div>
          <div>
            <div className={label}>표시 라벨 (화면용)</div>
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
            <div className={label}>장비 라벨 (장비에 적힌 표기)</div>
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
              <div className={label}>시작 단자 ({nodeLabel(edge.source)})</div>
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
              <div className={label}>끝 단자 ({nodeLabel(edge.target)})</div>
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
          <div>
            <div className={label}>케이블 길이 (m)</div>
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
            <div className={label}>메모</div>
            <input
              className={field}
              value={ed.note ?? ""}
              onChange={(e) =>
                updateEdge(edge.id, { note: e.target.value || undefined })
              }
            />
          </div>
          <button type="button" onClick={() => removeEdge(edge.id)} className={deleteBtn}>
            연결 삭제
          </button>
        </div>
      )}

      {/* 장소(구획) 편집 */}
      {zone && (
        <div className="space-y-4 text-sm">
          <div>
            <div className={label}>장소 이름</div>
            <input
              className={field}
              value={zone.data.label}
              onChange={(e) => updateZone(zone.id, { label: e.target.value })}
            />
          </div>
          <div>
            <div className={label}>색상</div>
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
          <p className="text-[11px] text-gray-400">
            모서리를 끌어 크기를 조절할 수 있습니다.
          </p>
          <button type="button" onClick={() => removeNode(zone.id)} className={deleteBtn}>
            장소 삭제
          </button>
        </div>
      )}

      {/* 장비 편집 */}
      {device && (
        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <div>
              <div className={label}>이름</div>
              <input
                className={field}
                value={device.data.label}
                onChange={(e) => updateDevice(device.id, { label: e.target.value })}
              />
            </div>
            {advanced && (
              <div>
                <div className={label}>모델 (선택)</div>
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
            <div className={label}>카테고리: {device.data.category}</div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className={label}>I/O 포트 ({device.data.ports.length})</span>
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
                className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[11px] text-gray-600 hover:border-blue-400 hover:bg-blue-50"
              >
                + 포트 추가
              </button>
            </div>

            <ul className="space-y-2">
              {device.data.ports.map((p) => (
                <li
                  key={p.id}
                  className="space-y-1.5 rounded border border-gray-200 bg-white p-2"
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      className={`${field} flex-1`}
                      value={p.name}
                      onChange={(e) =>
                        updatePort(device.id, p.id, { name: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      title="포트 삭제"
                      onClick={() => removePort(device.id, p.id)}
                      className="rounded border border-gray-200 px-1.5 py-1 text-gray-400 hover:border-red-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>

                  <select
                    className={field}
                    value={p.direction}
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

                  {advanced && (
                    <>
                      <select
                        className={field}
                        value={p.signal}
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

                      <select
                        className={field}
                        value={p.connector ?? ""}
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
                    </>
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
