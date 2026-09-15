'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { VerificationBanner } from './VerificationBanner';

interface AuctionProps {
  auction: {
    id: string;
    title: string;
    creatorName: string;
    piboxSsUrl: string;
    highestBid: Float64Array | number;
    expiresAt: string;
    status: string;
  };
  currentUserPiId: string;
}

export const AuctionManager: React.FC<AuctionProps> = ({ auction, currentUserPiId }) => {
  const { lang } = useLanguage();
  const [bidAmount, setBidAmount] = useState<number>(Number(auction.highestBid) + 1);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Anti-Sniping & Countdown Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(auction.expiresAt).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        setTimeLeft(lang === 'id' ? 'LELANG SELESAI' : 'AUCTION ENDED');
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.expiresAt, lang]);

  const handlePlaceBid = async () => {
    if (bidAmount <= auction.highestBid) {
      alert(lang === 'id' ? 'Penawaran harus lebih tinggi dari saat ini!' : 'Bid must be higher than current bid!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Initiate 0.2 Pi Fee via Pi SDK
      window.Pi.createPayment(
        {
          amount: 0.2,
          memo: `Bidding entry fee for auction #${auction.id}`,
          metadata: { auctionId: auction.id, type: 'BID_ENTRY_FEE' },
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
            // Post bid & trigger anti-sniping check on server
            const res = await fetch('/api/bids', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                auctionId: auction.id,
                bidderId: currentUserPiId,
                amount: bidAmount,
                paymentId,
                txid,
              }),
            });

            if (res.ok) {
              alert(lang === 'id' ? 'Penawaran Berhasil!' : 'Bid Placed Successfully!');
              window.location.reload();
            }
          },
          onCancel: () => setIsSubmitting(false),
          onError: (err: any) => {
            console.error(err);
            setIsSubmitting(false);
          },
        }
      );
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-white">
      {/* Visual Image Display */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
        <img src={auction.piboxSsUrl} alt={auction.title} className="object-cover w-full h-full" />
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30">
          ⏱️ {timeLeft}
        </div>
      </div>

      <h2 className="text-lg font-bold truncate">{auction.title}</h2>
      <p className="text-xs text-slate-400 mb-2">Creator: <span className="text-slate-200">{auction.creatorName}</span></p>

      {/* Cross-Check Anti-Fraud Banner */}
      <VerificationBanner title={auction.title} creatorName={auction.creatorName} />

      {/* Bidding Section */}
      <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800/80">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-slate-400">{lang === 'id' ? 'Tawaran Tertinggi' : 'Highest Bid'}</span>
          <span className="text-base font-extrabold text-cyan-400 font-mono">{auction.highestBid} π</span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            min={Number(auction.highestBid) + 0.1}
            step="0.1"
          />
          <button
            onClick={handlePlaceBid}
            disabled={isSubmitting || auction.status !== 'ACTIVE'}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-sm py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 shrink-0"
          >
            {isSubmitting
              ? lang === 'id' ? 'Memproses...' : 'Processing...'
              : lang === 'id' ? 'Tawar (0.2 π Fee)' : 'Bid (0.2 π Fee)'}
          </button>
        </div>
      </div>
    </div>
  );
};
