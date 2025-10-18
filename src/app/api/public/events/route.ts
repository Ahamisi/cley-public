import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Digital Art Workshop',
    description: 'Learn the fundamentals of digital art and create stunning illustrations using modern techniques.',
    slug: 'digital-art-workshop',
    coverImage: '/events/digital-art-workshop.jpg',
    startDate: '2024-03-15T14:00:00Z',
    endDate: '2024-03-15T17:00:00Z',
    location: {
      name: 'Online Event',
      city: 'Virtual',
      country: 'Global',
    },
    organizer: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: '/avatars/johndoe.jpg',
    },
    category: 'Workshop',
    tags: ['digital art', 'workshop', 'online', 'beginner'],
    ticketPrice: 49.99,
    currency: 'USD',
    capacity: 50,
    soldTickets: 32,
    isOnline: true,
    isActive: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
  },
  {
    id: '2',
    title: 'Photography Masterclass',
    description: 'Advanced photography techniques for professional results. Perfect for intermediate photographers.',
    slug: 'photography-masterclass',
    coverImage: '/events/photography-masterclass.jpg',
    startDate: '2024-03-22T10:00:00Z',
    endDate: '2024-03-22T16:00:00Z',
    location: {
      name: 'Creative Studio',
      address: '123 Art Street',
      city: 'New York',
      country: 'USA',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    },
    organizer: {
      id: '2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: '/avatars/janedoe.jpg',
    },
    category: 'Masterclass',
    tags: ['photography', 'masterclass', 'in-person', 'advanced'],
    ticketPrice: 199.99,
    currency: 'USD',
    capacity: 20,
    soldTickets: 15,
    isOnline: false,
    isActive: true,
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: '3',
    title: 'Design Portfolio Review',
    description: 'Get professional feedback on your design portfolio and learn how to improve your presentation.',
    slug: 'design-portfolio-review',
    coverImage: '/events/portfolio-review.jpg',
    startDate: '2024-02-28T18:00:00Z',
    endDate: '2024-02-28T20:00:00Z',
    location: {
      name: 'Online Event',
      city: 'Virtual',
      country: 'Global',
    },
    organizer: {
      id: '3',
      username: 'bobsmith',
      displayName: 'Bob Smith',
      avatar: '/avatars/bobsmith.jpg',
    },
    category: 'Webinar',
    tags: ['design', 'portfolio', 'review', 'feedback'],
    ticketPrice: 0,
    currency: 'USD',
    capacity: 100,
    soldTickets: 67,
    isOnline: true,
    isActive: true,
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-20T10:45:00Z',
  },
  {
    id: '4',
    title: 'Music Production Workshop',
    description: 'Learn the basics of music production and create your first track using modern software.',
    slug: 'music-production-workshop',
    coverImage: '/events/music-production.jpg',
    startDate: '2024-04-05T15:00:00Z',
    endDate: '2024-04-05T18:00:00Z',
    location: {
      name: 'Online Event',
      city: 'Virtual',
      country: 'Global',
    },
    organizer: {
      id: '4',
      username: 'alicejohnson',
      displayName: 'Alice Johnson',
      avatar: '/avatars/alicejohnson.jpg',
    },
    category: 'Workshop',
    tags: ['music', 'production', 'workshop', 'beginner'],
    ticketPrice: 79.99,
    currency: 'USD',
    capacity: 30,
    soldTickets: 12,
    isOnline: true,
    isActive: true,
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const upcoming = searchParams.get('upcoming');
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Replace with actual API call to your backend
    // const events = await fetchEventsFromBackend({ category, search, upcoming, limit, offset });
    
    // For now, filter mock data
    let filteredEvents = [...mockEvents];

    // Filter by category
    if (category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by upcoming
    if (upcoming === 'true') {
      const now = new Date();
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.startDate) > now
      );
    }

    // Sort by start date
    filteredEvents.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Apply pagination
    const paginatedEvents = filteredEvents.slice(offset, offset + limit);

    return NextResponse.json(paginatedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
