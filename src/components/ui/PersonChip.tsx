import type { Person } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';

interface PersonChipProps {
  person: Person;
}

export function PersonChip({ person }: PersonChipProps) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
      style={{ backgroundColor: 'var(--surface-elevated)' }}
    >
      <PersonAvatar person={person} size={24} />
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        {person.firstName}
      </span>
    </div>
  );
}
