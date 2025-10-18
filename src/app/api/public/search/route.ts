import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock search data - replace with actual API calls to your backend
const mockSearchData = {
  users: [
    {
      id: '1',
      type: 'user',
      title: 'John Doe',
      description: 'Digital artist and designer passionate about creating beautiful experiences.',
      image: '/avatars/johndoe.jpg',
      url: '/johndoe',
      metadata: { username: 'johndoe', verified: true },
    },
    {
      id: '2',
      type: 'user',
      title: 'Jane Doe',
      description: 'Professional photographer specializing in portrait and landscape photography.',
      image: '/avatars/janedoe.jpg',
      url: '/janedoe',
      metadata: { username: 'janedoe', verified: false },
    },
  ],
  creators: [
    {
      id: '1',
      type: 'creator',
      title: 'John Doe',
      description: 'Featured digital artist with over 10 years of experience in creative design.',
      image: '/avatars/johndoe.jpg',
      url: '/creators/johndoe',
      metadata: { username: 'johndoe', category: 'Digital Art', followers: 5678 },
    },
    {
      id: '2',
      type: 'creator',
      title: 'Jane Doe',
      description: 'Award-winning photographer and creative director.',
      image: '/avatars/janedoe.jpg',
      url: '/creators/janedoe',
      metadata: { username: 'janedoe', category: 'Photography', followers: 4321 },
    },
  ],
  products: [
    {
      id: '1',
      type: 'product',
      title: 'Digital Art Collection',
      description: 'A stunning collection of digital artworks featuring vibrant colors and unique compositions.',
      image: '/products/digital-art-1.jpg',
      url: '/products/digital-art-collection',
      metadata: { price: 49.99, currency: 'USD', category: 'Digital Art', rating: 4.8 },
    },
    {
      id: '2',
      type: 'product',
      title: 'Photography Presets',
      description: 'Professional photography presets for portrait and landscape photography.',
      image: '/products/presets-1.jpg',
      url: '/products/photography-presets',
      metadata: { price: 29.99, currency: 'USD', category: 'Photography', rating: 4.6 },
    },
    {
      id: '3',
      type: 'product',
      title: 'Design System Template',
      description: 'Complete design system template with components, colors, and typography guidelines.',
      image: '/products/design-system-1.jpg',
      url: '/products/design-system-template',
      metadata: { price: 99.99, currency: 'USD', category: 'Design', rating: 4.9 },
    },
  ],
  events: [
    {
      id: '1',
      type: 'event',
      title: 'Digital Art Workshop',
      description: 'Learn the fundamentals of digital art and create stunning illustrations using modern techniques.',
      image: '/events/digital-art-workshop.jpg',
      url: '/events/digital-art-workshop',
      metadata: { 
        startDate: '2024-03-15T14:00:00Z', 
        location: 'Online Event', 
        category: 'Workshop',
        price: 49.99,
        currency: 'USD'
      },
    },
    {
      id: '2',
      type: 'event',
      title: 'Photography Masterclass',
      description: 'Advanced photography techniques for professional results. Perfect for intermediate photographers.',
      image: '/events/photography-masterclass.jpg',
      url: '/events/photography-masterclass',
      metadata: { 
        startDate: '2024-03-22T10:00:00Z', 
        location: 'New York, USA', 
        category: 'Masterclass',
        price: 199.99,
        currency: 'USD'
      },
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';

    if (!query) {
      return NextResponse.json([]);
    }

    // TODO: Replace with actual API call to your backend
    // const results = await searchFromBackend(query, type);
    
    // For now, perform mock search
    const searchLower = query.toLowerCase();
    let results: any[] = [];

    // Search users
    if (type === 'all' || type === 'users') {
      results.push(...mockSearchData.users.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.metadata.username.toLowerCase().includes(searchLower)
      ));
    }

    // Search creators
    if (type === 'all' || type === 'creators') {
      results.push(...mockSearchData.creators.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.metadata.username.toLowerCase().includes(searchLower) ||
        item.metadata.category.toLowerCase().includes(searchLower)
      ));
    }

    // Search products
    if (type === 'all' || type === 'products') {
      results.push(...mockSearchData.products.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.metadata.category.toLowerCase().includes(searchLower)
      ));
    }

    // Search events
    if (type === 'all' || type === 'events') {
      results.push(...mockSearchData.events.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.metadata.category.toLowerCase().includes(searchLower) ||
        item.metadata.location.toLowerCase().includes(searchLower)
      ));
    }

    // Limit results to prevent overwhelming responses
    const limitedResults = results.slice(0, 50);

    return NextResponse.json(limitedResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
