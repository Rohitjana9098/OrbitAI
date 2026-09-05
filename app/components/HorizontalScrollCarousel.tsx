'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInUp, StaggerContainer } from '@/lib/motion-variants';

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  icon: React.ReactNode;
  color: string;
}

interface HorizontalScrollCarouselProps {
  items: CarouselItem[];
  title: string;
  subtitle?: string;
}

export function HorizontalScrollCarousel({ items, title, subtitle }: HorizontalScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateScrollButtons);
    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scrollTo = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = container.clientWidth * 0.4;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      scrollLeft: containerRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const delta = e.clientX - dragStart.x;
    containerRef.current.scrollLeft = dragStart.scrollLeft - delta * 0.8;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    const delta = e.deltaY * 0.6;
    containerRef.current.scrollLeft += delta;
    e.preventDefault();
  };

  return (
    <motion.div
      variants={StaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative w-full overflow-hidden rounded-[2rem] border border-white/[0.14] bg-white/[0.045] p-5 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_80px_-36px_rgba(0,0,0,0.9)] sm:p-7"
    >
      <motion.div variants={FadeInUp} className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-display font-bold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
            className={`p-2.5 rounded-xl border transition-all ${
              canScrollLeft
                ? 'bg-white/[0.08] border-white/[0.16] text-white backdrop-blur-xl hover:border-oro-gold/50 hover:bg-white/[0.14] hover:text-oro-gold hover:shadow-[0_0_18px_rgba(212,162,111,0.16)]'
                : 'bg-white/[0.02] border-white/[0.05] text-zinc-600 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
            className={`p-2.5 rounded-xl border transition-all ${
              canScrollRight
                ? 'bg-white/[0.08] border-white/[0.16] text-white backdrop-blur-xl hover:border-oro-gold/50 hover:bg-white/[0.14] hover:text-oro-gold hover:shadow-[0_0_18px_rgba(212,162,111,0.16)]'
                : 'bg-white/[0.02] border-white/[0.05] text-zinc-600 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        ref={containerRef}
        variants={FadeInUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="relative flex gap-4 overflow-x-auto scrollbar-hide scroll-pl-1 snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            className="snap-start w-72 flex-shrink-0"
          >
            <motion.div
              variants={FadeInUp}
              transition={{ delay: (index % items.length) * 0.05 }}
              className="group relative h-full rounded-2xl bg-gradient-to-br from-white/[0.1] via-white/[0.055] to-white/[0.025] border border-white/[0.16] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_14px_40px_-24px_rgba(0,0,0,0.9)] hover:border-oro-gold/50 hover:bg-white/[0.12] hover:shadow-[0_12px_42px_-18px_rgba(212,162,111,0.28)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base border border-white/[0.14] backdrop-blur-xl"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: item.color }}
                >
                  {item.metric}
                </span>
              </div>

              <h4 className="text-lg font-display font-semibold text-white mb-1 group-hover:text-oro-gold transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed">{item.subtitle}</p>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute -inset-px bg-gradient-to-r from-oro-gold/10 via-transparent to-oro-bronze/10 rounded-2xl" />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
