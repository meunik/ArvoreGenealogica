import type { Person } from '../../types';
import { deriveAgeGroup } from '../../utils/personUtils';
import {
  SKIN_TONES,
  HAIR_COLORS,
  getShirtColor,
} from './types.ts';
import { AvatarAdultMale } from './AvatarAdultMale';
import { AvatarAdultFemale } from './AvatarAdultFemale';
import { AvatarYoungMale } from './AvatarYoungMale';
import { AvatarYoungFemale } from './AvatarYoungFemale';
import { AvatarChildMale } from './AvatarChildMale';
import { AvatarChildFemale } from './AvatarChildFemale';
import { AvatarElderlyMale } from './AvatarElderlyMale';
import { AvatarElderlyFemale } from './AvatarElderlyFemale';

interface PersonAvatarProps {
  person: Person;
  size?: number;
  className?: string;
}

export function PersonAvatar({ person, size = 56, className = '' }: PersonAvatarProps) {
  const config = person.avatar;
  const gender = config?.gender ?? person.gender;
  const ageGroup = config?.ageGroup ?? deriveAgeGroup(person);
  const skinColor = SKIN_TONES[config?.skinTone ?? 'medium'];
  const hairColor = HAIR_COLORS[config?.hairColor ?? 'brown'];
  const shirtColor = getShirtColor(person.uuid, gender);

  const svgProps = { skinColor, hairColor, shirtColor };

  let AvatarComponent;
  if (ageGroup === 'child') {
    AvatarComponent = gender === 'female' ? AvatarChildFemale : AvatarChildMale;
  } else if (ageGroup === 'young') {
    AvatarComponent = gender === 'female' ? AvatarYoungFemale : AvatarYoungMale;
  } else if (ageGroup === 'elderly') {
    AvatarComponent = gender === 'female' ? AvatarElderlyFemale : AvatarElderlyMale;
  } else {
    AvatarComponent = gender === 'female' ? AvatarAdultFemale : AvatarAdultMale;
  }

  return (
    <div
      className={`shrink-0 rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <AvatarComponent {...svgProps} />
    </div>
  );
}
