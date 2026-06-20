"use client";

import { useState } from "react";
import { nextPortId, useWayMapStore } from "@/store/waymapStore";
import {
  CONNECTOR_OPTIONS,
  DIRECTION_OPTIONS,
  SIGNAL_OPTIONS,
} from "@/lib/portOptions";
import type { ConnectorType } from "@/lib/types";

const field =
  "w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-800 focus:border-blue-400 focus:outline-none";
const label = "text-[11px] text-gray-400";

export default function PropertiesPanel() {
  const node = useWayMapStore(
    (s) => s.nodes.find((n) => n.id === s.selectedId) ?? null,
  );
  const updateDevice = useWayMapStore((s) => s.updateDevice);
  const removeDevice = useWayMapStore((s) => s.removeDevice);
  const addPort = useWayMapStore((s) => s.addPort);
  const updatePort = useWayMapStore((s) => s.updatePort);
  const removePort = useWayMapStore((s) => s.removePort);

  const [advanced, setAdvanced] = useState(false);

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          속성
        </h2>
        {node && (
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

      {!node ? (
        <p className="text-sm text-gray-400">장비를 선택하면 정보가 표시됩니다.</p>
      ) : (
        <div className="space-y-4 text-sm">
          {/* 장비 기본 정보 */}
          <div className="space-y-2">
            <div>
              <div className={label}>이름</div>
              <input
                className={field}
                value={node.data.label}
                onChange={(e) => updateDevice(node.id, { label: e.target.value })}
              />
            </div>
            {advanced && (
              <div>
                <div className={label}>모델 (선택)</div>
                <input
                  className={field}
                  value={node.data.model ?? ""}
                  placeholder="예: behringer-x32-compact"
                  onChange={(e) =>
                    updateDevice(node.id, { model: e.target.value || undefined })
                  }
                />
              </div>
            )}
            <div className={label}>카테고리: {node.data.category}</div>
          </div>

          {/* 포트 목록 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className={label}>I/O 포트 ({node.data.ports.length})</span>
              <button
                type="button"
                onClick={() =>
                  addPort(node.id, {
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
              {node.data.ports.map((p) => (
                <li
                  key={p.id}
                  className="space-y-1.5 rounded border border-gray-200 bg-white p-2"
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      className={`${field} flex-1`}
                      value={p.name}
                      onChange={(e) =>
                        updatePort(node.id, p.id, { name: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      title="포트 삭제"
                      onClick={() => removePort(node.id, p.id)}
                      className="rounded border border-gray-200 px-1.5 py-1 text-gray-400 hover:border-red-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>

                  <select
                    className={field}
                    value={p.direction}
                    onChange={(e) =>
                      updatePort(node.id, p.id, {
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
                          updatePort(node.id, p.id, {
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
                          updatePort(node.id, p.id, {
                            connector:
                              (e.target.value as ConnectorType) || undefined,
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

          {/* 장비 삭제 */}
          <button
            type="button"
            onClick={() => removeDevice(node.id)}
            className="w-full rounded border border-red-200 bg-white px-2 py-1.5 text-sm text-red-500 hover:border-red-400 hover:bg-red-50"
          >
            장비 삭제
          </button>
        </div>
      )}
    </aside>
  );
}
