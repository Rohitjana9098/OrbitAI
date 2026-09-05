'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XLogo, GitHubLogo, DiscordLogo } from '../BrandLogos';

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Docs', href: '#' },
    { label: 'Status', href: '#' },
  ];

  const socialLinks = [
    { label: 'Twitter', href: '#', icon: 'X' },
    { label: 'GitHub', href: '#', icon: 'GH' },
    { label: 'Discord', href: '#', icon: 'DC' },
    { label: 'Twitter', href: '#', icon: <XLogo className="w-4 h-4" /> },
    { label: 'GitHub', href: '#', icon: <GitHubLogo className="w-4 h-4" /> },
    { label: 'Discord', href: '#', icon: <DiscordLogo className="w-4 h-4" /> },
  ];

  return (
    <footer className="relative w-full bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-zinc-800">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500 mb-2">
              OrbitAI
            </h3>
            <p className="text-zinc-400 text-sm">
              Your AI companion for everything onchain
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="flex flex-wrap gap-8">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-500 text-sm"
          >
            © {currentYear} OrbitAI. All rights reserved.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-6"
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                title={social.label}
                className="w-8 h-8 flex items-center justify-center rounded border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300 text-xs font-semibold"
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
