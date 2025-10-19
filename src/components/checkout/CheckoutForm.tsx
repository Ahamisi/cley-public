'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { OrderSummary } from './OrderSummary';
import { CurrencySwitcher } from './CurrencySwitcher';
import { toast } from 'sonner';
import { Loader2, CreditCard, Truck, User, AlertCircle } from 'lucide-react';

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  title: string;
  price: number;
  image?: string;
  variantName?: string;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Address {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutData {
  customer: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  customerNotes: string;
  useShippingAsBilling: boolean;
}

interface ValidationErrors {
  customer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  shippingAddress?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  billingAddress?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  general?: string;
}

// Helper component for validation errors
const ValidationError = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
};

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [selectedCurrency, setSelectedCurrency] = useState('NGN'); // Default to Nigerian Naira
  
  // Get country code from currency
  const getCountryFromCurrency = (currency: string): string => {
    const currencyCountryMap: Record<string, string> = {
      'NGN': 'NG',
      'USD': 'US',
      'GBP': 'GB',
      'EUR': 'EU',
      'GHS': 'GH',
      'KES': 'KE'
    };
    return currencyCountryMap[currency] || 'NG';
  };

  const [formData, setFormData] = useState<CheckoutData>({
    customer: {
      email: '',
      firstName: '',
      lastName: '',
      phone: ''
    },
    shippingAddress: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'NG' // Default to Nigeria
    },
    billingAddress: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'NG' // Default to Nigeria
    },
    customerNotes: '',
    useShippingAsBilling: true
  });

  // Load cart items from URL params or localStorage
  useEffect(() => {
    const loadCartItems = () => {
      // Check URL params first (for direct checkout from product page)
      const productId = searchParams.get('product');
      const variantId = searchParams.get('variant');
      const quantity = parseInt(searchParams.get('quantity') || '1');
      const title = searchParams.get('title') || 'Product';
      const price = parseFloat(searchParams.get('price') || '0');

      if (productId) {
        setCartItems([{
          productId,
          variantId: variantId || undefined,
          quantity,
          title,
          price,
          variantName: searchParams.get('variantName') || undefined
        }]);
      } else {
        // Load from localStorage (for cart-based checkout)
        const savedCart = localStorage.getItem('cleyverse-cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCartItems();
  }, [searchParams]);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Nigerian phone number patterns
    const nigerianPatterns = [
      /^0[789][01]\d{8}$/, // 080, 081, 070, 071, 090, 091
      /^\+234[789][01]\d{8}$/, // +234 format
      /^234[789][01]\d{8}$/, // 234 format without +
    ];
    
    // International patterns
    const internationalPatterns = [
      /^[\+]?[1-9][\d]{7,15}$/, // General international format
    ];
    
    const allPatterns = [...nigerianPatterns, ...internationalPatterns];
    
    if (!allPatterns.some(pattern => pattern.test(cleanPhone))) {
      return 'Please enter a valid phone number (e.g., 08012345678 or +2348012345678)';
    }
    return undefined;
  };

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} is required`;
    return undefined;
  };

  const validatePostalCode = (postalCode: string, country: string): string | undefined => {
    if (!postalCode.trim()) return 'Postal code is required';
    
    // Basic validation for common formats
    const cleanPostalCode = postalCode.replace(/\s/g, '').toUpperCase();
    
    if (country === 'USA' || country === 'US') {
      const usZipRegex = /^\d{5}(-\d{4})?$/;
      if (!usZipRegex.test(cleanPostalCode)) {
        return 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)';
      }
    } else if (country === 'CA' || country === 'Canada') {
      const caPostalRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;
      if (!caPostalRegex.test(cleanPostalCode)) {
        return 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
      }
    } else if (country === 'GB' || country === 'UK') {
      const ukPostalRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
      if (!ukPostalRegex.test(cleanPostalCode)) {
        return 'Please enter a valid UK postal code';
      }
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate customer info
    const customerErrors: any = {};
    customerErrors.firstName = validateRequired(formData.customer.firstName, 'First name');
    customerErrors.lastName = validateRequired(formData.customer.lastName, 'Last name');
    customerErrors.email = validateEmail(formData.customer.email);
    customerErrors.phone = validatePhone(formData.customer.phone);

    if (Object.values(customerErrors).some(error => error)) {
      errors.customer = customerErrors;
    }

    // Validate shipping address
    const shippingErrors: any = {};
    shippingErrors.address = validateRequired(formData.shippingAddress.address, 'Street address');
    shippingErrors.city = validateRequired(formData.shippingAddress.city, 'City');
    shippingErrors.state = validateRequired(formData.shippingAddress.state, 'State');
    shippingErrors.postalCode = validatePostalCode(formData.shippingAddress.postalCode, formData.shippingAddress.country);
    shippingErrors.country = validateRequired(formData.shippingAddress.country, 'Country');

    if (Object.values(shippingErrors).some(error => error)) {
      errors.shippingAddress = shippingErrors;
    }

    // Validate billing address if not using shipping address
    if (!formData.useShippingAsBilling) {
      const billingErrors: any = {};
      billingErrors.address = validateRequired(formData.billingAddress.address, 'Street address');
      billingErrors.city = validateRequired(formData.billingAddress.city, 'City');
      billingErrors.state = validateRequired(formData.billingAddress.state, 'State');
      billingErrors.postalCode = validatePostalCode(formData.billingAddress.postalCode, formData.billingAddress.country);
      billingErrors.country = validateRequired(formData.billingAddress.country, 'Country');

      if (Object.values(billingErrors).some(error => error)) {
        errors.billingAddress = billingErrors;
      }
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
      errors.general = 'Please select a payment method';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (section: keyof ValidationErrors, field?: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (field && newErrors[section]) {
        delete (newErrors[section] as any)[field];
        if (Object.keys(newErrors[section] as any).length === 0) {
          delete newErrors[section];
        }
      } else {
        delete newErrors[section];
      }
      return newErrors;
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear general errors when user starts typing
    if (validationErrors.general) {
      clearFieldError('general');
    }
  };

  const handleAddressChange = (type: 'shipping' | 'billing', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value
      }
    }));
    // Clear validation error for this field
    clearFieldError(`${type}Address` as keyof ValidationErrors, field);
  };

  const handleCustomerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
    // Clear validation error for this field
    clearFieldError('customer', field);
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    const country = getCountryFromCurrency(currency);
    
    // Update shipping and billing address countries
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        country: country
      },
      billingAddress: {
        ...prev.billingAddress,
        country: country
      }
    }));
    
    // Clear payment method selection when currency changes
    setSelectedPaymentMethod(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get store ID from the first item (assuming all items are from same store)
      // For now, we'll use a mapping as fallback
      const productStoreMapping: Record<string, string> = {
        'sample-product': 'aceman',
        'jermaine-book': 'aceman',
        // Add more mappings as needed
      };
      
      // Try to get store ID from cart items or use fallback
      let storeId = 'aceman'; // Default fallback
      
      // TODO: In the future, cart items should include store information
      // or we should have a way to resolve product ID to store ID
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        customer: formData.customer,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.useShippingAsBilling ? formData.shippingAddress : formData.billingAddress,
        customerNotes: formData.customerNotes,
        useShippingAsBilling: formData.useShippingAsBilling
      };

      const response = await fetch(`/api/stores/${storeId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Order creation failed');
      }

      if (result.payment?.authorizationUrl) {
        // Clear cart
        localStorage.removeItem('cleyverse-cart');
        
        // Redirect to payment
        window.location.href = result.payment.authorizationUrl;
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-cley-blue mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart before checking out.
        </p>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currency Switcher */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Currency</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred currency for this purchase
                  </p>
                </div>
                <CurrencySwitcher
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.customer.firstName}
                    onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                    className={validationErrors.customer?.firstName ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.customer?.firstName} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.customer.lastName}
                    onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                    className={validationErrors.customer?.lastName ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.customer?.lastName} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                    className={validationErrors.customer?.email ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.customer?.email} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.customer.phone}
                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    className={validationErrors.customer?.phone ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.customer?.phone} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingAddress">Street Address *</Label>
                <Input
                  id="shippingAddress"
                  value={formData.shippingAddress.address}
                  onChange={(e) => handleAddressChange('shipping', 'address', e.target.value)}
                  className={validationErrors.shippingAddress?.address ? 'border-red-500' : ''}
                />
                <ValidationError error={validationErrors.shippingAddress?.address} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="shippingCity">City *</Label>
                  <Input
                    id="shippingCity"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                    className={validationErrors.shippingAddress?.city ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.shippingAddress?.city} />
                </div>
                <div>
                  <Label htmlFor="shippingState">State *</Label>
                  <Input
                    id="shippingState"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                    className={validationErrors.shippingAddress?.state ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.shippingAddress?.state} />
                </div>
                <div>
                  <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                  <Input
                    id="shippingPostalCode"
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => handleAddressChange('shipping', 'postalCode', e.target.value)}
                    className={validationErrors.shippingAddress?.postalCode ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.shippingAddress?.postalCode} />
                </div>
              </div>
              <div>
                <Label htmlFor="shippingCountry">Country *</Label>
                <Input
                  id="shippingCountry"
                  value={formData.shippingAddress.country}
                  onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                  className={validationErrors.shippingAddress?.country ? 'border-red-500' : ''}
                />
                <ValidationError error={validationErrors.shippingAddress?.country} />
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useShippingAsBilling"
                  checked={formData.useShippingAsBilling}
                  onCheckedChange={(checked) => handleInputChange('useShippingAsBilling', checked)}
                />
                <Label htmlFor="useShippingAsBilling">
                  Use shipping address as billing address
                </Label>
              </div>

              {!formData.useShippingAsBilling && (
                <>
                  <div>
                    <Label htmlFor="billingAddress">Street Address *</Label>
                    <Input
                      id="billingAddress"
                      value={formData.billingAddress.address}
                      onChange={(e) => handleAddressChange('billing', 'address', e.target.value)}
                      className={validationErrors.billingAddress?.address ? 'border-red-500' : ''}
                    />
                    <ValidationError error={validationErrors.billingAddress?.address} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City *</Label>
                      <Input
                        id="billingCity"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                        className={validationErrors.billingAddress?.city ? 'border-red-500' : ''}
                      />
                      <ValidationError error={validationErrors.billingAddress?.city} />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State *</Label>
                      <Input
                        id="billingState"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                        className={validationErrors.billingAddress?.state ? 'border-red-500' : ''}
                      />
                      <ValidationError error={validationErrors.billingAddress?.state} />
                    </div>
                    <div>
                      <Label htmlFor="billingPostalCode">Postal Code *</Label>
                      <Input
                        id="billingPostalCode"
                        value={formData.billingAddress.postalCode}
                        onChange={(e) => handleAddressChange('billing', 'postalCode', e.target.value)}
                        className={validationErrors.billingAddress?.postalCode ? 'border-red-500' : ''}
                      />
                      <ValidationError error={validationErrors.billingAddress?.postalCode} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billingCountry">Country *</Label>
                    <Input
                      id="billingCountry"
                      value={formData.billingAddress.country}
                      onChange={(e) => handleAddressChange('billing', 'country', e.target.value)}
                      className={validationErrors.billingAddress?.country ? 'border-red-500' : ''}
                    />
                    <ValidationError error={validationErrors.billingAddress?.country} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <PaymentMethodSelector
            currency={selectedCurrency}
            country={getCountryFromCurrency(selectedCurrency)}
            amount={totalAmount}
            onSelect={(method) => {
              setSelectedPaymentMethod(method);
              clearFieldError('general');
            }}
            selected={selectedPaymentMethod}
          />
          
          {/* General Error Display */}
          {validationErrors.general && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>{validationErrors.general}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special instructions for your order..."
                value={formData.customerNotes}
                onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <OrderSummary items={cartItems} currency={selectedCurrency} />
            
            {/* Complete Purchase Button Inside Order Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <Button
                type="submit"
                className="w-full bg-cley-blue hover:bg-cley-blue/90 text-white h-12 shadow-lg"
                disabled={isSubmitting || !selectedPaymentMethod}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
