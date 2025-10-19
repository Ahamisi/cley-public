'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  processor: string;
  name: string;
  priority: number;
  methods: string[];
  features: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  icon: string;
  description: string;
  supportedCurrencies: string[];
  supportedRegions: string[];
  isRecommended: boolean;
}

interface PaymentMethodSelectorProps {
  currency: string;
  country: string;
  amount: number;
  onSelect: (method: PaymentMethod) => void;
  selected: PaymentMethod | null;
}

export function PaymentMethodSelector({ 
  currency, 
  country, 
  amount, 
  onSelect, 
  selected 
}: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [recommended, setRecommended] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currency) params.append('currency', currency);
      if (country) params.append('country', country);
      if (amount) params.append('amount', amount.toString());

      const response = await fetch(`/api/payment-methods?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentMethods(data.methods || []);
        setRecommended(data.recommended);
        
        // Auto-select recommended method
        if (data.recommended && !selected) {
          onSelect(data.recommended);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch payment methods');
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      toast.error('Failed to load payment methods. Please try again.');
      
      // Fallback to default Paystack method
      const fallbackMethod: PaymentMethod = {
        processor: 'paystack',
        name: 'Paystack',
        priority: 1,
        methods: ['card', 'bank_transfer', 'mobile_money'],
        features: ['secure', 'instant_settlement'],
        fees: {
          percentage: 1.5,
          fixed: 0,
          currency: currency || 'NGN'
        },
        icon: '/paystack-logo.png',
        description: 'Secure payment processing',
        supportedCurrencies: [currency || 'NGN'],
        supportedRegions: [country || 'NG'],
        isRecommended: true
      };
      
      setPaymentMethods([fallbackMethod]);
      setRecommended(fallbackMethod);
      onSelect(fallbackMethod);
    } finally {
      setLoading(false);
    }
  }, [currency, country, amount, onSelect]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const formatMethods = (methods: string[]) => {
    return methods.map(method => 
      method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.processor}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selected?.processor === method.processor
                ? 'border-cley-blue bg-cley-blue/5 ring-2 ring-cley-blue/20'
                : 'border-gray-200 hover:border-cley-blue'
            }`}
            onClick={() => onSelect(method)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {method.icon ? (
                    <img 
                      src={method.icon} 
                      alt={method.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-cley-blue rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{method.name}</h4>
                    {method.isRecommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {method.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {method.methods.slice(0, 3).map((methodType) => (
                      <Badge key={methodType} variant="outline" className="text-xs">
                        {methodType.replace('_', ' ')}
                      </Badge>
                    ))}
                    {method.methods.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{method.methods.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Fee: {method.fees.percentage}% + {method.fees.fixed} {method.fees.currency}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {selected?.processor === method.processor && (
                  <div className="w-5 h-5 bg-cley-blue rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {paymentMethods.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payment methods available</p>
            <p className="text-sm">Please try again later</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
