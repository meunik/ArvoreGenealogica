import dagreLib from '@dagrejs/dagre';
import type { FamilyNode, FamilyEdge } from './treeBuilder';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DagreGraph = InstanceType<typeof dagreLib.graphlib.Graph>;

const PERSON_NODE_WIDTH = 160;
const PERSON_NODE_HEIGHT = 90;
const COUPLE_NODE_SIZE = 12;
const NODESEP = 60;

/** Shifts a subtree (following layout edges downward only) by (dx, dy). */
function shiftSubtree(
  nodeId: string,
  dx: number,
  dy: number,
  g: DagreGraph,
  edges: FamilyEdge[],
  visited: Set<string>,
): void {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pos = g.node(nodeId) as any;
  if (pos) { pos.x += dx; pos.y += dy; }
  for (const edge of edges) {
    if (edge.data?.visualOnly) continue;
    if (edge.source === nodeId) shiftSubtree(edge.target, dx, dy, g, edges, visited);
  }
}

/**
 * Runs dagre layout then applies post-layout passes:
 * 1. Enforce sibling left-to-right order declared via layoutOrder edge data.
 * 2. Snap childless-couple spouses side-by-side (their couple node is NOT in Dagre).
 */
export function applyDagreLayout(
  nodes: FamilyNode[],
  edges: FamilyEdge[],
): FamilyNode[] {
  const g = new dagreLib.graphlib.Graph();

  g.setGraph({
    rankdir: 'TB',
    nodesep: NODESEP,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });

  g.setDefaultEdgeLabel(() => ({}));

  const visibleNodeIds = new Set<string>();
  for (const node of nodes) {
    if (node.hidden && !node.data.layoutInclude) continue;
    visibleNodeIds.add(node.id);
    const isCouple = node.data.type === 'couple';
    g.setNode(node.id, {
      width: isCouple ? COUPLE_NODE_SIZE : PERSON_NODE_WIDTH,
      height: isCouple ? COUPLE_NODE_SIZE : PERSON_NODE_HEIGHT,
    });
  }

  const sortedEdges = [...edges].sort((a, b) => {
    const aOrder = typeof a.data?.layoutOrder === 'number' ? a.data.layoutOrder : Infinity;
    const bOrder = typeof b.data?.layoutOrder === 'number' ? b.data.layoutOrder : Infinity;
    return aOrder - bOrder;
  });

  for (const edge of sortedEdges) {
    if (edge.data?.visualOnly) continue;
    if (edge.hidden && !edge.data?.layoutInclude) continue;
    if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagreLib.layout(g);

  // Pass 1: enforce childOrder sibling ordering
  const coupleChildOrders = new Map<string, { childId: string; order: number }[]>();
  for (const edge of edges) {
    if (
      typeof edge.data?.layoutOrder === 'number' &&
      !edge.data?.visualOnly &&
      (!edge.hidden || edge.data?.layoutInclude)
    ) {
      const list = coupleChildOrders.get(edge.source) ?? [];
      list.push({ childId: edge.target, order: edge.data.layoutOrder as number });
      coupleChildOrders.set(edge.source, list);
    }
  }

  for (const [, children] of coupleChildOrders) {
    if (children.length < 2) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withX = children.map(c => ({ ...c, currentX: (g.node(c.childId) as any)?.x ?? 0 }));
    const slots = [...withX].sort((a, b) => a.currentX - b.currentX).map(c => c.currentX);
    const desired = [...withX].sort((a, b) => a.order - b.order);
    if (desired.every((d, i) => d.currentX === slots[i])) continue;
    const targetX = new Map<string, number>();
    desired.forEach((d, i) => targetX.set(d.childId, slots[i]));
    for (const { childId, currentX } of withX) {
      const delta = targetX.get(childId)! - currentX;
      if (delta !== 0) shiftSubtree(childId, delta, 0, g, edges, new Set());
    }
  }

  // Pass 2: snap childless-couple spouses side-by-side
  // Flood-fill to find connected components in the Dagre graph
  const componentId = new Map<string, number>();
  let nextCompId = 0;

  const floodFill = (nodeId: string, id: number): void => {
    if (componentId.has(nodeId)) return;
    componentId.set(nodeId, id);
    for (const edge of edges) {
      if (edge.data?.visualOnly) continue;
      if (edge.hidden && !edge.data?.layoutInclude) continue;
      if (edge.source === nodeId && visibleNodeIds.has(edge.target)) floodFill(edge.target, id);
      if (edge.target === nodeId && visibleNodeIds.has(edge.source)) floodFill(edge.source, id);
    }
  };

  for (const id of visibleNodeIds) {
    if (!componentId.has(id)) floodFill(id, nextCompId++);
  }

  const componentMembers = new Map<number, Set<string>>();
  for (const [nodeId, cid] of componentId) {
    if (!componentMembers.has(cid)) componentMembers.set(cid, new Set());
    componentMembers.get(cid)!.add(nodeId);
  }

  const hiddenCouplePositions = new Map<string, { x: number; y: number }>();

  for (const node of nodes) {
    if (node.data.type !== 'couple') continue;
    if (node.data.status !== 'active') continue;
    if (node.data.hasChildren) continue;

    const p1Id = `p-${node.data.partner1Uuid}`;
    const p2Id = `p-${node.data.partner2Uuid}`;

    if (!visibleNodeIds.has(p1Id) || !visibleNodeIds.has(p2Id)) continue;

    const c1 = componentId.get(p1Id);
    const c2 = componentId.get(p2Id);
    if (c1 === c2) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pos1 = g.node(p1Id) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pos2 = g.node(p2Id) as any;
    if (!pos1 || !pos2) continue;

    // Node half-widths for proper bounding-box calculation
    const nodeHalfW = (id: string) =>
      id.startsWith('c-') ? COUPLE_NODE_SIZE / 2 : PERSON_NODE_WIDTH / 2;

    // Rightmost edge of component 1 (anchor side)
    let rightmostC1 = -Infinity;
    for (const memberId of componentMembers.get(c1!)!) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mpos = g.node(memberId) as any;
      if (mpos) rightmostC1 = Math.max(rightmostC1, mpos.x + nodeHalfW(memberId));
    }

    // Leftmost edge of component 2 (visitor side, before shifting)
    let leftmostC2 = Infinity;
    for (const memberId of componentMembers.get(c2!)!) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mpos = g.node(memberId) as any;
      if (mpos) leftmostC2 = Math.min(leftmostC2, mpos.x - nodeHalfW(memberId));
    }

    // dx: shift c2 so its left edge is NODESEP away from c1's right edge
    const dx = (rightmostC1 + NODESEP) - leftmostC2;
    // dy: align the two spouses to the same Y
    const dy = pos1.y - pos2.y;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

    for (const memberId of componentMembers.get(c2!)!) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pos = g.node(memberId) as any;
      if (pos) { pos.x += dx; pos.y += dy; }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const np1 = g.node(p1Id) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const np2 = g.node(p2Id) as any;
    if (np1 && np2) {
      hiddenCouplePositions.set(node.id, {
        x: (np1.x + np2.x) / 2,
        y: np1.y,
      });
    }
  }

  // Materialise positions
  return nodes.map(node => {
    if (node.hidden && node.data.type === 'couple') {
      const hpos = hiddenCouplePositions.get(node.id);
      if (hpos) {
        return {
          ...node,
          position: {
            x: hpos.x - COUPLE_NODE_SIZE / 2,
            y: hpos.y - COUPLE_NODE_SIZE / 2,
          },
        };
      }
      return node;
    }

    if (node.hidden || !visibleNodeIds.has(node.id)) return node;
    const pos = g.node(node.id);
    if (!pos) return node;
    const isCouple = node.data.type === 'couple';
    const w = isCouple ? COUPLE_NODE_SIZE : PERSON_NODE_WIDTH;
    const h = isCouple ? COUPLE_NODE_SIZE : PERSON_NODE_HEIGHT;
    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    };
  });
}
