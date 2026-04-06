import { useMemo } from 'react';
import { useFamilyData } from '../context/FamilyContext';
import { buildFamilyGraph } from '../utils/treeBuilder';
import { applyDagreLayout } from '../utils/layoutEngine';
import type { FamilyNode, FamilyEdge } from '../utils/treeBuilder';

export function useTreeBuilder(collapsedNodeIds: Set<string>): {
  nodes: FamilyNode[];
  edges: FamilyEdge[];
} {
  const { persons, conjugalRelationships, parentalRelationships } = useFamilyData();

  const { nodes: baseNodes, edges: baseEdges } = useMemo(() => {
    return buildFamilyGraph({ persons, conjugalRelationships, parentalRelationships });
  }, [persons, conjugalRelationships, parentalRelationships]);

  const { nodes, edges } = useMemo(() => {
    if (collapsedNodeIds.size === 0) {
      const laid = applyDagreLayout(baseNodes, baseEdges);
      return { nodes: laid, edges: baseEdges };
    }

    // Find all node IDs that are descendants of collapsed nodes
    const hiddenNodeIds = new Set<string>();

    const childrenMap = new Map<string, string[]>();
    for (const edge of baseEdges) {
      // Visual-only edges (e.g. direct marriage edge for childless couples) must not
      // influence which nodes are hidden when collapsing a branch.
      if (edge.data?.visualOnly) continue;
      if (!childrenMap.has(edge.source)) childrenMap.set(edge.source, []);
      childrenMap.get(edge.source)!.push(edge.target);
    }

    function markHidden(nodeId: string) {
      const children = childrenMap.get(nodeId) ?? [];
      for (const child of children) {
        if (!hiddenNodeIds.has(child)) {
          hiddenNodeIds.add(child);
          markHidden(child);
        }
      }
    }

    for (const collapsedId of collapsedNodeIds) {
      // collapsedId is a conjugal relationship UUID (e.g. 'c-001').
      // The couple node ID in the graph is 'c-' + conjugalUuid = 'c-c-001'.
      markHidden(`c-${collapsedId}`);
    }

    const visibleNodes = baseNodes.map((n: FamilyNode) => ({
      ...n,
      hidden: hiddenNodeIds.has(n.id),
    }));

    const visibleEdges = baseEdges.map((e: FamilyEdge) => ({
      ...e,
      hidden: hiddenNodeIds.has(e.source) || hiddenNodeIds.has(e.target),
    }));

    const laid = applyDagreLayout(visibleNodes, visibleEdges);
    return { nodes: laid, edges: visibleEdges };
  }, [baseNodes, baseEdges, collapsedNodeIds]);

  return { nodes, edges };
}
