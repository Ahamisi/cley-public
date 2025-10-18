'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingCart, Package } from 'lucide-react';

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  title: string;
  price: number;
  image?: string;
  variantName?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  currency?: string;
}

export function OrderSummary({ items, currency = 'NGN' }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping for now
  const tax = 0; // No tax for now
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${item.productId}-${item.variantId || 'default'}-${index}`} className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground">Variant: {item.variantName}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="font-medium text-sm">{formatPrice(item.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="text-green-600">
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-cley-blue">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <span>Secure checkout powered by Paystack</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            🔒 SSL Secured
          </Badge>
          <Badge variant="outline" className="text-xs">
            💳 Multiple Payment Methods
          </Badge>
          <Badge variant="outline" className="text-xs">
            🚚 Fast Delivery
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
