// ─── Avatar ────────────────────────────────────────────────────────────────
export type Gender = 'male' | 'female' | 'other';
export type AgeGroup = 'child' | 'young' | 'adult' | 'elderly';
export type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white';
export type ClothingStyle = 'casual' | 'formal' | 'sporty';

export interface AvatarConfig {
  ageGroup: AgeGroup;
  gender: Gender;
  /** Future customizations — optional, will be used when avatar editor is implemented */
  skinTone?: SkinTone;
  hairColor?: HairColor;
  hasGlasses?: boolean;
  hasEarrings?: boolean;
  hasNecklace?: boolean;
  hasPiercing?: boolean;
  clothingStyle?: ClothingStyle;
}

// ─── Blood Type ────────────────────────────────────────────────────────────
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// ─── Person ────────────────────────────────────────────────────────────────
export interface Person {
  uuid: string;
  firstName: string;
  lastName: string;
  photo?: string;
  birthDate?: string;   // "YYYY-MM-DD"
  deathDate?: string;   // "YYYY-MM-DD"
  bloodType?: BloodType;
  phone?: string;
  email?: string;
  profession?: string;
  gender: Gender;
  avatar?: AvatarConfig;
}

// ─── Relationships ─────────────────────────────────────────────────────────
export type ConjugalStatus = 'married' | 'cohabiting' | 'divorced' | 'widowed';
export type ConjugalType = 'marriage' | 'civil_union' | 'cohabitation';
export type ParentalType = 'biological' | 'adoptive' | 'stepparent' | 'foster';

export interface ConjugalRelationship {
  uuid: string;
  partner1Uuid: string;
  partner2Uuid: string;
  status: ConjugalStatus;
  relationshipType: ConjugalType;
  startDate?: string;
  endDate?: string;
  /** Optional left-to-right ordering of children in the tree layout */
  childOrder?: string[];
}

export interface ParentalRelationship {
  uuid: string;
  parentUuid: string;
  childUuid: string;
  /** Which conjugal relationship produced/adopted this child, if known */
  conjugalRelationshipUuid?: string;
  type: ParentalType;
}

// ─── Family Data (root of family.json) ────────────────────────────────────
export interface FamilyData {
  persons: Person[];
  conjugalRelationships: ConjugalRelationship[];
  parentalRelationships: ParentalRelationship[];
}

// ─── Tree Builder types ────────────────────────────────────────────────────
export type CoupleNodeStatus = 'active' | 'divorced' | 'widowed';

export interface CoupleNodeData {
  type: 'couple';
  status: CoupleNodeStatus;
  partner1Uuid: string;
  partner2Uuid: string;
  conjugalRelationshipUuid: string;
  hasChildren: boolean;
  isCollapsed?: boolean;
  [key: string]: unknown;
}

export interface PersonNodeData {
  type: 'person';
  person: Person;
  isCollapsed: boolean;
  hasChildren: boolean;
  [key: string]: unknown;
}

// React Flow requires Node data to extend Record<string, unknown>
export type FamilyNodeData = CoupleNodeData | PersonNodeData;
