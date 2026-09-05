'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownUp,
  ArrowLeftRight,
  ArrowUp,
  Bell,
  CheckCircle2,
  ChevronRight,
  Coins,
  Globe,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Activity,
  Search,
} from 'lucide-react';
import { WalletModal } from '../WalletModal';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';
import { Skeleton } from '../Skeleton';

type View =
  | 'overview'
  | 'ask'
  | 'swap'
  | 'stake'
  | 'lend'
  | 'bridge'
  | 'activity'
  | 'security';

type ChatMessage = {
  role: 'user' | 'oro';
  text: string;
  tx?: {
    title: string;
    route: string;
    output: string;
    fee: string;
  };
};

type ActivityRow = {
  type: string;
  detail: string;
  time: string;
  status: string;
};

const NAV: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'ask', label: 'Ask OrbitAI', icon: MessageSquare },
  { id: 'swap', label: 'Swap', icon: ArrowDownUp },
  { id: 'stake', label: 'Stake', icon: Coins },
  { id: 'lend', label: 'Lend', icon: TrendingUp },
  { id: 'bridge', label: 'Bridge', icon: Globe },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

const POSITIONS = [
  { asset: 'ETH', chain: 'Ethereum', amount: '4.82', value: '$12,642', apy: '—', change: '+1.8%' },
  { asset: 'USDC', chain: 'Base', amount: '18,400', value: '$18,400', apy: '8.9%', change: '+0.1%' },
  { asset: 'stETH', chain: 'Ethereum', amount: '2.10', value: '$5,510', apy: '3.6%', change: '+2.1%' },
  { asset: 'SOL', chain: 'Solana', amount: '142.4', value: '$21,360', apy: '7.4%', change: '-0.6%' },
  { asset: 'ZIG', chain: 'Multi-chain', amount: '8,240', value: '$6,592', apy: '14.2%', change: '+4.4%' },
];

const ACTIVITY = [
  { type: 'Swap', detail: '1.50 ETH → 3,932 USDC', time: '2m ago', status: 'Confirmed' },
  { type: 'Stake', detail: '10 SOL → Kamino kSOL', time: '1h ago', status: 'Confirmed' },
  { type: 'Bridge', detail: '500 USDC Ethereum → Base', time: '4h ago', status: 'Finalized' },
  { type: 'Lend', detail: 'Supply 2,000 USDC on Aave', time: '1d ago', status: 'Confirmed' },
];

const ALLOCATION = [
  { label: 'ETH / stETH', pct: 32, color: '#D4A26F' },
  { label: 'Stablecoins', pct: 28, color: '#34D399' },
  { label: 'SOL', pct: 22, color: '#E8C59C' },
  { label: 'Yield / ZIG', pct: 18, color: '#6B4F31' },
];

const CHART = [42, 44, 43, 48, 51, 49, 55, 58, 56, 62, 61, 67, 72, 70, 76, 81, 79, 86, 90, 88, 94];

