import type { Person } from '../types';

export function calcAge(birthDate?: string, deathDate?: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  const age = end.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    end.getMonth() > birth.getMonth() ||
    (end.getMonth() === birth.getMonth() && end.getDate() >= birth.getDate());
  return hasBirthdayPassed ? age : age - 1;
}

export function formatDate(dateStr?: string, locale = 'pt-BR'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function getDisplayName(person: Person): string {
  return `${person.firstName} ${person.lastName}`;
}

export function getYearsLabel(person: Person): string {
  const birth = calcAge(person.birthDate, person.deathDate);
  if (birth === null) return '';
  if (person.deathDate) return `${person.birthDate?.slice(0, 4)} – ${person.deathDate.slice(0, 4)}`;
  return `${person.birthDate?.slice(0, 4)}`;
}

export function deriveAgeGroup(person: Person): import('../types').AgeGroup {
  const age = calcAge(person.birthDate);
  if (age === null) return 'adult';
  if (age < 13) return 'child';
  if (age < 30) return 'young';
  if (age < 65) return 'adult';
  return 'elderly';
}
