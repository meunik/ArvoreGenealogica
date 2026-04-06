import { useCallback, useState } from 'react';

export function useExpandCollapse() {
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((personUuid: string) => {
    setCollapsedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(personUuid)) {
        next.delete(personUuid);
      } else {
        next.add(personUuid);
      }
      return next;
    });
  }, []);

  const isCollapsed = useCallback(
    (personUuid: string) => collapsedNodeIds.has(personUuid),
    [collapsedNodeIds],
  );

  return { collapsedNodeIds, toggle, isCollapsed };
}
