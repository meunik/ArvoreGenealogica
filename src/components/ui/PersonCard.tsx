import { useNavigate } from 'react-router';
import type { Person } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';
import { getDisplayName } from '../../utils/personUtils';

interface PersonCardProps {
  person: Person;
  /** Secondary line shown below the name (e.g. relationship label or birth year). */
  subtitle?: string;
  /** Badge rendered on the right side of the card. */
  badge?: React.ReactNode;
}

/**
 * Clickable card representing a single person.
 * Navigates to /person/:uuid on click.
 */
export function PersonCard({ person, subtitle, badge }: PersonCardProps) {
  const navigate = useNavigate();

  return (
    <button
      key={person.uuid}
      className="flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
      onClick={() => navigate(`/person/${person.uuid}`)}
    >
      <PersonAvatar person={person} size={40} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {getDisplayName(person)}
        </p>
        {subtitle && (
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {badge && <div className="shrink-0">{badge}</div>}
    </button>
  );
}
