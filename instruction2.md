# Frontend Public Pages Implementation Prompt

## 🎯 **Task Overview**
Create public-facing pages for Cleyverse that don't require user authentication. These pages should be accessible to anyone and optimized for SEO, visibility, and user experience.

---

## 📁 **Directory Structure to Create**

### **Required Directories:**
```
app/
├── [username]/                    # Dynamic user profiles (cley.me/username)
│   ├── page.tsx                  # Main profile page
│   ├── links/
│   │   └── page.tsx             # All links view
│   ├── products/
│   │   ├── page.tsx             # User's products
│   │   └── [slug]/
│   │       └── page.tsx         # Individual product page
│   └── events/
│       ├── page.tsx             # User's events
│       └── [slug]/
│           └── page.tsx         # Individual event page
├── products/                     # Global product marketplace
│   ├── page.tsx                 # Product listing page
│   ├── [slug]/
│   │   └── page.tsx             # Individual product page
│   └── category/
│       └── [category]/
│           └── page.tsx         # Category pages
├── events/                       # Global event marketplace
│   ├── page.tsx                 # Event listing page
│   ├── [slug]/
│   │   └── page.tsx             # Individual event page
│   └── category/
│       └── [category]/
│           └── page.tsx         # Event category pages
├── creators/                     # Creator discovery
│   ├── page.tsx                 # Creator listing page
│   ├── [username]/
│   │   └── page.tsx             # Creator profile page
│   └── category/
│       └── [category]/
│           └── page.tsx         # Creator category pages
└── search/                       # Search functionality
    ├── page.tsx                 # Search results page
    └── [query]/
        └── page.tsx             # Specific search results
```

---

## 🎯 **Page Requirements & Features**

### **1. User Profile Pages (`[username]/page.tsx`)**

#### **Features:**
- **Profile Header:** Avatar, name, bio, social links
- **Link Grid:** Display user's links in customizable layout
- **Product Showcase:** Featured products (if any)
- **Event Listings:** Upcoming events (if any)
- **Analytics Widget:** Public stats (views, clicks)
- **Share Buttons:** Social media sharing
- **QR Code:** Generate QR code for profile

