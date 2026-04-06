import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface SlideOverFooterProps {
  onViewProfile: () => void;
}

export function SlideOverFooter({ onViewProfile }: SlideOverFooterProps) {
  const { t } = useTranslation();

  return (
    <div
      className="px-5 py-4 border-t"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-card)' }}
    >
      <Button variant="primary" size="md" className="w-full" onClick={onViewProfile}>
        {t('person.viewProfile')}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
