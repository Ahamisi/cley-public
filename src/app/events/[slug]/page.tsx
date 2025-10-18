import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventCard } from '@/components/public/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { publicAPI } from '@/lib/public-api';
import { Event } from '@/types/public';
import { Calendar, MapPin, Clock, Users, Share2, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface EventPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  try {
    // For now, we'll use a mock event structure
    const event = {
      id: params.slug,
      title: 'Sample Event',
      description: 'This is a sample event description',
      startDate: new Date().toISOString(),
      slug: params.slug,
      image: '/placeholder-event.jpg',
      organizer: {
        displayName: 'Sample Organizer',
        username: 'organizer'
      }
    };
    
    return {
      title: `${event.title} - ${format(parseISO(event.startDate), 'MMM dd, yyyy')} | Cleyverse Events`,
      description: event.description,
      openGraph: {
        title: `${event.title} - ${format(parseISO(event.startDate), 'MMM dd, yyyy')}`,
        description: event.description,
        url: `https://cley.live/events/${event.slug}`,
        siteName: 'Cleyverse',
        images: [
          {
            url: event.image || '/og-default.jpg',
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${event.title} - ${format(parseISO(event.startDate), 'MMM dd, yyyy')}`,
        description: event.description,
        images: [event.image || '/og-default.jpg'],
      },
      alternates: {
        canonical: `https://cley.live/events/${event.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Event Not Found - Cleyverse',
      description: 'The requested event could not be found.',
    };
  }
}

// Generate structured data for event
function generateStructuredData(event: Event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    image: event.coverImage,
    url: `https://cley.live/events/${event.slug}`,
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
        streetAddress: event.location.address,
      },
      geo: event.location.coordinates ? {
        '@type': 'GeoCoordinates',
        latitude: event.location.coordinates.lat,
        longitude: event.location.coordinates.lng,
      } : undefined,
    },
    organizer: {
      '@type': 'Person',
      name: event.organizer.displayName,
      url: `https://cley.me/${event.organizer.username}`,
    },
    offers: {
      '@type': 'Offer',
      price: event.ticketPrice || 0,
      priceCurrency: event.currency,
      availability: event.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isOnline ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
  };
}

export default async function EventPage({ params }: EventPageProps) {
  try {
    const event = await publicAPI.getEvent(params.slug);
    
    // Fetch related events
    const relatedEvents = await publicAPI.getEvents({
      category: event.category,
      limit: 4,
    }).then(events => events.filter(e => e.id !== event.id));

    const structuredData = generateStructuredData(event);

    const formatPrice = (price: number, currency: string) => {
      if (price === 0) return 'Free';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(price);
    };

    const formatEventDate = (dateString: string) => {
      try {
        const date = parseISO(dateString);
        return format(date, 'EEEE, MMMM dd, yyyy');
      } catch {
        return dateString;
      }
    };

    const formatEventTime = (dateString: string) => {
      try {
        const date = parseISO(dateString);
        return format(date, 'h:mm a');
      } catch {
        return '';
      }
    };

    const getEventStatus = () => {
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

    const eventStatus = getEventStatus();

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
                  <BreadcrumbLink href="/events">Events</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/events?category=${event.category}`}>
                    {event.category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{event.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Event Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Cover */}
                <div className="aspect-video bg-white rounded-lg shadow-sm border overflow-hidden">
                  <Image
                    src={event.coverImage || '/placeholder-event.jpg'}
                    alt={event.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Event Info */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="space-y-6">
                    {/* Title and Status */}
                    <div className="space-y-3">
                      <Badge className={`${eventStatus.color} text-white`}>
                        {eventStatus.label}
                      </Badge>
                      <h1 className="text-3xl font-outfit font-bold text-cley-blue">
                        {event.title}
                      </h1>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-cley-blue" />
                        <div>
                          <p className="font-medium">{formatEventDate(event.startDate)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-cley-blue" />
                        <div>
                          <p className="font-medium">
                            {event.isOnline ? 'Online Event' : event.location.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {event.isOnline ? 'Virtual Location' : `${event.location.city}, ${event.location.country}`}
                          </p>
                        </div>
                      </div>

                      {event.capacity && (
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-cley-blue" />
                          <div>
                            <p className="font-medium">
                              {event.soldTickets || 0} / {event.capacity} tickets
                            </p>
                            <p className="text-sm text-muted-foreground">Capacity</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-cley-blue" />
                        <div>
                          <p className="font-medium">{event.category}</p>
                          <p className="text-sm text-muted-foreground">Category</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-outfit font-semibold text-cley-blue mb-3">
                        About This Event
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details Tabs */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="organizer">Organizer</TabsTrigger>
                      <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-outfit font-semibold text-cley-blue">
                          Event Information
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Date:</span>
                            <span className="font-medium">{formatEventDate(event.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">End Date:</span>
                            <span className="font-medium">{formatEventDate(event.endDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">
                              {event.isOnline ? 'Online Event' : `${event.location.name}, ${event.location.city}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">{event.category}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="organizer" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-outfit font-semibold text-cley-blue">
                          Event Organizer
                        </h3>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={event.organizer.avatar} alt={event.organizer.displayName} />
                            <AvatarFallback className="bg-cley-blue text-white text-xl">
                              {event.organizer.displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-xl font-outfit font-bold text-cley-blue">
                              {event.organizer.displayName}
                            </h4>
                            <p className="text-muted-foreground">
                              @{event.organizer.username}
                            </p>
                          </div>
                        </div>
                        <Button asChild className="bg-cley-blue hover:bg-cley-blue/90 text-white">
                          <Link href={`/${event.organizer.username}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="tickets" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-outfit font-semibold text-cley-blue">
                          Ticket Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium">General Admission</p>
                              <p className="text-sm text-muted-foreground">
                                {event.capacity ? `Limited to ${event.capacity} attendees` : 'Unlimited capacity'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-cley-blue">
                                {formatPrice(event.ticketPrice || 0, event.currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ticket Purchase */}
                <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-cley-blue">
                        {formatPrice(event.ticketPrice || 0, event.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">per ticket</p>
                    </div>

                    <Button 
                      className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white h-12"
                      disabled={eventStatus.status === 'ended' || !event.isActive}
                    >
                      {eventStatus.status === 'ended' ? 'Event Ended' : 'Get Tickets'}
                    </Button>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    {event.capacity && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tickets Available</span>
                          <span>{event.capacity - (event.soldTickets || 0)} remaining</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-cley-blue h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(((event.soldTickets || 0) / event.capacity) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-outfit font-semibold text-cley-blue mb-4">
                    Organized by
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={event.organizer.avatar} alt={event.organizer.displayName} />
                      <AvatarFallback className="bg-cley-blue text-white">
                        {event.organizer.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{event.organizer.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        @{event.organizer.username}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/${event.organizer.username}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-outfit font-bold text-cley-blue mb-6">
                  Related Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedEvents.map((relatedEvent) => (
                    <EventCard
                      key={relatedEvent.id}
                      event={relatedEvent}
                      showOrganizer={true}
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
    console.error('Error fetching event:', error);
    notFound();
  }
}
