import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    if (!email || !orderNumber) {
      return NextResponse.json(
        { message: 'Email and order number are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Tracking order:', { email, orderNumber });

    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('orderNumber', orderNumber);

    const response = await fetch(`${backendUrl}/orders/track?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Backend order tracking failed:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Order not found',
          error: data.error || 'Unknown error'
        },
        { status: response.status }
      );
    }

    console.log('✅ Order tracked successfully');
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Order tracking error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
