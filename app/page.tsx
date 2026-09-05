'use client';

import React from 'react';
import Navbar from '@/app/components/home/Navbar';
import HeroHome from '@/app/components/home/HeroHome';
import HowItWorks from '@/app/components/home/HowItWorks';
import ChatDemo from '@/app/components/home/ChatDemo';
import FeaturesGrid from '@/app/components/home/FeaturesGrid';
import UseCases from '@/app/components/home/UseCases';
import ShieldEngineSection from '@/app/components/home/ShieldEngineSection';
import FaqSection from '@/app/components/home/FaqSection';
import BlogSection from '@/app/components/home/BlogSection';
import FooterHome from '@/app/components/home/FooterHome';
import PageSequenceBackground from '@/app/components/home/PageSequenceBackground';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white">
      {/* Frame-by-frame background for everything below the hero (hero keeps video) */}
      <PageSequenceBackground />
      <Navbar />
      <HeroHome />
      <HowItWorks />
      <ChatDemo />
      <FeaturesGrid />
      <UseCases />
      <ShieldEngineSection />
      <FaqSection />
      <BlogSection />
      <FooterHome />
    </main>
  );
}
