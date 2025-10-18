import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const { storeId } = params;

    console.log('🔍 Creating order for store:', storeId);
    console.log('🔍 Order data:', JSON.stringify(body, null, 2));

    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/stores/${storeId}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Backend order creation failed:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Order creation failed',
          error: data.error || 'Unknown error'
        },
        { status: response.status }
      );
    }

    console.log('✅ Order created successfully:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
