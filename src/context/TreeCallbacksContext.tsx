import { createContext, useContext } from 'react';

interface TreeCallbacksContextValue {
  onSelectPerson: (uuid: string) => void;
  onToggleCollapse: (uuid: string) => void;
}

const TreeCallbacksContext = createContext<TreeCallbacksContextValue | null>(null);

export const TreeCallbacksProvider = TreeCallbacksContext.Provider;

export function useTreeCallbacks(): TreeCallbacksContextValue {
  const ctx = useContext(TreeCallbacksContext);
  if (!ctx) throw new Error('useTreeCallbacks must be used within TreeCallbacksProvider');
  return ctx;
}
