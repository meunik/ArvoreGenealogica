import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { CoupleNodeData } from '../../types';
import { useTreeCallbacks } from '../../context/TreeCallbacksContext';

type CoupleNodeProps = NodeProps & { data: CoupleNodeData };

export function CoupleNode({ data }: CoupleNodeProps) {
  const { onToggleCollapse } = useTreeCallbacks();
  const isActive = data.status === 'active';
  const isCollapsed = !!data.isCollapsed;
  const canCollapse = data.hasChildren;

  const handleClick = canCollapse
    ? () => onToggleCollapse(data.conjugalRelationshipUuid)
    : undefined;

  if (!isActive) {
    // Divorced/widowed with children: small gray dot, clickable if has children
    return (
      <>
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        <div
          onClick={handleClick}
          title={canCollapse ? (isCollapsed ? 'Expandir filhos' : 'Recolher filhos') : undefined}
          className={`w-2.5 h-2.5 rounded-full border-[1.5px] border-muted flex items-center justify-center transition-colors duration-150 ${canCollapse ? 'cursor-pointer' : 'cursor-default'} ${isCollapsed ? 'bg-muted' : 'bg-border'}`}
        >
          {canCollapse && (
            <span className="text-[7px] leading-none font-bold text-primary">
              {isCollapsed ? '+' : '−'}
            </span>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div
        onClick={handleClick}
        title={canCollapse ? (isCollapsed ? 'Expandir filhos' : 'Recolher filhos') : undefined}
        className={`w-3.5 h-3.5 rounded-full border-2 border-accent-hover shadow-couple flex items-center justify-center transition-all duration-150 ${canCollapse ? 'cursor-pointer hover:scale-[1.2]' : 'cursor-default'} ${isCollapsed ? 'bg-accent-hover' : 'bg-accent'}`}
      >
        {canCollapse && (
          <span className="text-[8px] leading-none font-bold text-white">
            {isCollapsed ? '+' : '−'}
          </span>
        )}
      </div>
    </>
  );
}
