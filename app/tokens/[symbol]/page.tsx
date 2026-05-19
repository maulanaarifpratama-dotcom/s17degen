'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Copy, Download, ExternalLink, Lock, Sparkles, Unlock } from 'lucide-react';
import { SDEGEN_TOKENS } from '@/constants/tokens';
import { useAccess } from '@/components/AccessProvider';
import { Badge } from '@/components/ui/Badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useImpactFeed } from '@/components/ImpactFeedProvider';
import { toPng } from 'html-to-image';

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

function getNumbers(input: string) {
  return [...input.matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => Number(match[0].replace(',', '.'))).filter(Number.isFinite);
}

type GajikapanStyle = 'savage' | 'mentor' | 'analytical' | 'encouraging';

let lastGajikapanHeadline = '';

const gajikapanHeadlines: Record<GajikapanStyle, string[]> = {
  savage: [
    'Your CV is doing unpaid labor hiding your actual value 💀',
    'Your experience has value, but your wording is unemployed.',
    'This CV has main-character effort with background-character proof.',
  ],
  mentor: [
    'You have the raw material; now make the impact obvious.',
    'Your work sounds useful — it just needs recruiter-friendly evidence.',
    'The story is there. The proof needs a louder microphone.',
  ],
  analytical: [
    'Your CV has activity signals, but weak outcome signals.',
    'Recruiters are skimming for proof; your CV is giving them fog.',
    'The gap is not effort. The gap is clarity plus measurable evidence.',
  ],
  encouraging: [
    'You are closer than you think — the bullet just needs sharper proof.',
    'This is fixable. Your CV needs receipts, not a personality transplant.',
    'Your experience can land better if the value shows up faster.',
  ],
};

const gajikapanQuickFixes: Record<GajikapanStyle, string[]> = {
  savage: [
    'Rewrite one bullet as result first, task second. Busy is not the same as valuable.',
    'Delete one vague sentence and replace it with a number, outcome, or tool. No proof, no mercy.',
  ],
  mentor: [
    'Use action + measurable result + who benefited, then keep the sentence calm and clear.',
    'Pick your strongest task and turn it into a before/after improvement story.',
  ],
  analytical: [
    'Add metric, scope, tool, and outcome so the recruiter can verify the signal quickly.',
    'Convert responsibility language into evidence language: what changed, by how much, for whom.',
  ],
  encouraging: [
    'Start with one bullet. Add one number or concrete result and you instantly look more credible.',
    'Make the value obvious in five seconds; your future self deserves that upgrade.',
  ],
};

function pickGajikapanHeadline(style: GajikapanStyle) {
  const candidates = gajikapanHeadlines[style].filter((headline) => headline !== lastGajikapanHeadline);
  const headline = pickRandom(candidates.length > 0 ? candidates : gajikapanHeadlines[style]);
  lastGajikapanHeadline = headline;
  return headline;
}

function getGajikapanContext(signal: string) {
  if (/ads|marketing|campaign|meta|google|performance/i.test(signal)) {
    return {
      wrong: 'You mention marketing work, but not spend, CTR, leads, CAC, ROAS, or conversion impact.',
      fix: 'Anchor the bullet around campaign goal + channel + metric movement.',
      example: 'Optimized Meta Ads campaign, improved CTR by 18%, and reduced cost per lead by 22% across weekly tests.',
    };
  }

  if (/engineer|developer|frontend|backend|fullstack|software|code|api|react|next/i.test(signal)) {
    return {
      wrong: 'You list tech tasks, but the business/user impact is still hiding behind the stack.',
      fix: 'Connect the feature or bugfix to speed, reliability, users, revenue, or team efficiency.',
      example: 'Built React dashboard module, reduced reporting time by 40%, and helped ops monitor issues faster.',
    };
  }

  return {
    wrong: 'You list activity, not impact. The effort is visible, but the value is blurry.',
    fix: 'Rewrite one bullet as action + measurable result + who benefited.',
    example: 'Improved monthly reporting flow, cut manual work by 30%, and helped the team decide faster.',
  };
}

