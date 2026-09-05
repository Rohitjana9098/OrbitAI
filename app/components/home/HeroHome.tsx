'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Skeleton } from '../Skeleton';

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

export default function HeroHome() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) setVideoReady(true);
  }, [prefersReducedMotion]);

  const openAssistant = (intent?: string) => {
    const value = (intent ?? prompt).trim();
    router.push(value ? `/dashboard?intent=${encodeURIComponent(value)}` : '/dashboard');
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as Window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPrompt('Voice input is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => setPrompt(event.results[0][0].transcript);
    recognition.start();
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background — the woman seated with glowing rings, clearly visible */}
      <div className="absolute inset-0 w-full h-full">
        {/* Skeleton placeholder shown while the hero video is buffering */}
        {!videoReady && (
          <div className="absolute inset-0">
            <Skeleton className="absolute inset-0" style={{ borderRadius: 0 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          </div>
        )}
        <video
          autoPlay={!prefersReducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/oro-hero-poster.jpg"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="/video/Generate_video_using_frame_1080p_202609012242.mp4"
            type="video/mp4"
          />
        </video>
        {/* Subtle overlays keep the subject clearly visible while aiding text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-36 pb-10"
      >
        {/* Headline */}
        <motion.div variants={item} className="text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight">
            <span>Discover, </span>
            <span className="text-[#E8A458]">Analyze and Trade</span>
            <br className="hidden sm:block" />
            <span>in One Conversation</span>
          </h1>
        </motion.div>

        {/* Spacer so the person stays centered and visible */}
        <div className="flex-1" />

        {/* Bottom section: search bar + CTAs */}
        <motion.div
          variants={item}
          className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5"
        >
          {/* Search input */}
          <form
            className="w-full relative group"
            onSubmit={(event) => {
              event.preventDefault();
              openAssistant();
            }}
          >
            <div className="absolute -inset-1 rounded-full bg-[#E8A458]/15 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/[0.06] backdrop-blur-2xl rounded-full border border-white/[0.15] p-1.5 pl-6 flex items-center gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)]">
              <input
                type="text"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Analyse my portfolio and show the best opportunities"
                className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-white placeholder:text-gray-400 text-base md:text-lg h-12 min-w-0"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Voice input"
                title={listening ? 'Listening...' : 'Use voice input'}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <button
                type="submit"
                className="bg-white text-black rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors"
                aria-label="Submit"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => openAssistant()}
              className="bg-white text-black rounded-full px-9 py-3 text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_10px_40px_-12px_rgba(255,255,255,0.4)]"
            >
              Ask OrbitAI
            </button>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-white text-sm hover:text-gray-200 transition-colors"
            >
              How it works
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M20 12H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
