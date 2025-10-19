'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/public";
import { motion } from "framer-motion";
import { useState } from "react";
import { publicAPI } from "@/lib/public-api";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  username?: string;
  showVendor?: boolean;
}

export function ProductCard({ product, username, showVendor = true }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    try {
      await publicAPI.trackClick('product', product.id, username);
    } catch (error) {
      console.error('Failed to track like:', error);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Track the add to cart event
      await publicAPI.trackClick('product', product.id, username);
      
      // Here you would typically add to cart logic
      // For now, we'll just show a success state
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-cley-yellow fill-current' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Link href={`/products/${product.slug}`}>
              <Image
                src={product.images?.[0] || '/placeholder-product.svg'}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-cley-blue text-cley-blue' : 'text-gray-600'}`} />
              </Button>
            </div>
            
            {/* Badge */}
            {product.badge && (
              <Badge className="absolute top-3 left-3 bg-cley-yellow text-black font-medium">
                {product.badge}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3">
          {/* Vendor Info */}
          {showVendor && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-6 w-6 rounded-full bg-cley-lightBlue flex items-center justify-center">
                <span className="text-xs font-medium text-cley-blue">
                  {product.vendor.displayName.charAt(0)}
                </span>
              </div>
              <span>{product.vendor.displayName}</span>
            </div>
          )}
          
          {/* Title and Description */}
          <div className="space-y-2">
            <Link href={`/products/${product.slug}`}>
              <CardTitle className="text-lg font-outfit line-clamp-2 hover:text-cley-blue transition-colors cursor-pointer">
                {product.title}
              </CardTitle>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          
          {/* Rating */}
          {product.rating && product.reviewCount && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xl font-bold text-cley-blue">
                {formatPrice(product.price, product.currency)}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-cley-blue hover:bg-cley-blue/90 text-white"
              size="sm"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