#### **SEO Requirements:**
```tsx
// Example metadata
export const metadata = {
  title: `${username} - Cleyverse Profile`,
  description: `Check out ${username}'s links, products, and events on Cleyverse`,
  openGraph: {
    title: `${username} - Cleyverse Profile`,
    description: `Check out ${username}'s links, products, and events on Cleyverse`,
    url: `https://cley.me/${username}`,
    images: [`https://cley.me/api/og/${username}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${username} - Cleyverse Profile`,
    description: `Check out ${username}'s links, products, and events on Cleyverse`,
  },
}
```

### **2. Product Pages (`products/[slug]/page.tsx`)**

#### **Features:**
- **Product Gallery:** Image carousel with zoom
- **Product Details:** Title, description, price, variants
- **Add to Cart:** Direct purchase functionality
- **Related Products:** Recommendations
- **Reviews Section:** Customer reviews and ratings
- **Share & Wishlist:** Social sharing and save for later
- **Vendor Info:** Creator profile link

#### **SEO Requirements:**
```tsx
// Example metadata
export const metadata = {
  title: `${product.title} - ${product.vendor.name} | Cleyverse`,
  description: product.description,
  openGraph: {
    title: `${product.title} - ${product.vendor.name}`,
    description: product.description,
    url: `https://cley.biz/products/${product.slug}`,
    images: [product.images[0]],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${product.title} - ${product.vendor.name}`,
    description: product.description,
  },
}
```

### **3. Event Pages (`events/[slug]/page.tsx`)**

#### **Features:**
- **Event Header:** Title, date, location, organizer
- **Event Description:** Detailed event info
- **Ticket Purchase:** Eventbrite-style ticket selection
- **Vendor Marketplace:** Event vendors and products
- **Event Map:** Location and venue details
- **Social Features:** Share event, add to calendar
- **Offline Payment:** NFC/RFID payment options

#### **SEO Requirements:**
```tsx
// Example metadata
export const metadata = {
  title: `${event.title} - ${event.date} | Cleyverse Events`,
  description: event.description,
  openGraph: {
    title: `${event.title} - ${event.date}`,
    description: event.description,
    url: `https://cley.live/events/${event.slug}`,
    images: [event.coverImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${event.title} - ${event.date}`,
    description: event.description,
  },
}
```

---

## 🛠 **Scalable Technologies for Millions of Visitors**

### **1. Core Performance & SEO**
```bash
npm install next-seo                    # SEO optimization
npm install @next/bundle-analyzer       # Bundle size optimization
npm install next-sitemap               # Dynamic sitemap generation
npm install @vercel/analytics          # Performance analytics
npm install next-pwa                   # Progressive Web App
npm install workbox-webpack-plugin     # Service worker caching
```

### **2. Image & Media Optimization (Critical for Scale)**
```bash
npm install sharp                      # Image processing
npm install @next/image               # Next.js optimized images
npm install next-optimized-images     # Advanced image optimization
npm install @vercel/og                # Dynamic OG image generation
npm install lqip-loader               # Low-quality image placeholders
```

### **3. Caching & Performance (Essential for Millions)**
```bash
npm install redis                      # Redis client for caching
npm install @vercel/kv                # Vercel KV for edge caching
npm install swr                        # Data fetching with caching
npm install react-query               # Server state management
npm install @tanstack/react-query     # Advanced query caching
```

### **4. Search & Filtering (Scalable Search)**
```bash
npm install algoliasearch              # Algolia for search (recommended for scale)
npm install fuse.js                   # Client-side search fallback
npm install react-select              # Advanced select components
npm install @headlessui/react         # Accessible UI components
npm install react-virtualized         # Virtual scrolling for large lists
```

### **5. Social & Sharing (Viral Growth)**
```bash
npm install react-share               # Social media sharing
npm install qrcode                    # QR code generation
npm install html2canvas               # Screenshot generation
npm install react-copy-to-clipboard   # Copy functionality
npm install react-social-icons        # Social media icons
```

### **6. Analytics & Monitoring (Scale Tracking)**
```bash
npm install @vercel/analytics         # Vercel analytics
npm install @vercel/speed-insights    # Core Web Vitals tracking
npm install @sentry/nextjs            # Error monitoring
npm install web-vitals                # Performance metrics
npm install @hotjar/nextjs            # User behavior analytics
npm install gtag                      # Google Analytics 4
```

### **7. Database & API Optimization (High Traffic)**
```bash
npm install prisma                    # Database ORM
npm install @prisma/client           # Prisma client
npm install drizzle-orm              # Alternative lightweight ORM
npm install @tanstack/react-query    # Server state management
npm install axios                     # HTTP client with caching
```

### **8. Security & Rate Limiting (Protection)**
```bash
npm install @upstash/ratelimit        # Rate limiting
npm install @vercel/edge-config       # Edge configuration
npm install next-auth                 # Authentication (for admin)
npm install csrf                      # CSRF protection
```

### **9. CDN & Edge Optimization**
```bash
npm install @vercel/edge              # Edge functions
npm install @vercel/blob              # Blob storage
npm install @vercel/postgres          # Edge database
npm install @vercel/kv                # Edge caching
```

---

## 🛠 **Technology Stack Based on Initial Frontend Setup**

### **Core Technologies (Already Set Up):**
```typescript
// From your existing frontend setup
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand (state management)
- React Query (server state)
- Framer Motion (animations)
- Lucide React (icons)
```

### **Best UI Framework Recommendation:**
```typescript
// RECOMMENDED: Keep shadcn/ui + Tailwind CSS
// Why it's the best choice for Cleyverse:

1. PERFORMANCE:
   - Zero runtime overhead (CSS-only components)
   - Tree-shakable (only import what you use)
   - No JavaScript bundle bloat
   - Fastest possible rendering

2. SCALABILITY:
   - Copy-paste components (no dependencies)
   - Customizable without breaking changes
   - TypeScript-first
   - Works with any React setup

3. DESIGN FLEXIBILITY:
   - No opinionated design system
   - Easy to customize for Cley brand
   - No gradients by default
   - Clean, minimal aesthetic

4. DEVELOPER EXPERIENCE:
   - Best-in-class TypeScript support
   - Excellent documentation
   - Active community
   - Regular updates

// ALTERNATIVES (if needed):
- Mantine (feature-rich but heavier)
- Chakra UI (good but more opinionated)
- Ant Design (enterprise-focused, heavy)
- Material-UI (Google's design system, opinionated)
```

### **Additional Scalable Technologies to Add:**
```typescript
// Performance & Caching
- Vercel Edge Runtime (for API routes)
- Redis (for caching)
- Vercel KV (edge caching)
- SWR (data fetching with caching)

// Search & Discovery
- Algolia (enterprise search)
- Fuse.js (client-side search fallback)
- React Virtualized (for large lists)

// Image & Media
- Sharp (image processing)
- Next.js Image (optimized images)
- Vercel OG (dynamic OG images)
- LQIP (low-quality image placeholders)

// Analytics & Monitoring
- Vercel Analytics (performance tracking)
- Sentry (error monitoring)
- Hotjar (user behavior)
- Google Analytics 4 (traffic analytics)

// Security & Protection
- Upstash Rate Limit (rate limiting)
- CSRF protection
- DDoS protection
- Edge security headers
```

### **Database & API Optimization:**
```typescript
// Database
- Prisma ORM (type-safe database access)
- Connection pooling
- Read replicas for scaling
- Database indexing optimization

// API Routes
- Edge functions for critical paths
- API response caching
- Request/response compression
- GraphQL (for complex queries)
```

---

## 🎨 **UI/UX Requirements**

### **Design System (Based on Initial Frontend Setup):**

#### **Brand Colors (No Gradients):**
```css
:root {
  --cley-blue-primary: #0662BB;
  --cley-yellow-accent: #F9C33D;
  --cley-light-blue: #F3FDFB;
  --cley-blue-hover: #054A8A;
  --cley-yellow-hover: #E6B035;
  --cley-gray-light: #F8F9FA;
  --cley-gray-medium: #6C757D;
  --cley-gray-dark: #343A40;
}
```

#### **Typography:**
```css
/* Fonts from initial setup */
--font-inter: 'Inter', sans-serif;      /* Body text */
--font-outfit: 'Outfit', sans-serif;    /* Headers */
--font-jetbrains: 'JetBrains Mono', monospace; /* Code */
```

#### **Tailwind Configuration:**
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        cley: {
          blue: "#0662BB",
          yellow: "#F9C33D",
          lightBlue: "#F3FDFB",
          blueHover: "#054A8A",
          yellowHover: "#E6B035",
          grayLight: "#F8F9FA",
          grayMedium: "#6C757D",
          grayDark: "#343A40",
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

#### **Icon System:**
```typescript
// Use Lucide React icons (from initial setup)
import { 
  Instagram, 
  TikTok, 
  Youtube, 
  Twitter,
  Facebook,
  Linkedin,
  Pinterest,
  // ... all platform icons
} from 'lucide-react'

// Custom icons for Cleyverse
import { 
  CleyLogo,
  CleyTag,
  CleyLive,
  CleyBiz,
  CleyWork,
  CleyMe
} from '@/components/icons/cley-icons'
```

#### **Component Library (shadcn/ui):**
```typescript
// Pre-configured components from initial setup
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
```

#### **Responsive Design:**
```css
/* Mobile-first approach */
.container {
  @apply px-4 sm:px-6 lg:px-8;
}

.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6;
}

.text-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}
```

#### **Dark Mode Support:**
```typescript
// Dark mode toggle component
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

#### **Loading States:**
```typescript
// Skeleton loaders for all pages
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  )
}
```

#### **Error Handling:**
```typescript
// Custom error pages
export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-cley-blue">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button asChild className="mt-4">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
```

#### **Accessibility:**
```typescript
// WCAG 2.1 AA compliance
- Semantic HTML elements
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Focus indicators
- Alt text for all images
```

#### **Animation System (Framer Motion):**
```typescript
import { motion } from "framer-motion"

// Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
}

// Component animations
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
>
  <Card>...</Card>
</motion.div>
```

#### **Global Styles:**
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### **Components to Create with Styling:**

#### **ProfileHeader Component:**
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, Heart, Eye } from "lucide-react"

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="text-center space-y-4 py-8">
      <Avatar className="h-24 w-24 mx-auto">
        <AvatarImage src={user.avatar} alt={user.displayName} />
        <AvatarFallback className="bg-cley-blue text-white">
          {user.displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-outfit font-bold text-cley-blue">
          {user.displayName}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {user.bio}
        </p>
        <div className="flex justify-center gap-2">
          {user.badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="bg-cley-light-blue">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          {user.views} views
        </Button>
        <Button variant="outline" size="sm">
          <Heart className="h-4 w-4 mr-2" />
          {user.likes} likes
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
```

#### **LinkGrid Component:**
```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

export function LinkGrid({ links }: { links: Link[] }) {
  return (
    <div className="grid gap-4 max-w-md mx-auto">
      {links.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <Button 
                asChild 
                className="w-full h-12 bg-cley-blue hover:bg-cley-blueHover text-white border-0"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {link.icon && (
                        <img 
                          src={link.icon} 
                          alt={link.title}
                          className="h-6 w-6 rounded"
                        />
                      )}
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
```

#### **ProductCard Component:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-cley-yellow text-black">
              {product.badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-lg font-outfit line-clamp-2">
            {product.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < product.rating ? 'text-cley-yellow fill-current' : 'text-gray-300'
                }`} 
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({product.reviewCount})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xl font-bold text-cley-blue">
              ${product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </p>
            )}
          </div>
          
          <Button className="bg-cley-blue hover:bg-cley-blueHover text-white">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### **SearchBar Component:**
```tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { useState } from "react"

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("")
  
  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search creators, products, events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
          className="pl-10 pr-20 h-12 border-2 border-cley-blue/20 focus:border-cley-blue"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => onSearch(query)}
            className="h-8 bg-cley-blue hover:bg-cley-blueHover text-white"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
```

#### **ThemeToggle Component:**
```tsx
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-10 w-10"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

---

## 🎨 **Improved Design Approach (No Gradients)**

### **Design Principles:**
```css
/* Flat Design with Solid Colors */
- Use solid colors instead of gradients
- Clean, minimal aesthetic
- High contrast for accessibility
- Consistent spacing and typography
- Subtle shadows and borders for depth
```

### **Button Styles:**
```tsx
// Primary Button (Cley Blue)
<Button className="bg-cley-blue hover:bg-cley-blueHover text-white">
  Primary Action
</Button>

// Secondary Button (Cley Yellow)
<Button className="bg-cley-yellow hover:bg-cley-yellowHover text-black">
  Secondary Action
</Button>

// Outline Button
<Button variant="outline" className="border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white">
  Outline Action
</Button>
```

### **Card Styles:**
```tsx
// Standard Card
<Card className="border border-gray-200 hover:border-cley-blue hover:shadow-md transition-all">
  <CardContent className="p-6">
    Content here
  </CardContent>
</Card>

// Featured Card
<Card className="border-2 border-cley-blue bg-cley-lightBlue">
  <CardContent className="p-6">
    Featured content
  </CardContent>
</Card>
```

### **Color Usage:**
```css
/* Primary Actions: Cley Blue (#0662BB) */
/* Secondary Actions: Cley Yellow (#F9C33D) */
/* Backgrounds: Cley Light Blue (#F3FDFB) */
/* Text: Gray Dark (#343A40) */
/* Borders: Gray Medium (#6C757D) */
/* Hover States: Darker shades */
```

---

## 📊 **SEO & Visibility Features**

### **1. Dynamic Sitemap Generation**
```tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://cley.me',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add dynamic routes for users, products, events
  ]
}
```

### **2. Robots.txt**
```txt
# app/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

Sitemap: https://cley.me/sitemap.xml
```

### **3. Open Graph Images**
```tsx
// app/api/og/[username]/route.ts
export async function GET(request: Request) {
  // Generate dynamic OG images for each profile
}
```

### **4. Structured Data (JSON-LD)**
```tsx
// Add to each page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": username,
  "url": `https://cley.me/${username}`,
  "sameAs": socialLinks
}
```

---

## 🚀 **Scalability Architecture for Millions of Visitors**

### **1. Edge-First Architecture**
```typescript
// Use Vercel Edge Runtime for maximum performance
export const runtime = 'edge'

