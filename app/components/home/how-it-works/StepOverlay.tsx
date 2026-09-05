'use client';

import React from 'react';
import { MotionValue, motion, useSpring, useTransform } from 'framer-motion';
import { HEADER, STEPS } from '@/lib/how-it-works/content';
import { CheckGlyph, ConfirmUI, TerminalUI, TxCardUI } from './StepVisuals';

interface StepOverlayProps {
  /** Scroll progress [0..1] of the pinned 400vh section. */
  progress: MotionValue<number>;
}

export default function StepOverlay({ progress }: StepOverlayProps) {
  /* ---- Background header: visible, then fades out by 20% scroll ---- */
  const headerOpacity = useTransform(progress, [0, 0.2], [1, 0]);
  const headerY = useTransform(progress, [0, 0.2], [0, -16]);

  /* ---- Left column — active step copy (fade + slide up per third) ---- */
  const step1Opacity = useTransform(progress, [0, 0.1, 0.29, 0.37], [0, 1, 1, 0]);
  const step1Y = useTransform(progress, [0, 0.1, 0.29, 0.37], [28, 0, 0, -26]);

  const step2Opacity = useTransform(progress, [0.34, 0.44, 0.58, 0.66], [0, 1, 1, 0]);
  const step2Y = useTransform(progress, [0.34, 0.44, 0.58, 0.66], [28, 0, 0, -26]);

  const step3Opacity = useTransform(progress, [0.67, 0.76, 1], [0, 1, 1]);
  const step3Y = useTransform(progress, [0.67, 0.76, 1], [30, 0, 0]);

  /* ---- Right column — dynamic transaction preview ---- */
  const terminalOpacity = useTransform(progress, [0.02, 0.1, 0.3, 0.37], [0, 1, 1, 0]);
  const terminalY = useTransform(progress, [0.02, 0.1, 0.3, 0.37], [22, 0, 0, -24]);

  const checkOpacity = useTransform(progress, [0.12, 0.26], [0, 1]);
  const checkScale = useTransform(progress, [0.12, 0.26], [0.6, 1]);

  const txOpacity = useTransform(progress, [0.34, 0.44, 0.58, 0.66], [0, 1, 1, 0]);
  const txY = useTransform(progress, [0.34, 0.44, 0.58, 0.66], [24, 0, 0, -26]);

  const confirmOpacity = useTransform(progress, [0.67, 0.76, 1], [0, 1, 1]);
  const confirmY = useTransform(progress, [0.67, 0.76, 1], [26, 0, 0]);

  /* ---- Bottom progress rail ---- */
  const rail = useSpring(progress, { stiffness: 70, damping: 22, restDelta: 0.001 });
  const railScaleX = useTransform(rail, (v) => Math.max(0.001, v));
  const railPct = useTransform(rail, (v) => Math.round(v * 100));
  const railStep = useTransform(
    rail,
    (v): string => (v < 1 / 3 ? '01' : v < 2 / 3 ? '02' : '03')
  );

  return (
    <div
      className="absolute inset-0 z-20 will-change-transform"
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-x-12 px-6 lg:grid-cols-12 lg:px-10">
        {/* ============ LEFT — intro headers + active step copy ============ */}
        <div className="relative flex flex-col justify-center rounded-3xl border border-white/[0.14] bg-white/[0.045] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_70px_-30px_rgba(0,0,0,0.9)] sm:p-8 lg:col-span-7 lg:p-10">
          <motion.div
            style={{ opacity: headerOpacity, y: headerY, willChange: 'transform, opacity' }}
            className="pointer-events-auto pb-6 pt-4 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-oro-gold" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/60">
                {HEADER.badge}
              </span>
            </div>
            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {HEADER.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
              {HEADER.description}
            </p>
          </motion.div>

          {/* Active step copy — stacked, one revealed per scroll third */}
          <div className="relative h-[340px] pointer-events-none lg:h-[360px]">
            <motion.div
              style={{ opacity: step1Opacity, y: step1Y, willChange: 'transform, opacity' }}
              className="pointer-events-auto absolute inset-x-0 top-0"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-oro-gold">
                {STEPS[0].eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                {STEPS[0].title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 md:text-[15px]">
                {STEPS[0].description}
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: step2Opacity, y: step2Y, willChange: 'transform, opacity' }}
              className="pointer-events-auto absolute inset-x-0 top-0"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-oro-gold">
                {STEPS[1].eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                {STEPS[1].title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 md:text-[15px]">
                {STEPS[1].description}
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: step3Opacity, y: step3Y, willChange: 'transform, opacity' }}
              className="pointer-events-auto absolute inset-x-0 top-0"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-oro-gold">
                {STEPS[2].eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                {STEPS[2].title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 md:text-[15px]">
                {STEPS[2].description}
              </p>
            </motion.div>
          </div>
        </div>
{/* ============ RIGHT — dynamic transaction preview ============ */}
        <div className="relative h-[520px] rounded-3xl border border-white/[0.14] bg-white/[0.045] p-5 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_70px_-30px_rgba(0,0,0,0.9)] lg:col-span-5 lg:h-[560px] lg:p-7">
          {/* STEP 01 — terminal + checkmark */}
          <motion.div
            style={{ opacity: terminalOpacity, y: terminalY, willChange: 'transform, opacity' }}
            className="pointer-events-auto absolute inset-x-0 top-0 mx-auto w-full max-w-[440px]"
          >
            <TerminalUI prompt={STEPS[0].prompt ?? ''} />
          </motion.div>

          <motion.div
            style={{ opacity: checkOpacity, scale: checkScale, willChange: 'transform, opacity' }}
            className="pointer-events-none absolute inset-x-0 top-[140px] mx-auto flex max-w-[440px] justify-start"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)] backdrop-blur-xl">
              <span className="text-emerald-300">
                <CheckGlyph className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-[11px] tracking-wide text-emerald-200/90">
                Request received — routing…
              </span>
            </div>
          </motion.div>

          {/* STEP 02 — transaction review card */}
          <motion.div
            style={{ opacity: txOpacity, y: txY, willChange: 'transform, opacity' }}
            className="pointer-events-auto absolute inset-x-0 top-0 mx-auto w-full max-w-[440px]"
          >
            <TxCardUI animated />
          </motion.div>

          {/* STEP 03 — confirm + interactive service tiles */}
          <motion.div
            style={{ opacity: confirmOpacity, y: confirmY, willChange: 'transform, opacity' }}
            className="pointer-events-auto absolute inset-x-0 top-0 mx-auto w-full max-w-[440px]"
          >
            <ConfirmUI />
          </motion.div>
        </div>
      </div>

      {/* ============ BOTTOM — scroll progress rail ============ */}
      <div className="absolute inset-x-0 bottom-5">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 lg:px-10">
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/40">
            <motion.span className="text-oro-gold">{railStep}</motion.span> / 03
          </span>
          <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gold-gradient"
              style={{ scaleX: railScaleX }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-white/40">
            <motion.span>{railPct}</motion.span>%
          </span>
        </div>
      </div>
    </div>
  );
}
