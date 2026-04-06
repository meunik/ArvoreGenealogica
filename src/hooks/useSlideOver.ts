import { useCallback, useState } from 'react';

interface SlideOverState {
  isOpen: boolean;
  selectedPersonId: string | null;
}

export function useSlideOver() {
  const [state, setState] = useState<SlideOverState>({
    isOpen: false,
    selectedPersonId: null,
  });

  const open = useCallback((personUuid: string) => {
    setState({ isOpen: true, selectedPersonId: personUuid });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    isOpen: state.isOpen,
    selectedPersonId: state.selectedPersonId,
    open,
    close,
  };
}
