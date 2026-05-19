'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { SDEGEN_TOKENS } from '@/constants/tokens';
import { useAccess } from '@/components/AccessProvider';
import { MemeCard } from '@/components/MemeCard';
import { Badge } from '@/components/ui/Badge';
import { useImpactFeed } from '@/components/ImpactFeedProvider';
import type { SdegenToken } from '@/types/token';

const topToolSymbols = ['GAJIKAPAN', 'NGIDEA', 'BUMIPANAS', 'AKMIS'];

const progressItems = [
  { label: 'Access verification', id: 'Verifikasi akses', value: 85 },
  { label: 'Core AI tools', id: 'Alat AI utama', value: 55 },
  { label: 'Full monster worlds', id: 'Dunia monster penuh', value: 40 },
  { label: 'Impact mode', id: 'Mode dampak', value: 20 },
];

const impactFeedItems = [
  { emoji: '💼', text: 'Your CV is holding you back 💀', symbol: 'GAJIKAPAN', type: 'AI insight' },
  { emoji: '💸', text: 'Living costs rising again lol', symbol: 'AKMIS', type: 'Meme observation' },
  { emoji: '🔥', text: 'Planet is cooking faster than expected🔥', symbol: 'BUMIPANAS', type: 'AI insight' },
  { emoji: '🤖', text: 'Your idea needs one user, not ten buzzwords.', symbol: 'NGIDEA', type: 'Tool preview' },
  { emoji: '🍚', text: 'Food stress is a system signal, not a personal failure.', symbol: 'NASINANGIS', type: 'AI insight' },
  { emoji: '💊', text: 'Burnout check: your body has entered buffering mode.', symbol: 'SEHATGA', type: 'Tool preview' },
  { emoji: '🔌', text: 'No power, no productivity. Simple math.', symbol: 'LAMPUMATI', type: 'Meme observation' },
  { emoji: '⚖️', text: 'The scale is tilted and everyone noticed.', symbol: 'GAKADIL', type: 'Meme observation' },
  { emoji: '🏚️', text: 'Hot room, broken fan, urban boss fight.', symbol: 'RUMAHPANAS', type: 'Tool preview' },
  { emoji: '🛍️', text: 'Checkout gremlin says maybe pause before buying again.', symbol: 'BELILAGI', type: 'AI insight' },
  { emoji: '🐟', text: 'The fish packed a suitcase. Ocean update not great.', symbol: 'IKANMINGGIR', type: 'Meme observation' },
  { emoji: '🌲', text: 'One last leaf is not a forest strategy.', symbol: 'HUTANHILANG', type: 'AI insight' },
  { emoji: '🚔', text: 'Civic literacy should not feel like a jumpscare.', symbol: 'DIPERIKSA', type: 'Tool preview' },
  { emoji: '🤝', text: 'Chaos alone is noise. Chaos together becomes a plan.', symbol: 'BARBARGA', type: 'AI insight' },
];

const milestones = [
  ['ACCESS', 'Wallet connect, token checks, and protected-style UI.', 'Wallet, cek token, dan UI akses.'],
  ['CORE AI TOOLS', 'Four flagship tools become playable.', 'Empat alat utama mulai bisa dicoba.'],
  ['FULL TOOLSET', 'All 17 token worlds get dedicated utilities.', 'Semua 17 dunia token punya utilitas masing-masing.'],
  ['IMPACT MODE', 'Turn usage into clearer impact stories.', 'Ubah penggunaan jadi cerita dampak yang lebih jelas.'],
];

const sections: Array<{ category: SdegenToken['category']; description: string; gridClassName: string }> = [
  {
    category: 'SURVIVAL',
    description: 'Basic life support, but make it token-gated.',
    gridClassName: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
  },
  {
    category: 'WORK & BUILD',
    description: 'Because ideas, income, and electricity are apparently optional.',
    gridClassName: 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto',
  },
  {
    category: 'SOCIETY',
    description: 'Systems are weird. People are tired. We made monsters.',
    gridClassName: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  },
  {
    category: 'PLANET',
    description: 'The planet is cooking and everybody is still scrolling.',
    gridClassName: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  },
];

