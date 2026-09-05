'use client';

import { useEffect } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export type ProgressTarget = { current: HTMLElement | null };

/**
 * Self-contained scroll progress for a pinned section.
 *
 * Computes [0..1] directly from `getBoundingClientRect()` every animation frame:
 *   progress = -rect.top / (rect.height - viewportHeight)
 *
 * Because it reads the real document scroll position itself (rather than relying on
 * framer-motion's useScroll observers), it is immune to conflicts with smooth-scroll
 * libraries (Lenis) and to sticky/reflow quirks: whatever actually scrolols the
 * document is exactly what drives the sequence.
 */
export function useSectionProgress(target: ProgressTarget): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    let rafId = 0;
    let last = -1;

    const tick = () => {
      const el = target.current;
      if (el && typeof window !== 'undefined') {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total > 1) {
          const p = clamp01(-rect.top / total);
          if (Math.abs(p - last) > 0.0005) {
            last = p;
            progress.set(p);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progress, target]);

  return progress;
}