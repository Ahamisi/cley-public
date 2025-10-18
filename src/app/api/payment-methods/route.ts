import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'NGN';
    const country = searchParams.get('country') || 'NG';
    const amount = searchParams.get('amount') || '0';

    console.log('🔍 Fetching payment methods:', { currency, country, amount });

    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams();
    if (currency) params.append('currency', currency);
    if (country) params.append('country', country);
    if (amount) params.append('amount', amount);

    const response = await fetch(`${backendUrl}/payment-methods?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Backend payment methods fetch failed:', data);
      
      // Return fallback payment method
      return NextResponse.json({
        message: 'Payment methods retrieved successfully',
        currency,
        country,
        amount: parseFloat(amount),
        methods: [
          {
            processor: 'paystack',
            name: 'Paystack',
            priority: 1,
            methods: ['card', 'bank_transfer', 'mobile_money', 'ussd', 'qr_code'],
            features: ['instant_settlement', 'low_fees', 'local_banking'],
            fees: {
              percentage: 1.5,
              fixed: 0,
              currency: currency
            },
            icon: 'https://paystack.com/assets/img/paystack-logo.png',
            description: 'Fast and secure payments. Supports cards, bank transfers, and mobile money.',
            supportedCurrencies: [currency],
            supportedRegions: [country],
            isRecommended: true
          }
        ],
        recommended: {
          processor: 'paystack',
          name: 'Paystack',
          priority: 1,
          methods: ['card', 'bank_transfer', 'mobile_money', 'ussd', 'qr_code'],
          features: ['instant_settlement', 'low_fees', 'local_banking'],
          fees: {
            percentage: 1.5,
            fixed: 0,
            currency: currency
          },
          isRecommended: true
        }
      });
    }

    console.log('✅ Payment methods fetched successfully');
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Payment methods fetch error:', error);
    
    // Return fallback payment method
    return NextResponse.json({
      message: 'Payment methods retrieved successfully',
      currency: 'NGN',
      country: 'NG',
      amount: 0,
      methods: [
        {
          processor: 'paystack',
          name: 'Paystack',
          priority: 1,
          methods: ['card', 'bank_transfer', 'mobile_money'],
          features: ['secure', 'instant_settlement'],
          fees: {
            percentage: 1.5,
            fixed: 0,
            currency: 'NGN'
          },
          icon: 'https://paystack.com/assets/img/paystack-logo.png',
          description: 'Secure payment processing',
          supportedCurrencies: ['NGN'],
          supportedRegions: ['NG'],
          isRecommended: true
        }
      ],
      recommended: {
        processor: 'paystack',
        name: 'Paystack',
        priority: 1,
        methods: ['card', 'bank_transfer', 'mobile_money'],
        features: ['secure', 'instant_settlement'],
        fees: {
          percentage: 1.5,
          fixed: 0,
          currency: 'NGN'
        },
        isRecommended: true
      }
    });
  }
}
