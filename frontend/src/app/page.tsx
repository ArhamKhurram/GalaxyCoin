'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-5xl font-bold mb-4">🌌 Expanding Space</h1>
      <p className="text-lg mb-8 max-w-xl">
        A living blockchain universe born from Solana transactions. Discover stars, galaxies, and more — in real time.
      </p>
      <Link href="/app">
        <button className="px-6 py-3 bg-purple-600 rounded-xl text-white text-lg hover:bg-purple-700 transition">
          Launch Universe 🚀
        </button>
      </Link>
    </main>
  );
}
