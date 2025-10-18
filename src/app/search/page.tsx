import { Metadata } from 'next';
import { SearchBar } from '@/components/public/SearchBar';
import { ProductCard } from '@/components/public/ProductCard';
import { EventCard } from '@/components/public/EventCard';
import { ProfileHeader } from '@/components/public/ProfileHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { publicAPI } from '@/lib/public-api';
import { SearchResult } from '@/types/public';
import { Search, Filter, Users, ShoppingBag, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search - Cleyverse',
  description: 'Search for creators, products, and events on Cleyverse. Discover amazing content from talented creators around the world.',
  openGraph: {
    title: 'Search - Cleyverse',
    description: 'Search for creators, products, and events on Cleyverse. Discover amazing content from talented creators around the world.',
    url: 'https://cley.me/search',
    siteName: 'Cleyverse',
    images: [
      {
        url: '/og-search.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleyverse Search',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search - Cleyverse',
    description: 'Search for creators, products, and events on Cleyverse. Discover amazing content from talented creators around the world.',
    images: ['/og-search.jpg'],
  },
  alternates: {
    canonical: 'https://cley.me/search',
  },
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query, type } = searchParams;

  // If no query, show search interface
  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cley-blue to-cley-blue/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">
              Search Cleyverse
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover creators, products, and events from talented people around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search creators, products, events..." 
                className="bg-white/10 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-outfit font-bold text-cley-blue mb-4">
              What are you looking for?
            </h2>
            <p className="text-muted-foreground mb-8">
              Try searching for creators, products, events, or categories
            </p>
            
            {/* Popular Searches */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Digital Art',
                  'Photography',
                  'Music',
                  'Workshops',
                  'Design',
                  'Coding',
                  'Fashion',
                  'Technology',
                  'Business',
                  'Education'
                ].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="hover:bg-cley-blue hover:text-white"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    // Perform search
    const searchResults = await publicAPI.search(query, type as any);
    
    // Group results by type
    const resultsByType = {
      users: searchResults.filter(result => result.type === 'user'),
      creators: searchResults.filter(result => result.type === 'creator'),
      products: searchResults.filter(result => result.type === 'product'),
      events: searchResults.filter(result => result.type === 'event'),
    };

    const totalResults = searchResults.length;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search creators, products, events..."
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-muted-foreground">
                {totalResults} results for "{query}"
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">
                All ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users ({resultsByType.users.length})
              </TabsTrigger>
              <TabsTrigger value="creators">
                <Users className="h-4 w-4 mr-2" />
                Creators ({resultsByType.creators.length})
              </TabsTrigger>
              <TabsTrigger value="products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Products ({resultsByType.products.length})
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="h-4 w-4 mr-2" />
                Events ({resultsByType.events.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-8">
                {/* Users & Creators */}
                {(resultsByType.users.length > 0 || resultsByType.creators.length > 0) && (
                  <div>
                    <h2 className="text-xl font-outfit font-bold text-cley-blue mb-4">
                      People
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...resultsByType.users, ...resultsByType.creators].map((result) => (
                        <div key={result.id} className="bg-white rounded-lg shadow-sm border p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-cley-lightBlue flex items-center justify-center">
                              <span className="text-lg font-medium text-cley-blue">
                                {result.title.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-cley-blue">{result.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {result.description}
                              </p>
                            </div>
                          </div>
                          <Button asChild className="w-full mt-4 bg-cley-blue hover:bg-cley-blue/90 text-white">
                            <a href={result.url}>View Profile</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {resultsByType.products.length > 0 && (
                  <div>
                    <h2 className="text-xl font-outfit font-bold text-cley-blue mb-4">
                      Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resultsByType.products.map((result) => (
                        <div key={result.id} className="bg-white rounded-lg shadow-sm border p-4">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            {result.image && (
                              <img 
                                src={result.image} 
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <h3 className="font-medium text-cley-blue mb-2">{result.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {result.description}
                          </p>
                          <Button asChild className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white">
                            <a href={result.url}>View Product</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events */}
                {resultsByType.events.length > 0 && (
                  <div>
                    <h2 className="text-xl font-outfit font-bold text-cley-blue mb-4">
                      Events
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resultsByType.events.map((result) => (
                        <div key={result.id} className="bg-white rounded-lg shadow-sm border p-4">
                          <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            {result.image && (
                              <img 
                                src={result.image} 
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <h3 className="font-medium text-cley-blue mb-2">{result.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {result.description}
                          </p>
                          <Button asChild className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white">
                            <a href={result.url}>View Event</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {totalResults === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-outfit font-bold text-cley-blue mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or browse our categories
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Digital Art', 'Photography', 'Music', 'Workshops', 'Design'].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          className="hover:bg-cley-blue hover:text-white"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resultsByType.users.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-cley-lightBlue flex items-center justify-center">
                        <span className="text-lg font-medium text-cley-blue">
                          {result.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-cley-blue">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4 bg-cley-blue hover:bg-cley-blue/90 text-white">
                      <a href={result.url}>View Profile</a>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="creators" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resultsByType.creators.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-cley-lightBlue flex items-center justify-center">
                        <span className="text-lg font-medium text-cley-blue">
                          {result.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-cley-blue">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4 bg-cley-blue hover:bg-cley-blue/90 text-white">
                      <a href={result.url}>View Profile</a>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resultsByType.products.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-cley-blue mb-2">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {result.description}
                    </p>
                    <Button asChild className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white">
                      <a href={result.url}>View Product</a>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resultsByType.events.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-cley-blue mb-2">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {result.description}
                    </p>
                    <Button asChild className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white">
                      <a href={result.url}>View Event</a>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cley-blue mb-4">
            Search Error
          </h1>
          <p className="text-muted-foreground">
            We're having trouble with the search. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
