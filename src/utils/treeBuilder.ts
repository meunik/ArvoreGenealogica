import type { Node, Edge } from '@xyflow/react';
import type {
  FamilyData,
  CoupleNodeData,
  PersonNodeData,
  FamilyNodeData,
} from '../types';

export type FamilyNode = Node<FamilyNodeData>;
export type FamilyEdge = Edge;

/**
 * Converts flat FamilyData (persons + relationships) into React Flow nodes and edges.
 *
 * Rules:
 * 1. Each person becomes a PersonNode.
 * 2. Each conjugal relationship that is 'active' (married/cohabiting) OR is 'divorced'/'widowed'
 *    WITH shared children produces a CoupleNode as a junction point.
 * 3. Divorced/widowed couples WITHOUT shared children are fully omitted from the graph.
 * 4. Edges from spouses → CoupleNode are only rendered for active relationships.
 * 5. Edges from CoupleNode → children are always rendered when the CoupleNode exists.
 * 6. When both parents exist but no CoupleNode exists (degenerate), the edge goes parent → child directly.
 */
export function buildFamilyGraph(data: FamilyData): { nodes: FamilyNode[]; edges: FamilyEdge[] } {
  const nodes: FamilyNode[] = [];
  const edges: FamilyEdge[] = [];

  // ── 1. Index children per conjugal relationship ────────────────────────
  const childrenByConjugal = new Map<string, Set<string>>();
  for (const pr of data.parentalRelationships) {
    if (!pr.conjugalRelationshipUuid) continue;
    if (!childrenByConjugal.has(pr.conjugalRelationshipUuid)) {
      childrenByConjugal.set(pr.conjugalRelationshipUuid, new Set());
    }
    childrenByConjugal.get(pr.conjugalRelationshipUuid)!.add(pr.childUuid);
  }

  // ── 2. Determine which conjugal relationships produce a CoupleNode ─────
  const activeCoupleUuids = new Set<string>(); // will render spouse edges
  const coupleNodeUuids = new Set<string>();    // will have a CoupleNode in graph
  const childlessCoupleUuids = new Set<string>(); // active + no children → hidden layout node + direct visual edge
  const separatedCoupleUuids = new Set<string>(); // divorced/widowed + children → show separated edges to couple node

  for (const cr of data.conjugalRelationships) {
    const isActive = cr.status === 'married' || cr.status === 'cohabiting';
    const hasChildren = (childrenByConjugal.get(cr.uuid)?.size ?? 0) > 0;

    if (isActive) {
      activeCoupleUuids.add(cr.uuid);
      coupleNodeUuids.add(cr.uuid);
      if (!hasChildren) {
        // Active but childless → hidden technical node for layout + direct visual edge
        childlessCoupleUuids.add(cr.uuid);
      }
    } else if (hasChildren) {
      // divorced/widowed but with children → CoupleNode with separated spouse edges
      coupleNodeUuids.add(cr.uuid);
      separatedCoupleUuids.add(cr.uuid);
    }
    // else: divorced without children → skip entirely
  }

  // ── 3. Build person nodes ──────────────────────────────────────────────
  // Count children per person to determine hasChildren flag
  const childCountByPerson = new Map<string, number>();
  for (const pr of data.parentalRelationships) {
    childCountByPerson.set(pr.parentUuid, (childCountByPerson.get(pr.parentUuid) ?? 0) + 1);
  }

  for (const person of data.persons) {
    const nodeData: PersonNodeData = {
      type: 'person',
      person,
      isCollapsed: false,
      hasChildren: (childCountByPerson.get(person.uuid) ?? 0) > 0,
    };
    nodes.push({
      id: `p-${person.uuid}`,
      type: 'personNode',
      position: { x: 0, y: 0 }, // overwritten by layout engine
      data: nodeData,
    });
  }

  // ── 4. Build couple nodes + spouse edges ──────────────────────────────
  for (const cr of data.conjugalRelationships) {
    if (!coupleNodeUuids.has(cr.uuid)) continue;

    const isActive = activeCoupleUuids.has(cr.uuid);
    const isChildless = childlessCoupleUuids.has(cr.uuid);
    const isSeparated = separatedCoupleUuids.has(cr.uuid);
    const hasChildrenForCouple = !isChildless;

    const coupleNodeData: CoupleNodeData = {
      type: 'couple',
      status: isActive ? 'active' : cr.status === 'widowed' ? 'widowed' : 'divorced',
      partner1Uuid: cr.partner1Uuid,
      partner2Uuid: cr.partner2Uuid,
      conjugalRelationshipUuid: cr.uuid,
      hasChildren: hasChildrenForCouple,
    };

    nodes.push({
      id: `c-${cr.uuid}`,
      type: 'coupleNode',
      position: { x: 0, y: 0 },
      // Childless active couples: hidden technical node (keeps Dagre layout correct)
      hidden: isChildless,
      data: { ...coupleNodeData, layoutInclude: isChildless },
    });

    const edgeType = cr.relationshipType === 'cohabitation' ? 'cohabitationEdge' : 'marriageEdge';

    if (isActive && !isChildless) {
      // Normal active couple with children: marriage edges visible
      edges.push({ id: `e-p1-${cr.uuid}`, source: `p-${cr.partner1Uuid}`, target: `c-${cr.uuid}`, type: edgeType, data: { relationship: cr } });
      edges.push({ id: `e-p2-${cr.uuid}`, source: `p-${cr.partner2Uuid}`, target: `c-${cr.uuid}`, type: edgeType, data: { relationship: cr } });
    } else if (isActive && isChildless) {
      // Childless couple: hidden technical edges (for Dagre layout) + one direct visual edge
      edges.push({ id: `e-p1-${cr.uuid}`, source: `p-${cr.partner1Uuid}`, target: `c-${cr.uuid}`, type: edgeType, hidden: true, data: { relationship: cr, layoutInclude: true } });
      edges.push({ id: `e-p2-${cr.uuid}`, source: `p-${cr.partner2Uuid}`, target: `c-${cr.uuid}`, type: edgeType, hidden: true, data: { relationship: cr, layoutInclude: true } });
      // One direct visual-only edge between the two persons
      edges.push({ id: `e-direct-${cr.uuid}`, source: `p-${cr.partner1Uuid}`, target: `p-${cr.partner2Uuid}`, type: edgeType, sourceHandle: 'couple-out', targetHandle: 'couple-in', data: { relationship: cr, visualOnly: true } });
    } else if (isSeparated) {
      // Divorced/widowed with children: separated (dashed gray) edges from both partners to couple node
      edges.push({ id: `e-p1-${cr.uuid}`, source: `p-${cr.partner1Uuid}`, target: `c-${cr.uuid}`, type: 'separatedEdge', data: { relationship: cr } });
      edges.push({ id: `e-p2-${cr.uuid}`, source: `p-${cr.partner2Uuid}`, target: `c-${cr.uuid}`, type: 'separatedEdge', data: { relationship: cr } });
    }
  }

  // ── 5. Build parent→child edges ────────────────────────────────────────
  // Group parental relationships by (conjugalRelationshipUuid + childUuid)
  // We only need one edge per CoupleNode→Child pair
  const addedCoupleChildEdges = new Set<string>();

  for (const pr of data.parentalRelationships) {
    if (pr.conjugalRelationshipUuid && coupleNodeUuids.has(pr.conjugalRelationshipUuid)) {
      const key = `${pr.conjugalRelationshipUuid}-${pr.childUuid}`;
      if (addedCoupleChildEdges.has(key)) continue;
      addedCoupleChildEdges.add(key);

      // Determine if child is adoptive from ALL parental records for this conjugal+child
      const relForThisCouple = data.parentalRelationships.filter(
        r => r.conjugalRelationshipUuid === pr.conjugalRelationshipUuid && r.childUuid === pr.childUuid
      );
      const isAdoptive = relForThisCouple.every(r => r.type === 'adoptive' || r.type === 'foster' || r.type === 'stepparent');

      edges.push({
        id: `e-c-${pr.conjugalRelationshipUuid}-${pr.childUuid}`,
        source: `c-${pr.conjugalRelationshipUuid}`,
        target: `p-${pr.childUuid}`,
        type: isAdoptive ? 'adoptiveParentalEdge' : 'bloodParentalEdge',
        data: { type: pr.type },
      });
    } else {
      // No couple node — direct parent → child edge
      edges.push({
        id: `e-direct-${pr.uuid}`,
        source: `p-${pr.parentUuid}`,
        target: `p-${pr.childUuid}`,
        type: pr.type === 'adoptive' || pr.type === 'foster' ? 'adoptiveParentalEdge' : 'bloodParentalEdge',
        data: { type: pr.type },
      });
    }
  }

  return { nodes, edges };
}
