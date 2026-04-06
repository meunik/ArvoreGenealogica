import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'pt-BR', label: 'PT' },
  { code: 'en',   label: 'EN' },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div
      className="flex rounded-xl overflow-hidden border"
      style={{ borderColor: 'var(--border)' }}
    >
      {LANGUAGES.map(lang => {
        const isActive = current === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="px-2.5 py-1 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-muted)',
            }}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