function chooseQuickToken(input: string) {
  const value = input.toLowerCase();
  if (value.includes('cv') || value.includes('resume') || value.includes('job') || value.includes('kerja')) return SDEGEN_TOKENS.find((token) => token.symbol === 'GAJIKAPAN')!;
  if (value.includes('idea') || value.includes('pitch') || value.includes('startup') || value.includes('ide')) return SDEGEN_TOKENS.find((token) => token.symbol === 'NGIDEA')!;
  if (value.includes('carbon') || value.includes('climate') || value.includes('planet') || value.includes('bumi')) return SDEGEN_TOKENS.find((token) => token.symbol === 'BUMIPANAS')!;
  return SDEGEN_TOKENS.find((token) => token.symbol === 'AKMIS')!;
}

function quickOutput(symbol: string, input: string) {
  const hasInput = input.trim().length > 0;
  const fallback = hasInput ? '' : 'Chaos detected. ';
  const outputs: Record<string, string> = {
    GAJIKAPAN: `${fallback}Your CV is confusing and weak 💀`,
    NGIDEA: `${fallback}Your idea has vibes, but no landing page yet.`,
    BUMIPANAS: `${fallback}Planet overheating, but your next action can be smaller.`,
    AKMIS: `${fallback}Survival mode says: fix food, sleep, and cash timing first.`,
  };
  return outputs[symbol] || `${fallback}This problem needs one tiny next move.`;
}

