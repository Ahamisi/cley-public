import { NextRequest, NextResponse } from 'next/server';

// Mock links data - replace with actual API calls to your backend
const mockLinks = [
  {
    id: '1',
    platform: 'instagram',
    url: 'https://instagram.com/johndoe',
    title: 'Follow me on Instagram',
    icon: '/icons/instagram.svg',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    platform: 'twitter',
    url: 'https://twitter.com/johndoe',
    title: 'Check out my Twitter',
    icon: '/icons/twitter.svg',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    platform: 'website',
    url: 'https://johndoe.com',
    title: 'Visit my Portfolio',
    icon: '/icons/website.svg',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    platform: 'youtube',
    url: 'https://youtube.com/@johndoe',
    title: 'Watch my Videos',
    icon: '/icons/youtube.svg',
    order: 4,
    isActive: true,
  },
  {
    id: '5',
    platform: 'linkedin',
    url: 'https://linkedin.com/in/johndoe',
    title: 'Connect on LinkedIn',
    icon: '/icons/linkedin.svg',
    order: 5,
    isActive: false, // This link is inactive
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // TODO: Replace with actual API call to your backend
    // const links = await fetchUserLinksFromBackend(username);
    
    // For now, return mock data
    if (username === 'johndoe') {
      return NextResponse.json(mockLinks);
    }

    // Return empty array for other users
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching user links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
