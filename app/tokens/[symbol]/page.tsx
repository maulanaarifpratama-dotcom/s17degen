'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Copy, ExternalLink, Lock, Sparkles, Unlock } from 'lucide-react';
import { SDEGEN_TOKENS } from '@/constants/tokens';
import { useAccess } from '@/components/AccessProvider';
import { Badge } from '@/components/ui/Badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useImpactFeed } from '@/components/ImpactFeedProvider';

const WalletMultiButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, { ssr: false });

const toolNames: Record<string, string> = {
  GAJIKAPAN: 'AI CV Roaster',
  NGIDEA: 'Idea to Pitch Generator',
  BUMIPANAS: 'Carbon Insight Generator',
  AKMIS: 'Survival Plan Generator',
};

const stories: Record<string, { en: string; id: string }> = {
  GAJIKAPAN: { en: 'Work should feel like progress, not an endless waiting room for payday. This world turns career anxiety into clearer words and next actions.', id: 'Kerja seharusnya terasa maju, bukan cuma nunggu gajian. Dunia ini bantu ubah cemas karier jadi kata-kata dan langkah yang lebih jelas.' },
  NGIDEA: { en: 'Ideas are easy to collect and hard to ship. This world helps messy thoughts become a small pitch that can actually move.', id: 'Ide gampang dikumpulkan, susah dieksekusi. Dunia ini bantu pikiran berantakan jadi pitch kecil yang bisa jalan.' },
  BUMIPANAS: { en: 'The planet feels hot, loud, and too big to fix alone. This world makes climate action feel smaller, clearer, and shareable.', id: 'Bumi terasa panas, ribut, dan terlalu besar untuk dibereskan sendiri. Dunia ini bikin aksi iklim terasa lebih kecil, jelas, dan bisa dibagikan.' },
  AKMIS: { en: 'Survival mode is real. This world turns broke energy into a simple plan for the next few steps without pretending life is easy.', id: 'Mode bertahan hidup itu nyata. Dunia ini mengubah energi bokek jadi rencana sederhana untuk langkah berikutnya tanpa pura-pura hidup gampang.' },
};

function toolName(symbol: string) {
  return toolNames[symbol] || `${symbol} Problem-to-Action Generator`;
}

function storyFor(symbol: string) {
  return stories[symbol] || { en: 'Every broken-life monster represents a real-world pressure. This world turns the meme into a tiny, practical reflection tool.', id: 'Setiap monster broken-life mewakili tekanan nyata. Dunia ini mengubah meme jadi alat refleksi kecil yang praktis.' };
}

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function outputFor(symbol: string, input: string) {
  const demoSignal = 'Admin intern, handled reports, made slides, helped team operations, used Excel, coordinated meetings.';
  const isDemo = symbol === 'GAJIKAPAN' && input.trim().length === 0;
  const signal = input.trim() || (symbol === 'GAJIKAPAN' ? demoSignal : 'No context provided yet.');

  if (symbol === 'GAJIKAPAN') {
    const mainLine = pickRandom([
      'Your CV is hiding the good stuff 💀',
      'Your experience has value, but your wording is unemployed.',
      'Recruiters are skimming. Your CV is making them work overtime.',
      'This CV has main-character effort with background-character proof.',
    ]);
    const wrong = pickRandom([
      'It lists activity, but not impact. Busy is not the same as valuable.',
      'The strongest part is probably there, but it is buried under generic wording.',
      'It sounds like a job description, not evidence that you did something well.',
      'The recruiter should not need detective skills to understand your contribution.',
    ]);
    const fix = pickRandom([
      'Rewrite one bullet into: action + measurable result + who benefited.',
      'Add one number, one outcome, and one concrete tool or process you improved.',
      'Replace vague verbs with proof: improved, reduced, shipped, coordinated, analyzed, increased.',
      'Start with the result, then explain the task. Make the value obvious in five seconds.',
    ]);

    return [
      `MAIN LINE: ${mainLine}`,
      `WHAT'S WRONG: ${wrong}`,
      `QUICK FIX: ${fix}`,
      'EXAMPLE: Improved monthly reporting flow, reduced manual work by 30%, and helped the team make faster decisions.',
      'ID: CV kamu bukan jelek. Tapi sinyal bagusnya ketutup. Bikin lebih jelas, lebih terukur, dan lebih gampang dipercaya.',
      `INPUT SIGNAL: ${isDemo ? 'Demo mode used sample CV because you gave no input.' : signal.slice(0, 180)}`,
    ].join('\n');
  }

  const hooks: Record<string, string> = {
    NGIDEA: 'Pitch mode: define the user, the pain, the weird advantage, and the first tiny experiment. If nobody reacts, shrink the idea.',
    BUMIPANAS: 'Carbon insight: pick one repeatable habit, connect it to local climate pressure, and make the next action boring enough to actually do.',
    AKMIS: 'Survival plan: protect food, sleep, cash timing, and one next move. Dignity first. Chaos second.',
  };
  return `${hooks[symbol] || 'Monster read: convert the problem into one tiny action, one honest blocker, and one next step.'}\n\nInput signal: ${signal.slice(0, 180)}`;
}

