'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useTokenGating } from '@/hooks/useTokenGating';

type AccessContextValue = ReturnType<typeof useTokenGating>;

const AccessContext = createContext<AccessContextValue | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const access = useTokenGating();
  return <AccessContext.Provider value={access}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess must be used inside AccessProvider');
  }
  return context;
}
