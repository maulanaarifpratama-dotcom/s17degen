'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false },
);

const sdgStripColors = [
  '#E5243B',
  '#DDA63A',
  '#4C9F38',
  '#C5192D',
  '#FF3A21',
  '#26BDE2',
  '#FCC30B',
  '#A21942',
  '#FD6925',
  '#DD1367',
  '#FD9D24',
  '#BF8B2E',
  '#3F7E44',
  '#0A97D9',
  '#56C02B',
  '#00689D',
  '#19486A',
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight text-slate-50">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_35%_25%,#f8fafc_0_12%,#26BDE2_13%_42%,#19486A_43%_100%)] text-slate-950 shadow-neon">
            <Zap className="h-5 w-5" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-lg">S17 DEGEN</span>
            <span className="mt-1 flex h-1 w-28 overflow-hidden rounded-full" aria-hidden="true">
              {sdgStripColors.map((color, index) => (
                <span key={`${color}-${index}`} className="h-full flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">by Impactory</span>
          </span>
          <span className="text-lg sm:hidden">S17</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/transparency" className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200 md:inline-flex">
            Transparency
          </Link>
          <Link href="/dashboard" className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200 sm:inline-flex">
            Dashboard
          </Link>
          <WalletMultiButton />
        </div>
      </nav>
    </header>
  );
}
