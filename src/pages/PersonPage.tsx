import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFamilyData } from '../context/FamilyContext';
import { PersonAvatar } from '../components/avatar/PersonAvatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { InfoRow } from '../components/ui/InfoRow';
import { calcAge, formatDate, getDisplayName } from '../utils/personUtils';
import type { ParentalRelationship } from '../types';

const PARENTAL_BADGE: Record<ParentalRelationship['type'], NonNullable<React.ComponentProps<typeof Badge>['variant']>> = {
  biological: 'default',
  adoptive:   'adoptive',
  stepparent: 'muted',
  foster:     'muted',
};

export function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPersonById, getChildrenOf, getParentsOf, getSpousesOf } = useFamilyData();

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

  const children = getChildrenOf(person.uuid);
  const parents = getParentsOf(person.uuid);
  const spouses = getSpousesOf(person.uuid);
  const age = calcAge(person.birthDate, person.deathDate);
  const isDeceased = !!person.deathDate;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      {/* ── Back button ── */}
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
        {/* ── Hero Card ── */}
        <div
          className="rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
        >
          <div
            className="rounded-3xl overflow-hidden shrink-0"
            style={{
              border: `4px solid ${isDeceased ? 'var(--text-muted)' : 'var(--accent)'}`,
              boxShadow: `0 0 32px var(--node-shadow)`,
            }}
          >
            <PersonAvatar person={person} size={120} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {person.firstName} <span style={{ color: 'var(--text-secondary)' }}>{person.lastName}</span>
            </h1>

            {age !== null && (
              <p className="text-lg mt-1" style={{ color: 'var(--text-muted)' }}>
                {age} {t('person.age').toLowerCase()}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {person.bloodType && <Badge variant="accent" size="md">🩸 {person.bloodType}</Badge>}
              {isDeceased && <Badge variant="muted" size="md">✝ {t('person.deceased')}</Badge>}
              {person.profession && (
                <Badge variant="default" size="md">💼 {person.profession}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* ── Info Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dados Pessoais */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('person.details')}
            </h2>
            <InfoRow label={t('person.birthDate')} value={formatDate(person.birthDate)} icon="🎂" />
            {isDeceased && (
              <InfoRow label={t('person.deathDate')} value={formatDate(person.deathDate)} icon="✝️" />
            )}
            <InfoRow label={t('person.bloodType')} value={person.bloodType} fallback={t('person.noBloodType')} icon="🩸" />
            <InfoRow label={t('person.profession')} value={person.profession} fallback={t('person.noProfession')} icon="💼" />
          </div>

          {/* Contato */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Contato
            </h2>
            <InfoRow label={t('person.phone')} value={person.phone} fallback={t('person.noPhone')} icon="📞" />
            <InfoRow label={t('person.email')} value={person.email} fallback={t('person.noEmail')} icon="✉️" />
          </div>
        </div>

        {/* ── Relacionamentos ── */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
        >
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('person.relationships')}
          </h2>

          <div className="space-y-6">
            {/* Cônjuges */}
            {spouses.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {t('person.spouse')} / {t('person.exSpouse')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {spouses.map(({ person: spouse, relationship }) => {
                    const isActive = relationship.status === 'married' || relationship.status === 'cohabiting';
                    return (
                      <button
                        key={relationship.uuid}
                        className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
                        onClick={() => navigate(`/person/${spouse.uuid}`)}
                      >
                        <PersonAvatar person={spouse} size={40} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {getDisplayName(spouse)}
                          </p>
                          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {t(`relationship.${relationship.status}`)}
                          </p>
                        </div>
                        <Badge variant={isActive ? 'accent' : 'muted'}>
                          {isActive ? '❤️' : '—'}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pais */}
            {parents.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {t('person.parents')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parents.map(({ person: parent, type }) => (
                    <button
                      key={parent.uuid}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
                      onClick={() => navigate(`/person/${parent.uuid}`)}
                    >
                      <PersonAvatar person={parent} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {getDisplayName(parent)}
                        </p>
                      </div>
                      <Badge variant={PARENTAL_BADGE[type]}>
                        {t(`relationship.${type}`)}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filhos */}
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
                    <button
                      key={child.uuid}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
                      onClick={() => navigate(`/person/${child.uuid}`)}
                    >
                      <PersonAvatar person={child} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {getDisplayName(child)}
                        </p>
                        {child.birthDate && (
                          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {child.birthDate.slice(0, 4)}
                          </p>
                        )}
                      </div>
                    </button>
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