// Edge functions for critical paths
export async function GET(request: Request) {
  // Handle millions of requests at edge locations
}
```

### **2. Advanced Caching Strategy**
```typescript
// Multi-layer caching
const cacheConfig = {
  // Browser cache: 1 hour
  browser: { maxAge: 3600 },
  // CDN cache: 24 hours  
  cdn: { maxAge: 86400 },
  // Edge cache: 7 days
  edge: { maxAge: 604800 },
  // Database cache: 30 minutes
  db: { maxAge: 1800 }
}
```

### **3. Database Optimization for Scale**
```typescript
// Use connection pooling
const dbConfig = {
  connectionLimit: 100,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
}

// Implement read replicas
const readReplicas = [
  'db-read-1.region-1.com',
  'db-read-2.region-2.com',
  'db-read-3.region-3.com'
]
```

### **4. Image Optimization for Millions**
```typescript
// Next.js Image with optimization
<Image
  src={userAvatar}
  alt={username}
  width={200}
  height={200}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={lqip}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### **5. Search at Scale**
```typescript
// Algolia for search (handles millions of records)
const searchConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SEARCH_KEY,
  indexName: 'cleyverse_users',
  hitsPerPage: 20,
  attributesToRetrieve: ['username', 'displayName', 'bio', 'avatar'],
  attributesToHighlight: ['username', 'displayName', 'bio']
}
```

