'use client';

import React from 'react';
import { Skeleton, SkeletonCard, SkeletonCircle, SkeletonText, SkeletonButton } from './components/Skeleton';

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0C] text-white overflow-hidden">
      {/* Tactile Grain Overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-40" />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-oro-gold/10 blur-[160px]" />
      </div>

      {/* Navbar Skeleton */}
      <header className="fixed top-0 w-full z-40 h-24 px-6 md:px-10 flex items-center justify-between border-b border-white/[0.08] bg-black/40 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <Skeleton className="w-28 h-8 rounded-lg" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
          <SkeletonButton className="w-32 h-10" />
        </div>
        <SkeletonCircle className="md:hidden w-9 h-9" />
      </header>

      {/* Hero Section Skeleton */}
      <main className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-12 md:h-16 w-3/4 rounded-xl" />
          <Skeleton className="h-12 md:h-16 w-full rounded-xl" />
          <SkeletonText className="w-2/3 h-5 mt-4" />
        </div>

        {/* Input bar skeleton */}
        <div className="w-full max-w-2xl mt-12">
          <Skeleton className="h-14 w-full rounded-full" />
        </div>

        {/* Feature Grid Skeleton */}
        <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-44" />
        </div>

        {/* Workflow steps skeleton */}
        <div className="w-full mt-16 space-y-4">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </main>
    </div>
  );
}

