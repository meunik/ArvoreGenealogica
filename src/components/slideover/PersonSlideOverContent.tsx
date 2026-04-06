import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Person, ParentalRelationship } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InfoRow } from '../ui/InfoRow';
import { calcAge, formatDate, getDisplayName } from '../../utils/personUtils';
import { useFamilyData } from '../../context/FamilyContext';

interface PersonSlideOverContentProps {
  person: Person;
  onClose: () => void;
}

const PARENTAL_BADGE: Record<ParentalRelationship['type'], NonNullable<React.ComponentProps<typeof Badge>['variant']>> = {
  biological: 'default',
  adoptive:   'adoptive',
  stepparent: 'muted',
  foster:     'muted',
};

export function PersonSlideOverContent({ person, onClose }: PersonSlideOverContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getChildrenOf, getParentsOf, getSpousesOf } = useFamilyData();

  const children = getChildrenOf(person.uuid);
  const parents = getParentsOf(person.uuid);
  const spouses = getSpousesOf(person.uuid);
  const age = calcAge(person.birthDate, person.deathDate);
  const isDeceased = !!person.deathDate;

  const handleViewProfile = () => {
    onClose();
    navigate(`/person/${person.uuid}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div
        className="px-5 pt-5 pb-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="rounded-2xl overflow-hidden shrink-0"
            style={{
              border: `3px solid ${isDeceased ? 'var(--text-muted)' : 'var(--accent)'}`,
              boxShadow: `0 0 20px var(--node-shadow)`,
            }}
          >
            <PersonAvatar person={person} size={72} />
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <h2 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {person.firstName}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {person.lastName}
            </p>
            {age !== null && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
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

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Info pessoal */}
        <section>
          <InfoRow label={t('person.birthDate')} value={formatDate(person.birthDate)} fallback={t('person.noPhone')} icon="🎂" />
          {isDeceased && (
            <InfoRow label={t('person.deathDate')} value={formatDate(person.deathDate)} icon="✝️" />
          )}
          <InfoRow label={t('person.bloodType')} value={person.bloodType} fallback={t('person.noBloodType')} icon="🩸" />
          <InfoRow label={t('person.profession')} value={person.profession} fallback={t('person.noProfession')} icon="💼" />
          <InfoRow label={t('person.phone')} value={person.phone} fallback={t('person.noPhone')} icon="📞" />
          <InfoRow label={t('person.email')} value={person.email} fallback={t('person.noEmail')} icon="✉️" />
        </section>

        {/* Cônjuges */}
        {spouses.length > 0 && (
          <section>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('person.relationships')}
            </h3>
            <div className="space-y-2">
              {spouses.map(({ person: spouse, relationship }) => {
                const isActive = relationship.status === 'married' || relationship.status === 'cohabiting';
                return (
                  <div
                    key={relationship.uuid}
                    className="flex items-center gap-3 p-2 rounded-xl"
                    style={{ backgroundColor: 'var(--surface-elevated)' }}
                  >
                    <PersonAvatar person={spouse} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {getDisplayName(spouse)}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {t(`relationship.${relationship.status}`)}
                      </p>
                    </div>
                    <Badge variant={isActive ? 'accent' : 'muted'}>
                      {isActive ? t('person.spouse') : t('person.exSpouse')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Pais */}
        {parents.length > 0 && (
          <section>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('person.parents')}
            </h3>
            <div className="space-y-2">
              {parents.map(({ person: parent, type }) => (
                <div
                  key={parent.uuid}
                  className="flex items-center gap-3 p-2 rounded-xl"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  <PersonAvatar person={parent} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {getDisplayName(parent)}
                    </p>
                  </div>
                  <Badge variant={PARENTAL_BADGE[type]}>
                    {t(`relationship.${type}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filhos */}
        <section>
          <h3
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('person.children')} ({children.length})
          </h3>
          {children.length === 0 ? (
            <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
              {t('person.noChildren')}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {children.map(child => (
                <div
                  key={child.uuid}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  <PersonAvatar person={child} size={24} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {child.firstName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-card)' }}
      >
        <Button variant="primary" size="md" className="w-full" onClick={handleViewProfile}>
          {t('person.viewProfile')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
