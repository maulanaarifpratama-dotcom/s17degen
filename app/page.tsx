import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { BuyIntentBanner } from '@/components/BuyIntentBanner';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { TokenGrid } from '@/components/TokenGrid';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#020617_38%,#020617_100%)] text-slate-50">
      <Navbar />
      <BuyIntentBanner />
      <HeroSection />
      <TokenGrid />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/50">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-300">Why this exists</p>
            <h2 className="mt-3 text-3xl font-black">Meme-native outside. Utility layer underneath.</h2>
            <p className="mt-4 leading-7 text-slate-400">
              S17 DEGEN by Impactory turns SDG narratives into chaotic, shareable meme access keys. The meme is the door, the wallet is identity, the token is the key, and Impactory is the utility.
            </p>
            <p className="mt-4 text-sm font-bold text-cyan-200">
              Formal name: Sustainable 17: Digital Engagement for Global Empowerment Network.
            </p>
            <Link href="/transparency" className="mt-5 inline-flex rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-cyan-400">
              Read Transparency
            </Link>
          </div>
          <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 shadow-2xl shadow-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-200" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Disclaimer</p>
                <p className="mt-3 leading-7 text-amber-50/90">
                  S17 DEGEN tokens are experimental meme-based access tokens. They are not financial products, investment contracts, or promises of profit. Token ownership may unlock platform features, community access, or experimental digital experiences. Participate responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
