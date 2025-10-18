import { NextRequest, NextResponse } from 'next/server';

// Mock user data - replace with actual API calls to your backend
const mockUser = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  bio: 'Digital artist and designer passionate about creating beautiful experiences.',
  avatar: '/avatars/johndoe.jpg',
  coverImage: '/covers/johndoe.jpg',
  verified: true,
  badges: ['Featured Creator', 'Digital Artist'],
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
    {
      id: '3',
      platform: 'website',
      url: 'https://johndoe.com',
      title: 'Portfolio',
      icon: '/icons/website.svg',
      order: 3,
      isActive: true,
    },
  ],
  stats: {
    views: 15420,
    likes: 892,
    shares: 234,
    clicks: 1234,
    followers: 5678,
  },
  theme: {
    primaryColor: '#0662BB',
    secondaryColor: '#F9C33D',
    backgroundColor: '#F3FDFB',
    textColor: '#1a1a1a',
    fontFamily: 'Inter',
    layout: 'grid',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // TODO: Replace with actual API call to your backend
    // const user = await fetchUserFromBackend(username);
    
    // For now, return mock data
    if (username === 'johndoe') {
      return NextResponse.json(mockUser);
    }

    // Simulate user not found
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
