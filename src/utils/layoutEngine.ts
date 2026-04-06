import dagreLib from '@dagrejs/dagre';
import type { FamilyNode, FamilyEdge } from './treeBuilder';

type DagreGraph = InstanceType<typeof dagreLib.graphlib.Graph>;
type DagrePos   = { x: number; y: number };

// ─── Node dimensions ───────────────────────────────────────────────────────

const PERSON_WIDTH  = 160;
const PERSON_HEIGHT = 90;
const COUPLE_SIZE   = 12;
const NODESEP       = 60;   // horizontal gap between siblings and adjacent trees
const RANKSEP       = 100;  // vertical gap between generations

function nodeHalfWidth(nodeId: string): number {
  return nodeId.startsWith('c-') ? COUPLE_SIZE / 2 : PERSON_WIDTH / 2;
}

// ─── Subtree shift ─────────────────────────────────────────────────────────

/**
 * Recursively shifts a node and all its layout-descendants by (dx, dy).
 * Only follows non-visual, downward layout edges.
 */
function shiftSubtree(
  rootId:  string,
  dx:      number,
  dy:      number,
  g:       DagreGraph,
  edges:   FamilyEdge[],
  visited: Set<string>,
): void {
  if (visited.has(rootId)) return;
  visited.add(rootId);

  const pos = g.node(rootId) as DagrePos | undefined;
  if (pos) { pos.x += dx; pos.y += dy; }

  for (const edge of edges) {
    if (edge.data?.visualOnly) continue;
    if (edge.source === rootId) shiftSubtree(edge.target, dx, dy, g, edges, visited);
  }
}

// ─── Connected components ──────────────────────────────────────────────────

interface ComponentMap {
  /** Which component each node belongs to (by numeric ID). */
  nodeComponent: Map<string, number>;
  /** All nodes belonging to each component. */
  members:       Map<number, Set<string>>;
}

/**
 * Assigns every visible node to a connected component via bidirectional
 * flood-fill over layout edges (visual-only and hidden edges are ignored).
 */
function buildConnectedComponents(
  visibleNodeIds: Set<string>,
  edges:          FamilyEdge[],
): ComponentMap {
  const nodeComponent = new Map<string, number>();
  const members       = new Map<number, Set<string>>();
  let   nextCompId    = 0;

  const flood = (nodeId: string, compId: number): void => {
    if (nodeComponent.has(nodeId)) return;
    nodeComponent.set(nodeId, compId);
    members.get(compId)!.add(nodeId);

    for (const edge of edges) {
      if (edge.data?.visualOnly) continue;
      if (edge.hidden && !edge.data?.layoutInclude) continue;

      const neighbour =
        edge.source === nodeId && visibleNodeIds.has(edge.target) ? edge.target :
        edge.target === nodeId && visibleNodeIds.has(edge.source) ? edge.source :
        null;

      if (neighbour) flood(neighbour, compId);
    }
  };

  for (const nodeId of visibleNodeIds) {
    if (!nodeComponent.has(nodeId)) {
      const compId = nextCompId++;
      members.set(compId, new Set());
      flood(nodeId, compId);
    }
  }

  return { nodeComponent, members };
}

// ─── Bounding-box helper ───────────────────────────────────────────────────

interface HorizontalBounds { left: number; right: number; }

/** Returns the leftmost and rightmost pixel edges of a set of nodes. */
function getHorizontalBounds(memberIds: Set<string>, g: DagreGraph): HorizontalBounds {
  let left  =  Infinity;
  let right = -Infinity;

  for (const id of memberIds) {
    const pos = g.node(id) as DagrePos | undefined;
    if (!pos) continue;
    const hw = nodeHalfWidth(id);
    left  = Math.min(left,  pos.x - hw);
    right = Math.max(right, pos.x + hw);
  }

  return { left, right };
}

// ─── Pass 1: enforce sibling order ────────────────────────────────────────

