'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchResult } from "@/types/public";
import { publicAPI } from "@/lib/public-api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  className?: string;
}

export function SearchBar({ 
  placeholder = "Search creators, products, events...", 
  onSearch,
  showSuggestions = true,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim() || !showSuggestions) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await publicAPI.search(query, 'all');
        setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestionsList(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, showSuggestions]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    onSearch?.(searchQuery);
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
    setShowSuggestionsList(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestionsList(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    router.push(suggestion.url);
    setShowSuggestionsList(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤';
      case 'product': return '🛍️';
      case 'event': return '🎉';
      case 'creator': return '⭐';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user': return 'Profile';
      case 'product': return 'Product';
      case 'event': return 'Event';
      case 'creator': return 'Creator';
      default: return 'Result';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestionsList(true);
            }
          }}
          className="pl-10 pr-20 h-12 border-2 border-cley-blue/20 focus:border-cley-blue rounded-lg"
        />
        
        {/* Clear button */}
        {query && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {/* Search button */}
        <Button
          size="sm"
          onClick={() => handleSearch()}
          disabled={!query.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 bg-cley-blue hover:bg-cley-blue/90 text-white"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestionsList && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={`${suggestion.type}-${suggestion.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    selectedIndex === index ? 'bg-cley-lightBlue' : ''
                  }`}
                >
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {suggestion.title}
                      </p>
                      <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                        {getTypeLabel(suggestion.type)}
                      </span>
                    </div>
                    {suggestion.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {suggestion.description}
                      </p>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
            
            {/* Show all results */}
            <div className="border-t border-gray-200 p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearch()}
                className="w-full text-cley-blue hover:bg-cley-lightBlue"
              >
                View all results for "{query}"
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
