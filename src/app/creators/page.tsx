import { Metadata } from 'next';
import { SearchBar } from '@/components/public/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { publicAPI } from '@/lib/public-api';
import { Creator } from '@/types/public';
import { Users, ArrowRight, Star, ShoppingBag, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Creators - Cleyverse',
  description: 'Discover talented creators on Cleyverse. Find amazing artists, designers, educators, and professionals from around the world.',
  openGraph: {
    title: 'Creators - Cleyverse',
    description: 'Discover talented creators on Cleyverse. Find amazing artists, designers, educators, and professionals from around the world.',
    url: 'https://cley.me/creators',
    siteName: 'Cleyverse',
    images: [
      {
        url: '/og-creators.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleyverse Creators',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creators - Cleyverse',
    description: 'Discover talented creators on Cleyverse. Find amazing artists, designers, educators, and professionals from around the world.',
    images: ['/og-creators.jpg'],
  },
  alternates: {
    canonical: 'https://cley.me/creators',
  },
};

interface CreatorsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
  };
}

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const { category, search, page } = searchParams;
  const currentPage = parseInt(page || '1');
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  try {
    // Fetch creators with filters
    const [creators, featuredCreators] = await Promise.all([
      publicAPI.getCreators({
        category,
        search,
        limit,
        offset,
      }),
      publicAPI.getFeaturedCreators(),
    ]);

    // Common categories for filtering
    const categories = [
      'Digital Art',
      'Photography',
      'Music',
      'Design',
      'Education',
      'Technology',
      'Business',
      'Fashion',
      'Health',
      'Entertainment',
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cley-blue to-cley-blue/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">
              Discover Amazing Creators
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with talented creators from around the world and explore their amazing content
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search creators..." 
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
                  All Creators
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
          </div>

          {/* Featured Creators Section */}
          {!category && !search && featuredCreators.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-outfit font-bold text-cley-blue mb-6">
                Featured Creators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCreators.slice(0, 3).map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            </div>
          )}

          {/* Creators Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-outfit font-bold text-cley-blue">
                {category ? `${category} Creators` : 'All Creators'}
              </h2>
              <p className="text-muted-foreground">
                {creators.length} creators found
              </p>
            </div>

            {creators.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No creators found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {creators.length >= limit && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && (
                <Button variant="outline" size="sm">
                  Previous
                </Button>
              )}
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, Math.ceil(creators.length / limit)) }, (_, i) => {
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
              
              {creators.length >= limit && (
                <Button variant="outline" size="sm">
                  Next
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching creators:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cley-blue mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We're having trouble loading creators. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

// Creator Card Component
function CreatorCard({ creator }: { creator: Creator }) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-300">
      <div className="text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-20 w-20 mx-auto ring-4 ring-cley-lightBlue">
            <AvatarImage src={creator.avatar} alt={creator.displayName} />
            <AvatarFallback className="bg-cley-blue text-white text-xl font-outfit">
              {creator.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {creator.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-cley-blue rounded-full p-1">
              <Star className="h-4 w-4 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Name and Bio */}
        <div className="space-y-2">
          <h3 className="text-lg font-outfit font-bold text-cley-blue">
            {creator.displayName}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {creator.bio}
          </p>
          <Badge variant="outline" className="bg-cley-lightBlue text-cley-blue border-cley-blue/20">
            {creator.category}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-cley-blue">
              {formatNumber(creator.stats.followers)}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold text-cley-blue">
              {creator.stats.products}
            </p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
          <div>
            <p className="text-lg font-bold text-cley-blue">
              {creator.stats.events}
            </p>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white">
          <Link href={`/${creator.username}`}>
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