function outputFor(symbol: string, input: string) {
  const demoSignal = 'Admin intern, handled reports, made slides, helped team operations, used Excel, coordinated meetings.';
  const isDemo = symbol === 'GAJIKAPAN' && input.trim().length === 0;
  const signal = input.trim() || (symbol === 'GAJIKAPAN' ? demoSignal : 'No context provided yet.');

    if (symbol === 'GAJIKAPAN') {
    const style = pickRandom(['savage', 'mentor', 'analytical', 'encouraging']) as GajikapanStyle;
    const context = getGajikapanContext(signal);
    const mainLine = pickGajikapanHeadline(style);
    const wrong = pickRandom([
      context.wrong,
      'The recruiter should not need detective skills to find your value.',
      'It reads like a task list, not evidence that you improved something.',
      'Your strongest proof exists somewhere, but the sentence does not point to it yet.',
    ]);
    const fix = pickRandom([
      context.fix,
      ...gajikapanQuickFixes[style],
    ]);
    const twist = pickRandom([
      'Make the value impossible to miss.',
      'Receipts beat vibes.',
      'Proof is the new personality.',
      'Busy is not the same as valuable.',
    ]);

    return [
      `MAIN LINE: ${mainLine}`,
      `WHAT'S WRONG: ${wrong}`,
      `QUICK FIX: ${fix} ${twist}`,
      `EXAMPLE: ${context.example}`,
      'ID: CV kamu bukan jelek; sinyal bagusnya ketutup. Bikin lebih terukur dan gampang dipercaya.',
      `INPUT SIGNAL: ${isDemo ? 'Demo mode used sample CV because you gave no input.' : signal.slice(0, 150)}`,
    ].join('\n');
  }

  if (symbol === 'NGIDEA') {
    const idea = signal === 'No context provided yet.' ? 'a student-friendly local service idea' : signal.slice(0, 120);
    return [
      'HEADLINE: Your idea needs a sharper first user, not more vibes.',
      `PROBLEM: People who face “${idea}” need a faster, clearer way to act.`,
      'SOLUTION: Package it as one tiny offer with one obvious benefit.',
      'NEXT STEP: Ask 5 target users one painful question, then build the smallest demo.',
      `PITCH LINE: “We help [specific user] solve [pain] without [annoying old way].”`,
      'ID: Ide bagus harus diperkecil dulu biar bisa dites cepat.',
    ].join('\n');
  }

  if (symbol === 'BUMIPANAS') {
    const numbers = getNumbers(signal);
    const km = numbers[0] || 10;
    const isFlight = /flight|fly|plane|pesawat/i.test(signal);
    const isCar = /car|drive|mobil|motor/i.test(signal);
    const factor = isFlight ? 0.18 : isCar ? 0.2 : 0.08;
    const estimate = Math.max(0.5, km * factor);
    return [
      `HEADLINE: Estimated footprint: ~${estimate.toFixed(1)} kg CO₂e. Not cute, but fixable.`,
      `BREAKDOWN: ${km} km × ${factor.toFixed(2)} kg CO₂e/km estimate.`,
      `COMPARISON: About ${Math.max(1, Math.round(estimate / 0.4))} phone charges worth of emissions.`,
      'SUGGESTION: Combine trips, switch one ride to public transit, or offset with a real local action.',
      'NEXT STEP: Repeat this check before the next trip; guilt is useless, patterns are useful.',
      'ID: Angkanya perkiraan, tapi cukup buat mulai ubah kebiasaan.',
    ].join('\n');
  }

  if (symbol === 'AKMIS') {
    const numbers = getNumbers(signal);
    const money = numbers[0] || 250000;
    const dailySpend = numbers[1] || 50000;
    const days = Math.max(1, Math.floor(money / Math.max(dailySpend, 1)));
    const risk = days <= 3 ? 'HIGH RISK — survival mode is screaming.' : days <= 7 ? 'MEDIUM RISK — manageable, but no silly checkout.' : 'LOWER RISK — still budget like a suspicious accountant.';
    return [
      `HEADLINE: You can survive about ${days} day(s) at this burn rate.`,
      `MATH: ${money.toLocaleString()} cash ÷ ${dailySpend.toLocaleString()}/day spend.`,
      `RISK: ${risk}`,
      'CUT FIRST: Snacks, impulse delivery, and “small” purchases that quietly rob you.',
      'NEXT STEP: Lock today’s food + transport budget before spending on anything else.',
      'ID: Amankan makan, transport, dan tidur dulu. Gaya hidup nanti aja.',
    ].join('\n');
  }

  return [
    `BASIC MODE: ${symbol} can turn this issue into one practical next step.`,
    `INSIGHT: You’re dealing with “${signal.slice(0, 90)}” → the real blocker is clarity.`,
    'BREAKDOWN: Name the problem, choose one affected person, remove one avoidable friction.',
    'NEXT STEP: Write one action you can do in 24 hours, then share it with one real person.',
    'ID: Mode dasar dulu — ubah masalah jadi satu langkah kecil yang bisa dilakukan.',
  ].join('\n');
}

