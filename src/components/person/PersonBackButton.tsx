import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export function PersonBackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className="sticky top-0 z-10 px-4 md:px-8 py-3 border-b border-border flex items-center gap-3 bg-surface-card"
    >
      <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        {t('person.backToTree')}
      </Button>
    </div>
  );
}
