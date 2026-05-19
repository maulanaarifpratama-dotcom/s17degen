'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ExternalLink, Lock, RefreshCw } from 'lucide-react';
import { getTokenBySdg } from '@/constants/tokens';
import { useAccess } from '@/components/AccessProvider';
import { isPlaceholderMint } from '@/lib/solana';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false },
);

function StateShell({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">{children}</div>;
}

export function GatedFeatureContainer({ requiredSdg, children }: { requiredSdg: number; children: ReactNode }) {
  const token = getTokenBySdg(requiredSdg);
  const { connected, loading, error, refresh, isUnlocked } = useAccess();

  function rememberBuyIntent() {
    if (token) window.localStorage.setItem('s17:last-buy-intent', token.symbol);
  }

  if (!token) {
    return <StateShell>Unknown SDG access rule.</StateShell>;
  }

  if (!connected) {
    return (
      <StateShell>
        <p className="mb-4 font-bold text-slate-100">Connect Wallet to Unlock This Feature</p>
        <WalletMultiButton />
      </StateShell>
    );
  }

  if (isPlaceholderMint(token.mintAddress)) {
    return (
      <StateShell>
        <div className="flex items-start gap-3">
          <Lock className="mt-1 h-5 w-5 text-amber-300" />
          <div>
            <p className="font-black text-slate-100">Token mint not configured yet</p>
            <p className="mt-2 text-slate-400">${token.symbol} is an experimental access token placeholder. Add the real Pump.fun mint to enable live access checks.</p>
            <p className="mt-3 text-xs font-semibold text-slate-500">Buy on Pump.fun ↗, then return here and Verify Access.</p>
            <a href={token.pumpFunUrl || token.pumpFunLink} target="_blank" rel="noopener noreferrer" onClick={rememberBuyIntent} className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 font-black text-slate-100 hover:border-cyan-400">
              Pump.fun placeholder <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </StateShell>
    );
  }

  if (loading) {
    return <StateShell><div className="h-24 animate-pulse rounded-xl bg-slate-800/80" /></StateShell>;
  }

  if (error) {
    return (
      <StateShell>
        <p className="font-bold text-red-200">Access check failed: {error}</p>
        <button onClick={refresh} className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-black text-slate-950">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </StateShell>
    );
  }

  if (!isUnlocked(requiredSdg)) {
    return (
      <StateShell>
        <p className="font-black text-slate-100">You don’t hold enough ${token.symbol}. Go to Pump.fun to fix your life.</p>
        <p className="mt-3 text-xs font-semibold text-slate-500">Buy on Pump.fun ↗, then return here and Verify Access.</p>
        <a href={token.pumpFunUrl || token.pumpFunLink} target="_blank" rel="noopener noreferrer" onClick={rememberBuyIntent} className="mt-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/40 px-4 py-2 font-black text-fuchsia-100 hover:bg-fuchsia-400/10">
          Buy on Pump.fun <ExternalLink className="h-4 w-4" />
        </a>
      </StateShell>
    );
  }

  return <>{children}</>;
}
