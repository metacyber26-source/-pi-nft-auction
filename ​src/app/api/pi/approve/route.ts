import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();

    // Verify payment with Pi Network Server API
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to approve payment with Pi Network' }, { status: 400 });
    }

    return NextResponse.json({ status: 'APPROVED' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
