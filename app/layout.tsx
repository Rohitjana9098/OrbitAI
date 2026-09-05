import type { Metadata } from 'next';
import './globals.css';
import { SmoothScroll } from './components/SmoothScroll';

export const metadata: Metadata = {
  title: 'OrbitAI — AI Companion for Conversational DeFi & Onchain Execution',
  description:
    'The market is loud. OrbitAI is clarity. Swap, stake, and bridge across 15+ chains in a single natural language conversation. Non-custodial security powered by Shield Engine.',
  keywords: [
    'OrbitAI',
    'AI DeFi',
    'Crypto AI Companion',
    'Conversational Onchain',
    'Cross-chain Swap',
    'Shield Engine',
    'Web3 AI Agent',
  ],
  openGraph: {
    title: 'OrbitAI — Conversational Onchain Intelligence',
    description:
      'Swap, stake, and bridge across 15+ chains with plain English instructions. Protected by Shield Engine.',
    siteName: 'OrbitAI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="dark">
      <body className="font-sans antialiased bg-oro-bg text-white selection:bg-oro-gold selection:text-black relative min-h-screen">
        <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-40" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