/**
 * If a couple node declares an explicit child order via edge layoutOrder data,
 * swaps the X positions of children (and their subtrees) to match that order.
 */
function enforceChildOrder(g: DagreGraph, edges: FamilyEdge[]): void {
  // Collect edges that carry explicit sibling order, grouped by parent couple node
  const orderedChildrenByParent = new Map<string, { childId: string; order: number }[]>();

  for (const edge of edges) {
    if (typeof edge.data?.layoutOrder !== 'number') continue;
    if (edge.data?.visualOnly) continue;
    if (edge.hidden && !edge.data?.layoutInclude) continue;

    const list = orderedChildrenByParent.get(edge.source) ?? [];
    list.push({ childId: edge.target, order: edge.data.layoutOrder as number });
    orderedChildrenByParent.set(edge.source, list);
  }

  for (const children of orderedChildrenByParent.values()) {
    if (children.length < 2) continue;

    // Capture the X Dagre assigned to each child
    const childrenWithX = children.map(c => ({
      ...c,
      currentX: (g.node(c.childId) as DagrePos | undefined)?.x ?? 0,
    }));

    // Available X slots (left-to-right positions Dagre chose)
    const xSlots = [...childrenWithX]
      .sort((a, b) => a.currentX - b.currentX)
      .map(c => c.currentX);

    // Desired left-to-right sequence (ascending layoutOrder)
    const desiredSequence = [...childrenWithX].sort((a, b) => a.order - b.order);

    // Nothing to do if Dagre already placed them in the right order
    if (desiredSequence.every((child, i) => child.currentX === xSlots[i])) continue;

    // Map each child to its target slot and shift its subtree
    const targetXByChild = new Map(desiredSequence.map((child, i) => [child.childId, xSlots[i]]));

    for (const { childId, currentX } of childrenWithX) {
      const delta = targetXByChild.get(childId)! - currentX;
      if (delta !== 0) shiftSubtree(childId, delta, 0, g, edges, new Set());
    }
  }
}

// ─── Pass 2: snap childless-couple spouses side-by-side ───────────────────

/**
 * For every active couple without children, their couple node and spouse edges
 * were excluded from Dagre (they are visual-only). That means the two spouses
 * end up in separate connected components placed independently by Dagre.
 *
 * This pass shifts the visitor spouse's entire component so that:
 *   - The visitor sits directly to the right of the anchor, at the same Y.
 *   - The two families do not overlap (bounding-box based gap, not just node gap).
 *
 * Returns the computed centre position for each hidden couple node so the
 * materialisation step can render it in the right place.
 */
function snapChildlessSpousesTogether(
  nodes:          FamilyNode[],
  g:              DagreGraph,
  visibleNodeIds: Set<string>,
  components:     ComponentMap,
): Map<string, DagrePos> {
  const hiddenCouplePositions = new Map<string, DagrePos>();
  const { nodeComponent, members } = components;

  for (const node of nodes) {
    if (node.data.type   !== 'couple') continue;
    if (node.data.status !== 'active') continue;
    if (node.data.hasChildren)         continue; // Dagre already handles couples with children

    const anchorId  = `p-${node.data.partner1Uuid}`;
    const visitorId = `p-${node.data.partner2Uuid}`;

    if (!visibleNodeIds.has(anchorId) || !visibleNodeIds.has(visitorId)) continue;

    const anchorCompId  = nodeComponent.get(anchorId)!;
    const visitorCompId = nodeComponent.get(visitorId)!;

    // Already neighbours — nothing to do
    if (anchorCompId === visitorCompId) continue;

    const anchorPos  = g.node(anchorId)  as DagrePos | undefined;
    const visitorPos = g.node(visitorId) as DagrePos | undefined;
    if (!anchorPos || !visitorPos) continue;

    // Use bounding boxes so trees of different widths never overlap
    const anchorBounds  = getHorizontalBounds(members.get(anchorCompId)!,  g);
    const visitorBounds = getHorizontalBounds(members.get(visitorCompId)!, g);

    // Shift visitor component: left edge of visitor tree = right edge of anchor tree + gap
    const dx = (anchorBounds.right + NODESEP) - visitorBounds.left;
    // Align both spouses to the same generation row
    const dy = anchorPos.y - visitorPos.y;

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

    for (const memberId of members.get(visitorCompId)!) {
      const pos = g.node(memberId) as DagrePos | undefined;
      if (pos) { pos.x += dx; pos.y += dy; }
    }

    // Place the hidden couple node midway between the two (now-adjacent) spouses
    const updatedAnchorPos  = g.node(anchorId)  as DagrePos | undefined;
    const updatedVisitorPos = g.node(visitorId) as DagrePos | undefined;
    if (updatedAnchorPos && updatedVisitorPos) {
      hiddenCouplePositions.set(node.id, {
        x: (updatedAnchorPos.x + updatedVisitorPos.x) / 2,
        y:  updatedAnchorPos.y,
      });
    }
  }

  return hiddenCouplePositions;
}

