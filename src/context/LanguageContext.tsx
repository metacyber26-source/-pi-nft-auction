'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    title: 'Sistem Lelang NFT Pi Network',
    placeBid: 'Ajukan Penawaran',
    highestBid: 'Penawaran Tertinggi',
    timeRemaining: 'Sisa Waktu',
    seller: 'Penjual',
    bidHistory: 'Riwayat Penawaran',
    enterAmount: 'Masukkan jumlah Pi',
    auctionEnded: 'Lelang Telah Berakhir',
  },
  en: {
    title: 'Pi Network NFT Auction System',
    placeBid: 'Place Bid',
    highestBid: 'Highest Bid',
    timeRemaining: 'Time Remaining',
    seller: 'Seller',
    bidHistory: 'Bid History',
    enterAmount: 'Enter Pi amount',
    auctionEnded: 'Auction Ended',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
