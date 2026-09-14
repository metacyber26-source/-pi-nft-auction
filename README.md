# 🚀 Pi Network NFT Auction & Pi Box App

Web application berbasis **Next.js 14**, **Tailwind CSS**, dan **Prisma ORM** yang terintegrasi dengan **Pi Network SDK**. Aplikasi ini mendukung sistem lelang NFT (English & Dutch Auction), mekanisme anti-sniping, transaksi Mystery Box (Pi Box), serta fitur *royalty split* otomatis.

---

## 🛠️ Tech Stack & Features

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Mobile-First / Samsung Galaxy A16 Viewport Optimized)
- **Database**: PostgreSQL (Neon DB via Prisma ORM)
- **Blockchain / Payments**: Pi Network SDK (Approval & Completion Handler)
- **Localization**: Dual Language Support (Bahasa Indonesia & English via Context API)

---

## 📂 Project Structure

```text
.
├── prisma/
│   └── schema.prisma        # Database Schema & Models
├── public/
│   └── locales/             # Dictionary JSONs (id.json & en.json)
├── src/
│   ├── app/
│   │   ├── api/             # Pi Network & Auction REST Endpoints
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # Reusable Mobile-First Components
│   ├── context/             # Language & Pi Network Context Providers
│   └── lib/                 # Database & SDK Clients
├── package.json
├── next.config.js
└── tailwind.config.js
