import { NextResponse } from 'next/server';
import axios from 'axios';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { paymentId, txid, paymentType, targetId } = await request.json();
    const piApiKey = process.env.PI_API_KEY;

    // Complete Payment via Pi API
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          Authorization: `Key ${piApiKey}`,
        },
      }
    );

    // Business Logic Execution based on Payment Type
    if (paymentType === 'CREATE_AUCTION_FEE') {
      await prisma.auction.update({
        where: { id: targetId },
        data: { status: 'ACTIVE' },
      });
    } else if (paymentType === 'BID_ENTRY_FEE') {
      await prisma.bid.update({
        where: { id: targetId },
        data: { feePaid: true },
      });
    }

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Pi Payment Completion Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Payment Completion Failed' }, { status: 500 });
  }
}
