'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AuctionCardProps {
  auction: {
    id: string;
    type: 'ENGLISH' | 'DUTCH';
    currentPrice: number;
    buyNowPrice?: number;
    endTime: string;
    nft: {
      metadataUri: string;
      rarity: string;
      isBox: boolean;
    };
  };
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(auction.currentPrice);
  const [bidAmount, setBidAmount] = useState<number>(auction.currentPrice + 1);

  // Countdown and Dutch Auction price decay calculation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auction.endTime).getTime();
      const diff = Math.max(0, end - now);
      setTimeLeft(diff);

      // Handle Dutch auction dynamic price calculation
      if (auction.type === 'DUTCH' && diff > 0) {
        const decayRate = 0.01; // Example decay step per second
        setCurrentPrice((prev) => Math.max(1, prev - decayRate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  const handleBidSubmit = async () => {
    const response = await fetch('/api/auctions/bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auctionId: auction.id, amount: bidAmount }),
    });

    const data = await response.json();
    if (data.antiSnipingTriggered) {
      alert(t('auction.anti_sniping'));
    }
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-gray-900 border border-gray-800 p-4 text-white shadow-lg touch-manipulation">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-800">
        <img src={auction.nft.metadataUri} alt="NFT Media" className="object-cover w-full h-full" />
        <span className="absolute top-2 right-2 bg-purple-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
          {auction.nft.rarity}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">{t('auction.current_bid')}</p>
          <p className="text-xl font-black text-amber-400">π {currentPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{t('auction.time_left')}</p>
          <p className="text-sm font-semibold text-rose-500">{formatTime(timeLeft)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="w-1/2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handleBidSubmit}
            disabled={timeLeft === 0}
            className="w-1/2 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-black font-bold py-2 px-4 rounded-xl text-sm disabled:opacity-50"
          >
            {t('auction.bid_now')}
          </button>
        </div>

        {auction.buyNowPrice && (
          <button
            disabled={timeLeft === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white font-bold py-2 px-4 rounded-xl text-sm disabled:opacity-50"
          >
            {t('auction.buy_now')} (π {auction.buyNowPrice})
          </button>
        )}
      </div>
    </div>
  );
};
