interface SlideOverBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideOverBackdrop({ isOpen, onClose }: SlideOverBackdropProps) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 bg-black/50 ${isOpen ? 'opacity-100 pointer-events-auto backdrop-blur-[2px]' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
