'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Lock, Eye, Zap, Globe, AlertTriangle } from 'lucide-react';
import { HorizontalScrollCarousel } from '../HorizontalScrollCarousel';

const features = [
  { label: 'Simulation Passed', status: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.2} /> },
  { label: 'Verified Protocol', status: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.2} /> },
  { label: 'Slippage Safe (0.1%)', status: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.2} /> },
  { label: 'No Approval Risk', status: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.2} /> },
];

const carouselItems = [
  {
    id: 'fork-sim',
    title: 'Shadow Fork Simulation',
    subtitle: 'Dry-runs your transaction on an isolated state fork across 10,000+ nodes before broadcast.',
    metric: '10K nodes',
    icon: <Shield className="w-5 h-5 text-oro-gold" />,
    color: '#D4A26F',
  },
  {
    id: 'mev-guard',
    title: 'MEV Protection',
    subtitle: 'Routes through Flashbots private relays to eliminate sandwich attacks and front-running.',
    metric: '0.05% slip',
    icon: <Zap className="w-5 h-5 text-oro-gold" />,
    color: '#D4A26F',
  },
  {
    id: 'honeypot',
    title: 'Honeypot Detection',
    subtitle: 'Scans for hidden transfer taxes, blacklist hooks, and malicious re-entrancy before signing.',
    metric: '100% safe',
    icon: <AlertTriangle className="w-5 h-5 text-oro-gold" />,
    color: '#D4A26F',
  },
  {
    id: 'slippage',
    title: 'Slippage Capping',
    subtitle: 'Enforces strict slippage caps per-asset and per-route with guaranteed execution bounds.',
    metric: 'Strict cap',
    icon: <Eye className="w-5 h-5 text-oro-gold" />,
    color: '#D4A26F',
  },
  {
    id: 'self-custody',
    title: 'Self-Custody Check',
    subtitle: 'Private keys never touch any server. Signature is assembled and signed only in your wallet.',
    metric: 'Non-custodial',
    icon: <Lock className="w-5 h-5 text-oro-gold" />,
    color: '#D4A26F',
  },
  {
    id: 'multi-chain',
    title: 'Multi-Chain Validation',
    subtitle: 'Simulated across EVM, Solana, and Cosmos ecosystems before cross-chain broadcast.',
    metric: '15+ chains',
    icon: <Globe className="w-5 h-5 text-oro-gold" />,
    color: '#D4A26F',
  },
];

export default function ShieldEngineSection() {
  return (
    <section id="security" className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col lg:flex-row gap-12 items-center"
      >
        {/* Left Content */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white/[0.05] backdrop-blur-xl px-3 py-1 rounded-full border border-white/[0.12] mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BD8554]"></span>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              SHIELD ENGINE
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Every action, previewed before it happens.
          </h2>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Our proprietary simulation engine dry-runs your transaction on a shadow fork,
            ensuring exact outputs and zero unexpected state changes before you sign.
          </p>

          <a href="#security-pipeline" className="inline-flex items-center gap-2 border border-white/[0.15] bg-white/[0.05] backdrop-blur-xl text-white rounded-full px-6 py-3 font-medium hover:border-white/40 hover:bg-white/[0.08] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            Explore Security
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right Features */}
        <div className="flex-1 bg-white/[0.06] backdrop-blur-2xl rounded-3xl border border-white/[0.12] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)]">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-xl border border-oro-gold/40 bg-oro-gold/15 flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(212,162,111,0.18)]">
                  <span className="text-oro-gold">{feature.status}</span>
                </div>
                <span className="text-base text-white font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Horizontal Scroll Carousel */}
      <div id="security-pipeline" className="mt-20 scroll-mt-24 pt-12 border-t border-white/[0.06]">
        <HorizontalScrollCarousel
          items={carouselItems}
          title="Security Pipeline"
          subtitle="Every layer of protection applied before your signature reaches the chain."
        />
      </div>
    </section>
  );
}
