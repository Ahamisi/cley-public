import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
      id: '2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: '/avatars/janedoe.jpg',
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
    id: '4',
    title: 'Music Production Pack',
    description: 'High-quality music production samples and loops for modern electronic music.',
    slug: 'music-production-pack',
    price: 79.99,
    currency: 'USD',
    images: ['/products/music-pack-1.jpg', '/products/music-pack-2.jpg'],
    category: 'Music',
    tags: ['music', 'production', 'samples', 'electronic'],
    vendor: {
      id: '4',
      username: 'alicejohnson',
      displayName: 'Alice Johnson',
      avatar: '/avatars/alicejohnson.jpg',
    },
    rating: 4.7,
    reviewCount: 123,
    isActive: true,
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-22T12:30:00Z',
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
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'newest';

    // TODO: Replace with actual API call to your backend
    // const products = await fetchProductsFromBackend({ category, search, limit, offset, sort });
    
    // For now, filter mock data
    let filteredProducts = [...mockProducts];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort products
    switch (sort) {
      case 'popular':
        filteredProducts.sort((a, b) => b.reviewCount! - a.reviewCount!);
        break;
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return NextResponse.json(paginatedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
