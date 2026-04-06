import type { AgeGroup, Gender, SkinTone, HairColor } from '../../types';

export interface AvatarSvgProps {
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  className?: string;
}

// ── Color Palettes ──────────────────────────────────────────────────────────

export const SKIN_TONES: Record<SkinTone, string> = {
  'light':       '#fde4c8',
  'medium-light':'#f5c9a0',
  'medium':      '#d4915a',
  'medium-dark': '#a0623a',
  'dark':        '#6e3b1e',
};

export const HAIR_COLORS: Record<HairColor, string> = {
  'black':  '#1a1210',
  'brown':  '#6b3a2a',
  'blonde': '#d4a843',
  'red':    '#9e3a1a',
  'gray':   '#9a9a9a',
  'white':  '#e8e8e8',
};

export const SHIRT_COLOR_BY_GENDER: Record<Gender, string[]> = {
  male:   ['#2d4a7a', '#3a5a3a', '#6a3a6a', '#4a4a4a'],
  female: ['#6a3a5a', '#3a5a6a', '#7a4a3a', '#5a3a7a'],
  other:  ['#4a5a6a', '#5a4a6a', '#3a6a5a', '#6a5a3a'],
};

/** Picks a deterministic shirt color from the UUID */
export function getShirtColor(uuid: string, gender: Gender): string {
  const palette = SHIRT_COLOR_BY_GENDER[gender];
  const idx = uuid.charCodeAt(uuid.length - 1) % palette.length;
  return palette[idx];
}

export type { AgeGroup, Gender };
