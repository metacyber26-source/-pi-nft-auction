'use client';

import React, { useState, useEffect } from 'react';
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
  const { lang, toggleLanguage } = useLanguage();
  const currentHighestBid = Number(auction.highestBid);
  const [bidAmount, setBidAmount] = useState<number>(currentHighestBid + 1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State Penjual
  const [nftTitle, setNftTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [duration, setDuration] = useState('24');
  const [ssUrl, setSsUrl] = useState('');

  // 1. Eksekusi Pembayaran SDK Pi (Pop-Up)
  const triggerPiPayment = (memo: string, type: 'CREATE_LISTING' | 'PLACE_BID', onSuccess: () => void) => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined' && (window as any).Pi) {
      (window as any).Pi.createPayment(
        {
          amount: 0.2,
          memo: memo,
          metadata: { type, auctionId: auction.id },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            await fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid, paymentType: type, targetId: auction.id }),
            });
            setIsSubmitting(false);
            onSuccess();
          },
          onCancel: () => setIsSubmitting(false),
          onError: (err: any) => {
            console.error(err);
            setIsSubmitting(false);
            alert(lang === 'id' ? 'Pembayaran Gagal atau Dibatalkan' : 'Payment Failed or Cancelled');
          },
        }
      );
    } else {
      // Fallback Simulasi jika diakses di luar Pi Browser
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 1000);
    }
  };

  // 2. Handler Pembeli Klik Penawaran
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= currentHighestBid) {
      alert(lang === 'id' ? 'Penawaran harus lebih tinggi!' : 'Bid must be higher!');
      return;
    }

    triggerPiPayment(
      `Fee Penawaran Lelang NFT #${auction.id}`,
      'PLACE_BID',
      () => {
        alert(lang === 'id' ? 'Pembayaran 0.2 Pi Berhasil! Penawaran Anda telah dipasang.' : '0.2 Pi Fee Paid! Your bid is placed.');
        window.location.reload();
      }
    );
  };

  // 3. Handler Penjual Upload Aset & Listing Fee
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftTitle || !creatorName || !startPrice) {
      alert(lang === 'id' ? 'Lengkapi semua data!' : 'Fill all fields!');
      return;
    }

    triggerPiPayment(
      `Fee Biaya Listing NFT di PiBox Event Zone`,
      'CREATE_LISTING',
      () => {
        alert(lang === 'id' ? 'Pembayaran 0.2 Pi Berhasil! Aset NFT Anda resmi dilelang.' : '0.2 Pi Fee Paid! NFT successfully listed.');
        setShowCreateModal(false);
        window.location.reload();
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-950 text-white font-sans p-4 flex flex-col justify-between">
      <div>
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">PIBOX EVENT ZONE</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3 py-1.5 rounded-xl border border-purple-400/30 shadow-sm transition"
            >
              + {lang === 'id' ? 'Jual NFT' : 'Sell NFT'}
            </button>
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-700 text-slate-300"
            >
              {lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        {/* Main NFT Card Component */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Image & Timer Badge */}
          <div className="relative aspect-square w-full bg-slate-950 border-b border-slate-800">
            <img
              src={auction.piboxSsUrl || 'https://placehold.co/600x600/0f172a/38bdf8?text=PIBOX+NFT+ZONE'}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-400 shadow-md">
              ⏱️ 23h 59m
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-wide">{auction.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'id' ? 'Penjual' : 'Seller'}: <span className="text-cyan-400 font-medium">{auction.creatorName}</span>
              </p>
            </div>

            {/* High-Visibility Verification Banner */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                ⚠️ PIBOX VERIFICATION WARNING
              </div>
              <p className="text-[11px] text-amber-200/80 mb-1.5">
                {lang === 'id'
                  ? 'Pastikan judul dan creator cocok persis dengan list di PIBOX EVENT ZONE:'
                  : 'Ensure exact match on PIBOX EVENT ZONE:'}
              </p>
              <div className="bg-black/40 p-2 rounded-xl text-[10px] font-mono border border-white/5 space-y-0.5">
                <div>Title: <strong className="text-white">{auction.title}</strong></div>
                <div>Creator: <strong className="text-white">{auction.creatorName}</strong></div>
              </div>
            </div>

            {/* Bidding Control Panel */}
            <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{lang === 'id' ? 'Tawaran Tertinggi' : 'Highest Bid'}</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">{currentHighestBid} π</span>
              </div>

              <form onSubmit={handleBidSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    min={currentHighestBid + 0.1}
                    step="0.1"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">π</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Memproses Pi SDK...'
                    : `${lang === 'id' ? 'Ajukan Penawaran' : 'Place Bid'} (0.2 π Fee)`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / POPUP SELLER UPLOAD (0.2 Pi Fee) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">
                {lang === 'id' ? 'Upload Aset NFT PiBox' : 'Upload PiBox NFT Asset'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Judul NFT (Sama dengan PiBox)</label>
                <input
                  type="text"
                  value={nftTitle}
                  onChange={(e) => setNftTitle(e.target.value)}
                  placeholder="Contoh: Dewa Wayang #01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Creator di PiBox</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Contoh: Master Ful21"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Harga Awal (π)</label>
                  <input
                    type="number"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    placeholder="10"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Durasi</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="12">12 Jam</option>
                    <option value="24">24 Jam</option>
                    <option value="48">48 Jam</option>
                    <option value="72">72 Jam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL SS Screenshot NFT</label>
                <input
                  type="url"
                  value={ssUrl}
                  onChange={(e) => setSsUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Memproses Pi SDK...'
                    : `${lang === 'id' ? 'Bayar Fee Listing' : 'Pay Listing Fee'} (0.2 π)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
