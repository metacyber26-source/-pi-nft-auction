'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    connected: 'Terhubung',
    disconnected: 'Terputus',
    activeAuctions: 'Lelang Aktif',
    bidsWon: 'Lelang Dimenangkan',
    proofPending: 'Bukti Tertunda',
    trustScore: 'Skor Kepercayaan',
    warningTitle: 'PERINGATAN VERIFIKASI PIBOX',
    warningText: 'Pastikan 3 elemen berikut cocok secara PERSIS di PIBOX EVENT ZONE sebelum bertransaksi:',
    checkItem1: 'Gambar Screenshot NFT',
    checkItem2: 'Judul NFT (Huruf besar/kecil & spasi harus identik)',
    checkItem3: 'Nama Kreator / Penjual',
    highestBid: 'Penawaran Tertinggi',
    timeRemaining: 'Sisa Waktu',
    bidNow: 'Tawar Sekarang',
    buyNow: 'Beli Langsung',
    verifiedListed: 'Terverifikasi di PiBox',
    pendingListing: 'Menunggu Bukti Listing',
    uploadProof: 'Unggah Bukti Screenshot',
    dragDropText: 'Tarik & lepas screenshot PiBox di sini, atau klik untuk memilih file',
    sellerProof: 'Bukti Listing Penjual',
    buyerProof: 'Bukti Pembelian Pembeli',
    bidHistory: 'Riwayat Penawaran',
    submitProof: 'Kirim Bukti',
    close: 'Tutup',
  },
  en: {
    connected: 'Connected',
    disconnected: 'Disconnected',
    activeAuctions: 'Active Auctions',
    bidsWon: 'Bids Won',
    proofPending: 'Proof Pending',
    trustScore: 'Trust Score',
    warningTitle: 'PIBOX VERIFICATION WARNING',
    warningText: 'Ensure the following 3 elements match EXACTLY on PIBOX EVENT ZONE before transacting:',
    checkItem1: 'NFT Screenshot Image',
    checkItem2: 'NFT Title (Case & space sensitive exact match)',
    checkItem3: 'Creator / Seller Name',
    highestBid: 'Highest Bid',
    timeRemaining: 'Time Remaining',
    bidNow: 'Bid Now',
    buyNow: 'Buy Now',
    verifiedListed: 'Verified on PiBox',
    pendingListing: 'Pending Listing SS',
    uploadProof: 'Upload Screenshot Proof',
    dragDropText: 'Drag & drop PiBox screenshot here, or click to browse',
    sellerProof: 'Seller Listing Proof',
    buyerProof: 'Buyer Purchase Proof',
    bidHistory: 'Bid History',
    submitProof: 'Submit Proof',
    close: 'Close',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
