// Public API client for Cleyverse storefront
import { User, Product, Event, Creator, SearchResult, AnalyticsEvent } from '@/types/public';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class PublicAPI {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🔍 API Call:', url); // Debug log
    console.log('🔍 API Base URL:', API_BASE_URL);
    console.log('🔍 Endpoint:', endpoint);
    console.log('🔍 Full URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error('❌ API Error Details:');
      console.error('  Status:', response.status);
      console.error('  Status Text:', response.statusText);
      console.error('  URL:', url);
      console.error('  Headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to get response body for more details
      try {
        const errorBody = await response.text();
        console.error('  Response Body:', errorBody);
      } catch (e) {
        console.error('  Could not read response body:', e);
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User/Profile endpoints - Updated to match public-api.md
  async getUser(username: string): Promise<any> {
    const response = await this.fetch<any>(`/users/public/${username}`);
    return response.user;
  }

  async getUserLinks(username: string): Promise<any[]> {
    const response = await this.fetch<any>(`/users/public/${username}`);
    return response.links || [];
  }

  async getUserProducts(username: string): Promise<Product[]> {
    // For now, we'll use a mapping of known usernames to store URLs
    // TODO: Backend should include storeUrl in user response or provide separate endpoint
    const userStoreMapping: Record<string, string> = {
      'aceman1': 'ace-merch',
      // Add more mappings as needed
    };
    
    const storeUrl = userStoreMapping[username];
    
    if (!storeUrl) {
      console.log(`User ${username} doesn't have a store or store URL not mapped`);
      return [];
    }
    
    try {
      const response = await this.fetch<any>(`/stores/public/${storeUrl}/products`);
      // Handle the API response structure: { message, products, pagination }
      const apiProducts = response.products || response;
      
      if (!Array.isArray(apiProducts)) {
        return [];
      }
      
      // Transform API response to match frontend Product type
      return apiProducts.map((apiProduct: any) => ({
        id: apiProduct.id,
        title: apiProduct.title,
        description: apiProduct.description,
        slug: apiProduct.handle,
        price: parseFloat(apiProduct.price) || 0,
        originalPrice: apiProduct.compareAtPrice ? parseFloat(apiProduct.compareAtPrice) : undefined,
        currency: 'USD', // Default currency
        images: apiProduct.images || [],
        variants: apiProduct.variants?.map((variant: any) => ({
          id: variant.id,
          name: variant.title,
          price: parseFloat(variant.price) || 0,
          stock: variant.inventoryQuantity || 0,
          attributes: {
            color: variant.title,
            sku: variant.sku
          }
        })) || [],
        category: apiProduct.tags?.[0] || 'General',
        tags: apiProduct.tags || [],
        vendor: {
          id: 'unknown',
          username: 'unknown',
          displayName: 'Unknown Vendor',
          avatar: undefined
        },
        rating: 0,
        reviewCount: 0,
        badge: apiProduct.isFeatured ? 'Featured' : undefined,
        isActive: apiProduct.isPublished || false,
        createdAt: apiProduct.createdAt,
        updatedAt: apiProduct.createdAt
      }));
    } catch (error) {
      // Handle different error cases gracefully
      if (error instanceof Error && error.message.includes('Store is not active')) {
        console.log(`Store ${storeUrl} exists but is not active - user may not want to publish their store`);
        return [];
      } else if (error instanceof Error && error.message.includes('404')) {
        console.log(`Store ${storeUrl} not found`);
        return [];
      } else {
        console.log(`Error fetching products for store ${storeUrl}:`, error);
        return [];
      }
    }
  }

  async getUserEvents(username: string): Promise<Event[]> {
    // Events would need to be implemented based on the actual backend structure
    return [];
  }

  // Product endpoints - Updated to match public-api.md
  async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc';
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('q', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('page', (Math.floor((params.offset || 0) / (params.limit || 20)) + 1).toString());
    
    // Map sort parameters to backend format
    if (params?.sort) {
      switch (params.sort) {
        case 'newest':
          searchParams.append('sortBy', 'createdAt');
          searchParams.append('sortOrder', 'DESC');
          break;
        case 'popular':
          searchParams.append('sortBy', 'createdAt'); // Will be updated when backend supports popularity
          searchParams.append('sortOrder', 'DESC');
          break;
        case 'price_asc':
          searchParams.append('sortBy', 'price');
          searchParams.append('sortOrder', 'ASC');
          break;
        case 'price_desc':
          searchParams.append('sortBy', 'price');
          searchParams.append('sortOrder', 'DESC');
          break;
      }
    }

    const query = searchParams.toString();
    const response = await this.fetch<any>(`/products/public/search${query ? `?${query}` : ''}`);
    
    // Handle the API response structure: { message, products, pagination, filters }
    const apiProducts = response.products || [];
    
    // Transform API response to match frontend Product type
    return apiProducts.map((apiProduct: any) => ({
      id: apiProduct.id,
      title: apiProduct.title,
      description: apiProduct.description,
      slug: apiProduct.handle,
      price: parseFloat(apiProduct.price) || 0,
      originalPrice: apiProduct.compareAtPrice ? parseFloat(apiProduct.compareAtPrice) : undefined,
      currency: 'USD', // Default currency
      images: apiProduct.images || [],
      variants: [], // Search API doesn't include variants
      category: 'General', // Would need to be provided by backend
      tags: [],
      vendor: {
        id: apiProduct.store?.id || 'unknown',
        username: apiProduct.owner?.username || 'unknown',
        displayName: apiProduct.store?.name || 'Unknown Vendor',
        avatar: apiProduct.owner?.profileImageUrl || apiProduct.store?.logoUrl
      },
      rating: 0,
      reviewCount: 0,
      badge: undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  async getProduct(storeUrl: string, productHandle: string): Promise<Product> {
    const response = await this.fetch<any>(`/stores/public/${storeUrl}/products/${productHandle}`);
    
    // Handle the API response structure: { message, product, store }
    const apiProduct = response.product;
    if (!apiProduct) {
      throw new Error('Product not found in API response');
    }
    
    // Transform API response to match frontend Product type
    return {
      id: apiProduct.id,
      title: apiProduct.title,
      description: apiProduct.description,
      slug: apiProduct.handle,
      price: parseFloat(apiProduct.price) || 0,
      originalPrice: apiProduct.compareAtPrice ? parseFloat(apiProduct.compareAtPrice) : undefined,
      currency: 'USD', // Default currency
      images: apiProduct.images || [],
      variants: apiProduct.variants?.map((variant: any) => ({
        id: variant.id,
        name: variant.title,
        price: parseFloat(variant.price) || 0,
        stock: variant.inventoryQuantity || 0,
        attributes: {
          color: variant.option1Value || variant.title,
          sku: variant.sku
        }
      })) || [],
      category: apiProduct.tags?.[0] || 'General',
      tags: apiProduct.tags || [],
      vendor: {
        id: response.store?.id || 'unknown',
        username: 'unknown', // Would need to be provided by backend
        displayName: response.store?.name || 'Unknown Vendor',
        avatar: response.store?.logoUrl
      },
      rating: 0,
      reviewCount: 0,
      badge: apiProduct.isFeatured ? 'Featured' : undefined,
      isActive: apiProduct.isPublished || false,
      createdAt: apiProduct.createdAt,
      updatedAt: apiProduct.updatedAt
    };
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await this.fetch<any>('/products/public/featured');
    return response.products || [];
  }

  async getRecentProducts(): Promise<Product[]> {
    // Use the search endpoint with newest sort
    const response = await this.fetch<any>('/products/public/search?sortBy=createdAt&sortOrder=DESC&limit=20');
    return response.products || [];
  }

  // Event endpoints
  async getEvents(params?: {
    category?: string;
    search?: string;
    upcoming?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Event[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.upcoming) searchParams.append('upcoming', 'true');
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.fetch<Event[]>(`/api/public/events${query ? `?${query}` : ''}`);
  }

  async getEvent(slug: string): Promise<Event> {
    return this.fetch<Event>(`/api/public/events/${slug}`);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return this.fetch<Event[]>('/api/public/events/upcoming');
  }

  // Creator endpoints
  async getCreators(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Creator[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.fetch<Creator[]>(`/api/public/creators${query ? `?${query}` : ''}`);
  }

  async getCreator(username: string): Promise<Creator> {
    return this.fetch<Creator>(`/api/public/creators/${username}`);
  }

  async getFeaturedCreators(): Promise<Creator[]> {
    return this.fetch<Creator[]>('/api/public/creators/featured');
  }

  // Search endpoint - Updated to match public-api.md
  async search(query: string, type?: 'all' | 'users' | 'products' | 'events' | 'creators'): Promise<SearchResult[]> {
    const searchParams = new URLSearchParams({ q: query });
    
    if (type === 'products' || type === 'all') {
      const response = await this.fetch<any>(`/products/public/search?${searchParams.toString()}`);
      return (response.products || []).map((product: any) => ({
        type: 'product',
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.images?.[0]?.imageUrl,
        url: `/products/${product.store?.storeUrl}/${product.handle}`,
        metadata: product,
      }));
    }
    
    return [];
  }

  // Analytics endpoints - Updated to match public-api.md
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    // This would need to be implemented based on the actual backend analytics structure
    console.log('Analytics event:', event);
  }

  async trackClick(entityType: string, entityId: string, userId?: string): Promise<void> {
    if (entityType === 'link') {
      await this.fetch(`/links/${entityId}/click`, {
        method: 'POST',
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          ipAddress: '', // Will be handled by backend
          referrer: document.referrer,
        }),
      });
    } else if (entityType === 'socialLink') {
      await this.fetch(`/social-links/${entityId}/click`, {
        method: 'POST',
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          ipAddress: '', // Will be handled by backend
          referrer: document.referrer,
        }),
      });
    }
  }

  async trackView(entityType: string, entityId: string, userId?: string): Promise<void> {
    if (entityType === 'product') {
      // Extract storeUrl and productHandle from entityId if needed
      await this.fetch(`/stores/public/${entityId}/view`, {
        method: 'POST',
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          ipAddress: '', // Will be handled by backend
          referrer: document.referrer,
        }),
      });
    }
  }
}

export const publicAPI = new PublicAPI();
