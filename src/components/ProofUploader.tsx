'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ProofUploaderProps {
  auctionId: string;
  role: 'SELLER' | 'BUYER';
}

export const ProofUploader: React.FC<ProofUploaderProps> = ({ auctionId, role }) => {
  const { lang } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('auctionId', auctionId);
    formData.append('role', role);

    try {
      const res = await fetch('/api/proof', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert(lang === 'id' ? 'Bukti berhasil diunggah!' : 'Proof uploaded successfully!');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto my-4 text-white">
      <h3 className="text-sm font-bold mb-1">
        {role === 'SELLER'
          ? lang === 'id' ? 'Unggah Bukti Listing PiBox (Batas 24 Jam)' : 'Upload PiBox Listing Proof (24h Limit)'
          : lang === 'id' ? 'Unggah Bukti Pembelian PiBox' : 'Upload PiBox Purchase Proof'}
      </h3>
      <p className="text-xs text-slate-400 mb-3">
        {role === 'SELLER'
          ? lang === 'id' ? 'Unggah tangkapan layar bahwa NFT telah dilisting sesuai harga pemenang.' : 'Upload screenshot showing NFT listed at winning price.'
          : lang === 'id' ? 'Unggah tangkapan layar bukti transaksi telah selesai.' : 'Upload screenshot of completed transaction.'}
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold text-xs py-2 rounded-lg disabled:opacity-50 transition"
      >
        {uploading
          ? lang === 'id' ? 'Mengunggah...' : 'Uploading...'
          : lang === 'id' ? 'Kirim Bukti Verification' : 'Submit Proof Verification'}
      </button>
    </div>
  );
};
