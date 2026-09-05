'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';
import { Skeleton, SkeletonCard, SkeletonText } from '../Skeleton';

const POSTS = [
  {
    category: 'Engineering',
    title: 'Shield Engine 2.0: simulation depth, tenfold',
    excerpt:
      'How we scaled shadow-fork dry-runs to 10,000+ nodes without adding a single second to preview time.',
    readTime: '6 min read',
    date: 'Sep 2026',
    gradient: 'from-[#D4A26F]/30 via-[#8B5E34]/20 to-transparent',
  },
  {
    category: 'Product',
    title: 'From sentence to settlement: anatomy of an OrbitAI route',
    excerpt:
      'A guided tour of what happens the moment you type "withdraw 1 USDC and swap it for ZIG" — step by step, onchain.',
    readTime: '8 min read',
    date: 'Aug 2026',
    gradient: 'from-[#C9854A]/25 via-[#6B4F31]/15 to-transparent',
  },
  {
    category: 'Insights',
    title: 'Why conversational DeFi is the killer app',
    excerpt:
      'Dashboards visualize what already happened. Conversation lets you act. The case for intent-based execution.',
    readTime: '5 min read',
    date: 'Aug 2026',
    gradient: 'from-[#D4A26F]/25 via-[#3D2E1D]/20 to-transparent',
  },
];

export default function BlogSection({ loading = false }: { loading?: boolean }) {
  return (
    <section id="blog" className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full py-16 md:py-24">
      <motion.div
        variants={StaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col"
      >
        {/* Header */}
        <motion.div
          variants={FadeInUp}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.05] backdrop-blur-xl px-3 py-1 rounded-full border border-white/[0.12] mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BD8554]"></span>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Blog
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
            From the OrbitAI journal.
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Engineering deep-dives, product breakdowns, and the thinking behind
            conversational onchain execution.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col rounded-3xl border border-white/[0.1] bg-white/[0.04] p-6 space-y-4">
                  <Skeleton className="h-36 w-full rounded-2xl" />
                  <SkeletonText className="h-6 w-3/4" />
                  <SkeletonText className="h-12 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="w-24 h-4 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
              ))
            : POSTS.map((post) => (
                <motion.a
                  key={post.title}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  variants={FadeInUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)] transition-colors duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
                >
                  {/* Cover */}
                  <div
                    className={`relative h-40 w-full bg-gradient-to-br ${post.gradient}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,162,111,0.18),_transparent_60%)]" />
                    <span className="absolute top-4 left-4 rounded-full border border-white/[0.15] bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-oro-gold backdrop-blur-xl">
                      {post.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="text-lg font-bold leading-snug text-white group-hover:text-oro-gold transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-gray-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-4">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="rounded-full border border-white/[0.15] bg-white/[0.05] p-1.5 text-gray-400 transition-colors duration-300 group-hover:border-oro-gold/40 group-hover:text-oro-gold">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
        </div>
      </motion.div>
    </section>
  );
}