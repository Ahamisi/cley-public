import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Successful - Cleyverse',
  description: 'Your order has been placed successfully',
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-outfit font-bold text-cley-blue">
              Order Successful!
            </CardTitle>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed and payment processed.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cley-blue rounded-full"></div>
                  You'll receive an order confirmation email shortly
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cley-blue rounded-full"></div>
                  Your order is being prepared for shipment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cley-blue rounded-full"></div>
                  You'll get tracking information once shipped
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link href="/order/track">
                  <Package className="h-4 w-4 mr-2" />
                  Track Order
                </Link>
              </Button>
            </div>

            {/* Support */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Need help with your order?
              </p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/support">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
