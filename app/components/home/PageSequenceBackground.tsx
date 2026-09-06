'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import {
  FRAME_COUNT,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  buildFrameUrl,
  frameIndexForProgress,
} from '@/lib/how-it-works/content';

/**
 * Full-page, frame-by-frame scroll background for the sections BELOW the hero.
 *
 * The hero keeps its own video background; this layer sits behind the rest of
 * the page. The 130 JPGs in /sequence3 are scrubbed on a fixed, full-viewport
 * <canvas> as the user scrolls: frame 1 at the top, frame 130 at the bottom.
 *
 * Robustness:
 *  1. A static <img> of frame 001 sits behind the canvas as an instant base so
 *     the background is never black while bitmaps decode.
 *  2. Bitmaps decode lazily through a size-capped LRU cache, keyed to a small
 *     window around the current pointer (works in both scroll directions).
 *  3. Respects `prefers-reduced-motion` by showing one static frame.
 */

const MAX_CACHED_FRAMES = 24; // sliding-window budget in decoded bitmaps
const PREFETCH = 4; // frames decoded ahead of/behind the pointer
const DECODE_WIDTH = Math.min(FRAME_WIDTH, 1920); // reduce decoded bitmap memory on large screens
const MAX_DPR = 1.5; // cap devicePixelRatio to keep canvas fill-rate sane
/** Tile colour shown around a frame when the viewport aspect wraps "contain". */
const CANVAS_BG = '#0B0B0C';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Decode an image URL into a bitmap, or null if the engine cannot. */
async function decodeBitmap(url: string): Promise<ImageBitmap | null> {
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`fetch ${res.status} for ${url}`);
    const blob = await res.blob();
    try {
      return await createImageBitmap(blob, {
        resizeWidth: DECODE_WIDTH,
        resizeQuality: 'medium',
      });
    } catch {
      // Some engines reject the resize options - retry without them.
      try {
        return await createImageBitmap(blob);
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }
}

export default function PageSequenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** Decoded-frame LRU cache. Map insertion order encodes recency. */
  const cacheRef = useRef<Map<number, ImageBitmap>>(new Map());
  const pendingRef = useRef<Set<number>>(new Set());
  const wantedRef = useRef(-1);
  const prefersReducedRef = useRef(false);

  /* Respect prefers-reduced-motion by showing one static frame. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedRef.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /** Request a decode for `index` (deduped). Evicts LRU frames past the budget. */
  const requestDecode = useCallback(async (index: number) => {
    const cache = cacheRef.current;
    const pending = pendingRef.current;
    if (index < 0 || index >= FRAME_COUNT) return;
    if (cache.has(index) || pending.has(index)) return;

    pending.add(index);
    try {
      const bitmap = await decodeBitmap(buildFrameUrl(index));
      if (!bitmap) return;

      cache.set(index, bitmap);
      while (cache.size > MAX_CACHED_FRAMES) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey === undefined) break;
        const evicted = cache.get(oldestKey);
        cache.delete(oldestKey);
        evicted?.close();
      }
    } finally {
      pending.delete(index);
    }
  }, []);

  /** Zoomed-out (fit) draw of one bitmap, honouring devicePixelRatio. */
  const drawFrame = useCallback((bitmap: ImageBitmap) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (cssW === 0 || cssH === 0) return;

    const dpr = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      MAX_DPR
    );
    const pxW = Math.round(cssW * dpr);
    const pxH = Math.round(cssH * dpr);

    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    // Whole frame visible, centred, never cropped or magnified ("zoom out").
    const scale = Math.min(cssW / FRAME_WIDTH, cssH / FRAME_HEIGHT);
    const dw = FRAME_WIDTH * scale;
    const dh = FRAME_HEIGHT * scale;
    const dx = (cssW - dw) / 2;
    const dy = (cssH - dh) / 2;

    // Paint the letterbox/tile bars behind the fitted frame.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(-dx, -dy, cssW + dw, cssH + dh);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, dx, dy, dw, dh);
  }, []);

  /* Drive the sequence from overall page scroll (0..1 -> frame 1..FRAME_COUNT). */
  useEffect(() => {
    // Kick off the opening window so the first paint is near-instant.
    for (let i = 0; i < 4; i += 1) void requestDecode(i);

    let rafId = 0;
    let last = -1;
    let lastDrawnIndex = -1;

    const tick = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Respect prefers-reduced-motion: keep the static first frame on screen.
      if (prefersReducedRef.current) {
        const bitmap = cacheRef.current.get(0);
        if (bitmap && lastDrawnIndex !== 0) {
          drawFrame(bitmap);
          lastDrawnIndex = 0;
        }
        return;
      }

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 1 ? clamp01(window.scrollY / scrollable) : 0;

      if (p !== last) {
        last = p;
        const index = frameIndexForProgress(p);

        if (index !== wantedRef.current) {
          wantedRef.current = index;
          for (let d = 0; d <= PREFETCH; d += 1) {
            void requestDecode(index - d);
            void requestDecode(index + d);
          }
        }

      }

      // Repaint as soon as a requested frame finishes decoding.
      const index = frameIndexForProgress(p);
      const bitmap = cacheRef.current.get(index);
      if (bitmap && lastDrawnIndex !== index) {
        drawFrame(bitmap);
        lastDrawnIndex = index;
      } else if (!bitmap) {
        lastDrawnIndex = -1;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [requestDecode, drawFrame]);

  return (
    <div
      className="fixed inset-0 z-0 bg-[#0B0B0C] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Static frame 001 = instant visual base while bitmaps decode. */}
      <img
        src={buildFrameUrl(0)}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Darkening keeps text on the sections above comfortably readable. */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
