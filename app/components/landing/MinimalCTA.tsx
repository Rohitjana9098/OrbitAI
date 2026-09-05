'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';

export default function MinimalCTA() {
  const features = [
    {
      number: '01',
      title: 'Real-Time Insights',
      description: 'AI-powered market analysis updated every second',
    },
    {
      number: '02',
      title: 'Smart Trading',
      description: 'Automated strategies tailored to your risk profile',
    },
    {
      number: '03',
      title: 'Portfolio Intelligence',
      description: 'Comprehensive tracking across all your assets',
    },
  ];

  const containerVariants = StaggerContainer;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 bg-zinc-950 overflow-hidden">
      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16 sm:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            <span className="text-zinc-100">Powered by </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
              Advanced AI
            </span>
          </h2>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to trade smarter, not harder
          </p>
        </motion.div>

        {/* Features Grid - Minimalist 3 column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              variants={itemVariants}
              className="group"
            >
              <div className="flex flex-col h-full">
                {/* Number */}
                <div className="text-5xl sm:text-6xl font-display text-zinc-800 group-hover:text-yellow-500/30 transition-colors duration-300 mb-4">
                  {feature.number}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="font-display text-xl sm:text-2xl text-zinc-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover line - Minimalist accent */}
                <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-yellow-500 to-transparent group-hover:w-12 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Text */}
        <motion.div
          variants={itemVariants}
          className="text-center border-t border-zinc-800 pt-12 sm:pt-16"
        >
          <p className="text-zinc-300 text-lg sm:text-xl mb-6">
            Ready to transform your trading experience?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 border border-yellow-500/30 text-yellow-400 font-semibold rounded-lg hover:border-yellow-500 hover:bg-yellow-500/5 transition-all duration-300"
          >
            Start Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Background Elements - Subtle */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
