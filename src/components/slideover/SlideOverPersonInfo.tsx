import { useTranslation } from 'react-i18next';
import type { Person } from '../../types';
import { InfoRow } from '../ui/InfoRow';
import { formatDate } from '../../utils/personUtils';

interface SlideOverPersonInfoProps {
  person: Person;
}

export function SlideOverPersonInfo({ person }: SlideOverPersonInfoProps) {
  const { t } = useTranslation();
  const isDeceased = !!person.deathDate;

  return (
    <section>
      <InfoRow label={t('person.birthDate')} value={formatDate(person.birthDate)} icon="🎂" />
      {isDeceased && (
        <InfoRow label={t('person.deathDate')} value={formatDate(person.deathDate)} icon="✝️" />
      )}
      <InfoRow label={t('person.bloodType')} value={person.bloodType} fallback={t('person.noBloodType')} icon="🩸" />
      <InfoRow label={t('person.profession')} value={person.profession} fallback={t('person.noProfession')} icon="💼" />
      <InfoRow label={t('person.phone')} value={person.phone} fallback={t('person.noPhone')} icon="📞" />
      <InfoRow label={t('person.email')} value={person.email} fallback={t('person.noEmail')} icon="✉️" />
    </section>
  );
}