### **6. Rate Limiting & Protection**
```typescript
// Rate limiting per IP
const rateLimit = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

// DDoS protection
const ddosProtection = {
  maxRequests: 100,
  timeWindow: 60000, // 1 minute
  blockDuration: 300000 // 5 minutes
}
```

### **7. Performance Monitoring**
```typescript
// Real-time performance tracking
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Web Vitals tracking
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // Send to analytics
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
    })
  }
}
```

---

## 🚀 **Performance Requirements**

### **Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### **Optimization Strategies for Millions of Visitors:**
- **Image Optimization:** WebP format, lazy loading, responsive images
- **Code Splitting:** Dynamic imports for heavy components, route-based splitting
- **Caching:** Multi-layer caching (browser, CDN, edge, database)
- **CDN:** Vercel Edge Network for global content delivery
- **Compression:** Gzip/Brotli compression, minification
- **Database:** Read replicas, connection pooling, query optimization
- **API:** Edge functions, response caching, rate limiting
- **Search:** Algolia for instant search across millions of records
- **Monitoring:** Real-time performance tracking and alerting

### **Traffic Handling Capacity:**
- **Expected Traffic:** 1M+ daily visitors
- **Peak Traffic:** 10M+ requests per hour during viral content
- **Global Reach:** 200+ edge locations via Vercel
- **Uptime Target:** 99.99% availability
- **Response Time:** <200ms for cached content, <1s for dynamic content

