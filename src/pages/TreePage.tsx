import { useCallback } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { FamilyTree } from '../components/tree/FamilyTree';
import { SlideOver } from '../components/slideover/SlideOver';
import { PersonSlideOverContent } from '../components/slideover/PersonSlideOverContent';
import { useSlideOver } from '../hooks/useSlideOver';
import { useFamilyData } from '../context/FamilyContext';

export function TreePage() {
  const { isOpen, selectedPersonId, open, close } = useSlideOver();
  const { getPersonById } = useFamilyData();

  const handleSelectPerson = useCallback((uuid: string) => {
    open(uuid);
  }, [open]);

  const selectedPerson = selectedPersonId ? getPersonById(selectedPersonId) : undefined;

  return (
    <AppLayout>
      <div className="w-full h-full">
        <FamilyTree onSelectPerson={handleSelectPerson} />
      </div>

      <SlideOver isOpen={isOpen} onClose={close}>
        {selectedPerson && (
          <PersonSlideOverContent person={selectedPerson} onClose={close} />
        )}
      </SlideOver>
    </AppLayout>
  );
}
