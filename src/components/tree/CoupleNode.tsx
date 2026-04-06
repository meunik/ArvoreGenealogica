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
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: isCollapsed ? 'var(--text-muted)' : 'var(--border)',
            border: '1.5px solid var(--text-muted)',
            cursor: canCollapse ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s',
          }}
        >
          {canCollapse && (
            <span style={{ fontSize: 7, color: 'var(--text-primary)', lineHeight: 1, fontWeight: 700 }}>
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
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: isCollapsed ? 'var(--accent-hover)' : 'var(--accent)',
          border: '2px solid var(--accent-hover)',
          boxShadow: '0 0 8px var(--node-shadow)',
          cursor: canCollapse ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => { if (canCollapse) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
      >
        {canCollapse && (
          <span style={{ fontSize: 8, color: '#fff', lineHeight: 1, fontWeight: 700 }}>
            {isCollapsed ? '+' : '−'}
          </span>
        )}
      </div>
    </>
  );
}
