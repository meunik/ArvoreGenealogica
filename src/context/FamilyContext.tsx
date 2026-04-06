import { createContext, useContext, useMemo } from 'react';
import type { FamilyData, Person, ConjugalRelationship, ParentalRelationship } from '../types';
import familyJson from '../data/family.json';

const familyData = familyJson as FamilyData;

interface FamilyContextValue {
  persons: Person[];
  conjugalRelationships: ConjugalRelationship[];
  parentalRelationships: ParentalRelationship[];
  getPersonById: (uuid: string) => Person | undefined;
  getChildrenOf: (personUuid: string) => Person[];
  getParentsOf: (personUuid: string) => Array<{ person: Person; type: ParentalRelationship['type'] }>;
  getSpousesOf: (personUuid: string) => Array<{ person: Person; relationship: ConjugalRelationship }>;
  getSiblingsOf: (personUuid: string) => Person[];
}

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const personMap = useMemo(() => {
    const map = new Map<string, Person>();
    for (const p of familyData.persons) map.set(p.uuid, p);
    return map;
  }, []);

  const getPersonById = (uuid: string) => personMap.get(uuid);

  const getChildrenOf = (personUuid: string): Person[] => {
    const childUuids = new Set<string>();
    for (const pr of familyData.parentalRelationships) {
      if (pr.parentUuid === personUuid) childUuids.add(pr.childUuid);
    }
    return Array.from(childUuids)
      .map(uuid => personMap.get(uuid))
      .filter((p): p is Person => p !== undefined);
  };

  const getParentsOf = (personUuid: string) => {
    return familyData.parentalRelationships
      .filter(pr => pr.childUuid === personUuid)
      .map(pr => ({
        person: personMap.get(pr.parentUuid),
        type: pr.type,
      }))
      .filter((r): r is { person: Person; type: ParentalRelationship['type'] } => r.person !== undefined);
  };

  const getSpousesOf = (personUuid: string) => {
    return familyData.conjugalRelationships
      .filter(cr => cr.partner1Uuid === personUuid || cr.partner2Uuid === personUuid)
      .map(cr => {
        const spouseUuid = cr.partner1Uuid === personUuid ? cr.partner2Uuid : cr.partner1Uuid;
        return { person: personMap.get(spouseUuid), relationship: cr };
      })
      .filter((r): r is { person: Person; relationship: ConjugalRelationship } => r.person !== undefined);
  };

  const getSiblingsOf = (personUuid: string): Person[] => {
    // Collect all parent UUIDs of this person
    const parentUuids = new Set(
      familyData.parentalRelationships
        .filter(pr => pr.childUuid === personUuid)
        .map(pr => pr.parentUuid),
    );
    if (parentUuids.size === 0) return [];

    // Collect UUIDs of everyone who shares at least one parent
    const siblingUuids = new Set<string>();
    for (const pr of familyData.parentalRelationships) {
      if (parentUuids.has(pr.parentUuid) && pr.childUuid !== personUuid) {
        siblingUuids.add(pr.childUuid);
      }
    }

    return Array.from(siblingUuids)
      .map(uuid => personMap.get(uuid))
      .filter((p): p is Person => p !== undefined);
  };

  const value: FamilyContextValue = {
    persons: familyData.persons,
    conjugalRelationships: familyData.conjugalRelationships,
    parentalRelationships: familyData.parentalRelationships,
    getPersonById,
    getChildrenOf,
    getParentsOf,
    getSpousesOf,
    getSiblingsOf,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamilyData(): FamilyContextValue {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamilyData must be used within FamilyProvider');
  return ctx;
}
