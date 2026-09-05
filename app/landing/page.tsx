'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/app/components/landing/HeroSection';
import MinimalCTA from '@/app/components/landing/MinimalCTA';
import SimpleFooter from '@/app/components/landing/SimpleFooter';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Divider Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full" />

      {/* CTA Section */}
      <MinimalCTA />

      {/* Divider Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full" />

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
}
