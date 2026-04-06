import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <Header />
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
