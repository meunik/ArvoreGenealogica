import { useEffect, useRef } from 'react';
import { SlideOverBackdrop } from './SlideOverBackdrop';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SlideOver({ isOpen, onClose, children }: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <SlideOverBackdrop isOpen={isOpen} onClose={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full z-50 flex flex-col w-full sm:w-100 md:w-105 transition-transform duration-300 ease-in-out bg-surface-card border-l border-border shadow-panel ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-surface-elevated active:scale-90 text-muted"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {children}
      </div>
    </>
  );
}
