'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  ShieldCheck,
} from 'lucide-react';

import {
  GoogleLogo,
  XLogo,
  AppleLogo,
  MetaMaskLogo,
  PhantomLogo,
  CoinbaseWalletLogo,
  WalletConnectLogo,
} from './BrandLogos';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: string) => void;
}

export function WalletModal({ isOpen, onClose, onSuccess }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const socialOptions = [
    {
      name: 'Google',
      icon: <GoogleLogo className="w-6 h-6" />,
      desc: 'Embedded passkey account',
    },
    {
      name: 'X / Twitter',
      icon: <XLogo className="w-5 h-5 text-white" />,
      desc: 'One-click social login',
    },
    {
      name: 'Apple ID',
      icon: <AppleLogo className="w-5 h-5 text-white" />,
      desc: 'iCloud Keychain passkey',
    },
  ];

  const web3Wallets = [
    {
      name: 'MetaMask',
      icon: <MetaMaskLogo className="w-6 h-6" />,
      badge: 'EVM Mainnets',
    },
    {
      name: 'Phantom',
      icon: <PhantomLogo className="w-6 h-6" />,
      badge: 'Solana & Multi-chain',
    },
    {
      name: 'Coinbase Wallet',
      icon: <CoinbaseWalletLogo className="w-6 h-6" />,
      badge: 'Smart Wallet Passkey',
    },
    {
      name: 'WalletConnect',
      icon: <WalletConnectLogo className="w-6 h-6" />,
      badge: '300+ Wallets',
    },
  ];

  const handleConnect = (walletName: string) => {
    setConnecting(walletName);
    setTimeout(() => {
      setConnecting(null);
      onSuccess(`0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="relative w-full max-w-md bg-[#0B0B0C] border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-oro-gold to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-oro-gold to-oro-bronze p-[1px]">
                  <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                    <Lock className="w-4 h-4 text-oro-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Connect to OrbitAI
                  </h3>
                  <span className="text-[11px] font-mono text-gray-400">
                    Non-custodial smart session
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Social Logins */}
            <div className="mt-5 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">
                Social Passkey (No seed phrase needed)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {socialOptions.map((social) => (
                  <button
                    key={social.name}
                    onClick={() => handleConnect(social.name)}
                    disabled={connecting !== null}
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-oro-gold/30 flex flex-col items-center justify-center gap-1.5 transition-all group disabled:opacity-50"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{social.icon}</span>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white font-sans">
                      {social.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <span className="relative px-3 bg-[#0B0B0C] text-[10px] uppercase font-mono tracking-widest text-gray-500">
                Or Web3 Self-Custody
              </span>
            </div>

            {/* Web3 Wallets */}
            <div className="space-y-2">
              {web3Wallets.map((wallet) => {
                const isThisConnecting = connecting === wallet.name;
                return (
                  <button
                    key={wallet.name}
                    onClick={() => handleConnect(wallet.name)}
                    disabled={connecting !== null}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-oro-gold/40 flex items-center justify-between transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-105 transition-transform">{wallet.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white group-hover:text-oro-gold transition-colors font-sans">
                          {wallet.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">{wallet.badge}</div>
                      </div>
                    </div>

                    {isThisConnecting ? (
                      <span className="w-4 h-4 rounded-full border-2 border-oro-gold border-t-transparent animate-spin" />
                    ) : (
                      <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300">
                        Connect
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Security Guarantee Notice */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Shield Sandboxed
              </span>
              <span className="text-gray-500">Non-Custodial</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
