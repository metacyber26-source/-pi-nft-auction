import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    const piApiKey = process.env.PI_API_KEY;

    // Call Pi Server API to approve payment
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${piApiKey}`,
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Pi Payment Approval Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Payment Approval Failed' }, { status: 500 });
  }
}
