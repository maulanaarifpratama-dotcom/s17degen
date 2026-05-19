'use client';

import { Wallet, WandSparkles } from 'lucide-react';
import { BuyIntentBanner } from '@/components/BuyIntentBanner';
import { Navbar } from '@/components/Navbar';
import { FeatureCard } from '@/components/FeatureCard';
import { GatedFeatureContainer } from '@/components/GatedFeatureContainer';
import { useAccess } from '@/components/AccessProvider';

function PremiumMock({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
      <div className="mb-3 flex items-center gap-2 font-black text-cyan-100">
        <WandSparkles className="h-4 w-4" /> Mock premium output
      </div>
      <ul className="space-y-2 text-sm text-slate-300">
        {lines.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  const { connected, publicKey, unlockedSdgNumbers, loading, error, refresh } = useAccess();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#312e81_0%,#020617_35%,#020617_100%)] text-slate-50">
      <Navbar />
      <BuyIntentBanner />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">S17 DEGEN by Impactory</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">Dashboard</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Protected-style UI without route blocking. Connect wallet, verify SPL token balances, and unlock the tools your meme key allows.</p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-3 flex items-center gap-2 text-slate-300"><Wallet className="h-5 w-5" /> Wallet status</div>
            <p className="font-black text-slate-50">{connected ? 'Connected' : 'Disconnected'}</p>
            <p className="mt-2 break-all text-xs text-slate-500">{publicKey ? publicKey.toBase58() : 'Connect wallet to verify access.'}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="mb-3 text-slate-300">Unlocked SDG features</p>
            <p className="text-4xl font-black text-cyan-200">{unlockedSdgNumbers.length}/17</p>
            <p className="mt-2 text-xs text-slate-500">Live count updates after token mints are configured.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="mb-3 text-slate-300">Access check</p>
            <p className="font-black text-slate-50">{loading ? 'Checking balances…' : error ? 'Needs retry' : 'Ready'}</p>
            <button onClick={refresh} className="mt-4 rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-cyan-400">Refresh</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <FeatureCard title="Eco-Carbon Offset Calculator" description="SDG 13 Climate Action Tool. Requires BUMIPANAS access.">
            <GatedFeatureContainer requiredSdg={13}>
              <PremiumMock lines={['Estimate a mock lifestyle carbon signal.', 'Turn climate anxiety into action prompts.', 'Generate a meme-native climate story card.']} />
            </GatedFeatureContainer>
          </FeatureCard>
          <FeatureCard title="DeGen CV / Resume Roaster" description="SDG 8 Decent Work Tool. Requires GAJIKAPAN access.">
            <GatedFeatureContainer requiredSdg={8}>
              <PremiumMock lines={['Roast vague resume bullets.', 'Rewrite work chaos into credible outcomes.', 'Create a playful job-readiness checklist.']} />
            </GatedFeatureContainer>
          </FeatureCard>
          <FeatureCard title="Idea-to-Pitch Generator" description="SDG 9 Innovation Tool. Requires NGIDEA access.">
            <GatedFeatureContainer requiredSdg={9}>
              <PremiumMock lines={['Structure chaotic ideas into problem/solution/value.', 'Draft a one-page early pitch.', 'Map infrastructure and innovation assumptions.']} />
            </GatedFeatureContainer>
          </FeatureCard>
        </div>
      </section>
    </main>
  );
}
