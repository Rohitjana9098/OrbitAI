'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '@/lib/how-it-works/use-media-query';
import { useSectionProgress } from '@/lib/how-it-works/use-section-progress';
import StepOverlay from './how-it-works/StepOverlay';
import MobileHowItWorks from './how-it-works/MobileHowItWorks';

/**
 * "How It Works" scroll experience.
 *
 * - 400vh scroll runway with a pinned 100vh viewport (position: sticky; top: 0).
 * - Scroll progress is computed by useSectionProgress straight from the section's
 *   bounding rect, so it works identically with native scrolling and with the
 *   Lenis smooth-scroll instance used across the site.
 * - The step copy and transaction previews scrub with that progress - forward
 *   AND reverse - at 60fps.
 * - The section background is transparent: the site-wide frame-sequence
 *   background (PageSequenceBackground) plays through here, so every part of
 *   the page keeps the same animated frame backdrop.
 * - Below 768px, or when the user prefers reduced motion, we swap to the
 *   lightweight vertical fallback (MobileHowItWorks).
 */
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reducedRaw = useReducedMotion();
  const prefersReduced = reducedRaw === true;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = useSectionProgress(sectionRef);

  const cinematic = mounted && isDesktop && !prefersReduced;

  if (!cinematic) {
    return <MobileHowItWorks scrollRef={sectionRef} />;
  }

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative h-[400vh] bg-transparent"
      aria-label="How OrbitAI works"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* The full-page frame-sequence background (PageSequenceBackground) shows
            through here — no opaque section background hides it. */}
        {/* Readability sheens over the frame background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[32%] bg-gradient-to-r from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[28%] bg-gradient-to-l from-black/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

        {/* Copy + UI overlays (scroll-mapped) */}
        <StepOverlay progress={progress} />
      </div>
    </section>
  );
}