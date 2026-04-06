import type { Node, Edge } from '@xyflow/react';
import type {
  FamilyData,
  ConjugalRelationship,
  ParentalRelationship,
  Person,
  CoupleNodeData,
  PersonNodeData,
  FamilyNodeData,
} from '../types';

export type FamilyNode = Node<FamilyNodeData>;
export type FamilyEdge = Edge;

// ─── Helpers: index & classify relationships ───────────────────────────────

/** Maps each conjugal UUID to the set of children it produced. */
function indexChildrenByConjugal(
  parentalRelationships: ParentalRelationship[],
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const pr of parentalRelationships) {
    if (!pr.conjugalRelationshipUuid) continue;
    if (!map.has(pr.conjugalRelationshipUuid)) map.set(pr.conjugalRelationshipUuid, new Set());
    map.get(pr.conjugalRelationshipUuid)!.add(pr.childUuid);
  }
  return map;
}

function isActiveConjugal(cr: ConjugalRelationship): boolean {
  return cr.status === 'married' || cr.status === 'cohabiting';
}

interface ConjugalClassification {
  /** Relationships whose couple node + spouse edges are rendered. */
  activeUuids:    Set<string>;
  /** All relationships that produce a CoupleNode in the graph. */
  nodeUuids:      Set<string>;
  /** Active but childless — couple node is hidden, spouses snapped in post-layout. */
  childlessUuids: Set<string>;
  /** Divorced/widowed with shared children — couple node shown with dashed edges. */
  separatedUuids: Set<string>;
}

/**
 * Determines which conjugal relationships produce a CoupleNode and what kind:
 *   active + children   → visible couple node + marriage edges
 *   active + no children → hidden couple node (visual-only, layout engine snaps)
 *   divorced/widowed + children → couple node with dashed separated edges
 *   divorced/widowed + no children → omitted entirely
 */
function classifyConjugalRelationships(
  conjugalRelationships: ConjugalRelationship[],
  childrenByConjugal:    Map<string, Set<string>>,
): ConjugalClassification {
  const activeUuids    = new Set<string>();
  const nodeUuids      = new Set<string>();
  const childlessUuids = new Set<string>();
  const separatedUuids = new Set<string>();

  for (const cr of conjugalRelationships) {
    const active      = isActiveConjugal(cr);
    const hasChildren = (childrenByConjugal.get(cr.uuid)?.size ?? 0) > 0;

    if (active) {
      activeUuids.add(cr.uuid);
      nodeUuids.add(cr.uuid);
      if (!hasChildren) childlessUuids.add(cr.uuid);
    } else if (hasChildren) {
      nodeUuids.add(cr.uuid);
      separatedUuids.add(cr.uuid);
    }
  }

  return { activeUuids, nodeUuids, childlessUuids, separatedUuids };
}

// ─── Person nodes ──────────────────────────────────────────────────────────

function buildPersonNodes(
  persons:               Person[],
  parentalRelationships: ParentalRelationship[],
): FamilyNode[] {
  const childCountByPerson = new Map<string, number>();
  for (const pr of parentalRelationships) {
    childCountByPerson.set(pr.parentUuid, (childCountByPerson.get(pr.parentUuid) ?? 0) + 1);
  }

  return persons.map(person => {
    const data: PersonNodeData = {
      type:        'person',
      person,
      isCollapsed: false,
      hasChildren: (childCountByPerson.get(person.uuid) ?? 0) > 0,
    };
    return { id: `p-${person.uuid}`, type: 'personNode', position: { x: 0, y: 0 }, data };
  });
}

// ─── Couple nodes + spouse edges ───────────────────────────────────────────

function buildCoupleNodesAndEdges(
  conjugalRelationships: ConjugalRelationship[],
  classification:        ConjugalClassification,
): { nodes: FamilyNode[]; edges: FamilyEdge[] } {
  const nodes: FamilyNode[] = [];
  const edges: FamilyEdge[] = [];
  const { activeUuids, nodeUuids, childlessUuids, separatedUuids } = classification;

  for (const cr of conjugalRelationships) {
    if (!nodeUuids.has(cr.uuid)) continue;

    const isActive    = activeUuids.has(cr.uuid);
    const isChildless = childlessUuids.has(cr.uuid);
    const isSeparated = separatedUuids.has(cr.uuid);

    const coupleData: CoupleNodeData = {
      type:                     'couple',
      status:                   isActive ? 'active' : cr.status === 'widowed' ? 'widowed' : 'divorced',
      partner1Uuid:             cr.partner1Uuid,
      partner2Uuid:             cr.partner2Uuid,
      conjugalRelationshipUuid: cr.uuid,
      hasChildren:              !isChildless,
    };

    nodes.push({
      id:       `c-${cr.uuid}`,
      type:     'coupleNode',
      position: { x: 0, y: 0 },
      // Childless couples are hidden; the layout engine positions them in post-layout
      hidden:   isChildless,
      data:     { ...coupleData, layoutInclude: false },
    });

    const edgeType = cr.relationshipType === 'cohabitation' ? 'cohabitationEdge' : 'marriageEdge';
    const p1 = `p-${cr.partner1Uuid}`;
    const p2 = `p-${cr.partner2Uuid}`;
    const c  = `c-${cr.uuid}`;

    if (isActive && !isChildless) {
      // Visible marriage/cohabitation edges routing into the couple node
      edges.push({ id: `e-p1-${cr.uuid}`, source: p1, target: c, type: edgeType, data: { relationship: cr } });
      edges.push({ id: `e-p2-${cr.uuid}`, source: p2, target: c, type: edgeType, data: { relationship: cr } });
    } else if (isChildless) {
      // Purely visual: layout engine snaps the spouses; one direct visible edge between them
      edges.push({ id: `e-p1-${cr.uuid}`,    source: p1, target: c,  type: edgeType, hidden: true, data: { relationship: cr, visualOnly: true } });
      edges.push({ id: `e-p2-${cr.uuid}`,    source: p2, target: c,  type: edgeType, hidden: true, data: { relationship: cr, visualOnly: true } });
      edges.push({ id: `e-direct-${cr.uuid}`, source: p1, target: p2, type: edgeType, sourceHandle: 'couple-out', targetHandle: 'couple-in', data: { relationship: cr, visualOnly: true } });
    } else if (isSeparated) {
      // Dashed gray edges representing a separated couple that shares children
      edges.push({ id: `e-p1-${cr.uuid}`, source: p1, target: c, type: 'separatedEdge', data: { relationship: cr } });
      edges.push({ id: `e-p2-${cr.uuid}`, source: p2, target: c, type: 'separatedEdge', data: { relationship: cr } });
    }
  }

  return { nodes, edges };
}

