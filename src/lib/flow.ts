import type { Edge } from "@xyflow/react";

// 신호 흐름: 시작 장비에서 결선을 따라 도달 가능한 노드/엣지(연결 컴포넌트)를 구한다.
// 방향은 ConnectionMode.Loose + 자유 결선이라 무방향 그래프로 BFS — 그 장비가
// 물리적으로 연결된 전체 신호 체인을 보여준다.
export function computeFlow(
  startId: string,
  edges: Edge[],
): { nodeIds: Set<string>; edgeIds: Set<string> } {
  const nodeIds = new Set<string>([startId]);
  const edgeIds = new Set<string>();

  const adj = new Map<string, Edge[]>();
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push(e);
    adj.get(e.target)!.push(e);
  }

  const queue: string[] = [startId];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const e of adj.get(cur) ?? []) {
      edgeIds.add(e.id);
      const next = e.source === cur ? e.target : e.source;
      if (!nodeIds.has(next)) {
        nodeIds.add(next);
        queue.push(next);
      }
    }
  }
  return { nodeIds, edgeIds };
}
