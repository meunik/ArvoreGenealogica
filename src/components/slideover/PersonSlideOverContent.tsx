import { useNavigate } from 'react-router';
import type { Person } from '../../types';
import { SlideOverHeader } from './SlideOverHeader';
import { SlideOverPersonInfo } from './SlideOverPersonInfo';
import { SlideOverRelationships } from './SlideOverRelationships';
import { SlideOverFooter } from './SlideOverFooter';

interface PersonSlideOverContentProps {
  person: Person;
  onClose: () => void;
}

export function PersonSlideOverContent({ person, onClose }: PersonSlideOverContentProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    onClose();
    navigate(`/person/${person.uuid}`);
  };

  return (
    <div className="flex flex-col h-full">
      <SlideOverHeader person={person} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <SlideOverPersonInfo person={person} />
        <SlideOverRelationships personUuid={person.uuid} />
      </div>

      <SlideOverFooter onViewProfile={handleViewProfile} />
    </div>
  );
}
