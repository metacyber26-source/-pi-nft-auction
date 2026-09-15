import React from 'react';
import Script from 'next/script';
import './globals.css'; // Wajib di-import agar Tailwind CSS aktif!

export const metadata = {
  title: 'Pi Network NFT Auction',
  description: 'Aplikasi Lelang NFT Pi Network',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        {/* Load SDK Resmi Pi Network secara asinkron sebelum halaman interaktif */}
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