function sparkPath(values: number[], w: number, h: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

// Glass surface helper classes aligned with home page design system
const glassCard =
  'bg-white/[0.05] backdrop-blur-2xl border border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)] hover:border-white/[0.22] transition-colors';
const glassInner =
  'bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.18] transition-colors';

export function DashboardApp() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>('overview');
  const [walletOpen, setWalletOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activity, setActivity] = useState<ActivityRow[]>(ACTIVITY);
  const [toast, setToast] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const handledIntent = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'oro',
      text: 'Welcome back. Portfolio is +2.4% today. Ask me to swap, stake, lend, or bridge — I’ll preview every action with Shield Engine before you sign.',
    },
    {
      role: 'user',
      text: 'Withdraw 1 USDC from PermaPod and swap it for ZIG',
    },
    {
      role: 'oro',
      text: 'Route compiled. Dry-run succeeded on PermaPod → Jupiter with 0.1% slippage.',
      tx: {
        title: 'Transaction Ready',
        route: 'PermaPod → Jupiter',
        output: '~ 12.45 ZIG',
        fee: '~ $0.002',
      },
    },
  ]);

  const [payAmount, setPayAmount] = useState('1.5');
  const [payToken, setPayToken] = useState('ETH');
  const [receiveToken, setReceiveToken] = useState('USDC');
  const [fromChain, setFromChain] = useState('Ethereum');
  const [toChain, setToChain] = useState('Base');
  const [bridgeAmount, setBridgeAmount] = useState('500');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processing, view]);

  const chartD = useMemo(() => sparkPath(CHART, 320, 88), []);

  const sendIntent = (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value || processing) return;
    setPrompt('');
    setView('ask');
    setConfirmed(false);
    setMessages((prev) => [...prev, { role: 'user', text: value }]);
    setProcessing(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'oro',
          text: `Intent understood: “${value}”. Shield Engine checked 18 routes. Preview is ready — nothing is signed until you confirm.`,
          tx: {
            title: 'Transaction Ready',
            route: 'Aerodrome → Stargate V2',
            output: 'Best quote locked',
            fee: '~ $0.84',
          },
        },
      ]);
      setProcessing(false);
    }, 1100);
  };

  useEffect(() => {
    const intent = searchParams.get('intent')?.trim();
    if (intent && handledIntent.current !== intent) {
      handledIntent.current = intent;
      sendIntent(intent);
    }
  }, [searchParams]);

  const runAction = (intent: string) => {
    if (!account) {
      setWalletOpen(true);
      return;
    }
    sendIntent(intent);
  };

  const confirmTransaction = (detail = 'OrbitAI transaction', type = 'Shield Engine') => {
    if (!account) {
      setWalletOpen(true);
      return;
    }
    setConfirmed(true);
    setActivity((prev) => [
      { type, detail, time: 'just now', status: 'Broadcasting' },
      ...prev,
    ]);
    void fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: account, type, detail, status: 'Broadcasting' }),
    });
    setToast('Transaction signed and broadcasting onchain');
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleWalletSuccess = (address: string) => {
    setAccount(address);
    void Promise.all([
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalId: address, displayName: 'OrbitAI user' }),
      }),
      fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: address, provider: 'Simulated Wallet', address }),
      }),
    ]);
  };

  useEffect(() => {
    if (!account) return;
    void fetch(`/api/activity?user=${encodeURIComponent(account)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.activity?.length) return;
        setActivity(data.activity.map((row: { type: string; detail: string; status: string; created_at: string }) => ({
          type: row.type,
          detail: row.detail,
          status: row.status,
          time: new Date(`${row.created_at}Z`).toLocaleString(),
        })));
      })
      .catch(() => undefined);
  }, [account]);

  const shortWallet = account ?? 'Connect Wallet';

  return (
    <div className="relative min-h-screen bg-[#0B0B0C] text-white flex overflow-hidden font-sans">
      {/* Tactile Grain Overlay matching home layout */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-40" />

      {/* Ambient glowing background lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[580px] h-[580px] rounded-full bg-oro-gold/20 blur-[150px]" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-[#E8A458]/15 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-1/3 w-[480px] h-[480px] rounded-full bg-oro-gold/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,162,111,0.12),_transparent_60%)]" />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static z-40 h-screen w-64 shrink-0 border-r border-white/[0.1] bg-[#0B0B0C]/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Link
          href="/"
          className="px-6 py-6 flex items-center justify-between group border-b border-white/[0.08]"
        >
          <span className="text-2xl font-light tracking-[0.3em] text-white group-hover:text-oro-gold transition-colors">
            OrbitAI
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#E8A458] border border-oro-border-gold/60 rounded-full px-2.5 py-0.5 bg-white/[0.04]">
            App
          </span>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (item.id === 'security') {
                    window.location.assign('/#security-pipeline');
                    return;
                  }
                  setView(item.id);
                  setSidebarOpen(false);
                }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/[0.12] to-oro-gold/15 border border-oro-border-gold/60 shadow-[0_4px_20px_rgba(212,162,111,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  <Icon className={`w-4 h-4 transition-colors ${active ? 'text-oro-gold' : 'text-gray-400'}`} />
                </span>
                <span className="relative z-10">{item.label}</span>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-oro-gold shadow-[0_0_8px_#D4A26F]"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Shield Engine Sidebar Badge */}
        <div className="p-4 m-3 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-oro-border-gold/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#E8A458] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
            Shield Engine Active
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-normal">
            Actions are simulated in a sandbox before signing.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Navbar Header */}
        <header className="sticky top-0 z-20 h-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-black/40 backdrop-blur-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <button
              className="lg:hidden p-2 rounded-xl border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2.5 text-[10px] uppercase tracking-[0.18em] text-gray-300 border border-white/[0.12] rounded-full px-3.5 py-1.5 bg-white/[0.04] backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-oro-gold to-[#E8A458]" />
              Non-custodial · AI-native
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendIntent();
              }}
              className="w-full relative group"
            >
              <div className="absolute -inset-1 rounded-full bg-[#E8A458]/15 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-3.5 h-3.5 text-gray-500 group-focus-within:text-oro-gold transition-colors" />
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Swap 100 USDC for ETH..."
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-oro-gold/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Open notifications"
              className="relative p-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl text-gray-300 hover:text-oro-gold hover:bg-white/[0.08] transition-all"
            >
              <Bell className="w-4 h-4" />
              {activity.length > ACTIVITY.length && <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />}
            </motion.button>
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-white/[0.14] bg-[#171514]/95 p-4 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400">Shield active</span>
                  </div>
                  <div className="space-y-3 text-xs text-gray-300">
                    <p className="rounded-xl bg-white/[0.05] p-3">All routes are simulated before signing.</p>
                    {activity[0] && <p className="rounded-xl bg-white/[0.05] p-3"><span className="text-oro-gold">{activity[0].type}:</span> {activity[0].status}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212, 162, 111, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setWalletOpen(true)}
              className="h-10 px-5 rounded-full bg-white text-black text-xs font-semibold flex items-center gap-2 hover:bg-white/90 transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)]"
            >
              <Wallet className="w-3.5 h-3.5" />
              {shortWallet}
            </motion.button>
          </div>
        </header>

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 max-w-[1400px]"
              >
                {/* Header Title & Action */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[#E8A458] mb-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-oro-gold shadow-[0_0_8px_#D4A26F]" />
                      Live Portfolio Balance
                    </div>
                    <h1 className="font-display gold-gradient-text text-5xl sm:text-6xl font-light tracking-tight text-white mb-2">
                      $64,504.00
                    </h1>
                    <p className="text-sm text-gray-300 leading-relaxed font-normal">
                      <span className="text-emerald-400 font-semibold text-base">+$1,512.40 (2.4%)</span>{' '}
                      <span className="text-gray-400">today across 4 chains</span>
                    </p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      onClick={() => setView('ask')}
                      className="self-start h-12 px-7 rounded-full bg-white/[0.09] backdrop-blur-2xl border border-white/[0.22] text-white text-sm font-semibold flex items-center gap-2.5 hover:bg-white/[0.16] hover:border-oro-gold/60 hover:shadow-[0_0_30px_rgba(212,162,111,0.2),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_35px_-8px_rgba(0,0,0,0.5)]"
                    >
                      <Sparkles className="w-4 h-4 text-black" />
                      Ask OrbitAI
                    </button>
                  </motion.div>
                </div>

                {/* KPI Grid */}
                <motion.div
                  variants={StaggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
                >
                  {[
                    { label: 'Net yield APY', value: '7.8%', hint: 'Blended across vaults' },
                    { label: 'Health factor', value: '2.45', hint: 'Aave & Morpho safety' },
                    { label: 'Unclaimed', value: '$186', hint: 'Rewards ready' },
                    { label: 'Network fees', value: '$0.84', hint: 'Est. next dry-run' },
                  ].map((kpi) => (
                    <motion.div
                      key={kpi.label}
                      variants={FadeInUp}
                      whileHover={{ y: -3, borderColor: 'rgba(212, 162, 111, 0.4)' }}
                      className={`rounded-2xl ${glassCard} p-5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_40px_-12px_rgba(212,162,111,0.2)] transition-all duration-300`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">{kpi.label}</p>
                      <p className="mt-3 font-display text-3xl font-light text-white">{kpi.value}</p>
                      <p className="text-xs text-gray-400 mt-2 font-normal">{kpi.hint}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Chart & Quick Conversation */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                  {/* Performance Chart */}
                  <div className={`xl:col-span-3 rounded-3xl ${glassCard} p-6 sm:p-8 flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="font-display text-xl font-normal text-white">30-day Performance</h2>
                          <p className="text-xs text-gray-400 mt-1">Multi-chain portfolio growth trajectory</p>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-400/10 border border-emerald-400/25 px-3 py-1 rounded-full backdrop-blur-xl">
                          +18.2%
                        </span>
                      </div>
                      <div className="relative w-full h-36">
                        <svg viewBox="0 0 320 88" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="oroFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#D4A26F" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#D4A26F" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={`${chartD} L 320 88 L 0 88 Z`} fill="url(#oroFill)" />
                          <path d={chartD} fill="none" stroke="#D4A26F" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {ALLOCATION.map((a) => (
                        <motion.div key={a.label} whileHover={{ scale: 1.02 }}>
                          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                            <span>{a.label}</span>
                            <span className="text-white font-semibold">{a.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.08] border border-white/[0.1] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${a.pct}%`, background: a.color }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Conversation Widget */}
                  <div className={`xl:col-span-2 rounded-3xl ${glassCard} p-6 sm:p-8 flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <Sparkles className="w-5 h-5 text-oro-gold" />
                        <h2 className="font-display font-normal text-xl text-white">Conversation Preview</h2>
                      </div>
                      <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                        Discover, analyze, and <span className="text-[#E8A458] font-medium">trade</span> in plain English.
                      </p>
                      <div className="space-y-3.5 mb-5">
                        <motion.div
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-auto w-full max-w-[96%] rounded-2xl rounded-tr-sm bg-white/[0.1] px-5 py-4 text-[15px] leading-6 text-white backdrop-blur-xl border border-white/[0.14] sm:max-w-[94%]"
                        >
                          Withdraw 1 USDC from PermaPod and swap it for ZIG
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded-2xl border border-oro-border-gold/50 bg-gradient-to-br from-oro-gold/10 to-oro-bronze/10 p-5 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        >
                          <div className="flex items-center gap-2 text-[#E8A458] text-xs font-semibold uppercase tracking-wider mb-4">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dry-Run Passed
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs font-mono text-gray-400 mb-4">
                            <div className={`rounded-xl p-3 ${glassInner}`}>
                              Est. output
                              <div className="text-white mt-1 font-medium">~ 12.45 ZIG</div>
                            </div>
                            <div className={`rounded-xl p-3 ${glassInner}`}>
                              Network fee
                              <div className="text-white mt-1 font-medium">~ $0.002</div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => confirmTransaction('Withdraw 1 USDC from PermaPod -> swap for ZIG', 'Swap')}
                            className="w-full h-10.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-[0_8px_25px_-6px_rgba(255,255,255,0.3)]"
                          >
                            Confirm Transaction
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendIntent();
                      }}
                      className="relative group"
                    >
                      <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Swap 100 USDC for ETH..."
                        className="w-full h-12 pl-5 pr-14 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-oro-gold/50 focus:bg-white/[0.08] transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        type="submit"
                        className="absolute right-1.5 top-1.5 w-9 h-9 rounded-full bg-gradient-to-r from-oro-gold to-[#E8A458] text-black flex items-center justify-center shadow-lg shadow-oro-gold/25 transition-all"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </motion.button>
                    </form>
                  </div>
                </div>

                {/* Positions & Safety Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Positions Table */}
                  <div className={`lg:col-span-2 rounded-3xl ${glassCard} overflow-hidden`}>
                    <div className="px-7 py-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.03] backdrop-blur-xl">
                      <h2 className="font-display font-normal text-lg text-white">Active Positions</h2>
                      <motion.button
                        whileHover={{ x: 3 }}
                        onClick={() => setView('activity')}
                        className="text-xs text-oro-gold font-semibold flex items-center gap-1 hover:text-oro-gold/80 transition-colors"
                      >
                        View activity <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold border-b border-white/[0.08]">
                            <th className="text-left font-semibold px-7 py-4">Asset</th>
                            <th className="text-left font-semibold px-3 py-4">Amount</th>
                            <th className="text-left font-semibold px-3 py-4">Value</th>
                            <th className="text-left font-semibold px-3 py-4">APY</th>
                            <th className="text-right font-semibold px-7 py-4">24h</th>
                          </tr>
                        </thead>
                        <tbody>
                          {POSITIONS.map((p) => (
                            <motion.tr
                              key={p.asset}
                              whileHover={{ backgroundColor: 'rgba(212, 162, 111, 0.06)' }}
                              className="border-t border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                            >
                              <td className="px-7 py-4">
                                <div className="font-medium text-white">{p.asset}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{p.chain}</div>
                              </td>
                              <td className="px-3 py-4 font-mono text-gray-300">{p.amount}</td>
                              <td className="px-3 py-4 text-white font-medium">{p.value}</td>
                              <td className="px-3 py-4 text-oro-gold font-mono font-medium">{p.apy}</td>
                              <td
                                className={`px-7 py-4 text-right font-mono font-semibold ${
                                  p.change.startsWith('-') ? 'text-red-400' : 'text-emerald-400'
                                }`}
                              >
                                {p.change}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Simulation Safety Card */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="rounded-3xl bg-emerald-400/10 backdrop-blur-2xl border border-emerald-400/30 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_-12px_rgba(52,211,153,0.2)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        <h2 className="font-display font-normal text-xl text-white">Shield Simulation</h2>
                      </div>
                      <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                        Every execution is dry-run in a non-custodial sandbox to prevent MEV attacks, high slippage, and malicious approvals.
                      </p>
                      <ul className="space-y-3.5 text-sm mb-6">
                        {['Verified smart contracts', 'Slippage guard (<0.1%)', 'Zero unauthorized approvals'].map((item) => (
                          <motion.li
                            key={item}
                            whileHover={{ x: 2 }}
                            className="flex items-center gap-3 text-gray-300 font-medium hover:text-emerald-300 transition-colors text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.assign('/#security-pipeline')}
                      className="w-full h-11 rounded-full border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-xl text-xs font-semibold text-emerald-300 hover:bg-emerald-400/20 transition-all"
                    >
                      Explore Security Features
                    </motion.button>
                  </motion.div>
                </div>

                {/* Quick Action Tiles */}
                <motion.div
                  variants={StaggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
                >
                  {[
                    { id: 'swap' as View, title: 'Swap', copy: 'Trade across protocols with optimized routes.', icon: ArrowDownUp },
                    { id: 'stake' as View, title: 'Stake', copy: 'Earn yield with top validators in one sentence.', icon: TrendingUp },
                    { id: 'lend' as View, title: 'Lend', copy: 'Deposit and borrow without complex UI.', icon: Coins },
                    { id: 'bridge' as View, title: 'Bridge', copy: 'Move assets across 15+ EVM & Solana chains.', icon: ArrowLeftRight },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <motion.button
                        key={c.id}
                        variants={FadeInUp}
                        onClick={() => setView(c.id)}
                        whileHover={{ y: -4, borderColor: 'rgba(212, 162, 111, 0.45)' }}
                        className={`text-left rounded-2xl ${glassCard} p-5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_40px_-12px_rgba(212,162,111,0.25)] transition-all duration-300`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-oro-gold/25 to-oro-bronze/15 backdrop-blur-xl text-oro-gold flex items-center justify-center mb-4 font-bold border border-white/[0.12]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-normal text-base text-white">{c.title}</h3>
                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-normal">{c.copy}</p>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

            {/* Ask OrbitAI View */}
            {view === 'ask' && (
              <motion.div
                key="ask"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto h-[calc(100vh-9rem)] flex flex-col justify-between"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-300 border border-white/[0.12] rounded-full px-3.5 py-1.5 mb-3 bg-white/[0.04] backdrop-blur-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-oro-gold shadow-[0_0_8px_#D4A26F]" />
                    Conversational Engine Active
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-normal">DeFi in plain conversation</h1>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'user' ? (
                        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-white/[0.12] px-5 py-3.5 text-sm backdrop-blur-xl border border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                          {msg.text}
                        </div>
                      ) : (
                        <div className="max-w-[92%] space-y-3">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-oro-gold to-[#E8A458] flex items-center justify-center font-display text-xs font-semibold text-black shrink-0 shadow-lg shadow-oro-gold/25">
                              AI
                            </div>
                            <div className={`rounded-2xl rounded-tl-sm ${glassInner} px-5 py-3.5 text-sm text-gray-200 leading-relaxed`}>
                              {msg.text}
                            </div>
                          </div>
                          {msg.tx && (
                            <div className="ml-11 rounded-2xl border border-oro-border-gold/40 bg-white/[0.05] backdrop-blur-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                              <div className="flex items-center gap-2 text-oro-gold text-xs font-semibold uppercase tracking-wider mb-4">
                                <Sparkles className="w-4 h-4" /> {msg.tx.title}
                              </div>
                              <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                                <div className={`rounded-xl p-3 ${glassInner}`}>
                                  <div className="text-gray-400 uppercase tracking-wider text-[10px]">Route</div>
                                  <div className="mt-1 font-mono text-gray-200">{msg.tx.route}</div>
                                </div>
                                <div className={`rounded-xl p-3 ${glassInner}`}>
                                  <div className="text-gray-400 uppercase tracking-wider text-[10px]">Est. output</div>
                                  <div className="mt-1 font-mono text-white">{msg.tx.output}</div>
                                </div>
                                <div className={`rounded-xl p-3 ${glassInner}`}>
                                  <div className="text-gray-400 uppercase tracking-wider text-[10px]">Network fee</div>
                                  <div className="mt-1 font-mono text-white">{msg.tx.fee}</div>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  confirmTransaction(msg.tx?.route ?? 'OrbitAI transaction', 'Transaction');
                                }}
                                className="w-full h-11 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-[0_8px_25px_-6px_rgba(255,255,255,0.3)]"
                              >
                                {confirmed ? 'Signed · Broadcasting onchain' : 'Confirm Transaction'}
                              </motion.button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {processing && (
                    <div className="ml-11 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-oro-gold">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-oro-gold border-t-transparent animate-spin" />
                        Simulating route with Shield Engine...
                      </div>
                      <div className="rounded-2xl border border-oro-border-gold/30 bg-white/[0.04] p-5 space-y-4">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <div className="grid grid-cols-3 gap-3">
                          <Skeleton className="h-12 rounded-xl" />
                          <Skeleton className="h-12 rounded-xl" />
                          <Skeleton className="h-12 rounded-xl" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-full" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['Swap 500 USDC for ETH', 'Stake 10 SOL', 'Bridge 200 USDC to Base'].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendIntent(q)}
                        className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-oro-gold/40 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendIntent();
                    }}
                    className="relative group"
                  >
                    <input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Swap 100 USDC for ETH..."
                      className="w-full h-14 pl-5 pr-14 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.14] text-sm placeholder:text-gray-500 focus:outline-none focus:border-oro-gold/50 focus:bg-white/[0.08] transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="submit"
                      className="absolute right-2 top-2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.3)]"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Swap View */}
            {view === 'swap' && (
              <Panel title="Instant Swap" badge="MEV Protected">
                <div className="w-full max-w-2xl mx-auto space-y-5">
                  <Field label={`You pay · balance 4.82 ${payToken}`}>
                    <div className="flex items-center gap-3">
                      <input
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="bg-transparent text-3xl font-display font-light outline-none w-full text-white"
                      />
                      <select
                        value={payToken}
                        onChange={(e) => setPayToken(e.target.value)}
                        className={`${glassInner} rounded-xl px-3 py-2 text-sm text-white font-medium outline-none bg-black/40`}
                      >
                        <option value="ETH" className="bg-[#0B0B0C]">ETH</option>
                        <option value="USDC" className="bg-[#0B0B0C]">USDC</option>
                        <option value="SOL" className="bg-[#0B0B0C]">SOL</option>
                      </select>
                    </div>
                  </Field>
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ rotate: 180, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const t = payToken;
                        setPayToken(receiveToken);
                        setReceiveToken(t);
                      }}
                      className={`p-2.5 rounded-full border border-white/[0.14] ${glassInner} text-oro-gold shadow-lg shadow-black/50`}
                    >
                      <ArrowDownUp className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <Field label="You receive">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-display font-light text-oro-gold">
                        {(Number(payAmount || 0) * (receiveToken === 'USDC' ? 2621.8 : 0.38)).toFixed(2)}
                      </div>
                      <select
                        value={receiveToken}
                        onChange={(e) => setReceiveToken(e.target.value)}
                        className={`ml-auto ${glassInner} rounded-xl px-3 py-2 text-sm text-white font-medium outline-none bg-black/40`}
                      >
                        <option value="USDC" className="bg-[#0B0B0C]">USDC</option>
                        <option value="ETH" className="bg-[#0B0B0C]">ETH</option>
                        <option value="SOL" className="bg-[#0B0B0C]">SOL</option>
                      </select>
                    </div>
                  </Field>
                  <Meta
                    rows={[
                      ['Optimal Route', 'Uniswap V3 + Aerodrome'],
                      ['Max Slippage', '0.05%'],
                      ['Network Fee', '~$0.64'],
                    ]}
                  />
                  <GoldButton onClick={() => runAction(`Swap ${payAmount || '0'} ${payToken} for ${receiveToken}`)}>
                    Execute Swap via Shield Engine
                  </GoldButton>
                </div>
              </Panel>
            )}

            {/* Bridge View */}
            {view === 'bridge' && (
              <Panel title="Universal Bridge" badge="15+ Chains Supported">
                <div className="w-full max-w-2xl mx-auto space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="From Chain">
                      <select
                        value={fromChain}
                        onChange={(e) => setFromChain(e.target.value)}
                        className="w-full bg-transparent font-medium outline-none text-white cursor-pointer"
                      >
                        <option value="Ethereum" className="bg-[#0B0B0C]">Ethereum</option>
                        <option value="Base" className="bg-[#0B0B0C]">Base</option>
                        <option value="Solana" className="bg-[#0B0B0C]">Solana</option>
                      </select>
                    </Field>
                    <Field label="To Chain">
                      <select
                        value={toChain}
                        onChange={(e) => setToChain(e.target.value)}
                        className="w-full bg-transparent font-medium outline-none text-white cursor-pointer"
                      >
                        <option value="Base" className="bg-[#0B0B0C]">Base</option>
                        <option value="Arbitrum" className="bg-[#0B0B0C]">Arbitrum</option>
                        <option value="Solana" className="bg-[#0B0B0C]">Solana</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Amount (USDC)">
                    <input
                      value={bridgeAmount}
                      onChange={(e) => setBridgeAmount(e.target.value)}
                      className="bg-transparent text-3xl font-display font-light outline-none w-full text-white"
                    />
                  </Field>
                  <Meta
                    rows={[
                      ['Protocol', 'Stargate V2'],
                      ['Estimated Finality', '< 35 seconds'],
                      ['Cross-chain Gas', '~$1.15'],
                    ]}
                  />
                  <GoldButton onClick={() => runAction(`Bridge ${bridgeAmount || '0'} USDC from ${fromChain} to ${toChain}`)}>
                    <span className="inline-flex items-center gap-2">
                      Bridge Assets Across Chains <ArrowLeftRight className="w-4 h-4" />
                    </span>
                  </GoldButton>
                </div>
              </Panel>
            )}

            {/* Stake View */}
            {view === 'stake' && (
              <Panel title="Verified Staking Vaults" badge="Avg APY 8.9%">
                <div className="w-full max-w-6xl mx-auto space-y-4">
                  {[
                    { name: 'Kamino kSOL', apy: '7.45%', chain: 'Solana' },
                    { name: 'Lido stETH', apy: '3.62%', chain: 'Ethereum' },
                    { name: 'Aave USDC', apy: '8.90%', chain: 'Base' },
                    { name: 'PermaPod ZIG', apy: '14.20%', chain: 'Multi-chain' },
                  ].map((pool) => (
                    <motion.div
                      key={pool.name}
                      whileHover={{ scale: 1.01, borderColor: 'rgba(212, 162, 111, 0.4)' }}
                      className={`min-h-[92px] flex items-center justify-between rounded-2xl ${glassInner} p-5 sm:p-6 hover:bg-white/[0.06] transition-all`}
                    >
                      <div>
                        <div className="font-medium text-white text-lg">{pool.name}</div>
                        <div className="text-sm text-gray-400 mt-1">{pool.chain}</div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="font-mono text-emerald-400 font-semibold">{pool.apy}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">APY</div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => runAction(`Stake into ${pool.name}`)}
                          className="h-9 px-5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.2)]"
                        >
                          Stake
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Panel>
            )}

            {/* Lend View */}
            {view === 'lend' && (
              <Panel title="Money Markets" badge="Max LTV 80%">
                <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className={`rounded-2xl ${glassCard} p-6 flex flex-col justify-between`}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">Supplied Capital</p>
                      <p className="font-display text-4xl font-light text-white mt-2">$14,280</p>
                      <p className="text-xs text-emerald-400 mt-1 font-medium">Earning 8.9% APY</p>
                    </div>
                    <GoldButton className="mt-6" onClick={() => runAction('Supply 2,000 USDC on Aave')}>
                      Supply Capital
                    </GoldButton>
                  </div>
                  <div className={`rounded-2xl ${glassCard} p-6 flex flex-col justify-between`}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">Borrowed Capital</p>
                      <p className="font-display text-4xl font-light text-white mt-2">$3,100</p>
                      <p className="text-xs text-oro-gold mt-1 font-medium">Health factor 2.45 (Safe)</p>
                    </div>
                    <button
                      onClick={() => runAction('Review repay or borrow options')}
                      className="mt-6 w-full h-12 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl text-xs font-semibold hover:bg-white/[0.08] transition-colors"
                    >
                      Repay / Borrow
                    </button>
                  </div>
                </div>
              </Panel>
            )}

            {/* Activity View */}
            {view === 'activity' && (
              <Panel title="Onchain Activity History" badge="Real-time">
                <div className="w-full max-w-6xl mx-auto space-y-4">
                  {activity.map((row, index) => (
                    <motion.div
                      key={`${row.detail}-${index}`}
                      whileHover={{ x: 3 }}
                      className={`min-h-[88px] flex items-center justify-between gap-5 rounded-2xl ${glassInner} p-5 sm:p-6 hover:bg-white/[0.06] transition-all`}
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] text-oro-gold uppercase tracking-wider font-semibold">{row.type}</div>
                        <div className="text-sm font-medium text-white mt-0.5 truncate">{row.detail}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-emerald-400">{row.status}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{row.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Panel>
            )}

            {/* Security View */}
            {view === 'security' && (
              <Panel title="Shield Engine Verification" badge="Non-Custodial">
                <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <h3 className="font-display text-2xl font-light text-white">Every action simulated before signing</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      OrbitAI never broadcasts raw transactions until a local sandbox dry-run passes. Smart contracts, slippage tolerance, and approval limits are verified to protect your funds.
                    </p>
                  </div>
                  <div className={`rounded-3xl ${glassCard} p-6 space-y-4`}>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-display font-normal text-lg text-white">Simulation Check passed</span>
                    </div>
                    <ul className="space-y-3 text-xs text-gray-300">
                      {[
                        'Verified smart contract bytecode',
                        'Slippage protection enforced (0.1%)',
                        'Zero unmonitored approval requests',
                        'Non-custodial user session guarantees',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mx-auto max-w-4xl">
                  <a
                    href="/#security-pipeline"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.05] text-xs font-semibold text-white backdrop-blur-xl transition-colors hover:border-oro-gold/50 hover:bg-white/[0.1]"
                  >
                    Open Security Pipeline
                  </a>
                </div>
              </Panel>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#15231e]/95 px-4 py-3 text-xs font-medium text-emerald-300 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} onSuccess={handleWalletSuccess} />
    </div>
  );
}

function Panel({
  title,
  badge,
  children,
}: {
  title: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      <div className="flex items-end justify-between border-b border-white/[0.08] pb-4">
        <h1 className="font-display text-3xl sm:text-4xl font-light text-white">{title}</h1>
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-300 border border-white/[0.12] rounded-full px-3.5 py-1.5 bg-white/[0.04] backdrop-blur-xl">
          {badge}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl ${glassInner} p-4 space-y-1.5`}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">{label}</div>
      {children}
    </div>
  );
}

function Meta({ rows }: { rows: [string, string][] }) {
  return (
    <div className={`rounded-2xl ${glassInner} p-4 space-y-2 text-xs font-mono text-gray-400`}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between">
          <span>{k}</span>
          <span className="text-gray-200 font-medium">{v}</span>
        </div>
      ))}
    </div>
  );
}

function GoldButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full h-12 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-[0_8px_25px_-6px_rgba(255,255,255,0.3)] ${className}`}
    >
      {children}
    </motion.button>
  );
}

