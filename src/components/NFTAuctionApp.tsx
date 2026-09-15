'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Upload, 
  X, 
  Zap, 
  Award, 
  History, 
  FileCheck,
  Search,
  ExternalLink
} from 'lucide-react';

// Types
interface AuctionItem {
  id: string;
  title: string;
  creator: string;
  highestBid: number;
  timeRemainingSeconds: number;
  isVerified: boolean;
  imageUrl: string;
}

export default function NFTAuctionApp() {
  const { t, language, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'auctions' | 'won' | 'pending' | 'trust'>('auctions');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofType, setProofType] = useState<'seller' | 'buyer'>('seller');

  // Dummy Data
  const sampleAuctions: AuctionItem[] = [
    {
      id: '1',
      title: 'Pi Network NFT Special Edition #01',
      creator: 'Master Ful21',
      highestBid: 12.5,
      timeRemainingSeconds: 1800, // < 1 jam (Timer merah/neon berkedip)
      isVerified: true,
      imageUrl: '/api/placeholder/400/400',
    },
    {
      id: '2',
      title: 'Wayang Dewa Antareja Cyber Core',
      creator: 'Gatotkaca_Dev',
      highestBid: 45.0,
      timeRemainingSeconds: 86400,
      isVerified: false,
      imageUrl: '/api/placeholder/400/400',
    },
  ];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-12 max-w-md mx-auto border-x border-slate-800 shadow-2xl">
      
      {/* 1. NAVIGATION & HEADER COMPONENT */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute top-0 left-0" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
              Pi Browser
            </div>
            <div className="text-xs font-bold text-[#06B6D4] flex items-center gap-1">
              <span>@MasterFul21</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pi Balance Badge */}
          <div className="bg-slate-900 border border-[#D946EF]/40 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(217,70,239,0.15)]">
            <span className="text-xs font-black text-[#D946EF]">π</span>
            <span className="text-xs font-bold font-mono text-white">128.50</span>
          </div>

          {/* Dual-Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-semibold transition active:scale-95"
          >
            <Globe className="w-3 h-3 text-[#06B6D4]" />
            <span className="uppercase">{language}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="p-3 space-y-4">

        {/* 2. WARNING & ANTI-FAKE ASSET BANNER COMPONENT */}
        <div className="relative overflow-hidden bg-slate-900/90 border-2 border-[#D946EF]/60 rounded-xl p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.15)]">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#D946EF]/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-6 h-6 text-[#D946EF] shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-xs font-black tracking-wide text-[#D946EF] uppercase">
                {t('warningTitle')}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug">
                {t('warningText')}
              </p>
              <ul className="text-[11px] text-slate-400 space-y-0.5 pt-1 pl-3 list-disc marker:text-[#06B6D4]">
                <li><strong className="text-white">{t('checkItem1')}</strong></li>
                <li><strong className="text-white">{t('checkItem2')}</strong></li>
                <li><strong className="text-white">{t('checkItem3')}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. USER DASHBOARD TAB NAVIGATION */}
        <div className="grid grid-cols-4 gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-center">
          <button
            onClick={() => setActiveTab('auctions')}
            className={`py-2 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center gap-1 ${
              activeTab === 'auctions'
                ? 'bg-[#06B6D4] text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate w-full">{t('activeAuctions')}</span>
          </button>

          <button
            onClick={() => setActiveTab('won')}
            className={`py-2 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center gap-1 ${
              activeTab === 'won'
                ? 'bg-[#06B6D4] text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="truncate w-full">{t('bidsWon')}</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center gap-1 ${
              activeTab === 'pending'
                ? 'bg-[#06B6D4] text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="truncate w-full">{t('proofPending')}</span>
          </button>

          <button
            onClick={() => setActiveTab('trust')}
            className={`py-2 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center gap-1 ${
              activeTab === 'trust'
                ? 'bg-[#06B6D4] text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="truncate w-full">{t('trustScore')}</span>
          </button>
        </div>

        {/* 3. AUCTION CARD GRID COMPONENT (MAIN FEED) */}
        {activeTab === 'auctions' && (
          <div className="space-y-4">
            {sampleAuctions.map((item) => {
              const isEndingSoon = item.timeRemainingSeconds < 3600;
              return (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-[#06B6D4]/50 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300"
                >
                  {/* Image Container with Badge Overlay */}
                  <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />
                    
                    {/* Placeholder Graphics */}
                    <div className="text-center p-4 z-0">
                      <div className="text-4xl font-extrabold text-[#06B6D4]/20 tracking-widest font-mono">
                        PIBOX NFT
                      </div>
                      <p className="text-xs text-slate-600 mt-2">[Screenshot Asset Preview]</p>
                    </div>

                    {/* Verification Status Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      {item.isVerified ? (
                        <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {t('verifiedListed')}
                        </span>
                      ) : (
                        <span className="bg-amber-950/80 border border-amber-500/50 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-lg">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {t('pendingListing')}
                        </span>
                      )}
                    </div>

                    {/* Flashing Countdown Timer Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span
                        className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md border ${
                          isEndingSoon
                            ? 'bg-rose-950/90 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                            : 'bg-slate-900/90 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {formatTime(item.timeRemainingSeconds)}
                      </span>
                    </div>

                    {/* Action trigger for modal */}
                    <button
                      onClick={() => {
                        setSelectedAuction(item);
                        setIsModalOpen(true);
                      }}
                      className="absolute bottom-3 right-3 z-20 bg-slate-900/90 hover:bg-[#D946EF] border border-slate-700 hover:border-[#D946EF] text-white p-2 rounded-xl backdrop-blur-md transition-all active:scale-90"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-3.5 space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {t('checkItem3')}: <span className="text-[#06B6D4] font-semibold">@{item.creator}</span>
                      </p>
                    </div>

                    {/* Highest Bid Section */}
                    <div className="flex justify-between items-end bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t('highestBid')}</span>
                        <div className="flex items-center gap-1 text-base font-black font-mono text-[#D946EF]">
                          <span>π</span>
                          <span>{item.highestBid.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Est. Fee</span>
                        <span className="text-xs text-slate-400 font-mono">0.20 π</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedAuction(item);
                          setIsModalOpen(true);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-[#06B6D4] border border-[#06B6D4]/40 font-bold py-2 px-3 rounded-xl text-xs transition active:scale-95 shadow-lg"
                      >
                        {t('bidNow')}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAuction(item);
                          setIsModalOpen(true);
                        }}
                        className="w-full bg-gradient-to-r from-[#D946EF] to-purple-600 hover:from-[#d946ef]/90 hover:to-purple-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition active:scale-95 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                      >
                        {t('buyNow')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB DEMO STATES */}
        {activeTab === 'won' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
            <Award className="w-8 h-8 text-[#06B6D4] mx-auto opacity-60" />
            <p className="text-xs text-slate-400">Belum ada lelang yang dimenangkan.</p>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
            <FileCheck className="w-8 h-8 text-[#D946EF] mx-auto opacity-60" />
            <p className="text-xs text-slate-400">Tidak ada verifikasi bukti tertunda.</p>
          </div>
        )}

        {activeTab === 'trust' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Skor Kepercayaan Pengguna</span>
              <span className="text-sm font-black font-mono text-emerald-400">98% / 100</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full w-[98%]" />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Skor dihitung berdasarkan penyelesaian transaksi lelang & verifikasi screenshot PiBox secara valid.
            </p>
          </div>
        )}

      </main>

      {/* 4. DETAIL PAGE & PROOF UPLOAD MODAL */}
      {isModalOpen && selectedAuction && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0F172A] border-t sm:border border-slate-800 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-4 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white truncate pr-2">
                {selectedAuction.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Proof Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setProofType('seller')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  proofType === 'seller'
                    ? 'bg-[#D946EF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('sellerProof')}
              </button>
              <button
                onClick={() => setProofType('buyer')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  proofType === 'buyer'
                    ? 'bg-[#06B6D4] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('buyerProof')}
              </button>
            </div>

            {/* Screenshot Drag & Drop Box */}
            <div className="border-2 border-dashed border-slate-700 hover:border-[#06B6D4] rounded-xl p-6 text-center bg-slate-900/40 space-y-2 transition cursor-pointer group">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-[#06B6D4] mx-auto transition" />
              <p className="text-xs text-slate-300 font-medium">
                {t('uploadProof')}
              </p>
              <p className="text-[10px] text-slate-500">
                {t('dragDropText')}
              </p>
            </div>

            {/* Bid History List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-[#06B6D4]" />
                {t('bidHistory')} (Top 3)
              </h4>
              <div className="space-y-1.5">
                {[
                  { user: '@MasterFul21', amount: 12.5, time: '2m ago' },
                  { user: '@Pioneer_Blitar', amount: 11.0, time: '15m ago' },
                  { user: '@CryptoKing', amount: 10.0, time: '1h ago' },
                ].map((bid, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-950/80 p-2 rounded-lg text-xs font-mono border border-slate-800/60"
                  >
                    <span className="text-slate-300">{bid.user}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#D946EF] font-bold">{bid.amount} π</span>
                      <span className="text-[10px] text-slate-500">{bid.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-[#06B6D4] hover:bg-[#06b6d4]/90 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition active:scale-95 shadow-lg"
            >
              {t('submitProof')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
