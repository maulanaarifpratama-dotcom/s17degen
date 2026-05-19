import Link from 'next/link';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const whatItIs = [
  'A meme-driven Web3 access layer for experimental Impactory experiences.',
  'A Solana wallet-based identity and token-balance verification surface.',
  'An SDG narrative experiment disguised as meme culture.',
  'A Web2.5 app that uses read-only RPC checks to verify SPL token access.',
];

const whatItIsNot = [
  'Not a financial product.',
  'Not an investment contract or promise of profit.',
  'Not a donation platform, crowdfunding platform, DeFi protocol, or DAO governance system.',
  'Not a custodial wallet, broker, exchange, or in-app trading venue.',
];

const safety = [
  'S17 DEGEN does not custody user funds.',
  'S17 DEGEN never requests seed phrases or private keys.',
  'Wallet connection is used only for read-only token balance verification.',
  'Pump.fun is an external token purchase surface. Links open in a new tab.',
  'The app does not iframe Pump.fun, embed Pump.fun, or provide in-app trading.',
];

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
      <h2 className="text-2xl font-black text-slate-50">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1e1b4b_0%,#020617_42%,#020617_100%)] text-slate-50">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
            <ShieldCheck className="h-4 w-4" /> S17 DEGEN by Impactory
          </div>
          <h1 className="text-4xl font-black sm:text-6xl">Transparency</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            S17 DEGEN stands for Sustainable 17: Digital Engagement for Global Empowerment Network. It is an experimental meme-based access layer for Impactory, built around the tagline “17 Ways Your Life is Broken — Pick One”.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ListCard title="What S17 DEGEN is" items={whatItIs} />
          <ListCard title="What S17 DEGEN is not" items={whatItIsNot} />
        </div>

        <div className="mt-6 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 shadow-2xl shadow-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-200" />
            <div>
              <h2 className="text-2xl font-black text-amber-50">No financial promise</h2>
              <p className="mt-3 leading-7 text-amber-50/90">
                S17 DEGEN tokens are experimental access tokens. There is no investment promise, no profit guarantee, no yield promise, and no expectation of financial return created by this app. The experience is not framed as donation or crowdfunding.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ListCard title="Wallet, custody, and Pump.fun safety" items={safety} />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-slate-100 px-5 py-3 text-center font-black text-slate-950 hover:bg-cyan-200">
            Back to tokens
          </Link>
          <a href="https://pump.fun" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-5 py-3 font-black text-slate-100 hover:border-fuchsia-400">
            Pump.fun opens externally <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
