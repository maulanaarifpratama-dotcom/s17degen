'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Lock, Unlock } from 'lucide-react';
import type { SdegenToken } from '@/types/token';
import { Badge } from '@/components/ui/Badge';

export function MemeCard({
  token,
  unlocked,
  balance,
  loading,
}: {
  token: SdegenToken;
  unlocked: boolean;
  balance: number;
  loading: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const router = useRouter();

  function rememberBuyIntent() {
    window.localStorage.setItem('s17:last-buy-intent', token.symbol);
  }

  const sdgNumber = token.sdgNumber.toString().padStart(2, '0');
  const cardStyle = {
    background: `radial-gradient(circle at 50% 0%, ${token.accentColor}55, transparent 38%), linear-gradient(135deg, ${token.accentColor}22, #020617 70%)`,
    borderColor: `${token.accentColor}77`,
    boxShadow: `0 22px 65px rgba(2, 6, 23, 0.7)`,
  };

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`Open ${token.symbol} token world`}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a,button')) return;
        router.push(`/tokens/${token.symbol.toLowerCase()}`);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') router.push(`/tokens/${token.symbol.toLowerCase()}`);
      }}
      className="group relative min-h-[650px] cursor-pointer overflow-hidden rounded-[2rem] border p-5 shadow-2xl transition duration-300 hover:z-10 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-[0_0_70px_rgba(34,211,238,0.2)] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus-within:z-10 focus-within:-translate-y-2 focus-within:scale-[1.025]"
      style={cardStyle}
    >
      <div className="absolute left-5 top-4 text-7xl font-black leading-none text-white/15 transition duration-300 group-hover:text-white/25 group-focus-within:text-white/25">
        {sdgNumber}
      </div>
      <div className="relative flex items-start justify-end gap-4">
        <Badge className={unlocked ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-100'}>
          {unlocked ? <Unlock className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
          {loading ? 'Checking' : unlocked ? 'Unlocked' : 'Locked'}
        </Badge>
      </div>

      <div className="relative mt-14 flex flex-col items-center text-center">
        <div
          className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[42%_58%_48%_52%/56%_43%_57%_44%] border border-white/20 p-1 text-8xl shadow-2xl transition duration-300 group-hover:scale-110 group-focus-within:scale-110"
          style={{ backgroundColor: token.accentColor, boxShadow: `0 0 44px ${token.accentColor}66` }}
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit] bg-slate-950/85">
            {!imageFailed ? (
              <Image
                src={token.imagePath}
                alt={`${token.monsterName} monster mascot`}
                width={160}
                height={160}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-125 group-focus-within:scale-125"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="drop-shadow-2xl transition duration-500 group-hover:scale-125 group-focus-within:scale-125">{token.emoji}</span>
            )}
          </div>
        </div>
        <Badge className="mt-4 border-white/20 bg-slate-950/70 text-slate-100 backdrop-blur">
          {token.category}
        </Badge>
        <p className="mt-3 text-xs font-black uppercase tracking-[0.28em]" style={{ color: token.accentColor }}>
          {token.monsterName}
        </p>
        <h3 className="mt-2 text-3xl font-black text-slate-50">${token.symbol}</h3>
        <p className="text-sm font-bold text-slate-300">{token.name}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">SDG {sdgNumber} · {token.sdgName}</p>
      </div>

      <div className="relative mt-5 text-center">
        <p className="text-base font-black text-slate-100">“{token.memeNarrative}”</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">{token.description}</p>
        <p className="mt-3 text-xs text-slate-500">Hover to reveal hidden depth</p>
        <div className="mt-3 min-h-[92px] rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-left opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">Hidden depth</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">{token.acronym}</p>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs backdrop-blur">
        <div>
          <p className="text-slate-500">Required</p>
          <p className="font-black text-slate-100">{token.requiredBalance} ${token.symbol}</p>
        </div>
        <div>
          <p className="text-slate-500">Current</p>
          <p className="font-black text-slate-100">{loading ? '...' : balance.toLocaleString()}</p>
        </div>
      </div>

      <p className="relative mt-5 text-xs font-semibold text-slate-400">Buy on Pump.fun ↗, then return here and Verify Access.</p>
      <div className="relative mt-3 flex flex-col gap-3">
        <a href={token.pumpFunUrl || token.pumpFunLink} target="_blank" rel="noopener noreferrer" onClick={rememberBuyIntent} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:border-fuchsia-400 hover:text-fuchsia-100">
          Buy on Pump.fun <ExternalLink className="h-4 w-4" />
        </a>
        <Link href={`/tokens/${token.symbol.toLowerCase()}`} className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
          {unlocked ? 'Enter World' : 'Verify Access'}
        </Link>
      </div>
    </article>
  );
}
