import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { PersonNodeData } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';
import { getYearsLabel } from '../../utils/personUtils';
import { useTranslation } from 'react-i18next';
import { useTreeCallbacks } from '../../context/TreeCallbacksContext';

type PersonNodeProps = NodeProps & { data: PersonNodeData };

export function PersonNode({ data }: PersonNodeProps) {
  const { t } = useTranslation();
  const { onSelectPerson } = useTreeCallbacks();
  const { person } = data;
  const yearsLabel = getYearsLabel(person);
  const isDeceased = !!person.deathDate;

  return (
    <div className="group relative cursor-pointer select-none w-40" onClick={() => onSelectPerson(person.uuid)}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <div
        className="rounded-xl border transition-all duration-200 p-2.5 bg-node-bg border-node-border shadow-node hover:border-node-border-hover hover:shadow-node-hover"
      >
        <div className="flex items-center gap-2">
          <div
            className={`rounded-full overflow-hidden shrink-0 border-2 ${isDeceased ? 'border-muted' : 'border-accent'}`}
          >
            <PersonAvatar person={person} size={44} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate leading-tight text-primary">
              {person.firstName}
            </p>
            <p className="text-xs truncate leading-tight text-secondary">
              {person.lastName}
            </p>
            {yearsLabel && (
              <p className="text-[10px] mt-0.5 leading-tight text-muted">
                {yearsLabel}
              </p>
            )}
          </div>
        </div>

        {isDeceased && (
          <div className="mt-1.5 text-center text-[9px] font-medium rounded px-1 py-0.5 bg-surface-elevated text-muted">
            ✝ {t('person.deceased')}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      {/* Extra handles for childless couple direct edge (bottom→bottom) */}
      <Handle id="couple-out" type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle id="couple-in"  type="target" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
