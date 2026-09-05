'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Skeleton } from '../Skeleton';

export default function ChatDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="chat-demo" className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white/[0.06] backdrop-blur-2xl rounded-3xl border border-white/[0.12] p-6 md:p-8 max-w-3xl mx-auto flex flex-col gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(0,0,0,0.7)]"
      >
        {/* User Message */}
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/[0.12] text-white rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-[85%] font-medium border border-white/[0.15] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Withdraw 1 USDC from PermaPod and swap it for ZIG
          </motion.div>
        </div>

        {/* AI Response / Transaction Preview */}
        <div className="flex justify-start">
          <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl rounded-tl-sm border border-white/[0.1] p-5 max-w-[95%] w-full flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {loading ? (
                /* Skeleton screen — simulates OrbitAI "thinking" while preparing the preview */
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  {/* Header skeleton */}
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-4 w-40 max-w-full" />
                      <Skeleton className="h-3 w-28 max-w-full" />
                    </div>
                  </div>

                  {/* Details skeleton */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center py-2 gap-4">
                      <Skeleton className="h-3 w-14" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-24 rounded" />
                        <span className="text-gray-500">→</span>
                        <Skeleton className="h-7 w-24 rounded" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-white/10 gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-white/10 gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </div>

                  {/* Button skeleton */}
                  <Skeleton className="w-full h-11 rounded-full mt-2" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-col gap-5"
                >
                  {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                className="w-8 h-8 rounded-full bg-[#BD8554] flex items-center justify-center text-[#0B0B0C] shrink-0 font-bold"
              >
                <Check className="w-5 h-5" strokeWidth={3.5} />
              </motion.div>
              <div>
                <h3 className="font-semibold text-white">Transaction Ready</h3>
                <p className="text-xs text-gray-400 font-normal">Review details before signing</p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Route
                </span>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-2.5 py-1 bg-white/[0.06] backdrop-blur-xl rounded border border-white/[0.1]"
                  >
                    PermaPod
                  </motion.span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="text-gray-500"
                  >
                    →
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-2.5 py-1 bg-white/[0.06] backdrop-blur-xl rounded border border-white/[0.1]"
                  >
                    Jupiter
                  </motion.span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Est. Output
                </span>
                <span className="text-xs text-white font-semibold tracking-wider">
                  ~ 12.45 ZIG
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Network Fee
                </span>
                <span className="text-xs text-gray-400">~ $0.002</span>
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white text-[#0B0B0C] rounded-full py-3 mt-2 font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_10px_40px_-12px_rgba(255,255,255,0.4)]"
            >
              Confirm Transaction
            </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
