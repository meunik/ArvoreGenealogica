import { useTranslation } from 'react-i18next';
import type { Person } from '../../types';
import { InfoRow } from '../ui/InfoRow';
import { formatDate } from '../../utils/personUtils';

interface PersonInfoGridProps {
  person: Person;
}

export function PersonInfoGrid({ person }: PersonInfoGridProps) {
  const { t } = useTranslation();
  const isDeceased = !!person.deathDate;

  return (
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
  );
}
