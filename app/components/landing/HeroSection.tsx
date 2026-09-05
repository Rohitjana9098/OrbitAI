'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsLoaded(true);
    }
  }, []);

  const scrollIndicatorVariants = {
    animate: {
      y: [0, 8, 0],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="/video/Woman_seated_with_glowing_rings_202608292110.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlay - Minimalist dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/80" />

      {/* Content */}
      <motion.div
        variants={StaggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-12"
      >
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-4xl">
          {/* "ORO" - Minimalist, elegant */}
          <motion.div variants={FadeInUp}>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                OrbitAI
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={FadeInUp}
            className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-300 mb-12 tracking-wide"
          >
            Your AI Companion for Everything Onchain
          </motion.p>

          {/* Description - Keep it minimal */}
          <motion.p
            variants={FadeInUp}
            className="text-sm sm:text-base text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Navigate the blockchain with intelligence. Trade, analyze, and grow
            with AI-powered insights at your fingertips.
          </motion.p>
        </div>

        {/* CTA Buttons - Minimalist style */}
        <motion.div
          variants={FadeInUp}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center"
        >
          {/* Primary Button */}
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(250, 204, 21, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-yellow-500 text-zinc-950 font-semibold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
            >
              Launch App
            </motion.button>
          </Link>

          {/* Secondary Button */}
          <motion.a
            href="#learn-more"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 sm:px-12 py-3 sm:py-4 border border-zinc-600 text-zinc-300 font-semibold rounded-lg hover:border-zinc-400 hover:text-zinc-100 transition-all"
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Minimalist */}
      <motion.div
        variants={scrollIndicatorVariants}
        animate="animate"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>

      {/* Subtle grid pattern - Optional minimalist texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>
    </div>
  );
}
