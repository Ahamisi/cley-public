import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/public/ProductCard';
import { ProductDetails } from '@/components/public/ProductDetails';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { publicAPI } from '@/lib/public-api';
import { Product } from '@/types/public';
import { Star, Heart, Share2, ShoppingCart, ArrowLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    // For now, we'll use a mapping to find the store URL for the product
    // TODO: Backend should provide a way to get store URL from product slug
    const productStoreMapping: Record<string, string> = {
      'sample-product': 'aceman',
      'jermaine-book': 'aceman',
      // Add more mappings as needed
    };
    
    const storeUrl = productStoreMapping[params.slug];
    if (!storeUrl) {
      return {
        title: 'Product Not Found',
        description: 'Product not found',
      };
    }
    
    const product = await publicAPI.getProduct(storeUrl, params.slug);
    
    return {
      title: `${product.title} - ${product.vendor.displayName} | Cleyverse`,
      description: product.description,
      openGraph: {
        title: `${product.title} - ${product.vendor.displayName}`,
        description: product.description,
        url: `https://cley.biz/products/${product.slug}`,
        siteName: 'Cleyverse',
        images: [
          {
            url: product.images[0] || '/og-default.jpg',
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} - ${product.vendor.displayName}`,
        description: product.description,
        images: [product.images[0] || '/og-default.jpg'],
      },
      alternates: {
        canonical: `https://cley.biz/products/${product.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found - Cleyverse',
      description: 'The requested product could not be found.',
    };
  }
}

// Generate structured data for product
function generateStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    url: `https://cley.biz/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: product.vendor.displayName,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.vendor.displayName,
      },
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
    category: product.category,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    // Try to get store URL from product data first
    // For now, we'll use a mapping as fallback
    const productStoreMapping: Record<string, string> = {
      'sample-product': 'aceman',
      'jermaine-book': 'aceman',
      // Add more mappings as needed
    };
    
    let storeUrl = productStoreMapping[params.slug];
    
    // TODO: In the future, we should be able to get store URL from product data
    // or have a separate endpoint to resolve product slug to store URL
    if (!storeUrl) {
      notFound();
    }
    
    const product = await publicAPI.getProduct(storeUrl, params.slug);
    
    // Fetch related products
    const relatedProducts = await publicAPI.getProducts({
      category: product.category,
      limit: 4,
    }).then(products => products.filter(p => p.id !== product.id));

    const structuredData = generateStructuredData(product);

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
          className={`h-5 w-5 ${
            i < Math.floor(rating) 
              ? 'text-cley-yellow fill-current' 
              : 'text-gray-300'
          }`} 
        />
      ));
    };

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/products?category=${product.category}`}>
                    {product.category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder-product.svg'}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
                        <Image
                          src={image}
                          alt={`${product.title} - Image ${index + 2}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <ProductDetails product={product} />
            </div>

            {/* Product Details Tabs */}
            <div className="mt-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="vendor">Vendor</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-muted-foreground">
                      Reviews will be displayed here once implemented.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="vendor" className="mt-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={product.vendor.avatar} alt={product.vendor.displayName} />
                        <AvatarFallback className="bg-cley-blue text-white text-xl">
                          {product.vendor.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-outfit font-bold text-cley-blue">
                          {product.vendor.displayName}
                        </h3>
                        <p className="text-muted-foreground">
                          @{product.vendor.username}
                        </p>
                      </div>
                    </div>
                    <Button asChild className="bg-cley-blue hover:bg-cley-blue/90 text-white">
                      <Link href={`/${product.vendor.username}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-outfit font-bold text-cley-blue mb-6">
                  Related Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                      showVendor={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