function feedTextFor(symbol: string, result: string) {
  const firstLine = result.split('\n')[0] || result;
  if (symbol === 'GAJIKAPAN') return firstLine.replace('MAIN LINE: ', '') || 'Your CV is hiding the good stuff 💀';
  return firstLine.replace('HEADLINE: ', '').replace('BASIC MODE: ', '');
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
  const { connected, isUnlocked, loading, refresh, isDemoActive, isDev } = useAccess();
  const { addUserFeedItem } = useImpactFeed();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
  const [hadBuyIntent, setHadBuyIntent] = useState(false);
  const shareCardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
    if (!token) return;
    setHadBuyIntent(window.localStorage.getItem('s17:last-buy-intent') === token.symbol);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const canonicalHref = `${window.location.origin}/tokens/${token.symbol.toLowerCase()}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"][data-demo="true"]');
    if (isDemoActive) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        robots.dataset.demo = 'true';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else if (robots) {
      robots.remove();
    }
  }, [isDemoActive, token]);

  if (!token) {
    return <main className="min-h-screen bg-slate-950 text-slate-50"><Navbar /><section className="mx-auto max-w-4xl px-4 py-20 text-center"><h1 className="text-4xl font-black">Token world not found</h1><p className="mt-4 text-slate-400">Dunia token tidak ditemukan.</p><Link href="/" className="mt-8 inline-flex rounded-full bg-slate-100 px-5 py-3 font-black text-slate-950">Back home</Link></section></main>;
  }

    const unlocked = isUnlocked(token.sdgNumber) || isDemoActive || isDev;
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
    await navigator.clipboard.writeText(`${token!.monsterName} / $${token!.symbol}\n${result}\n\nS17 DEGEN by Impactory\ns17degen.vercel.app`);
    setCopied(true);
  }

  async function downloadCard() {
    if (!shareCardRef.current) return;
    const dataUrl = await toPng(shareCardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#020617',
      filter: (node) => !(node instanceof HTMLElement && node.dataset.export === 'hide'),
    });
    const link = document.createElement('a');
    link.download = `${token!.symbol}-result.png`;
    link.href = dataUrl;
    link.click();
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
          {isDemoActive ? <p className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">Demo mode enabled — no token required<br />Mode demo aktif — tidak butuh token</p> : null}
          {!unlocked ? <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">{token.symbol === 'GAJIKAPAN' ? <p className="mb-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">Already bought $GAJIKAPAN? Connect your wallet and verify access below.</p> : null}<p className="font-black text-slate-100">Connect wallet to unlock</p><p className="mt-2 text-sm text-slate-400">ID: Hubungkan wallet dan verifikasi kepemilikan token untuk membuka alat ini.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row">{!connected ? <WalletMultiButton /> : null}<button onClick={refresh} className="rounded-full border border-slate-700 px-5 py-3 text-sm font-black text-slate-100 hover:border-cyan-400">Verify Access</button></div></div> : <form onSubmit={submit} className="mt-8 space-y-5"><textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-36 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300" placeholder={token.symbol === 'GAJIKAPAN' ? 'Paste your CV bullet points, LinkedIn summary, or messy work experience...' : `Tell ${token.monsterName} what is broken today... / Ceritakan chaos kamu hari ini...`} /><div className="flex flex-col gap-3 sm:flex-row"><button type="submit" disabled={isGenerating} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-3 font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70"><Sparkles className="h-4 w-4" /> {isGenerating ? 'Roasting gently...' : token.symbol === 'GAJIKAPAN' ? 'Roast My CV' : 'Generate Card'}</button>{token.symbol === 'GAJIKAPAN' && result ? <button type="submit" disabled={isGenerating} className="rounded-full border border-slate-700 px-6 py-3 font-black text-slate-100 hover:border-cyan-400 disabled:cursor-wait disabled:opacity-70">Generate Again</button> : null}</div>{isGenerating ? <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm font-bold text-amber-100">Reading your career chaos... finding weak bullets... preparing a useful roast. / Lagi baca chaos karier kamu...</p> : null}</form>}
          {result ? <div ref={shareCardRef} className={token.symbol === 'GAJIKAPAN' ? 'mt-8 overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950 shadow-2xl shadow-slate-950/70' : 'mt-8 rounded-[1.5rem] border border-white/15 bg-slate-950 p-5'} style={token.symbol === 'GAJIKAPAN' ? undefined : { borderColor: `${token.accentColor}55`, boxShadow: `0 0 42px ${token.accentColor}22` }}><div className={token.symbol === 'GAJIKAPAN' ? 'p-5' : ''}><div className="flex items-center gap-4"><MonsterImage token={token} size={84} /><div><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">Shareable Result</p><p className="text-2xl font-black text-slate-50">${token.symbol}</p><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">SDG {sdgNumber}</p></div></div>{token.symbol === 'GAJIKAPAN' && gajikapanResult ? <div className="mt-5 rounded-[1.75rem] border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-5 text-center" style={{ borderColor: `${token.accentColor}77`, boxShadow: `0 0 48px ${token.accentColor}33` }}><p className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: token.accentColor }}>$GAJIKAPAN CV Verdict</p><h3 className="mx-auto mt-4 max-w-2xl text-3xl font-black leading-tight text-slate-50">{gajikapanResult.mainLine}</h3><div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" /><div className="grid gap-4 text-left md:grid-cols-2"><div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4"><p className="text-sm font-black uppercase tracking-[0.2em] text-rose-200">What’s wrong</p><p className="mt-3 leading-7 text-slate-200">{gajikapanResult.wrong}</p></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Quick fix</p><p className="mt-3 leading-7 text-slate-200">{gajikapanResult.fix}</p></div></div><div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-left"><p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Better bullet</p><p className="mt-3 leading-7 text-slate-200">{gajikapanResult.example}</p></div><p className="mt-4 text-sm leading-6 text-slate-500">ID: {gajikapanResult.id}</p><p className="mt-4 text-xs font-bold text-slate-600">{gajikapanResult.inputSignal}</p><p className="mt-5 text-sm font-black text-amber-200">Another CV rescued 🫡</p></div> : <p className="mt-5 whitespace-pre-line rounded-2xl bg-slate-900/80 p-4 leading-7 text-slate-200">{result}</p>}<div className="mt-5 flex flex-col gap-3 sm:items-center sm:justify-between"><p className="text-sm font-black text-slate-400">S17 DEGEN by Impactory</p><p className="text-xs font-bold text-slate-600">s17degen.vercel.app</p>{token.symbol === 'GAJIKAPAN' ? <p data-export="hide" className="text-sm text-slate-500">Would you share this? Don’t worry, we won’t tell them it was you.</p> : null}<div data-export="hide" className="flex flex-col gap-3 sm:flex-row"><button onClick={copyResult} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 hover:border-cyan-400"><Copy className="h-4 w-4" /> {copied ? 'Copied' : token.symbol === 'GAJIKAPAN' ? 'Copy Result' : 'Copy'}</button><button onClick={downloadCard} className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/40 px-4 py-2 text-sm font-black text-cyan-100 hover:bg-cyan-400/10"><Download className="h-4 w-4" /> Download Card 📸</button>{token.symbol === 'GAJIKAPAN' ? <button onClick={() => { const fakeEvent = { preventDefault() {} } as FormEvent<HTMLFormElement>; submit(fakeEvent); }} disabled={isGenerating} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70">Generate Again 🔥</button> : null}</div></div></div></div> : null}
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
