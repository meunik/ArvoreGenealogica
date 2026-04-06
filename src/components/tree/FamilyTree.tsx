import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  type Node,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { PersonNode } from './PersonNode';
import { CoupleNode } from './CoupleNode';
import {
  MarriageEdge,
  CohabitationEdge,
  BloodParentalEdge,
  AdoptiveParentalEdge,
  SeparatedEdge,
} from './edges/FamilyEdges';
import { useTreeBuilder } from '../../hooks/useTreeBuilder';
import { useExpandCollapse } from '../../hooks/useExpandCollapse';
import { TreeCallbacksProvider } from '../../context/TreeCallbacksContext';
import type { FamilyNode, FamilyEdge } from '../../utils/treeBuilder';

const nodeTypes = {
  personNode: PersonNode,
  coupleNode: CoupleNode,
};

const edgeTypes = {
  marriageEdge: MarriageEdge,
  cohabitationEdge: CohabitationEdge,
  bloodParentalEdge: BloodParentalEdge,
  adoptiveParentalEdge: AdoptiveParentalEdge,
  separatedEdge: SeparatedEdge,
};

interface FamilyTreeProps {
  onSelectPerson: (uuid: string) => void;
}

function FamilyTreeCanvas({ onSelectPerson }: FamilyTreeProps) {
  const { fitView } = useReactFlow();
  const { collapsedNodeIds, toggle, isCollapsed } = useExpandCollapse();
  const { nodes: layoutNodes, edges: layoutEdges } = useTreeBuilder(collapsedNodeIds);
  const [showMinimap, setShowMinimap] = useState(false);

  // Inject isCollapsed state into CoupleNode data (collapse is now couple-node driven)
  const computedNodes = useMemo<FamilyNode[]>(() => {
    return layoutNodes.map(node => {
      if (node.data.type === 'couple') {
        return {
          ...node,
          data: { ...node.data, isCollapsed: isCollapsed(node.data.conjugalRelationshipUuid) },
        };
      }
      return node;
    });
  }, [layoutNodes, isCollapsed]);

  const [nodes, setNodes] = useState<FamilyNode[]>(computedNodes);
  const [edges, setEdges] = useState<FamilyEdge[]>(layoutEdges);

  // Keep nodes/edges in sync when layout recalculates
  useEffect(() => {
    setNodes(computedNodes);
    fitView({ padding: 0.15, duration: 400 });
  }, [computedNodes, fitView]);

  useEffect(() => {
    setEdges(layoutEdges);
  }, [layoutEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(prev => applyNodeChanges(changes, prev as Node[]) as unknown as FamilyNode[]);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(prev => applyEdgeChanges(changes, prev) as FamilyEdge[]);
  }, []);

  const callbacks = useMemo(
    () => ({ onSelectPerson, onToggleCollapse: toggle }),
    [onSelectPerson, toggle],
  );

  return (
    <TreeCallbacksProvider value={callbacks}>
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={2.5}
        attributionPosition="bottom-left"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="var(--border)"
        />
        <Controls showInteractive={false} position="bottom-right" />

        {/* Minimap toggle button — always visible in top-right */}
        <Panel position="top-right">
          <button
            onClick={() => setShowMinimap(v => !v)}
            title={showMinimap ? 'Ocultar minimapa' : 'Mostrar minimapa'}
            className={`w-7.5 h-7.5 rounded-md border border-border cursor-pointer flex items-center justify-center transition-all duration-150 ${showMinimap ? 'bg-accent text-white' : 'bg-surface-elevated text-secondary'}`}
          >
            {/* Map icon (grid squares) */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.9"/>
              <rect x="10" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.5"/>
              <rect x="1" y="10" width="5" height="5" rx="1" fill="currentColor" opacity="0.5"/>
              <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor" opacity="0.9"/>
            </svg>
          </button>
        </Panel>

        {showMinimap && (
          <MiniMap
            position="top-right"
            style={{ marginTop: 50 }}
            nodeColor={node => {
              if ((node.data as { type?: string })?.type === 'couple') return 'var(--accent)';
              return 'var(--surface-elevated)';
            }}
            maskColor="rgba(0,0,0,0.5)"
          />
        )}
      </ReactFlow>
    </TreeCallbacksProvider>
  );
}

export function FamilyTree({ onSelectPerson }: FamilyTreeProps) {
  return (
    <div className="w-full h-full bg-surface">
      <ReactFlowProvider>
        <FamilyTreeCanvas onSelectPerson={onSelectPerson} />
      </ReactFlowProvider>
    </div>
  );
}

