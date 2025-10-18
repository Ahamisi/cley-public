import { NextRequest, NextResponse } from 'next/server';

// Mock events data - replace with actual API calls to your backend
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
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: '/avatars/johndoe.jpg',
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
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: '/avatars/johndoe.jpg',
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
];

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Replace with actual API call to your backend
    // const events = await fetchUserEventsFromBackend(username, { limit, offset });
    
    // For now, return mock data
    if (username === 'johndoe') {
      // Simulate pagination
      const paginatedEvents = mockEvents.slice(offset, offset + limit);
      return NextResponse.json(paginatedEvents);
    }

    // Return empty array for other users
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
