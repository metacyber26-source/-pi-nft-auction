'use client';

import React, { useState } from 'react';

export default function NFTAuctionPage() {
  const [bidAmount, setBidAmount] = useState<string>('11');

  const handlePlaceBid = () => {
    alert(`Penawaran sebesar ${bidAmount} π berhasil diajukan!`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 md:p-8">
      {/* Header Bar */}
      <header className="w-full max-w-md flex items-center justify-between py-3 px-4 bg-slate-900 border border-slate-800 rounded-xl mb-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">PIBOX EVENT ZONE</span>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition">
            + Sell NFT
          </button>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition flex items-center gap-1">
          🇬🇧 EN
        </button>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* NFT Image Display */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 flex flex-col items-center justify-center p-6 border-b border-slate-800">
          <h1 className="text-4xl font-extrabold text-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] text-center">
            NFT Auction
          </h1>
        </div>

        {/* Details Content */}
        <div className="p-5 space-y-4">
          
          {/* Timer */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 w-fit px-3 py-1.5 rounded-full border border-slate-800">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>23h 59m</span>
          </div>

          {/* Title & Seller */}
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Pi Network NFT Special Edition
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Seller: <span className="text-cyan-400 font-medium">Master Ful21</span>
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wide">
              <span>⚠️</span> PIBOX VERIFICATION WARNING
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ensure exact match on <span className="font-semibold text-white">PIBOX EVENT ZONE</span>:
            </p>
            <ul className="text-xs text-slate-400 space-y-0.5 pl-2 border-l-2 border-amber-500/30">
              <li><strong className="text-slate-300">Title:</strong> Pi Network NFT Special Edition</li>
              <li><strong className="text-slate-300">Creator:</strong> Master Ful21</li>
            </ul>
          </div>

          {/* Bidding Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-medium text-slate-400">Highest Bid</span>
              <span className="text-lg font-extrabold text-cyan-400">10 π</span>
            </div>

            {/* Input & Button */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-2.5 px-3 text-white text-sm outline-none transition pr-8 font-semibold"
                  placeholder="Masukkan angka"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  π
                </span>
              </div>

              <button
                onClick={handlePlaceBid}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/20 transition active:scale-[0.98] text-sm"
              >
                Place Bid (0.2 π Fee)
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
