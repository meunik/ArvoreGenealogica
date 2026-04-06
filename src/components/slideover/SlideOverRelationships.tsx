import { useTranslation } from 'react-i18next';
import type { ParentalRelationship } from '../../types';
import { PersonAvatar } from '../avatar/PersonAvatar';
import { Badge } from '../ui/Badge';
import { PersonChip } from '../ui/PersonChip';
import { getDisplayName } from '../../utils/personUtils';
import { useFamilyData } from '../../context/FamilyContext';

interface SlideOverRelationshipsProps {
  personUuid: string;
}

const PARENTAL_BADGE: Record<ParentalRelationship['type'], NonNullable<React.ComponentProps<typeof Badge>['variant']>> = {
  biological: 'default',
  adoptive:   'adoptive',
  stepparent: 'muted',
  foster:     'muted',
};

export function SlideOverRelationships({ personUuid }: SlideOverRelationshipsProps) {
  const { t } = useTranslation();
  const { getChildrenOf, getParentsOf, getSpousesOf, getSiblingsOf } = useFamilyData();

  const children = getChildrenOf(personUuid);
  const parents  = getParentsOf(personUuid);
  const spouses  = getSpousesOf(personUuid);
  const siblings = getSiblingsOf(personUuid);

  return (
    <>
      {spouses.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
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

      {parents.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
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

      {siblings.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('person.siblings')} ({siblings.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {siblings.map(sibling => <PersonChip key={sibling.uuid} person={sibling} />)}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">
          {t('person.children')} ({children.length})
        </h3>
        {children.length === 0 ? (
          <p className="text-sm text-text-muted italic">
            {t('person.noChildren')}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {children.map(child => <PersonChip key={child.uuid} person={child} />)}
          </div>
        )}
      </section>
    </>
  );
}
