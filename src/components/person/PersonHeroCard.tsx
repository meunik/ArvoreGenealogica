import { useTranslation } from 'react-i18next';
import type { Person } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';
import { Badge } from '../ui/Badge';
import { calcAge } from '../../utils/personUtils';

interface PersonHeroCardProps {
  person: Person;
}

export function PersonHeroCard({ person }: PersonHeroCardProps) {
  const { t } = useTranslation();
  const age = calcAge(person.birthDate, person.deathDate);
  const isDeceased = !!person.deathDate;

  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
      style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
    >
      <div
        className="rounded-3xl overflow-hidden shrink-0"
        style={{
          border: `4px solid ${isDeceased ? 'var(--text-muted)' : 'var(--accent)'}`,
          boxShadow: '0 0 32px var(--node-shadow)',
        }}
      >
        <PersonAvatar person={person} size={120} />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {person.firstName}{' '}
          <span style={{ color: 'var(--text-secondary)' }}>{person.lastName}</span>
        </h1>

        {age !== null && (
          <p className="text-lg mt-1" style={{ color: 'var(--text-muted)' }}>
            {age} {t('person.age').toLowerCase()}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
          {person.bloodType && <Badge variant="accent" size="md">🩸 {person.bloodType}</Badge>}
          {isDeceased && <Badge variant="muted" size="md">✝ {t('person.deceased')}</Badge>}
          {person.profession && <Badge variant="default" size="md">💼 {person.profession}</Badge>}
        </div>
      </div>
    </div>
  );
}
