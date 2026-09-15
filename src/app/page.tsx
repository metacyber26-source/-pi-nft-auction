import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import NFTAuctionApp from '@/components/NFTAuctionApp';

export default function Home() {
  return (
    <LanguageProvider>
      <NFTAuctionApp />
    </LanguageProvider>
  );
}
