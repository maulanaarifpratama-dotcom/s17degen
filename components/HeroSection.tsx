import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
          <ShieldCheck className="h-4 w-4" /> S17 DEGEN by Impactory
        </div>
        <h1 className="bg-gradient-to-r from-slate-50 via-cyan-200 to-fuchsia-200 bg-clip-text text-5xl font-black leading-tight text-transparent sm:text-7xl">
          17 Ways Your Life is Broken — Pick One
        </h1>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.35em] text-fuchsia-200">Sustainable 17 access experiment</p>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          Meme tokens for real-world problems. Connect wallet, hold your suffering, unlock Impactory.
        </p>
        <p className="mt-3 text-xl font-black text-slate-100 sm:text-2xl">Pick One. Or ignore all. Your call.</p>
        <p className="mt-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-200">Meme outside. Utility inside. SDGs underneath.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="#tokens" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 font-black text-slate-950 shadow-neon transition hover:scale-[1.02]">
            Pick your broken life <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 font-bold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200">
            Verify access
          </Link>
        </div>
      </div>
    </section>
  );
}
