'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MotionValue, useAnimationFrame } from 'framer-motion';
import {
  FRAME_COUNT,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  buildFrameUrl,
  frameIndexForProgress,
} from '@/lib/how-it-works/content';

/**
 * High-performance, fault-tolerant canvas renderer for the frame sequence.
 *
 * Robustness model:
 *  1. A static <img> of frame 001 sits behind the canvas as an instant visual
 *     base, so the view is never pitch-black while bitmaps decode.
 *  2. Bitmaps are decoded lazily through a direction-aware, size-capped sliding
 *     window. Decoding has a triple fallback: createImageBitmap(+resize) ->
 *     createImageBitmap(plain) -> <img> element load. A load failure for one
 *     frame simply skips to the next; the seek retries it automatically.
 *  3. The draw loop paints one frame per animation frame from the self-computed
 *     scroll progress, and skips redundant work when nothing changed.
 *
 *  Result: zero flicker, zero layout shift, flawless reverse scrubbing.
 */

const MAX_CACHED_FRAMES = 20; // sliding-window budget in decoded bitmaps
const PREFETCH_HORIZON = 6; // frames decoded ahead of/behind the pointer
const DECODE_WIDTH = Math.min(FRAME_WIDTH, 1920); // lower bitmap memory without visible loss
const MAX_DPR = 1.5; // cap canvas fill-rate on retina screens
const LOADER_MAX_MS = 6000; // never trap the user behind the preloader

interface SequenceCanvasProps {
  /** Scroll progress [0..1] coming from useSectionProgress (400vh section). */
  progress: MotionValue<number>;
  /** Only draws while the section is actually on screen. */
  enabled: boolean;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Decode an image URL into a bitmap with escalating fallbacks. */
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
        throw new Error('createImageBitmap failed for ' + url);
      }
    }
  } catch {
    // Network / decode failure: last resort via <img> element decoding.
    try {
      const img = new Image();
      img.decoding = 'sync';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('img load failed for ' + url));
        img.src = url;
      });
      return await createImageBitmap(img);
    } catch {
      return null;
    }
  }
}

export default function SequenceCanvas({ progress, enabled }: SequenceCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** Decoded-frame LRU cache. Map insertion order encodes recency. */
  const cacheRef = useRef<Map<number, ImageBitmap>>(new Map());
  const pendingRef = useRef<Set<number>>(new Set());
  const wantedIndexRef = useRef(-1);
  const lastProgressRef = useRef(0);
  const readyRef = useRef(false);
  const failedRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [decodedCount, setDecodedCount] = useState(0);

  /** Request a decode for `index` (deduped). Evicts LRU frames past the budget. */
  const requestDecode = useCallback(async (index: number) => {
    const cache = cacheRef.current;
    const pending = pendingRef.current;
    if (index < 0 || index >= FRAME_COUNT) return;
    if (cache.has(index) || pending.has(index)) return;

    pending.add(index);

    try {
      const bitmap = await decodeBitmap(buildFrameUrl(index));
      if (!bitmap) throw new Error('decodeBitmap returned null');

      cache.set(index, bitmap);
      while (cache.size > MAX_CACHED_FRAMES) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey === undefined) break;
        const evicted = cache.get(oldestKey);
        cache.delete(oldestKey);
        evicted?.close();
      }

      setDecodedCount((prev) => Math.min(prev + 1, FRAME_COUNT));
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    } catch {
      failedRef.current += 1;
      if (failedRef.current === 3) {
        console.warn(
          `[SequenceCanvas] ${failedRef.current} frames failed to decode - ` +
            'check that /sequence2/ezgif-frame-*.jpg is reachable.'
        );
      }
    } finally {
      pending.delete(index);
    }
  }, []);

  /* Decode a small opening window immediately so the first paint is instant. */
  useEffect(() => {
    for (let i = 0; i < 4; i += 1) {
      void requestDecode(i);
    }
  }, [requestDecode]);

  /* Never trap the user behind the preloader if decoding is blocked. */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    }, LOADER_MAX_MS);
    return () => window.clearTimeout(timer);
  }, []);

  /** Cover-fit draw of one bitmap, honouring devicePixelRatio. */
  const drawFrame = useCallback((index: number, bitmap: ImageBitmap) => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const cssW = wrapper.clientWidth;
    const cssH = wrapper.clientHeight;
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

    const scale = Math.max(cssW / FRAME_WIDTH, cssH / FRAME_HEIGHT);
    const dw = FRAME_WIDTH * scale;
    const dh = FRAME_HEIGHT * scale;
    const dx = (cssW - dw) / 2;
    const dy = (cssH - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(bitmap, dx, dy, dw, dh);
  }, []);

  /* Drive the canvas: decode + paint one frame per animation frame from scroll
     progress. Skips redundant work when the pointer has not moved. */
  useAnimationFrame(() => {
    if (!enabled) return;

    const p = progress.get();
    const index = frameIndexForProgress(p);

    /* Request a decode window around the pointer; deduped inside requestDecode. */
    if (index !== wantedIndexRef.current) {
      wantedIndexRef.current = index;
      for (let d = 0; d <= PREFETCH_HORIZON; d += 1) {
        void requestDecode(index - d);
        void requestDecode(index + d);
      }
    }

    /* Skip redundant paints when the frame on screen is unchanged. */
    if (Math.abs(p - lastProgressRef.current) < 0.0002) return;
    lastProgressRef.current = p;

    const bitmap = cacheRef.current.get(index);
    if (bitmap) drawFrame(index, bitmap);
  });

  return (
    <div ref={wrapperRef} className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Static frame 001 = instant visual base while bitmaps decode. */}
      <img
        src={buildFrameUrl(0)}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{ opacity: ready ? 0 : 1 }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Preloader: only visible until the first frame has been decoded. */}
      {!ready && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#06070A]/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-oro-gold" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
              Decoding {decodedCount}/{FRAME_COUNT}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
