'use client';

import React from 'react';
import { AuctionManager } from '@/components/AuctionManager';
import { LanguageProvider } from '@/context/LanguageContext';

const dummyAuction = {
  id: '1',
  title: 'Pi Network NFT Special Edition',
  creatorName: 'Master Ful21',
  piboxSsUrl: 'https://placehold.co/600x600/0f172a/38bdf8?text=NFT+Auction',
  highestBid: 10,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  status: 'ACTIVE',
};

export default function HomePage() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center justify-center">
        <AuctionManager auction={dummyAuction} currentUserPiId="user_pi_123" />
      </main>
    </LanguageProvider>
  );
}
