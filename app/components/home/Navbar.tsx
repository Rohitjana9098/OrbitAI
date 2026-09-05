'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '#blog' },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 w-full z-50"
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-6 md:px-10 h-24 bg-black/25 backdrop-blur-2xl border-b border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        {/* Brand */}
        <Link href="/" className="text-3xl font-light tracking-[0.3em] text-white">
          OrbitAI
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ x: 2 }}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/dashboard"
              className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Ask OrbitAI
            </Link>
          </motion.span>
        </div>

        {/* Mobile: brand + Ask OrbitAI only */}
        <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="md:hidden">
          <Link
            href="/dashboard"
            className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium"
          >
            Ask OrbitAI
          </Link>
        </motion.span>
      </div>
    </motion.nav>
  );
}
