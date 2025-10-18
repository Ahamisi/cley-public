import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-outfit font-bold text-cley-blue mb-4">
            404
          </div>
          <div className="h-2 w-24 bg-cley-yellow mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-outfit font-bold text-cley-blue">
            Page Not Found
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-cley-blue hover:bg-cley-blue/90 text-white">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white">
            <Link href="/products">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Need help? Try these popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <Link href="/products" className="text-cley-blue hover:underline">
              Products
            </Link>
            <span>•</span>
            <Link href="/events" className="text-cley-blue hover:underline">
              Events
            </Link>
            <span>•</span>
            <Link href="/creators" className="text-cley-blue hover:underline">
              Creators
            </Link>
            <span>•</span>
            <Link href="/search" className="text-cley-blue hover:underline">
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
