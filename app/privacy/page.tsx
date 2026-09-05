import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#06070A] px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/" className="text-sm text-oro-gold hover:text-white">← Back to OrbitAI</Link>
        <h1 className="font-display text-4xl">Privacy Policy</h1>
        <p className="text-gray-300">This local prototype does not send wallet or conversation data to a production service. Any account and activity data shown in the dashboard exists only in the current browser session.</p>
      </div>
    </main>
  );
}
