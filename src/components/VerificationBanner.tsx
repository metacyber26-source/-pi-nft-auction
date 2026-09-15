'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface VerificationBannerProps {
  title: string;
  creatorName: string;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ title, creatorName }) => {
  const { lang } = useLanguage();

  return (
    <div className="my-3 p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-amber-200 text-xs leading-relaxed shadow-sm">
      <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-bold">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{lang === 'id' ? 'PERINGATAN VERIFIKASI PIBOX' : 'PIBOX VERIFICATION WARNING'}</span>
      </div>
      <p className="mb-2">
        {lang === 'id'
          ? 'Sebelum melakukan penawaran, pastikan data berikut SAMA PERSIS dengan listing di PIBOX NFT EVENT ZONE:'
          : 'Before placing a bid, ensure the following details EXACTLY MATCH the listing in PIBOX NFT EVENT ZONE:'}
      </p>
      <ul className="space-y-1 bg-black/30 p-2 rounded-lg font-mono text-[11px] border border-white/5">
        <li>
          <span className="text-gray-400">Title:</span> <strong className="text-white">{title}</strong>
        </li>
        <li>
          <span className="text-gray-400">Creator:</span> <strong className="text-white">{creatorName}</strong>
        </li>
      </ul>
    </div>
  );
};
