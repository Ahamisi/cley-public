// Public-facing types for Cleyverse storefront

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  verified?: boolean;
  badges?: string[];
  socialLinks?: SocialLink[];
  stats?: UserStats;
  theme?: UserTheme;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  title: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface UserStats {
  views: number;
  likes: number;
  shares: number;
  clicks: number;
  followers?: number;
}

export interface UserTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  layout: 'grid' | 'list' | 'minimal';
}

export interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  variants?: ProductVariant[];
  category: string;
  tags: string[];
  vendor: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  rating?: number;
  reviewCount?: number;
  badge?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address?: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  organizer: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  ticketPrice?: number;
  currency: string;
  capacity?: number;
  soldTickets?: number;
  isOnline?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  socialLinks?: SocialLink[];
  stats: {
    followers: number;
    products: number;
    events: number;
    totalSales: number;
  };
  isVerified: boolean;
  isActive: boolean;
}

export interface SearchResult {
  type: 'user' | 'product' | 'event' | 'creator';
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: string;
  itemCount: number;
}

export interface AnalyticsEvent {
  type: 'view' | 'click' | 'search' | 'purchase';
  entityType: 'user' | 'product' | 'event' | 'creator';
  entityId: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url: string;
  type: 'website' | 'profile' | 'product' | 'event';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}
