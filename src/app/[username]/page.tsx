import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileHeader } from '@/components/public/ProfileHeader';
import { LinkGrid } from '@/components/public/LinkGrid';
import { ProductCard } from '@/components/public/ProductCard';
import { EventCard } from '@/components/public/EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { publicAPI } from '@/lib/public-api';
import { User, Product, Event } from '@/types/public';

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  // Exclude static file requests from being handled as usernames
  const staticFiles = ['favicon.ico', 'manifest.json', 'robots.txt', 'sitemap.xml'];
  if (staticFiles.includes(params.username)) {
    return {
      title: 'Not Found',
      description: 'Page not found',
    };
  }

  try {
    const user = await publicAPI.getUser(params.username);
    
    return {
      title: `${user.displayName} - Cleyverse Profile`,
      description: user.bio || `Check out ${user.displayName}'s links, products, and events on Cleyverse`,
      openGraph: {
        title: `${user.displayName} - Cleyverse Profile`,
        description: user.bio || `Check out ${user.displayName}'s links, products, and events on Cleyverse`,
        url: `https://cley.me/${user.username}`,
        siteName: 'Cleyverse',
        images: [
          {
            url: user.avatar || '/og-default.jpg',
            width: 1200,
            height: 630,
            alt: `${user.displayName} - Cleyverse Profile`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${user.displayName} - Cleyverse Profile`,
        description: user.bio || `Check out ${user.displayName}'s links, products, and events on Cleyverse`,
        images: [user.avatar || '/og-default.jpg'],
      },
      alternates: {
        canonical: `https://cley.me/${user.username}`,
      },
    };
  } catch (error) {
    return {
      title: 'User Not Found - Cleyverse',
      description: 'The requested user profile could not be found.',
    };
  }
}

// Generate structured data for SEO
function generateStructuredData(user: User, links: any[], products: Product[], events: Event[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.displayName,
    url: `https://cley.me/${user.username}`,
    description: user.bio,
    image: user.avatar,
    sameAs: user.socialLinks?.map(link => link.url) || [],
    // Add additional structured data for products and events if needed
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  // Exclude static file requests from being handled as usernames
  const staticFiles = ['favicon.ico', 'manifest.json', 'robots.txt', 'sitemap.xml', 'placeholder-product.jpg'];
  if (staticFiles.includes(params.username) || params.username.includes('.jpg') || params.username.includes('.png') || params.username.includes('.jpeg')) {
    notFound();
  }

  try {
    // Fetch user data using the correct API structure
    const userData = await publicAPI.getUser(params.username);
    const links = await publicAPI.getUserLinks(params.username);
    
    // Fetch products and events separately, don't let them fail the whole page
    let products: Product[] = [];
    let events: Event[] = [];
    let backendErrors: string[] = [];
    
    try {
      products = await publicAPI.getUserProducts(params.username);
    } catch (error) {
      const errorMsg = `Products API failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌ Backend Error - Products API failed:', error);
      console.error('❌ This should be fixed by backend team');
      backendErrors.push(errorMsg);
      products = [];
    }
    
    try {
      events = await publicAPI.getUserEvents(params.username);
    } catch (error) {
      const errorMsg = `Events API failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌ Backend Error - Events API failed:', error);
      backendErrors.push(errorMsg);
      events = [];
    }
    
    // Map the response to match our expected structure
    const user = {
      id: userData.id,
      username: userData.username,
      displayName: `${userData.firstName} ${userData.lastName}`,
      bio: userData.bio,
      avatar: userData.profileImageUrl,
      verified: false, // Would need to be determined from backend
      badges: [userData.category],
      socialLinks: links,
      stats: {
        views: 0, // Would need to be calculated from analytics
        likes: 0,
        shares: 0,
        clicks: links.reduce((total, link) => total + (link.clickCount || 0), 0),
      },
    };

    const structuredData = generateStructuredData(user, links, products, events);

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-gradient-to-b from-cley-lightBlue/30 to-white">
          {/* Development Error Banner */}
          {process.env.NODE_ENV === 'development' && backendErrors.length > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    🚨 Development Mode - Backend API Errors Detected
                  </p>
                  <div className="mt-2 text-sm">
                    {backendErrors.map((error, index) => (
                      <div key={index} className="mb-1">
                        • {error}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-2 text-red-600">
                    These errors are logged in console. Backend team should fix these endpoints.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="container mx-auto px-4 py-8">
            {/* Profile Header */}
            <ProfileHeader user={user} />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto mt-8">
              <Tabs defaultValue="links" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="links" className="text-sm">
                    Links ({links.filter(link => link.isActive).length})
                  </TabsTrigger>
                  <TabsTrigger value="products" className="text-sm">
                    Products ({products.length})
                  </TabsTrigger>
                  <TabsTrigger value="events" className="text-sm">
                    Events ({events.filter(event => event.isActive).length})
                  </TabsTrigger>
                  <TabsTrigger value="about" className="text-sm">
                    About
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="links" className="mt-0">
                  <LinkGrid links={links} username={user.username} />
                </TabsContent>

                <TabsContent value="products" className="mt-0">
                  {products && Array.isArray(products) && products.filter(product => product.isActive).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products
                        ?.filter(product => product.isActive)
                        ?.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            username={user.username}
                            showVendor={false}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {user.displayName} hasn&apos;t added any products yet.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="events" className="mt-0">
                  {events.filter(event => event.isActive).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events
                        .filter(event => event.isActive)
                        .map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            username={user.username}
                            showOrganizer={false}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {user.displayName} hasn&apos;t created any events yet.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="about" className="mt-0">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                      {/* Bio Section */}
                      {user.bio && (
                        <div>
                          <h3 className="text-lg font-outfit font-semibold text-cley-blue mb-3">
                            About {user.displayName}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {user.bio}
                          </p>
                        </div>
                      )}

                      {/* Stats Section */}
                      {user.stats && (
                        <div>
                          <h3 className="text-lg font-outfit font-semibold text-cley-blue mb-3">
                            Profile Stats
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {user.stats.views > 0 && (
                              <div className="text-center">
                                <p className="text-2xl font-bold text-cley-blue">
                                  {user.stats.views.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Views</p>
                              </div>
                            )}
                            {user.stats.likes > 0 && (
                              <div className="text-center">
                                <p className="text-2xl font-bold text-cley-blue">
                                  {user.stats.likes.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Likes</p>
                              </div>
                            )}
                            {user.stats.shares > 0 && (
                              <div className="text-center">
                                <p className="text-2xl font-bold text-cley-blue">
                                  {user.stats.shares.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Shares</p>
                              </div>
                            )}
                            {user.stats.clicks > 0 && (
                              <div className="text-center">
                                <p className="text-2xl font-bold text-cley-blue">
                                  {user.stats.clicks.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Clicks</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {user.socialLinks && user.socialLinks.length > 0 && (
                        <div>
                          <h3 className="text-lg font-outfit font-semibold text-cley-blue mb-3">
                            Connect with {user.displayName}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {user.socialLinks
                              .filter(link => link.isActive)
                              .map((link) => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-cley-lightBlue text-cley-blue rounded-lg hover:bg-cley-blue hover:text-white transition-colors text-sm"
                                >
                                  <span>{link.title}</span>
                                </a>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error('Username:', params.username);
    console.error('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
    
    // For now, let's not call notFound() and instead show a fallback
    // notFound();
    
    // Return a fallback page instead of 404
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn't load the profile for @{params.username}
          </p>
          <p className="text-sm text-gray-500">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
}