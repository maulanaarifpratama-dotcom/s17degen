'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 's17:last-buy-intent';

export function BuyIntentBanner() {
  const [symbol, setSymbol] = useState<string | null>(null);

  useEffect(() => {
    setSymbol(window.localStorage.getItem(STORAGE_KEY));
  }, []);

  if (!symbol) return null;

  function dismiss() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSymbol(null);
  }

  return (
    <div className="border-b border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-cyan-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold">Bought ${symbol}? Connect wallet and Verify Access.</p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-full bg-cyan-200 px-4 py-2 text-xs font-black text-slate-950 hover:bg-cyan-100">
            Verify Access
          </Link>
          <button onClick={dismiss} className="rounded-full border border-cyan-300/40 p-2 text-cyan-100 hover:bg-cyan-300/10" aria-label="Dismiss buy intent banner">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
