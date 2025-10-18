import { NextRequest, NextResponse } from 'next/server';

// Mock featured creators data
const mockFeaturedCreators = [
  {
    id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Digital artist and designer passionate about creating beautiful experiences through art and technology.',
    avatar: '/avatars/johndoe.jpg',
    coverImage: '/covers/johndoe.jpg',
    category: 'Digital Art',
    tags: ['digital art', 'illustration', 'design', 'creative'],
    socialLinks: [
      {
        id: '1',
        platform: 'instagram',
        url: 'https://instagram.com/johndoe',
        title: 'Instagram',
        icon: '/icons/instagram.svg',
        order: 1,
        isActive: true,
      },
    ],
    stats: {
      followers: 5678,
      products: 12,
      events: 5,
      totalSales: 23400,
    },
    isVerified: true,
    isActive: true,
  },
  {
    id: '3',
    username: 'bobsmith',
    displayName: 'Bob Smith',
    bio: 'UI/UX designer and design system expert helping teams build consistent, beautiful user experiences.',
    avatar: '/avatars/bobsmith.jpg',
    coverImage: '/covers/bobsmith.jpg',
    category: 'Design',
    tags: ['ui/ux', 'design system', 'figma', 'components'],
    socialLinks: [
      {
        id: '5',
        platform: 'linkedin',
        url: 'https://linkedin.com/in/bobsmith',
        title: 'LinkedIn',
        icon: '/icons/linkedin.svg',
        order: 1,
        isActive: true,
      },
    ],
    stats: {
      followers: 7890,
      products: 15,
      events: 2,
      totalSales: 31200,
    },
    isVerified: true,
    isActive: true,
  },
  {
    id: '5',
    username: 'charliebrown',
    displayName: 'Charlie Brown',
    bio: 'Full-stack developer and coding instructor helping others learn modern web development technologies.',
    avatar: '/avatars/charliebrown.jpg',
    coverImage: '/covers/charliebrown.jpg',
    category: 'Education',
    tags: ['coding', 'web development', 'tutorial', 'javascript'],
    socialLinks: [
      {
        id: '9',
        platform: 'github',
        url: 'https://github.com/charliebrown',
        title: 'GitHub',
        icon: '/icons/github.svg',
        order: 1,
        isActive: true,
      },
    ],
    stats: {
      followers: 12345,
      products: 20,
      events: 8,
      totalSales: 45600,
    },
    isVerified: true,
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual API call to your backend
    // const featuredCreators = await fetchFeaturedCreatorsFromBackend();
    
    // For now, return mock data
    return NextResponse.json(mockFeaturedCreators);
  } catch (error) {
    console.error('Error fetching featured creators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
