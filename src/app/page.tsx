import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/public/SearchBar';
import { ProductCard } from '@/components/public/ProductCard';
import { EventCard } from '@/components/public/EventCard';
import { publicAPI } from '@/lib/public-api';
import { Product, Event } from '@/types/public';
import { ArrowRight, Star, Users, ShoppingBag, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  // Fetch featured content with error handling
  let featuredProducts: Product[] = [];
  let upcomingEvents: Event[] = [];
  
  try {
    const [productsResult, eventsResult] = await Promise.allSettled([
      publicAPI.getFeaturedProducts(),
      publicAPI.getUpcomingEvents(),
    ]);
    
    if (productsResult.status === 'fulfilled') {
      featuredProducts = productsResult.value;
    }
    
    if (eventsResult.status === 'fulfilled') {
      upcomingEvents = eventsResult.value;
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    // Continue with empty arrays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cley-blue to-cley-blue/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-outfit font-bold mb-6">
          Cleyverse
        </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Create without walls. Discover amazing products, events, and connect with talented creators worldwide.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              placeholder="Search creators, products, events..." 
              className="bg-white/10 backdrop-blur-sm"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-cley-yellow hover:bg-cley-yellow/90 text-black">
              <Link href="/products">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cley-blue">
              <Link href="/events">
                <Calendar className="h-5 w-5 mr-2" />
                Find Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-outfit font-bold text-cley-blue mb-2">10M+</div>
              <div className="text-muted-foreground">Creators</div>
            </div>
            <div>
              <div className="text-3xl font-outfit font-bold text-cley-blue mb-2">50M+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div>
              <div className="text-3xl font-outfit font-bold text-cley-blue mb-2">100K+</div>
              <div className="text-muted-foreground">Events</div>
            </div>
            <div>
              <div className="text-3xl font-outfit font-bold text-cley-blue mb-2">$1B+</div>
              <div className="text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-outfit font-bold text-cley-blue">
                Featured Products
              </h2>
              <Button asChild variant="outline" className="border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white">
                <Link href="/products">
                  View All Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
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
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-cley-lightBlue/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-outfit font-bold text-cley-blue">
                Upcoming Events
              </h2>
              <Button asChild variant="outline" className="border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white">
                <Link href="/events">
                  View All Events
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showOrganizer={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-outfit font-bold text-cley-blue mb-4">
              Explore Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover content across different categories and find exactly what you're looking for.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Digital Art', icon: '🎨', count: '2.5K' },
              { name: 'Photography', icon: '📸', count: '1.8K' },
              { name: 'Music', icon: '🎵', count: '3.2K' },
              { name: 'Design', icon: '🎨', count: '2.1K' },
              { name: 'Education', icon: '📚', count: '1.5K' },
              { name: 'Technology', icon: '💻', count: '2.8K' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="group p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:border-cley-blue"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-medium text-cley-blue group-hover:text-cley-blue/80">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.count} products
        </p>
      </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cley-blue to-cley-blue/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of creators and start building your presence on Cleyverse today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-cley-yellow hover:bg-cley-yellow/90 text-black">
              <Link href="/register">
                Create Account
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cley-blue">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

