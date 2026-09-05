'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HEADER, STEPS } from '@/lib/how-it-works/content';
import { CheckGlyph, ConfirmUI, TerminalUI, TxCardUI } from './StepVisuals';

/**
 * Mobile / reduced-motion fallback.
 *
 * The heavy canvas scroll-frame hook is intentionally absent here. The timeline
 * unrolls into a clean vertical column and every block enters via a simple
 * scroll-intersection fade — the standard “no jank on small screens” path.
 */

interface MobileHowItWorksProps {
  /** Optional ref for the parent's useScroll target. */
  scrollRef?: React.Ref<HTMLElement>;
}

function StepCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const step = STEPS[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
      className="flex flex-col gap-5 rounded-3xl border border-white/[0.14] bg-white/[0.055] p-5 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_-24px_rgba(0,0,0,0.85)] sm:p-7"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-oro-gold">
          {step.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">{step.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
          {step.description}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

export default function MobileHowItWorks({ scrollRef }: MobileHowItWorksProps) {
  return (
    <section
      id="how-it-works"
      ref={scrollRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-center" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-8">
        {/* Background header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-oro-gold" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/60">
              {HEADER.badge}
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
            {HEADER.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            {HEADER.description}
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col gap-12">
          {/* STEP 01 — terminal + checkmark */}
          <StepCard index={0}>
            <div className="mx-auto w-full max-w-md">
              <TerminalUI prompt={STEPS[0].prompt ?? ''} />
            </div>
            <div className="mx-auto flex w-full max-w-md items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 backdrop-blur-xl">
                <span className="text-emerald-300">
                  <CheckGlyph className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-[11px] tracking-wide text-emerald-200/90">
                  Request received — routing…
                </span>
              </div>
            </div>
          </StepCard>

          <div className="h-px w-full rounded-full bg-white/[0.06]" />

          {/* STEP 02 — transaction review card */}
          <StepCard index={1}>
            <div className="mx-auto w-full max-w-md">
              <TxCardUI />
            </div>
          </StepCard>

          <div className="h-px w-full rounded-full bg-white/[0.06]" />

          {/* STEP 03 — confirm + interactive service tiles */}
          <StepCard index={2}>
            <div className="mx-auto w-full max-w-md">
              <ConfirmUI />
            </div>
          </StepCard>
        </div>
      </div>
    </section>
  );
}
