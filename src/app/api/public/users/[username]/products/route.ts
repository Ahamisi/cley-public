import { NextRequest, NextResponse } from 'next/server';

// Mock products data - replace with actual API calls to your backend
const mockProducts = [
  {
    id: '1',
    title: 'Digital Art Collection',
    description: 'A stunning collection of digital artworks featuring vibrant colors and unique compositions.',
    slug: 'digital-art-collection',
    price: 49.99,
    originalPrice: 79.99,
    currency: 'USD',
    images: ['/products/digital-art-1.jpg', '/products/digital-art-2.jpg'],
    variants: [
      {
        id: '1',
        name: 'Standard',
        price: 49.99,
        stock: 100,
        attributes: { size: '1920x1080', format: 'PNG' },
      },
      {
        id: '2',
        name: 'Premium',
        price: 79.99,
        stock: 50,
        attributes: { size: '4K', format: 'PNG + PSD' },
      },
    ],
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
    id: '2',
    title: 'Photography Presets',
    description: 'Professional photography presets for portrait and landscape photography.',
    slug: 'photography-presets',
    price: 29.99,
    currency: 'USD',
    images: ['/products/presets-1.jpg', '/products/presets-2.jpg'],
    category: 'Photography',
    tags: ['photography', 'presets', 'lightroom', 'photoshop'],
    vendor: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: '/avatars/johndoe.jpg',
    },
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
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
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: '/avatars/johndoe.jpg',
    },
    rating: 4.9,
    reviewCount: 234,
    badge: 'New',
    isActive: true,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
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
    // const products = await fetchUserProductsFromBackend(username, { limit, offset });
    
    // For now, return mock data
    if (username === 'johndoe') {
      // Simulate pagination
      const paginatedProducts = mockProducts.slice(offset, offset + limit);
      return NextResponse.json(paginatedProducts);
    }

    // Return empty array for other users
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching user products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
