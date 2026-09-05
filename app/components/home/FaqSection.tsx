'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';

const FAQ_ITEMS = [
  {
    q: 'Is OrbitAI non-custodial?',
    a: 'Yes. Your private keys never leave your wallet, and no server ever holds them. OrbitAI assembles and previews the transaction entirely client-side — you review it and sign with your own wallet. Nothing is broadcast until you confirm.',
  },
  {
    q: 'Which chains and protocols does OrbitAI support?',
    a: 'OrbitAI routes across 15+ chains spanning EVM, Solana, and Cosmos ecosystems. It composes the optimal path through AMMs, staking vaults, lending markets, and bridges (think Aerodrome, Jupiter, Stargate V2, Kamino, Aave and more), picking the cheapest and safest hops for your intent.',
  },
  {
    q: 'How does Shield Engine protect my transaction?',
    a: 'Every intended action is dry-run on a shadow-fork simulation before broadcast. Routes are checked for MEV exposure, honeypot and fee-on-transfer traps, slippage safety, and approvals risk. Only transactions that pass every check are presented to you for signing.',
  },
  {
    q: 'What does it cost to use OrbitAI?',
    a: 'Previewing, simulating, and asking questions is free. When you execute, you only pay the network gas plus any minimal protocol fee embedded in the route. OrbitAI shows the full cost — route fee and network fee — on the preview screen before you sign.',
  },
  {
    q: 'Do I need a browser extension to get started?',
    a: 'No. You can explore the portfolio overview, run simulations, and ask OrbitAI anything without installing anything. When you are ready to execute, connect your preferred wallet and sign exactly as you would with any dapp.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full py-16 md:py-24">
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
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
            Questions, answered.
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Everything you need to know before you let OrbitAI handle your first intent.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div variants={FadeInUp} className="mx-auto w-full max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-2xl border backdrop-blur-2xl transition-colors duration-300 ${
                  isOpen
                    ? 'border-oro-gold/25 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)]'
                    : 'border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.06]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-semibold text-white">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex-shrink-0 transition-colors ${
                      isOpen ? 'text-oro-gold' : 'text-gray-500'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm md:text-base leading-relaxed text-gray-400">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}