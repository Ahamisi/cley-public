import { NextRequest, NextResponse } from 'next/server';

// Mock featured products data
const mockFeaturedProducts = [
  {
    id: '1',
    title: 'Digital Art Collection',
    description: 'A stunning collection of digital artworks featuring vibrant colors and unique compositions.',
    slug: 'digital-art-collection',
    price: 49.99,
    originalPrice: 79.99,
    currency: 'USD',
    images: ['/products/digital-art-1.jpg', '/products/digital-art-2.jpg'],
    category: 'Digital Art',
    tags: ['digital art', 'illustration', 'modern', 'abstract'],
    vendor: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: '/avatars/johndoe.jpg',
    },
    rating: 4.8,
    reviewCount: 156,
    badge: 'Best Seller',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '3',
    title: 'Design System Template',
    description: 'Complete design system template with components, colors, and typography guidelines.',
    slug: 'design-system-template',
    price: 99.99,
    originalPrice: 149.99,
    currency: 'USD',
    images: ['/products/design-system-1.jpg', '/products/design-system-2.jpg'],
    category: 'Design',
    tags: ['design system', 'ui/ux', 'figma', 'components'],
    vendor: {
      id: '3',
      username: 'bobsmith',
      displayName: 'Bob Smith',
      avatar: '/avatars/bobsmith.jpg',
    },
    rating: 4.9,
    reviewCount: 234,
    badge: 'New',
    isActive: true,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
  },
  {
    id: '5',
    title: 'Coding Tutorial Series',
    description: 'Comprehensive coding tutorial series covering modern web development technologies.',
    slug: 'coding-tutorial-series',
    price: 149.99,
    originalPrice: 199.99,
    currency: 'USD',
    images: ['/products/coding-tutorial-1.jpg', '/products/coding-tutorial-2.jpg'],
    category: 'Education',
    tags: ['coding', 'tutorial', 'web development', 'javascript'],
    vendor: {
      id: '5',
      username: 'charliebrown',
      displayName: 'Charlie Brown',
      avatar: '/avatars/charliebrown.jpg',
    },
    rating: 4.9,
    reviewCount: 567,
    badge: 'Featured',
    isActive: true,
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-25T14:45:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual API call to your backend
    // const featuredProducts = await fetchFeaturedProductsFromBackend();
    
    return NextResponse.json(mockFeaturedProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