---

## 🔧 **API Integration**

### **Required API Endpoints:**
```typescript
// API routes to implement
GET /api/users/[username]          # User profile data
GET /api/users/[username]/links    # User's links
GET /api/users/[username]/products # User's products
GET /api/users/[username]/events   # User's events
GET /api/products/[slug]           # Product details
GET /api/events/[slug]             # Event details
GET /api/search                    # Search functionality
GET /api/og/[username]             # Open Graph images
```

---

## 📱 **Mobile Optimization**

### **PWA Features:**
- **Service Worker:** Offline functionality
- **App Manifest:** Installable web app
- **Push Notifications:** Event updates, new products
- **Offline Storage:** Cache user data locally

### **Mobile-Specific Features:**
- **Touch Gestures:** Swipe navigation
- **Haptic Feedback:** Touch responses
- **Camera Integration:** QR code scanning
- **Geolocation:** Event location services

---

## 🎯 **Implementation Priority**

### **Phase 1 (Week 1-2):**
1. User profile pages (`[username]/page.tsx`)
2. Basic SEO setup (metadata, sitemap)
3. Core components (ProfileHeader, LinkGrid)

### **Phase 2 (Week 3-4):**
1. Product pages (`products/[slug]/page.tsx`)
2. Event pages (`events/[slug]/page.tsx`)
3. Search functionality

### **Phase 3 (Week 5-6):**
1. Advanced SEO (structured data, OG images)
2. Performance optimization
3. PWA features

### **Phase 4 (Week 7-8):**
1. Analytics integration
2. Social sharing features
3. Mobile optimization

---

## 🎨 **Design Guidelines**

### **Brand Colors:**
```css
:root {
  --cley-blue: #0662BB;
  --cley-yellow: #F9C33D;
  --cley-light-blue: #F3FDFB;
}
```

### **Typography:**
- **Headers:** Outfit font family
- **Body:** Inter font family
- **Code:** JetBrains Mono

### **Spacing:**
- **Mobile:** 16px base spacing
- **Desktop:** 24px base spacing
- **Grid:** 8px grid system

---

## 🚀 **Getting Started**

### **1. Install Dependencies:**
```bash
npm install next-seo @next/bundle-analyzer next-sitemap @vercel/analytics
npm install fuse.js react-select @headlessui/react
npm install react-share qrcode html2canvas
npm install @sentry/nextjs web-vitals
```

### **2. Create Directory Structure:**
```bash
mkdir -p app/[username]/{links,products,events}
mkdir -p app/products/[slug]
mkdir -p app/events/[slug]
mkdir -p app/creators/[username]
mkdir -p app/search/[query]
```

### **3. Set Up SEO:**
```bash
# Create sitemap.ts, robots.txt, and metadata files
```

### **4. Implement Core Pages:**
Start with `[username]/page.tsx` and build out from there.

---

## 🎯 **Success Metrics**

### **Technical Metrics:**
- **Page Load Speed:** < 2s
- **SEO Score:** 90+ on Lighthouse
- **Accessibility Score:** 95+ on Lighthouse
- **Mobile Score:** 90+ on Lighthouse

### **Business Metrics:**
- **User Engagement:** Time on page, bounce rate
- **Conversion Rate:** Link clicks, product purchases
- **Social Shares:** Share button usage
- **Search Visibility:** Organic traffic growth

---

**This implementation will create a comprehensive, SEO-optimized, and user-friendly public-facing platform for Cleyverse that doesn't require authentication and provides excellent visibility and discoverability for creators and their content.**
