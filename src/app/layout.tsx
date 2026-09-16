import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Pi Network NFT Auction',
  description: 'Aplikasi Lelang NFT Pi Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
