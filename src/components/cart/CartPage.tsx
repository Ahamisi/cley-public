'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  title: string;
  price: number;
  image?: string;
  variantName?: string;
}

export function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const savedCart = localStorage.getItem('cleyverse-cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          setCartItems(Array.isArray(items) ? items : []);
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      setIsLoading(false);
    };

    loadCartItems();
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem('cleyverse-cart', JSON.stringify(newItems));
    
    // Dispatch custom event to update header cart count
    const cartUpdatedEvent = new CustomEvent('cartUpdated', {
      detail: { cartItems: newItems }
    });
    window.dispatchEvent(cartUpdatedEvent);
    
    // Also trigger storage event for cross-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cleyverse-cart',
      newValue: JSON.stringify(newItems),
      storageArea: localStorage
    }));
  };

  const updateQuantity = (productId: string, variantId: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    updateCart(updatedItems);
    toast.success('Cart updated');
  };

  const removeItem = (productId: string, variantId: string | undefined) => {
    const updatedItems = cartItems.filter(item => 
      !(item.productId === productId && item.variantId === variantId)
    );
    updateCart(updatedItems);
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    updateCart([]);
    toast.success('Cart cleared');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cley-blue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-cley-blue mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart to get started.
        </p>
        <Button onClick={() => router.push('/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-outfit font-bold text-cley-blue">
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        <Button variant="outline" onClick={clearCart}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <Card key={`${item.productId}-${item.variantId || 'default'}-${index}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg line-clamp-2">{item.title}</h3>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Variant: {item.variantName}
                      </p>
                    )}
                    <p className="text-lg font-semibold text-cley-blue mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, item.variantId, parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center border-0"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-cley-blue">{formatPrice(total)}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white h-12"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/products')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
