import { useTranslation } from 'react-i18next';
import type { ParentalRelationship } from '../../types';
import { Badge } from '../ui/Badge';
import { PersonCard } from '../ui/PersonCard';
import { useFamilyData } from '../../context/FamilyContext';

interface PersonRelationshipsProps {
  personUuid: string;
}

const PARENTAL_BADGE: Record<ParentalRelationship['type'], NonNullable<React.ComponentProps<typeof Badge>['variant']>> = {
  biological: 'default',
  adoptive:   'adoptive',
  stepparent: 'muted',
  foster:     'muted',
};

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

export function PersonRelationships({ personUuid }: PersonRelationshipsProps) {
  const { t } = useTranslation();
  const { getChildrenOf, getParentsOf, getSpousesOf, getSiblingsOf } = useFamilyData();

  const children = getChildrenOf(personUuid);
  const parents  = getParentsOf(personUuid);
  const spouses  = getSpousesOf(personUuid);
  const siblings = getSiblingsOf(personUuid);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)' }}
    >
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
  );
}