function feedTextFor(symbol: string, result: string) {
  if (symbol === 'GAJIKAPAN') return result.split('\n')[0]?.replace('MAIN LINE: ', '') || 'Your CV is hiding the good stuff 💀';
  return result;
}

function parseGajikapanResult(result: string) {
  const getValue = (prefix: string) => result.split('\n').find((line) => line.startsWith(prefix))?.replace(prefix, '').trim() || '';
  return {
    mainLine: getValue('MAIN LINE: '),
    wrong: getValue("WHAT'S WRONG: "),
    fix: getValue('QUICK FIX: '),
    example: getValue('EXAMPLE: '),
    id: getValue('ID: '),
    inputSignal: getValue('INPUT SIGNAL: '),
  };
}

function MonsterImage({ token, size = 240 }: { token: (typeof SDEGEN_TOKENS)[number]; size?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex items-center justify-center overflow-hidden rounded-[42%_58%_48%_52%/56%_43%_57%_44%] border border-white/20 p-2 text-8xl shadow-2xl" style={{ width: size, height: size, backgroundColor: token.accentColor, boxShadow: `0 0 80px ${token.accentColor}66` }}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit] bg-slate-950/85">
        {!failed ? <Image src={token.imagePath} alt={`${token.monsterName} mascot`} width={size} height={size} className="h-full w-full object-cover" onError={() => setFailed(true)} priority /> : <span className="text-8xl drop-shadow-2xl">{token.emoji}</span>}
      </div>
    </div>
  );
}

