'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Blocks } from 'lucide-react';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';

interface UseCase {
  index: string;
  icon: React.ReactNode;
  title: string;
  headline: string;
  description: string;
}

const useCases: UseCase[] = [
  {
    index: '01',
    icon: <Zap className="w-5 h-5 text-oro-gold" />,
    title: 'Power Users',
    headline: 'Run the whole portfolio from one conversation.',
    description:
      'Swaps, yields, staking and lending in a single thread, with the routing already done by the time you read it.',
  },
  {
    index: '02',
    icon: <Sparkles className="w-5 h-5 text-oro-gold" />,
    title: 'Crypto-Curious',
    headline: "Your first step doesn't have to be scary.",
    description:
      "Talk to OrbitAI like you talk to a friend. OrbitAI explains in plain terms, then handles the part you don't want to get wrong on your first try.",
  },
  {
    index: '03',
    icon: <Blocks className="w-5 h-5 text-oro-gold" />,
    title: 'Builders',
    headline: 'Integrate DeFi with a single API.',
    description:
      'Plug OrbitAI into your app. Give your users natural language DeFi without building the infrastructure.',
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full py-16 md:py-24"
    >
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
              Use Cases
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
            Built for how you trade.
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Whether you live onchain or are just getting started, OrbitAI meets you where you are.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <motion.div
              key={useCase.index}
              variants={FadeInUp}
              className="group relative bg-white/[0.06] backdrop-blur-2xl rounded-3xl border border-white/[0.12] p-6 md:p-8 flex flex-col gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)] hover:border-white/[0.25] transition-colors"
            >
              {/* Icon + index */}
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-10 h-10 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center"
                >
                  {useCase.icon}
                </motion.div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 opacity-60 group-hover:text-oro-gold group-hover:opacity-100 transition-colors">
                  {useCase.index}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-base font-semibold text-white mb-3 leading-snug">
                  {useCase.headline}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}