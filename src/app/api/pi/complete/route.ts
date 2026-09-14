import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PLATFORM_FEE_PERCENTAGE = 0.025; // 2.5% Platform Fee

export async function POST(req: Request) {
  try {
    const { paymentId, txid, auctionId, userId } = await req.json();

    // Complete transaction via Pi API
    const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    if (!piResponse.ok) {
      return NextResponse.json({ error: 'Pi Network completion failed' }, { status: 400 });
    }

    const paymentData = await piResponse.json();
    const totalAmount = paymentData.amount;

    // Calculate Financial Royalty Splits
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { nft: true },
    });

    if (!auction) throw new Error('Auction not found');

    const platformFee = totalAmount * PLATFORM_FEE_PERCENTAGE;
    const royaltyFeePaid = totalAmount * auction.nft.royaltyFee;
    const sellerAmount = totalAmount - (platformFee + royaltyFeePaid);

    // Record Transaction & Transfer Ownership
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          piPaymentId: paymentId,
          txHash: txid,
          userId: userId,
          amount: totalAmount,
          platformFee,
          royaltyFeePaid,
          sellerAmount,
        },
      }),
      prisma.nft.update({
        where: { id: auction.nftId },
        data: { ownerId: userId },
      }),
      prisma.auction.update({
        where: { id: auctionId },
        data: { status: 'ENDED' },
      }),
    ]);

    return NextResponse.json({ success: true, txid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
