'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Auction {
  id: string;
  title: string;
  creatorName: string;
  piboxSsUrl: string;
  highestBid: number;
  expiresAt: string;
  status: string;
}

interface AuctionManagerProps {
  auction: Auction;
  currentUserPiId: string;
}

export const AuctionManager: React.FC<AuctionManagerProps> = ({
  auction,
  currentUserPiId,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [bidAmount, setBidAmount] = useState<number>(auction.highestBid + 1);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Penawaran ${bidAmount} Pi berhasil dikirim!`);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Header Bar & Switch Bahasa */}
      <div className="flex items-center justify-between p-4 bg-slate-950/60 border-b border-slate-800 backdrop-blur-md">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
          Pi Network Event
        </span>
        <button
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className="text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          {language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
        </button>
      </div>

      {/* NFT Image Preview */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden group">
        <img
          src={auction.piboxSsUrl}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs text-purple-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {t('timeRemaining')}: 23h 59m
        </div>
      </div>

      {/* Auction Details */}
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">{auction.title}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {t('seller')}: <span className="text-purple-400 font-medium">{auction.creatorName}</span>
          </p>
        </div>

        {/* Warning Box */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <div className="p-1 bg-amber-500/20 rounded-lg text-amber-400 mt-0.5">
            ⚠️
          </div>
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="block text-amber-400 font-semibold mb-0.5">PIBOX VERIFICATION WARNING</strong>
            Pastikan judul dan pembuat NFT cocok persis dengan list di Pi Event Zone sebelum mengajukan penawaran.
          </div>
        </div>

        {/* Bid Status & Form */}
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{t('highestBid')}</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
              {auction.highestBid} <span className="text-xs text-emerald-500">π</span>
            </span>
          </div>

          <form onSubmit={handleBidSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="number"
                min={auction.highestBid + 0.1}
                step="0.1"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-medium"
                placeholder={t('enterAmount')}
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">π</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition active:scale-[0.98]"
            >
              {t('placeBid')} (0.2 π Fee)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
