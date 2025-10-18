import { Metadata } from 'next';
import { ProductCard } from '@/components/public/ProductCard';
import { SearchBar } from '@/components/public/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { publicAPI } from '@/lib/public-api';
import { Product } from '@/types/public';
import { Filter, Grid, List, SortAsc } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Products - Cleyverse Marketplace',
  description: 'Discover amazing products from talented creators on Cleyverse. Shop unique items, digital products, and more.',
  openGraph: {
    title: 'Products - Cleyverse Marketplace',
    description: 'Discover amazing products from talented creators on Cleyverse. Shop unique items, digital products, and more.',
    url: 'https://cley.biz/products',
    siteName: 'Cleyverse',
    images: [
      {
        url: '/og-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleyverse Products Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products - Cleyverse Marketplace',
    description: 'Discover amazing products from talented creators on Cleyverse. Shop unique items, digital products, and more.',
    images: ['/og-products.jpg'],
  },
  alternates: {
    canonical: 'https://cley.biz/products',
  },
};

// Generate structured data for products page
function generateStructuredData(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cleyverse Products',
    description: 'Discover amazing products from talented creators on Cleyverse',
    url: 'https://cley.biz/products',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images[0],
        url: `https://cley.biz/products/${product.slug}`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        brand: {
          '@type': 'Brand',
          name: product.vendor.displayName,
        },
      },
    })),
  };
}

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, sort, page } = searchParams;
  const currentPage = parseInt(page || '1');
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  try {
    // Fetch products with filters
    const [products, featuredProducts] = await Promise.all([
      publicAPI.getProducts({
        category,
        search,
        limit,
        offset,
        sort: sort as any,
      }),
      publicAPI.getFeaturedProducts(),
    ]);

    const structuredData = generateStructuredData(products);

    // Common categories for filtering
    const categories = [
      'Digital Art',
      'Photography',
      'Music',
      'Writing',
      'Design',
      'Coding',
      'Education',
      'Fashion',
      'Health',
      'Technology',
      'Business',
      'Entertainment',
    ];

    const sortOptions = [
      { value: 'newest', label: 'Newest' },
      { value: 'popular', label: 'Most Popular' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
    ];

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-cley-blue to-cley-blue/80 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">
                Discover Amazing Products
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Shop unique items from talented creators around the world
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar 
                  placeholder="Search products..." 
                  className="bg-white/10 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Category Filters */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!category ? "default" : "outline"}
                    size="sm"
                    className={!category ? "bg-cley-blue text-white" : ""}
                  >
                    All Products
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      className={category === cat ? "bg-cley-blue text-white" : ""}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort and View Options */}
              <div className="flex items-center gap-4">
                <select
                  defaultValue={sort || 'newest'}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cley-blue focus:border-cley-blue"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex border border-gray-300 rounded-lg">
                  <Button variant="ghost" size="sm" className="rounded-r-none">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-l-none">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Products Section */}
            {!category && !search && featuredProducts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-outfit font-bold text-cley-blue mb-6">
                  Featured Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showVendor={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-outfit font-bold text-cley-blue">
                  {category ? `${category} Products` : 'All Products'}
                </h2>
                <p className="text-muted-foreground">
                  {products.length} products found
                </p>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showVendor={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No products found. Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {products.length >= limit && (
              <div className="flex justify-center gap-2">
                {currentPage > 1 && (
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                )}
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(products.length / limit)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={currentPage === pageNum ? "bg-cley-blue text-white" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {products.length >= limit && (
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cley-blue mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We're having trouble loading products. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
