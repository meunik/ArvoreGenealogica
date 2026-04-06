import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { t } = useTranslation();

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 border-b"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 12px var(--node-shadow)' }}
        >
          {/* Tree icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 22V12" />
            <path d="M12 12L8 8" />
            <path d="M12 12L16 8" />
            <path d="M8 8L4 4" />
            <path d="M8 8L12 4" />
            <path d="M16 8L12 4" />
            <path d="M16 8L20 4" />
          </svg>
        </div>
        <h1
          className="text-sm font-bold tracking-tight hidden sm:block"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('appTitle')}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
