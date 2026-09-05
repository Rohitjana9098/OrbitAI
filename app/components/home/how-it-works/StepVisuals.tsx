'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  Banknote,
  Coins,
  ArrowRightLeft,
} from 'lucide-react';
import { SERVICE_TILES, TRANSACTION } from '@/lib/how-it-works/content';

/**
 * Shared glass UI panels. The pinned desktop overlay maps scroll progress onto
 * these as opacity/slide transforms; the mobile fallback renders them statically.
 */

const PANEL_CLASS =
  'relative rounded-2xl border border-white/[0.16] bg-white/[0.07] backdrop-blur-2xl ' +
  'shadow-[0_18px_55px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] ' +
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent';

/** Map the ServiceTile icon key to a Lucide icon component. */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  repeat: <Repeat className="h-4 w-4 text-oro-gold" />,
  banknote: <Banknote className="h-4 w-4 text-oro-gold" />,
  coins: <Coins className="h-4 w-4 text-oro-gold" />,
  'arrow-right-left': <ArrowRightLeft className="h-4 w-4 text-oro-gold" />,
};

function serviceIcon(key: string): React.ReactNode {
  return SERVICE_ICONS[key] ?? React.createElement('span');
}

export function CheckGlyph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7.5"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowGlyph({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** STEP 01 — mock terminal window with animated caret. */
export function TerminalUI({ prompt }: { prompt: string }) {
  return (
    <div className={`${PANEL_CLASS} overflow-hidden font-mono`}>
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        <span className="ml-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
          orbitai · terminal
        </span>
      </div>

      <div className="flex items-start gap-2.5 px-4 py-5 text-[13px] leading-relaxed">
        <span className="shrink-0 select-none text-oro-gold" aria-hidden="true">
          ›
        </span>
        <p className="break-words text-white/90">{prompt}</p>
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-1 inline-block h-[1em] w-[7px] shrink-0 bg-oro-gold/80"
        />
      </div>
    </div>
  );
}
/** STEP 02 — transaction review card. */
export function TxCardUI({ animated = false }: { animated?: boolean }) {
  return (
    <div className={`${PANEL_CLASS} flex flex-col gap-4 p-5 text-left`}>
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="relative shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient text-[#0B0B0C]">
            <CheckGlyph className="h-4 w-4" />
          </div>
          {animated && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl border border-oro-gold/60"
              animate={{ opacity: [0.7, 0], scale: [1, 1.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-white">
            {TRANSACTION.header}
          </h3>
          <p className="text-[11px] text-white/50">{TRANSACTION.subheader}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-[12px]">
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/40">
            Route
          </span>
          <span className="flex items-center gap-1.5">
            <span className="rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-white/85">
              {TRANSACTION.routeFrom}
            </span>
            <span className="text-oro-gold/70">
              <ArrowGlyph className="h-3 w-3" />
            </span>
            <span className="rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-white/85">
              {TRANSACTION.routeTo}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2.5">
          <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/40">
            Est. Output
          </span>
          <span className="font-semibold tracking-wider text-white">
            {TRANSACTION.estOutput}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2.5">
          <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/40">
            Network Fee
          </span>
          <span className="text-white/50">{TRANSACTION.networkFee}</span>
        </div>
      </div>
    </div>
  );
}
/** STEP 03 — pulsing confirm button + interactive service tile grid. */
export function ConfirmUI() {
  return (
    <div className="flex flex-col gap-4">
      <div className={`${PANEL_CLASS} flex flex-col gap-4 p-5`}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              '0 0 34px -8px rgba(212,162,111,0.35), 0 10px 30px -12px rgba(0,0,0,0.6)',
              '0 0 64px -4px rgba(212,162,111,0.55), 0 10px 30px -12px rgba(0,0,0,0.6)',
              '0 0 34px -8px rgba(212,162,111,0.35), 0 10px 30px -12px rgba(0,0,0,0.6)',
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full rounded-xl bg-gold-gradient py-3.5 text-center text-sm font-bold tracking-[0.01em] text-[#0B0B0C]"
        >
          Confirm Transaction
        </motion.button>
        <p className="text-center text-[11px] text-white/45">
          Sign with WalletConnect — your keys never leave your hands.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SERVICE_TILES.map((tile) => (
          <motion.div
            key={tile.title}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex cursor-default flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] leading-none">
              <span aria-hidden="true">{serviceIcon(tile.icon)}</span>
            </div>
            <h4 className="text-[13px] font-semibold leading-tight text-white">
              {tile.title}
            </h4>
            <p className="text-[11px] leading-relaxed text-white/45">
              {tile.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