// ─── Main export ───────────────────────────────────────────────────────────

/**
 * Runs Dagre on the family graph and returns nodes with updated positions.
 *
 * Post-layout passes applied after Dagre:
 *   1. Enforce the left-to-right sibling order declared in `childOrder`.
 *   2. Snap childless-couple spouses side-by-side (they were in separate Dagre components).
 */
export function applyDagreLayout(nodes: FamilyNode[], edges: FamilyEdge[]): FamilyNode[] {
  // ── 1. Build the Dagre graph ───────────────────────────────────────────
  const g = new dagreLib.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: NODESEP, ranksep: RANKSEP, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));

  const visibleNodeIds = new Set<string>();
  for (const node of nodes) {
    if (node.hidden && !node.data.layoutInclude) continue;
    visibleNodeIds.add(node.id);
    const isCouple = node.data.type === 'couple';
    g.setNode(node.id, {
      width:  isCouple ? COUPLE_SIZE   : PERSON_WIDTH,
      height: isCouple ? COUPLE_SIZE   : PERSON_HEIGHT,
    });
  }

  // Sort edges so layoutOrder hints reach Dagre first (helps crossing-minimisation)
  const layoutEdges = [...edges].sort((a, b) => {
    const ao = typeof a.data?.layoutOrder === 'number' ? a.data.layoutOrder : Infinity;
    const bo = typeof b.data?.layoutOrder === 'number' ? b.data.layoutOrder : Infinity;
    return ao - bo;
  });

  for (const edge of layoutEdges) {
    if (edge.data?.visualOnly) continue;
    if (edge.hidden && !edge.data?.layoutInclude) continue;
    if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagreLib.layout(g);

  // ── 2. Post-layout corrections ────────────────────────────────────────
  enforceChildOrder(g, edges);

  const components            = buildConnectedComponents(visibleNodeIds, edges);
  const hiddenCouplePositions = snapChildlessSpousesTogether(nodes, g, visibleNodeIds, components);

  // ── 3. Materialise final node positions ───────────────────────────────
  return nodes.map(node => {
    // Hidden couple nodes are positioned by the snap pass, not by Dagre
    if (node.hidden && node.data.type === 'couple') {
      const snappedPos = hiddenCouplePositions.get(node.id);
      if (!snappedPos) return node;
      return {
        ...node,
        position: {
          x: snappedPos.x - COUPLE_SIZE / 2,
          y: snappedPos.y - COUPLE_SIZE / 2,
        },
      };
    }

    if (node.hidden || !visibleNodeIds.has(node.id)) return node;

    const pos = g.node(node.id) as DagrePos | undefined;
    if (!pos) return node;

    const isCouple = node.data.type === 'couple';
    const width    = isCouple ? COUPLE_SIZE   : PERSON_WIDTH;
    const height   = isCouple ? COUPLE_SIZE   : PERSON_HEIGHT;

    return {
      ...node,
      position: { x: pos.x - width / 2, y: pos.y - height / 2 },
    };
  });
}