export default function TokenWorldPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = params.symbol?.toUpperCase();
  const token = useMemo(() => SDEGEN_TOKENS.find((item) => item.symbol === symbol), [symbol]);
  const { connected, isUnlocked, loading, refresh } = useAccess();
  const { addUserFeedItem } = useImpactFeed();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hadBuyIntent, setHadBuyIntent] = useState(false);

  useEffect(() => {
    if (!token) return;
    setHadBuyIntent(window.localStorage.getItem('s17:last-buy-intent') === token.symbol);
  }, [token]);

  if (!token) {
    return <main className="min-h-screen bg-slate-950 text-slate-50"><Navbar /><section className="mx-auto max-w-4xl px-4 py-20 text-center"><h1 className="text-4xl font-black">Token world not found</h1><p className="mt-4 text-slate-400">Dunia token tidak ditemukan.</p><Link href="/" className="mt-8 inline-flex rounded-full bg-slate-100 px-5 py-3 font-black text-slate-950">Back home</Link></section></main>;
  }

  const unlocked = isUnlocked(token.sdgNumber);
  const story = storyFor(token.symbol);
  const sdgNumber = token.sdgNumber.toString().padStart(2, '0');
  const gajikapanResult = token.symbol === 'GAJIKAPAN' && result ? parseGajikapanResult(result) : null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setResult('');

    window.setTimeout(() => {
      const nextResult = outputFor(token!.symbol, input);
      setResult(nextResult);
      addUserFeedItem({
        emoji: token!.emoji,
        text: feedTextFor(token!.symbol, nextResult),
        symbol: token!.symbol,
      });
      setCopied(false);
      setIsGenerating(false);
    }, token!.symbol === 'GAJIKAPAN' ? 850 : 0);
  }

  async function copyResult() {
    await navigator.clipboard.writeText(`${token!.monsterName} / $${token!.symbol}\n${result}\n\nS17 DEGEN by Impactory`);
    setCopied(true);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1e1b4b_0%,#020617_42%,#020617_100%)] text-slate-50">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div className="flex justify-center lg:justify-start"><MonsterImage token={token} /></div>
        <div>
          <Badge className="border-white/20 bg-slate-950/70 text-slate-100">SDG {sdgNumber} · {token.sdgName}</Badge>
          <h1 className="mt-5 text-5xl font-black sm:text-7xl">${token.symbol}</h1>
          <p className="mt-2 text-2xl font-black" style={{ color: token.accentColor }}>{token.monsterName}</p>
          <p className="mt-2 text-xl font-bold text-slate-300">{token.name}</p>
          <p className="mt-8 max-w-3xl text-3xl font-black leading-tight text-slate-50">“{token.memeNarrative}”</p>
          <p className="mt-5 max-w-3xl text-slate-400">{token.monsterConcept}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6"><p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Problem Story</p><h2 className="mt-3 text-3xl font-black">What this monster is saying</h2><p className="mt-4 leading-7 text-slate-300">{story.en}</p><p className="mt-4 leading-7 text-slate-500">ID: {story.id}</p></div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6"><p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-300">Impact</p><h2 className="mt-3 text-3xl font-black">SDG-inspired connection</h2><p className="mt-4 leading-7 text-slate-300">This world connects meme identity to {token.sdgName}: a simple way to talk about pressure, behavior, and small action.</p><p className="mt-4 leading-7 text-slate-500">ID: Dunia ini menghubungkan identitas meme dengan {token.sdgName}: cara sederhana untuk membahas tekanan, perilaku, dan aksi kecil.</p></div>
      </div></section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border p-6 shadow-2xl shadow-slate-950/60" style={{ borderColor: `${token.accentColor}77`, background: `linear-gradient(135deg, ${token.accentColor}22, #020617 75%)` }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">AI Tool</p><h2 className="mt-2 text-3xl font-black">{toolName(token.symbol)}</h2><p className="mt-2 text-slate-400">EN: Turn your chaos into a shareable action card.</p><p className="text-slate-500">ID: Ubah chaos kamu jadi kartu aksi yang bisa dibagikan.</p></div><Badge className={unlocked ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-100'}>{unlocked ? <Unlock className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}{loading ? 'Checking' : unlocked ? 'Unlocked' : 'Locked'}</Badge></div>
          {!connected || !unlocked ? <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">{token.symbol === 'GAJIKAPAN' ? <p className="mb-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">Already bought $GAJIKAPAN? Connect your wallet and verify access below.</p> : null}<p className="font-black text-slate-100">Connect wallet to unlock</p><p className="mt-2 text-sm text-slate-400">ID: Hubungkan wallet dan verifikasi kepemilikan token untuk membuka alat ini.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row">{!connected ? <WalletMultiButton /> : null}<button onClick={refresh} className="rounded-full border border-slate-700 px-5 py-3 text-sm font-black text-slate-100 hover:border-cyan-400">Verify Access</button></div></div> : <form onSubmit={submit} className="mt-8 space-y-5"><textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-36 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300" placeholder={token.symbol === 'GAJIKAPAN' ? 'Paste your CV bullet points, LinkedIn summary, or messy work experience...' : `Tell ${token.monsterName} what is broken today... / Ceritakan chaos kamu hari ini...`} /><div className="flex flex-col gap-3 sm:flex-row"><button type="submit" disabled={isGenerating} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-3 font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70"><Sparkles className="h-4 w-4" /> {isGenerating ? 'Roasting gently...' : token.symbol === 'GAJIKAPAN' ? 'Roast My CV' : 'Generate Card'}</button>{token.symbol === 'GAJIKAPAN' && result ? <button type="submit" disabled={isGenerating} className="rounded-full border border-slate-700 px-6 py-3 font-black text-slate-100 hover:border-cyan-400 disabled:cursor-wait disabled:opacity-70">Generate Again</button> : null}</div>{isGenerating ? <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm font-bold text-amber-100">Reading your career chaos... finding weak bullets... preparing a useful roast. / Lagi baca chaos karier kamu...</p> : null}</form>}
          {result ? <div className={token.symbol === 'GAJIKAPAN' ? 'mt-8 overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950 shadow-2xl shadow-slate-950/70' : 'mt-8 rounded-[1.5rem] border border-white/15 bg-slate-950 p-5'}><div className={token.symbol === 'GAJIKAPAN' ? 'p-5' : ''}><div className="flex items-center gap-4"><MonsterImage token={token} size={84} /><div><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">Shareable Result</p><p className="text-2xl font-black text-slate-50">${token.symbol}</p></div></div>{token.symbol === 'GAJIKAPAN' && gajikapanResult ? <div className="mt-5 rounded-[1.75rem] border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-5 text-center" style={{ borderColor: `${token.accentColor}77`, boxShadow: `0 0 48px ${token.accentColor}33` }}><p className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: token.accentColor }}>$GAJIKAPAN CV Verdict</p><h3 className="mx-auto mt-4 max-w-2xl text-3xl font-black leading-tight text-slate-50">{gajikapanResult.mainLine}</h3><div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" /><div className="grid gap-4 text-left md:grid-cols-2"><div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4"><p className="text-sm font-black uppercase tracking-[0.2em] text-rose-200">What’s wrong</p><p className="mt-3 leading-7 text-slate-200">{gajikapanResult.wrong}</p></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Quick fix</p><p className="mt-3 leading-7 text-slate-200">{gajikapanResult.fix}</p></div></div><div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-left"><p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Better bullet</p><p className="mt-3 leading-7 text-slate-200">{gajikapanResult.example}</p></div><p className="mt-4 text-sm leading-6 text-slate-500">ID: {gajikapanResult.id}</p><p className="mt-4 text-xs font-bold text-slate-600">{gajikapanResult.inputSignal}</p><p className="mt-5 text-sm font-black text-amber-200">Another CV rescued 🫡</p></div> : <p className="mt-5 whitespace-pre-line rounded-2xl bg-slate-900/80 p-4 leading-7 text-slate-200">{result}</p>}<div className="mt-5 flex flex-col gap-3 sm:items-center sm:justify-between"><p className="text-sm font-black text-slate-400">S17 DEGEN by Impactory</p>{token.symbol === 'GAJIKAPAN' ? <p className="text-sm text-slate-500">Would you share this? Don’t worry, we won’t tell them it was you.</p> : null}<div className="flex flex-col gap-3 sm:flex-row"><button onClick={copyResult} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-cyan-400"><Copy className="h-4 w-4" /> {copied ? 'Copied' : token.symbol === 'GAJIKAPAN' ? 'Copy Result' : 'Copy'}</button>{token.symbol === 'GAJIKAPAN' ? <button onClick={() => { const fakeEvent = { preventDefault() {} } as FormEvent<HTMLFormElement>; submit(fakeEvent); }} disabled={isGenerating} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70">Generate Again 🔥</button> : null}</div></div></div></div> : null}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <p className="text-lg font-black text-slate-50">How it works</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm font-bold text-slate-300">
              <li>Buy ${token.symbol} on Pump.fun</li>
              <li>Come back here</li>
              <li>Connect wallet to unlock</li>
            </ol>
            <p className="mt-4 text-sm leading-6 text-slate-500">ID: Beli ${token.symbol} di Pump.fun, kembali ke halaman ini, lalu hubungkan wallet untuk membuka akses.</p>
          </div>

          {hadBuyIntent ? <p className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm font-bold text-amber-100">Welcome back 👋 Did you buy ${token.symbol}?</p> : null}
          {connected ? <p className="mb-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm font-bold text-emerald-100">Wallet connected ✅<br />Checking your token...</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={token.pumpFunUrl || token.pumpFunLink} target="_blank" rel="noopener noreferrer" onClick={() => { window.localStorage.setItem('s17:last-buy-intent', token.symbol); setHadBuyIntent(true); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-fuchsia-400/40 px-5 py-3 text-center font-black text-fuchsia-100 hover:bg-fuchsia-400/10">
              <span>Buy on Pump.fun ↗<br /><span className="text-xs font-bold text-fuchsia-200/70">Then come back and unlock</span></span> <ExternalLink className="h-4 w-4" />
            </a>
            <button onClick={refresh} className="flex-1 rounded-full bg-slate-100 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200">Verify Access</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
