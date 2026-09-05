import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OrbitAI — Dashboard',
  description: 'Conversational DeFi dashboard. Swap, stake, lend, and bridge with Shield Engine previews.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
