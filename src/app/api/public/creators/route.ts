import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock creators data
const mockCreators = [
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
      {
        id: '2',
        platform: 'twitter',
        url: 'https://twitter.com/johndoe',
        title: 'Twitter',
        icon: '/icons/twitter.svg',
        order: 2,
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
    id: '2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    bio: 'Professional photographer specializing in portrait and landscape photography with over 8 years of experience.',
    avatar: '/avatars/janedoe.jpg',
    coverImage: '/covers/janedoe.jpg',
    category: 'Photography',
    tags: ['photography', 'portrait', 'landscape', 'professional'],
    socialLinks: [
      {
        id: '3',
        platform: 'instagram',
        url: 'https://instagram.com/janedoe',
        title: 'Instagram',
        icon: '/icons/instagram.svg',
        order: 1,
        isActive: true,
      },
      {
        id: '4',
        platform: 'website',
        url: 'https://janedoe.com',
        title: 'Portfolio',
        icon: '/icons/website.svg',
        order: 2,
        isActive: true,
      },
    ],
    stats: {
      followers: 4321,
      products: 8,
      events: 3,
      totalSales: 15600,
    },
    isVerified: false,
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
      {
        id: '6',
        platform: 'twitter',
        url: 'https://twitter.com/bobsmith',
        title: 'Twitter',
        icon: '/icons/twitter.svg',
        order: 2,
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
    id: '4',
    username: 'alicejohnson',
    displayName: 'Alice Johnson',
    bio: 'Music producer and composer creating original tracks for films, games, and commercial projects.',
    avatar: '/avatars/alicejohnson.jpg',
    coverImage: '/covers/alicejohnson.jpg',
    category: 'Music',
    tags: ['music', 'production', 'composition', 'film'],
    socialLinks: [
      {
        id: '7',
        platform: 'youtube',
        url: 'https://youtube.com/@alicejohnson',
        title: 'YouTube',
        icon: '/icons/youtube.svg',
        order: 1,
        isActive: true,
      },
      {
        id: '8',
        platform: 'spotify',
        url: 'https://open.spotify.com/artist/alicejohnson',
        title: 'Spotify',
        icon: '/icons/spotify.svg',
        order: 2,
        isActive: true,
      },
    ],
    stats: {
      followers: 3456,
      products: 6,
      events: 4,
      totalSales: 8900,
    },
    isVerified: false,
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
      {
        id: '10',
        platform: 'youtube',
        url: 'https://youtube.com/@charliebrown',
        title: 'YouTube',
        icon: '/icons/youtube.svg',
        order: 2,
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
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Replace with actual API call to your backend
    // const creators = await fetchCreatorsFromBackend({ category, search, limit, offset });
    
    // For now, filter mock data
    let filteredCreators = [...mockCreators];

    // Filter by category
    if (category) {
      filteredCreators = filteredCreators.filter(creator => 
        creator.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCreators = filteredCreators.filter(creator =>
        creator.displayName.toLowerCase().includes(searchLower) ||
        creator.bio.toLowerCase().includes(searchLower) ||
        creator.username.toLowerCase().includes(searchLower) ||
        creator.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by followers (popularity)
    filteredCreators.sort((a, b) => b.stats.followers - a.stats.followers);

    // Apply pagination
    const paginatedCreators = filteredCreators.slice(offset, offset + limit);

    return NextResponse.json(paginatedCreators);
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
