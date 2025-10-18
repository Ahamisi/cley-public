import { Metadata } from 'next';
import { OrderTrackingForm } from '@/components/checkout/OrderTrackingForm';

export const metadata: Metadata = {
  title: 'Track Your Order - Cleyverse',
  description: 'Track your order status and delivery information',
};

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-outfit font-bold text-cley-blue mb-2">
              Track Your Order
            </h1>
            <p className="text-muted-foreground">
              Enter your order details to check the status
            </p>
          </div>
          
          <OrderTrackingForm />
        </div>
      </div>
    </div>
  );
}
