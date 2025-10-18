'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
}

const currencies: Currency[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    country: 'Nigeria'
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    country: 'United States'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    country: 'United Kingdom'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    country: 'Europe'
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    flag: '🇬🇭',
    country: 'Ghana'
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    country: 'Kenya'
  }
];

interface CurrencySwitcherProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  className?: string;
}

export function CurrencySwitcher({ 
  selectedCurrency, 
  onCurrencyChange, 
  className = '' 
}: CurrencySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  const handleCurrencySelect = (currencyCode: string) => {
    onCurrencyChange(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-3"
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{selectedCurrencyData.flag}</span>
        <span className="font-medium">{selectedCurrencyData.code}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Select Currency
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {currencies.map((currency) => (
                      <motion.div
                        key={currency.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => handleCurrencySelect(currency.code)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            selectedCurrency === currency.code
                              ? 'bg-cley-blue/10 border border-cley-blue/20'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{currency.flag}</span>
                            <div className="text-left">
                              <div className="font-medium text-sm">
                                {currency.code}
                              </div>
                              <div className="text-xs text-gray-500">
                                {currency.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">
                              {currency.symbol}
                            </div>
                            {selectedCurrency === currency.code && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Prices will be converted based on current exchange rates
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
