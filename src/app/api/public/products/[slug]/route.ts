import { NextRequest, NextResponse } from 'next/server';

// Mock product data - replace with actual API calls to your backend
const mockProducts = [
  {
    id: '1',
    title: 'Digital Art Collection',
    description: 'A stunning collection of digital artworks featuring vibrant colors and unique compositions. This collection includes 15 high-resolution digital paintings that showcase modern artistic techniques and contemporary design principles. Perfect for digital art enthusiasts, designers, and anyone looking to add beautiful artwork to their projects.',
    slug: 'digital-art-collection',
    price: 49.99,
    originalPrice: 79.99,
    currency: 'USD',
    images: [
      '/products/digital-art-1.jpg',
      '/products/digital-art-2.jpg',
      '/products/digital-art-3.jpg',
      '/products/digital-art-4.jpg',
    ],
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
    tags: ['digital art', 'illustration', 'modern', 'abstract', 'contemporary', 'high-resolution'],
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
    description: 'Professional photography presets for portrait and landscape photography. This comprehensive pack includes 50 carefully crafted presets that will transform your photos with just one click. Perfect for photographers of all skill levels.',
    slug: 'photography-presets',
    price: 29.99,
    currency: 'USD',
    images: [
      '/products/presets-1.jpg',
      '/products/presets-2.jpg',
      '/products/presets-3.jpg',
    ],
    category: 'Photography',
    tags: ['photography', 'presets', 'lightroom', 'photoshop', 'portrait', 'landscape'],
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
    description: 'Complete design system template with components, colors, and typography guidelines. This comprehensive template includes over 100 components, detailed documentation, and everything you need to build consistent, beautiful user interfaces.',
    slug: 'design-system-template',
    price: 99.99,
    originalPrice: 149.99,
    currency: 'USD',
    images: [
      '/products/design-system-1.jpg',
      '/products/design-system-2.jpg',
      '/products/design-system-3.jpg',
    ],
    category: 'Design',
    tags: ['design system', 'ui/ux', 'figma', 'components', 'template', 'documentation'],
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
];

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // TODO: Replace with actual API call to your backend
    // const product = await fetchProductFromBackend(slug);
    
    // For now, find product in mock data
    const product = mockProducts.find(p => p.slug === slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
