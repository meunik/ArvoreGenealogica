import { useTranslation } from 'react-i18next';
import type { Person } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';
import { Badge } from '../ui/Badge';
import { calcAge } from '../../utils/personUtils';

interface SlideOverHeaderProps {
  person: Person;
}

export function SlideOverHeader({ person }: SlideOverHeaderProps) {
  const { t } = useTranslation();
  const age = calcAge(person.birthDate, person.deathDate);
  const isDeceased = !!person.deathDate;

  return (
    <div className="px-5 pt-5 pb-4 border-b border-border">
      <div className="flex items-start gap-4">
        <div
          className={`rounded-2xl overflow-hidden shrink-0 border-[3px] shadow-node-sm ${isDeceased ? 'border-muted' : 'border-accent'}`}
        >
          <PersonAvatar person={person} size={72} />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-lg font-bold leading-tight text-primary">
            {person.firstName}
          </h2>
          <p className="text-sm text-secondary">
            {person.lastName}
          </p>
          {age !== null && (
            <p className="text-xs mt-1 text-muted">
              {age} {t('person.age').toLowerCase()}
              {isDeceased && (
                <span className="ml-2">
                  <Badge variant="muted">✝ {t('person.deceased')}</Badge>
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