export function TokenGrid() {
  const { isUnlocked, getTokenBalance, loading } = useAccess();
  const { userItems, addUserFeedItem } = useImpactFeed();
  const [feedItems, setFeedItems] = useState(impactFeedItems);
  const [quickInput, setQuickInput] = useState('');
  const [feedVisible, setFeedVisible] = useState(false);
  const [hasSeenFeed, setHasSeenFeed] = useState(false);
  const feedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setFeedItems([...impactFeedItems].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    const target = feedRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFeedVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasSeenFeed(true);
      },
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visibleFeedItems = useMemo(() => {
    const normalizedStatic = feedItems.map((item) => ({
      ...item,
      id: `${item.symbol}-${item.text}`,
      attribution: `Generated by $${item.symbol}`,
      isNew: false,
    }));

    if (userItems.length === 0) return normalizedStatic.slice(0, 3);
    return [...userItems, ...normalizedStatic].slice(0, 18);
  }, [feedItems, userItems]);

  function submitQuickGenerator() {
    const token = chooseQuickToken(quickInput);
    addUserFeedItem({
      emoji: token.emoji,
      text: quickOutput(token.symbol, quickInput),
      symbol: token.symbol,
    });
    setQuickInput('');
    window.setTimeout(() => feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  return (
    <>
      <section id="tokens" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Original broken-life monster collection</p>
          <h2 className="mt-3 text-3xl font-black text-slate-50 sm:text-5xl">1 Token = 1 Monster = 1 Access Key.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Meet 17 original cute meme monster mascots. Each one maps to an SDG-inspired color, a broken life problem, and an experimental S17 DEGEN access route.
          </p>
        </div>

        <div className="space-y-20">
          {sections.map((section) => {
            const tokens = SDEGEN_TOKENS.filter((token) => token.category === section.category);

            return (
              <section key={section.category} aria-labelledby={`${section.category}-collection`} className="relative">
                <div className="mb-8 flex flex-col gap-3 border-l-4 border-cyan-300/70 pl-5">
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">{section.category}</p>
                  <h3 id={`${section.category}-collection`} className="text-2xl font-black text-slate-50 sm:text-4xl">
                    {section.description}
                  </h3>
                </div>
                <div className={`grid gap-8 ${section.gridClassName}`}>
                  {tokens.map((token) => (
                    <MemeCard
                      key={token.id}
                      token={token}
                      unlocked={isUnlocked(token.sdgNumber)}
                      balance={getTokenBalance(token.mintAddress)}
                      loading={loading}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-300">AI Tools Arcade</p>
          <h2 className="mt-3 text-3xl font-black text-slate-50 sm:text-5xl">Playable product tools, not price charts.</h2>
          <p className="mt-4 text-slate-400">EN: Start with the flagship token worlds. ID: Mulai dari dunia token dengan alat utama.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topToolSymbols.map((symbol) => {
            const token = SDEGEN_TOKENS.find((item) => item.symbol === symbol)!;
            const unlocked = isUnlocked(token.sdgNumber);
            return (
              <Link key={symbol} href={`/tokens/${symbol.toLowerCase()}`} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-slate-50">${symbol}</p>
                    <p className="mt-1 text-sm font-bold text-slate-400">{token.featureTitle}</p>
                  </div>
                  <Badge className={unlocked ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-100'}>
                    {loading ? 'Checking' : unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">EN: Click to enter the tool world. ID: Klik untuk masuk ke dunia alat.</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section ref={feedRef} id="impact-feed" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Impact Feed</p>
          <h2 className="mt-3 text-4xl font-black text-slate-50 sm:text-5xl">Real world chaos, AI-filtered.</h2>
          <p className="mt-4 text-slate-400">EN: AI insights, tool result previews, and meme observations from the monster worlds. ID: Insight AI, cuplikan hasil tool, dan observasi meme dari dunia monster.</p>
        </div>

        <div className="mb-6 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="font-black text-slate-100">Try something quick</p>
          <p className="mt-1 text-sm text-slate-400">ID: Coba cepat — tempel CV, ide, atau situasi kamu.</p>
          <textarea
            value={quickInput}
            onChange={(event) => setQuickInput(event.target.value)}
            className="mt-4 min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300"
            placeholder="Paste your CV / idea / situation..."
          />
          <button onClick={submitQuickGenerator} className="mt-4 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200">
            Generate
          </button>
        </div>

        <div className="space-y-4">
          {visibleFeedItems.map((item, index) => {
            const token = SDEGEN_TOKENS.find((entry) => entry.symbol === item.symbol)!;
            return (
              <article key={item.id} className={`animate-feed-in rounded-[1.5rem] border bg-slate-950/75 p-4 shadow-2xl transition hover:-translate-y-1 ${item.isNew ? 'ring-1 ring-cyan-300/50' : ''}`} style={{ borderColor: `${token.accentColor}66`, boxShadow: `0 0 ${item.isNew ? 44 : index < 4 ? 34 : 18}px ${token.accentColor}${item.isNew ? '44' : '22'}` }}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `${token.accentColor}22` }}>{item.emoji}</div>
                    <div>
                      <Badge className="border-white/10 bg-white/5 text-slate-300">{item.type}</Badge>
                      <p className="mt-2 text-lg font-black leading-snug text-slate-100">{item.text}</p>
                      <p className="mt-1 text-sm font-bold" style={{ color: token.accentColor }}>{item.attribution}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:justify-end">
                    <Link href={`/tokens/${item.symbol.toLowerCase()}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200">Use Tool</Link>
                    <Link href={`/tokens/${item.symbol.toLowerCase()}`} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-cyan-300">View Token</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {hasSeenFeed && !feedVisible ? (
        <button onClick={() => feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="fixed bottom-5 right-5 z-50 rounded-full border border-cyan-300/40 bg-slate-950/90 px-5 py-3 text-sm font-black text-cyan-100 shadow-2xl shadow-cyan-950/50 backdrop-blur hover:bg-cyan-300/10">
          New chaos available 🔥
        </button>
      ) : null}

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Impact Progress</p>
          <h2 className="mt-3 text-3xl font-black text-slate-50">Tool development progress</h2>
          <p className="mt-3 text-sm font-bold text-amber-200">This is not a price chart.<br />This shows real development progress.</p>
          <p className="mt-2 text-sm text-slate-500">ID: Ini bukan grafik harga. Ini menunjukkan progres pengembangan alat.</p>
          <div className="mt-6 space-y-5">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm"><span className="font-bold text-slate-200">{item.label}</span><span className="text-slate-500">{item.value}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400" style={{ width: `${item.value}%` }} /></div>
                <p className="mt-1 text-xs text-slate-500">ID: {item.id}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-300">Milestones</p>
          <h2 className="mt-3 text-3xl font-black text-slate-50">Simple roadmap</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {milestones.map(([phase, en, id], index) => (
            <div key={phase} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Phase {index + 1}</p>
              <p className="mt-2 font-black text-slate-100">{phase}</p>
              <p className="mt-3 text-sm text-slate-400">EN: {en}</p>
              <p className="mt-1 text-sm text-slate-500">ID: {id}</p>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
