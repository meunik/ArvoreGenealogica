import dagre from '@dagrejs/dagre';
import type { FamilyNode, FamilyEdge } from './treeBuilder';

const PERSON_NODE_WIDTH = 160;
const PERSON_NODE_HEIGHT = 90;
const COUPLE_NODE_SIZE = 12;

/**
 * Runs dagre layout on the given nodes and edges and returns new nodes with
 * updated x/y positions. Nodes with `hidden: true` are excluded from layout.
 */
export function applyDagreLayout(
  nodes: FamilyNode[],
  edges: FamilyEdge[],
): FamilyNode[] {
  const g = new dagre.graphlib.Graph();

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

  for (const edge of edges) {
    // Skip visual-only edges (they are rendered but must not affect Dagre layout)
    if (edge.data?.visualOnly) continue;
    // Skip hidden edges UNLESS they have layoutInclude: true (technical layout edges)
    if (edge.hidden && !edge.data?.layoutInclude) continue;
    if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

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
