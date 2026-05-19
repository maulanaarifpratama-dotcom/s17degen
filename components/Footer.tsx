import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/60 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="text-2xl font-black text-slate-50">S17 DEGEN</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">by Impactory</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
              Formal name: Sustainable 17: Digital Engagement for Global Empowerment Network.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
              S17 DEGEN tokens are experimental meme-based access tokens. They are not investment products or promises of profit.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Pump.fun purchases open externally. S17 DEGEN only verifies token ownership via read-only Solana RPC.
            </p>
            <p className="mt-6 text-xs text-slate-600">© 2026 Impactory. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-cyan-400">
              Dashboard
            </Link>
            <Link href="/transparency" className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-fuchsia-400">
              Transparency
            </Link>
            <Link href="/transparency" className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-amber-300">
              Terms of Service
            </Link>
            <Link href="/transparency" className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-emerald-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
