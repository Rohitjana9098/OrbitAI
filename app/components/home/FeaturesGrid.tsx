'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  Banknote,
  Coins,
  ArrowRightLeft,
} from 'lucide-react';
import { Skeleton, SkeletonCircle, SkeletonText } from '../Skeleton';

const features = [
  {
    icon: <Repeat className="w-5 h-5 text-oro-gold" />,
    title: 'Swap',
    description: 'Trade across protocols instantly with optimized routing.',
  },
  {
    icon: <Banknote className="w-5 h-5 text-oro-gold" />,
    title: 'Stake',
    description: 'Earn yield with top validators in just one sentence.',
  },
  {
    icon: <Coins className="w-5 h-5 text-oro-gold" />,
    title: 'Lend',
    description: 'Deposit and borrow without navigating complex dashboards.',
  },
  {
    icon: <ArrowRightLeft className="w-5 h-5 text-oro-gold" />,
    title: 'Bridge',
    description: 'Move assets across chains with AI-optimized routes.',
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function FeaturesGrid({ loading = false }: { loading?: boolean }) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full py-16 md:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/[0.06] rounded-3xl border border-white/[0.12] p-6 flex flex-col gap-4">
                <SkeletonCircle className="w-10 h-10" />
                <SkeletonText className="h-6 w-24" />
                <SkeletonText className="h-10 w-full" />
              </div>
            ))
          : features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.28)' }}
                className="bg-white/[0.06] backdrop-blur-2xl rounded-3xl border border-white/[0.12] p-6 flex flex-col gap-4 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)]"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-10 h-10 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-lg"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
}
