'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type ImpactFeedType = 'AI Insight' | 'User-generated output' | 'System update' | 'Meme observation' | 'Tool preview';

export type ImpactFeedItem = {
  id: string;
  emoji: string;
  text: string;
  symbol: string;
  type: ImpactFeedType;
  attribution: string;
  isNew?: boolean;
};

type ImpactFeedContextValue = {
  userItems: ImpactFeedItem[];
  addUserFeedItem: (item: Omit<ImpactFeedItem, 'id' | 'isNew' | 'type' | 'attribution'> & { type?: ImpactFeedType }) => void;
};

const ImpactFeedContext = createContext<ImpactFeedContextValue | null>(null);

function shorten(text: string) {
  const firstLine = text.replace(/\s+/g, ' ').trim().split(/[.!?]/)[0] || 'Fresh chaos detected';
  return firstLine.length > 92 ? `${firstLine.slice(0, 89)}...` : firstLine;
}

export function ImpactFeedProvider({ children }: { children: ReactNode }) {
  const [userItems, setUserItems] = useState<ImpactFeedItem[]>([]);

  const addUserFeedItem = useCallback<ImpactFeedContextValue['addUserFeedItem']>((item) => {
    const nextItem: ImpactFeedItem = {
      id: `${item.symbol}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      emoji: item.emoji,
      text: shorten(item.text),
      symbol: item.symbol,
      type: item.type || 'User-generated output',
      attribution: `User-generated via $${item.symbol}`,
      isNew: true,
    };

    setUserItems((current) => [nextItem, ...current].slice(0, 20));
  }, []);

  const value = useMemo(() => ({ userItems, addUserFeedItem }), [userItems, addUserFeedItem]);

  return <ImpactFeedContext.Provider value={value}>{children}</ImpactFeedContext.Provider>;
}

export function useImpactFeed() {
  const context = useContext(ImpactFeedContext);
  if (!context) throw new Error('useImpactFeed must be used inside ImpactFeedProvider');
  return context;
}
