import { Metadata } from 'next';
import { EventCard } from '@/components/public/EventCard';
import { SearchBar } from '@/components/public/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { publicAPI } from '@/lib/public-api';
import { Event } from '@/types/public';
import { Filter, Calendar, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Events - Cleyverse Live',
  description: 'Discover amazing events from talented creators on Cleyverse. Join live events, workshops, and experiences.',
  openGraph: {
    title: 'Events - Cleyverse Live',
    description: 'Discover amazing events from talented creators on Cleyverse. Join live events, workshops, and experiences.',
    url: 'https://cley.live/events',
    siteName: 'Cleyverse',
    images: [
      {
        url: '/og-events.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleyverse Events',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events - Cleyverse Live',
    description: 'Discover amazing events from talented creators on Cleyverse. Join live events, workshops, and experiences.',
    images: ['/og-events.jpg'],
  },
  alternates: {
    canonical: 'https://cley.live/events',
  },
};

// Generate structured data for events page
function generateStructuredData(events: Event[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Cleyverse Events',
    description: 'Discover amazing events from talented creators on Cleyverse',
    url: 'https://cley.live/events',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: 'Cleyverse',
      url: 'https://cley.live',
    },
    // Include first few events as examples
    subEvent: events.slice(0, 5).map(event => ({
      '@type': 'Event',
      name: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.isOnline ? {
        '@type': 'VirtualLocation',
        url: event.location.name,
      } : {
        '@type': 'Place',
        name: event.location.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.location.city,
          addressCountry: event.location.country,
        },
      },
      organizer: {
        '@type': 'Person',
        name: event.organizer.displayName,
      },
      offers: {
        '@type': 'Offer',
        price: event.ticketPrice || 0,
        priceCurrency: event.currency,
      },
    })),
  };
}

interface EventsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    upcoming?: string;
    page?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category, search, upcoming, page } = searchParams;
  const currentPage = parseInt(page || '1');
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  try {
    // Fetch events with filters
    const [events, upcomingEvents] = await Promise.all([
      publicAPI.getEvents({
        category,
        search,
        upcoming: upcoming === 'true',
        limit,
        offset,
      }),
      publicAPI.getUpcomingEvents(),
    ]);

    const structuredData = generateStructuredData(events);

    // Common categories for filtering
    const categories = [
      'Workshop',
      'Concert',
      'Conference',
      'Meetup',
      'Webinar',
      'Masterclass',
      'Exhibition',
      'Performance',
      'Sports',
      'Gaming',
      'Art',
      'Technology',
      'Business',
      'Education',
      'Health',
      'Fashion',
    ];

    const getEventStatus = (event: Event) => {
      const now = new Date();
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      if (now < startDate) {
        return { status: 'upcoming', label: 'Upcoming', color: 'bg-green-500' };
      } else if (now >= startDate && now <= endDate) {
        return { status: 'live', label: 'Live', color: 'bg-red-500' };
      } else {
        return { status: 'ended', label: 'Ended', color: 'bg-gray-500' };
      }
    };

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
                Discover Amazing Events
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join live events, workshops, and experiences from talented creators
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar 
                  placeholder="Search events..." 
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
                    All Events
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

              {/* Status Filters */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={upcoming === 'true' ? "default" : "outline"}
                    size="sm"
                    className={upcoming === 'true' ? "bg-cley-blue text-white" : ""}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Upcoming
                  </Button>
                  <Button
                    variant={upcoming === 'false' ? "default" : "outline"}
                    size="sm"
                    className={upcoming === 'false' ? "bg-cley-blue text-white" : ""}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Live Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            {!category && !search && upcomingEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-outfit font-bold text-cley-blue mb-6">
                  Upcoming Events
                </h2>
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
            )}

            {/* Events Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-outfit font-bold text-cley-blue">
                  {category ? `${category} Events` : 'All Events'}
                </h2>
                <p className="text-muted-foreground">
                  {events.length} events found
                </p>
              </div>

              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showOrganizer={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No events found. Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {events.length >= limit && (
              <div className="flex justify-center gap-2">
                {currentPage > 1 && (
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                )}
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(events.length / limit)) }, (_, i) => {
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
                
                {events.length >= limit && (
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
    console.error('Error fetching events:', error);
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cley-blue mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We're having trouble loading events. Please try again later.
          </p>
        </div>
    </div>
  );
}
}