import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFamilyData } from '../context/FamilyContext';
import { PersonAvatar } from '../components/avatar/PersonAvatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { InfoRow } from '../components/ui/InfoRow';
import { PersonCard } from '../components/ui/PersonCard';
import { calcAge, formatDate } from '../utils/personUtils';
import type { ParentalRelationship } from '../types';

const PARENTAL_BADGE: Record<ParentalRelationship['type'], NonNullable<React.ComponentProps<typeof Badge>['variant']>> = {
  biological: 'default',
  adoptive:   'adoptive',
  stepparent: 'muted',
  foster:     'muted',
};

// ─── Sub-sections ──────────────────────────────────────────────────────────

interface RelationshipSectionProps {
  title: string;
  children: React.ReactNode;
}

function RelationshipSection({ title, children }: RelationshipSectionProps) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPersonById, getChildrenOf, getParentsOf, getSpousesOf, getSiblingsOf } = useFamilyData();

  const person = id ? getPersonById(id) : undefined;

  if (!person) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: 'var(--surface-elevated)' }}
        >
          🔍
        </div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {t('errors.personNotFound')}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('errors.personNotFoundDesc')}</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          ← {t('person.backToTree')}
        </Button>
      </div>
    );
  }

  const children  = getChildrenOf(person.uuid);
  const parents   = getParentsOf(person.uuid);
  const spouses   = getSpousesOf(person.uuid);
  const siblings  = getSiblingsOf(person.uuid);
  const age       = calcAge(person.birthDate, person.deathDate);
  const isDeceased = !!person.deathDate;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface)' }}>

      {/* Back button */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-3 border-b flex items-center gap-3"
        style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border)' }}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t('person.backToTree')}
        </Button>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Hero Card */}
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

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('person.details')}
            </h2>
            <InfoRow label={t('person.birthDate')} value={formatDate(person.birthDate)} icon="🎂" />
            {isDeceased && (
              <InfoRow label={t('person.deathDate')} value={formatDate(person.deathDate)} icon="✝️" />
            )}
            <InfoRow label={t('person.bloodType')} value={person.bloodType} fallback={t('person.noBloodType')} icon="🩸" />
            <InfoRow label={t('person.profession')} value={person.profession} fallback={t('person.noProfession')} icon="💼" />
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('person.contact')}
            </h2>
            <InfoRow label={t('person.phone')} value={person.phone} fallback={t('person.noPhone')} icon="📞" />
            <InfoRow label={t('person.email')} value={person.email} fallback={t('person.noEmail')} icon="✉️" />
          </div>
        </div>

        {/* Relacionamentos */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('person.relationships')}
          </h2>

          <div className="space-y-6">

            {spouses.length > 0 && (
              <RelationshipSection title={`${t('person.spouse')} / ${t('person.exSpouse')}`}>
                {spouses.map(({ person: spouse, relationship }) => {
                  const isActive = relationship.status === 'married' || relationship.status === 'cohabiting';
                  return (
                    <PersonCard
                      key={relationship.uuid}
                      person={spouse}
                      subtitle={t(`relationship.${relationship.status}`)}
                      badge={<Badge variant={isActive ? 'accent' : 'muted'}>{isActive ? '❤️' : '—'}</Badge>}
                    />
                  );
                })}
              </RelationshipSection>
            )}

            {parents.length > 0 && (
              <RelationshipSection title={t('person.parents')}>
                {parents.map(({ person: parent, type }) => (
                  <PersonCard
                    key={parent.uuid}
                    person={parent}
                    badge={<Badge variant={PARENTAL_BADGE[type]}>{t(`relationship.${type}`)}</Badge>}
                  />
                ))}
              </RelationshipSection>
            )}

            {siblings.length > 0 && (
              <RelationshipSection title={`${t('person.siblings')} (${siblings.length})`}>
                {siblings.map(sibling => (
                  <PersonCard key={sibling.uuid} person={sibling} subtitle={sibling.birthDate?.slice(0, 4)} />
                ))}
              </RelationshipSection>
            )}

            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                {t('person.children')} ({children.length})
              </p>
              {children.length === 0 ? (
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                  {t('person.noChildren')}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {children.map(child => (
                    <PersonCard key={child.uuid} person={child} subtitle={child.birthDate?.slice(0, 4)} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
