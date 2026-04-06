import dagreLib from '@dagrejs/dagre';
import type { FamilyNode, FamilyEdge } from './treeBuilder';

// @dagrejs/dagre exports the graphlib Graph via the default export
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DagreGraph = InstanceType<typeof dagreLib.graphlib.Graph>;

const PERSON_NODE_WIDTH = 160;
const PERSON_NODE_HEIGHT = 90;
const COUPLE_NODE_SIZE = 12;

/**
 * Shifts a node and all its layout-descendants by deltaX.
 */
function shiftSubtreeX(
  nodeId: string,
  deltaX: number,
  g: DagreGraph,
  edges: FamilyEdge[],
  visited: Set<string>,
): void {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pos = g.node(nodeId) as any;
  if (pos) pos.x += deltaX;
  for (const edge of edges) {
    if (edge.data?.visualOnly) continue;
    if (edge.source === nodeId) {
      shiftSubtreeX(edge.target, deltaX, g, edges, visited);
    }
  }
}

/**
 * Runs dagre layout on the given nodes and edges and returns new nodes with
 * updated x/y positions. Nodes with `hidden: true` are excluded from layout.
 * After layout, enforces sibling order declared via edge `layoutOrder` data.
 */
export function applyDagreLayout(
  nodes: FamilyNode[],
  edges: FamilyEdge[],
): FamilyNode[] {
  const g = new dagreLib.graphlib.Graph();

  g.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });

  g.setDefaultEdgeLabel(() => ({}));

  const visibleNodeIds = new Set<string>();
  for (const node of nodes) {
    // Hidden nodes are excluded UNLESS they have layoutInclude: true (e.g., childless couple technical nodes)
    if (node.hidden && !node.data.layoutInclude) continue;
    visibleNodeIds.add(node.id);

    const isCouple = node.data.type === 'couple';
    g.setNode(node.id, {
      width: isCouple ? COUPLE_NODE_SIZE : PERSON_NODE_WIDTH,
      height: isCouple ? COUPLE_NODE_SIZE : PERSON_NODE_HEIGHT,
    });
  }

  // Sort edges: layoutOrder edges first (hint to Dagre), rest after
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

  // ── Post-layout: enforce childOrder by swapping sibling X positions ──────
  // Dagre's crossing-minimisation may ignore edge insertion order, so we fix
  // the result here by detecting wrong sibling ordering and swapping subtrees.
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

    // Current Dagre X per child
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withX = children.map(c => ({ ...c, currentX: (g.node(c.childId) as any)?.x ?? 0 }));

    // Position slots: X values sorted left-to-right
    const slots = [...withX].sort((a, b) => a.currentX - b.currentX).map(c => c.currentX);

    // Desired sequence sorted by layoutOrder
    const desired = [...withX].sort((a, b) => a.order - b.order);

    // Skip if already in the right order
    if (desired.every((d, i) => d.currentX === slots[i])) continue;

    // Map each child to the X slot it should occupy
    const targetX = new Map<string, number>();
    desired.forEach((d, i) => targetX.set(d.childId, slots[i]));

    for (const { childId, currentX } of withX) {
      const delta = targetX.get(childId)! - currentX;
      if (delta !== 0) shiftSubtreeX(childId, delta, g, edges, new Set());
    }
  }

  return nodes.map(node => {
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
