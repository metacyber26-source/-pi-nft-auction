'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function NFTAuctionPage() {
  const [bidAmount, setBidAmount] = useState<string>('11');
  const [piUser, setPiUser] = useState<{ username: string; uid: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        window.Pi.init({ version: '2.0', sandbox: true });
        authenticatePiUser();
      } catch (err) {
        console.error('Inisialisasi Pi SDK gagal:', err);
      }
    }
  }, []);

  const authenticatePiUser = async () => {
    if (!window.Pi) return;
    try {
      const auth = await window.Pi.authenticate(['username', 'payments'], (payment: any) => {
        console.log('Incomplete payment found:', payment);
      });
      setPiUser({
        username: auth.user.username,
        uid: auth.user.uid,
      });
    } catch (error) {
      console.error('Autentikasi gagal:', error);
    }
  };

  const handlePlaceBid = async () => {
    if (!window.Pi) {
      alert('Buka aplikasi melalui Pi Browser untuk bertransaksi!');
      return;
    }

    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid) || numericBid <= 10) {
      alert('Penawaran harus lebih besar dari Highest Bid (10 π)');
      return;
    }

    const totalAmount = (numericBid + 0.2).toFixed(2);
    setIsLoading(true);

    try {
      await window.Pi.createPayment(
        {
          amount: parseFloat(totalAmount),
          memo: `Bid NFT Special Edition (${bidAmount} π + 0.2 π Fee)`,
          metadata: { nftId: 'pi-special-01', bidder: piUser?.username || 'Master Ful21' },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log('Payment ID ready for approval:', paymentId);
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            alert(`Transaksi Berhasil!\nTXID: ${txid}`);
            setIsLoading(false);
          },
          onCancel: () => {
            alert('Transaksi dibatalkan.');
            setIsLoading(false);
          },
          onError: (error: Error) => {
            console.error('Payment Error:', error);
            alert('Terjadi kesalahan pembayaran.');
            setIsLoading(false);
          },
        }
      );
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 md:p-8">
      {/* Navigation Header */}
      <header className="w-full max-w-md flex items-center justify-between py-3 px-4 bg-slate-900 border border-slate-800 rounded-xl mb-4 text-xs font-semibold shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">PIBOX EVENT ZONE</span>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition">
            + Sell NFT
          </button>
        </div>
        <div className="flex items-center gap-2">
          {piUser && (
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
              @{piUser.username}
            </span>
          )}
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition">
            🇬🇧 EN
          </button>
        </div>
      </header>

      {/* Main Auction Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* NFT Image Display */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex flex-col items-center justify-center p-6 border-b border-slate-800">
          <h1 className="text-4xl font-extrabold text-cyan-400 tracking-tight drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] text-center">
            NFT Auction
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Timer Badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-950/80 w-fit px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
            <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono">23h 59m</span>
          </div>

          {/* Title & Seller */}
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Pi Network NFT Special Edition
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Seller: <span className="text-cyan-400 font-semibold">Master Ful21</span>
            </p>
          </div>

          {/* Anti-Fraud Warning Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
              <span>⚠️</span> PIBOX VERIFICATION WARNING
            </div>
            <p className="text-xs text-slate-300">
              Ensure exact match on <strong className="text-white">PIBOX EVENT ZONE</strong>:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 pl-2 border-l-2 border-amber-500/40 font-mono">
              <li>Title: <span className="text-slate-200">Pi Network NFT Special Edition</span></li>
              <li>Creator: <span className="text-slate-200">Master Ful21</span></li>
            </ul>
          </div>

          {/* Bidding Control */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-medium text-slate-400">Highest Bid</span>
              <span className="text-xl font-black text-cyan-400 font-mono">10 π</span>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-3 px-4 text-white text-sm outline-none transition font-mono font-bold pr-10"
                  disabled={isLoading}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  π
                </span>
              </div>

              <button
                onClick={handlePlaceBid}
                disabled={isLoading}
                className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition active:scale-[0.98] text-sm flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isLoading ? (
                  <span>Memproses Transaksi...</span>
                ) : (
                  `Place Bid (${(parseFloat(bidAmount || '0') + 0.2).toFixed(1)} π Total)`
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
