'use client';

import React from 'react';
import { Skeleton, SkeletonCard, SkeletonCircle, SkeletonText, SkeletonButton, SkeletonRow } from '../components/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0C] text-white flex overflow-hidden font-sans">
      {/* Tactile Grain Overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-40" />

      {/* Ambient background glowing orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[580px] h-[580px] rounded-full bg-oro-gold/15 blur-[150px]" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-[#E8A458]/10 blur-[140px]" />
      </div>

      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex h-screen w-64 shrink-0 border-r border-white/[0.1] bg-[#0B0B0C]/80 backdrop-blur-2xl flex-col p-4 space-y-4">
        <div className="px-2 py-4 flex items-center justify-between border-b border-white/[0.08]">
          <Skeleton className="w-28 h-7 rounded-lg" />
          <Skeleton className="w-10 h-5 rounded-full" />
        </div>
        <div className="flex-1 space-y-2 py-4">
          <SkeletonRow className="h-11" />
          <SkeletonRow className="h-11" />
          <SkeletonRow className="h-11" />
          <SkeletonRow className="h-11" />
          <SkeletonRow className="h-11" />
          <SkeletonRow className="h-11" />
          <SkeletonRow className="h-11" />
        </div>
        <SkeletonCard className="h-24 rounded-2xl" />
      </aside>

      {/* Main Content Area Skeleton */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Header Skeleton */}
        <header className="sticky top-0 z-20 h-16 px-6 border-b border-white/[0.08] bg-black/40 backdrop-blur-2xl flex items-center justify-between gap-4">
          <Skeleton className="w-48 h-8 rounded-full" />
          <Skeleton className="hidden md:block w-72 h-10 rounded-full" />
          <div className="flex items-center gap-3">
            <SkeletonCircle className="w-9 h-9" />
            <SkeletonButton className="w-36 h-10" />
          </div>
        </header>

        {/* Dashboard Body Skeleton */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 max-w-[1400px]">
          {/* Header Title Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <SkeletonText className="w-36 h-4" />
              <Skeleton className="w-64 h-14 rounded-2xl" />
              <SkeletonText className="w-48 h-4" />
            </div>
            <SkeletonButton className="w-40 h-12" />
          </div>

          {/* 4 KPI Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
          </div>

          {/* Chart & Quick Widget Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <SkeletonCard className="xl:col-span-3 h-80 rounded-3xl" />
            <SkeletonCard className="xl:col-span-2 h-80 rounded-3xl" />
          </div>

          {/* Positions Table Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonCard className="lg:col-span-2 h-64 rounded-3xl" />
            <SkeletonCard className="lg:col-span-1 h-64 rounded-3xl" />
          </div>
        </main>
      </div>
    </div>
  );
}

