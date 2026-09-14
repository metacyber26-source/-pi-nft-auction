import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ANTI_SNIPING_WINDOW_MS = 3 * 60 * 1000; // 3 minutes
const EXTENSION_TIME_MS = 3 * 60 * 1000; // Extend by 3 minutes

export async function POST(req: Request) {
  try {
    const { auctionId, amount, userId } = await req.json();

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction || auction.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Auction inactive' }, { status: 400 });
    }

    if (amount <= auction.currentPrice) {
      return NextResponse.json({ error: 'Bid must be higher than current price' }, { status: 400 });
    }

    const now = new Date().getTime();
    const auctionEndTime = new Date(auction.endTime).getTime();
    let antiSnipingTriggered = false;
    let newEndTime = auction.endTime;

    // Check if anti-sniping rule should trigger
    if (auctionEndTime - now <= ANTI_SNIPING_WINDOW_MS) {
      antiSnipingTriggered = true;
      newEndTime = new Date(auctionEndTime + EXTENSION_TIME_MS);
    }

    await prisma.$transaction([
      prisma.bid.create({
        data: {
          auctionId,
          bidderId: userId,
          amount,
        },
      }),
      prisma.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: amount,
          endTime: newEndTime,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      currentPrice: amount,
      endTime: newEndTime,
      antiSnipingTriggered,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