// ─── Parent → child edges ──────────────────────────────────────────────────

/**
 * Returns true when every parental record for a given couple+child pair is
 * non-biological (adoptive, foster, or stepparent).
 */
function isFullyAdoptive(
  parentalRelationships: ParentalRelationship[],
  conjugalUuid:          string,
  childUuid:             string,
): boolean {
  return parentalRelationships
    .filter(pr => pr.conjugalRelationshipUuid === conjugalUuid && pr.childUuid === childUuid)
    .every(pr => pr.type === 'adoptive' || pr.type === 'foster' || pr.type === 'stepparent');
}

function buildParentalEdges(
  parentalRelationships: ParentalRelationship[],
  conjugalRelationships: ConjugalRelationship[],
  coupleNodeUuids:       Set<string>,
): FamilyEdge[] {
  const edges: FamilyEdge[]           = [];
  const addedCoupleChildKeys          = new Set<string>(); // deduplicate when two parents share a child

  for (const pr of parentalRelationships) {
    const conjugalUuid = pr.conjugalRelationshipUuid;
    const hasCouple    = !!conjugalUuid && coupleNodeUuids.has(conjugalUuid);

    if (hasCouple) {
      // One edge per couple→child pair (two parental records share it)
      const key = `${conjugalUuid}-${pr.childUuid}`;
      if (addedCoupleChildKeys.has(key)) continue;
      addedCoupleChildKeys.add(key);

      const adoptive   = isFullyAdoptive(parentalRelationships, conjugalUuid!, pr.childUuid);
      const childOrder = conjugalRelationships.find(cr => cr.uuid === conjugalUuid)?.childOrder;
      const layoutOrder = childOrder?.indexOf(pr.childUuid) ?? -1;

      edges.push({
        id:     `e-c-${conjugalUuid}-${pr.childUuid}`,
        source: `c-${conjugalUuid}`,
        target: `p-${pr.childUuid}`,
        type:   adoptive ? 'adoptiveParentalEdge' : 'bloodParentalEdge',
        data:   { type: pr.type, ...(layoutOrder >= 0 ? { layoutOrder } : {}) },
      });
    } else {
      // Single parent or parent without a conjugal record — direct person→person edge
      edges.push({
        id:     `e-direct-${pr.uuid}`,
        source: `p-${pr.parentUuid}`,
        target: `p-${pr.childUuid}`,
        type:   pr.type === 'adoptive' || pr.type === 'foster' ? 'adoptiveParentalEdge' : 'bloodParentalEdge',
        data:   { type: pr.type },
      });
    }
  }

  return edges;
}

// ─── Main export ───────────────────────────────────────────────────────────

/**
 * Converts flat FamilyData into React Flow nodes and edges.
 *
 * Node / edge rules:
 *   Person                              → PersonNode
 *   Active couple with children         → visible CoupleNode + marriage edges + child edges
 *   Active couple without children      → hidden CoupleNode (snapped by layout engine) + direct visual edge
 *   Divorced/widowed with children      → CoupleNode + dashed spouse edges + child edges
 *   Divorced/widowed without children   → omitted
 */
export function buildFamilyGraph(data: FamilyData): { nodes: FamilyNode[]; edges: FamilyEdge[] } {
  const childrenByConjugal = indexChildrenByConjugal(data.parentalRelationships);
  const classification     = classifyConjugalRelationships(data.conjugalRelationships, childrenByConjugal);

  const personNodes                          = buildPersonNodes(data.persons, data.parentalRelationships);
  const { nodes: coupleNodes, edges: coupleEdges } = buildCoupleNodesAndEdges(data.conjugalRelationships, classification);
  const parentalEdges                        = buildParentalEdges(data.parentalRelationships, data.conjugalRelationships, classification.nodeUuids);

  return {
    nodes: [...personNodes, ...coupleNodes],
    edges: [...coupleEdges, ...parentalEdges],
  };
}
