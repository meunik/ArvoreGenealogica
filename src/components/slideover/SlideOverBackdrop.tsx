interface SlideOverBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideOverBackdrop({ isOpen, onClose }: SlideOverBackdropProps) {
  return (
    <div
      className="fixed inset-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        backdropFilter: isOpen ? 'blur(2px)' : 'none',
      }}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
