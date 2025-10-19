'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingCart, Heart, Share2, CreditCard, Star } from 'lucide-react';
import { Product } from '@/types/public';
import Link from 'next/link';
import { toast } from 'sonner';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const handleAddToCart = async () => {
    console.log('🛒 Add to cart clicked!');
    console.log('Selected variant:', selectedVariant);
    console.log('Quantity:', quantity);
    console.log('Product:', product);
    
    if (!selectedVariant) {
      console.log('❌ No variant selected');
      toast.error('Please select a variant');
      return;
    }

    setIsAddingToCart(true);
    try {
      // Get existing cart items
      const existingCart = localStorage.getItem('cleyverse-cart');
      console.log('Existing cart:', existingCart);
      const cartItems = existingCart ? JSON.parse(existingCart) : [];
      console.log('Parsed cart items:', cartItems);

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.productId === product.id && item.variantId === selectedVariant.id
      );
      console.log('Existing item index:', existingItemIndex);

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += quantity;
        console.log('Updated existing item quantity');
      } else {
        // Add new item to cart
        const newItem = {
          productId: product.id,
          variantId: selectedVariant.id,
          quantity: quantity,
          title: product.title,
          price: selectedVariant.price,
          image: product.images[0],
          variantName: selectedVariant.name
        };
        cartItems.push(newItem);
        console.log('Added new item to cart:', newItem);
      }

      console.log('Final cart items:', cartItems);

      // Save to localStorage
      localStorage.setItem('cleyverse-cart', JSON.stringify(cartItems));
      console.log('✅ Saved to localStorage');
      
      // Dispatch custom event to update header cart count
      const cartUpdatedEvent = new CustomEvent('cartUpdated', {
        detail: { cartItems }
      });
      window.dispatchEvent(cartUpdatedEvent);
      console.log('✅ Dispatched cartUpdated event');
      
      // Also trigger storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cleyverse-cart',
        newValue: JSON.stringify(cartItems),
        storageArea: localStorage
      }));
      console.log('✅ Dispatched storage event');
      
      toast.success(`${quantity} x ${product.title} (${selectedVariant.name}) added to cart!`);
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    setIsBuyingNow(true);
    try {
      // Redirect to checkout with product details
      const checkoutUrl = new URL('/checkout', window.location.origin);
      checkoutUrl.searchParams.set('product', product.id);
      checkoutUrl.searchParams.set('variant', selectedVariant.id);
      checkoutUrl.searchParams.set('quantity', '1');
      checkoutUrl.searchParams.set('title', product.title);
      checkoutUrl.searchParams.set('price', selectedVariant.price.toString());
      checkoutUrl.searchParams.set('variantName', selectedVariant.name);
      
      window.location.href = checkoutUrl.toString();
    } catch (error) {
      toast.error('Failed to proceed to checkout');
      setIsBuyingNow(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Vendor Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={product.vendor.avatar} alt={product.vendor.displayName} />
          <AvatarFallback className="bg-cley-blue text-white">
            {product.vendor.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">Sold by</p>
          <Link 
            href={`/${product.vendor.username}`}
            className="font-medium text-cley-blue hover:underline"
          >
            {product.vendor.displayName}
          </Link>
        </div>
      </div>

      {/* Title and Badge */}
      <div className="space-y-3">
        {product.badge && (
          <Badge className="bg-cley-yellow text-black font-medium">
            {product.badge}
          </Badge>
        )}
        <h1 className="text-3xl font-outfit font-bold text-cley-blue">
          {product.title}
        </h1>
      </div>

      {/* Rating */}
      {product.rating && product.reviewCount && (
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2">
        <p className="text-3xl font-bold text-cley-blue">
          {formatPrice(selectedVariant?.price || product.price, product.currency)}
        </p>
        {product.originalPrice && (
          <p className="text-lg text-muted-foreground line-through">
            {formatPrice(product.originalPrice, product.currency)}
          </p>
        )}
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Variants</h3>
          <div className="grid grid-cols-2 gap-3">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedVariant?.id === variant.id
                    ? 'border-cley-blue bg-cley-blue/5 ring-2 ring-cley-blue/20'
                    : 'border-gray-200 hover:border-cley-blue'
                }`}
              >
                <p className="font-medium">{variant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(variant.price, product.currency)}
                </p>
                {variant.stock > 0 ? (
                  <p className="text-xs text-green-600 mt-1">
                    {variant.stock} in stock
                  </p>
                ) : (
                  <p className="text-xs text-red-600 mt-1">Out of stock</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <h3 className="font-medium">Quantity</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center"
            min="1"
            max={selectedVariant?.stock || 99}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
            className="h-10 w-10"
          >
            +
          </Button>
        </div>
        {selectedVariant && (
          <p className="text-sm text-muted-foreground">
            {selectedVariant.stock} available
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedVariant || selectedVariant.stock === 0}
            className="flex-1 bg-cley-blue hover:bg-cley-blue/90 text-white h-12"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button 
            onClick={handleBuyNow}
            disabled={isBuyingNow || !selectedVariant || selectedVariant.stock === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isBuyingNow ? 'Processing...' : 'Buy Now'}
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="h-12 w-12">
            <Heart className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
