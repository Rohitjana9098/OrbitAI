import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#06070A] px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/" className="text-sm text-oro-gold hover:text-white">← Back to OrbitAI</Link>
        <h1 className="font-display text-4xl">Terms of Service</h1>
        <p className="text-gray-300">OrbitAI is a local product prototype. Transactions shown in this demo are simulated and are not financial advice or live blockchain transactions.</p>
      </div>
    </main>
  );
}
