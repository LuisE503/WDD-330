/**
 * Configuration constants for SleepOutside app
 * Centralizes all configuration values for easy maintenance
 */

// API Configuration
export const API_CONFIG = {
  baseURL: 'https://wdd330-backend.onrender.com',
  endpoints: {
    products: '/products/search',
    product: '/product',
    checkout: '/checkout'
  },
  timeout: 10000 // 10 seconds
};

// Checkout Configuration
export const CHECKOUT_CONFIG = {
  shippingRate: 10,      // $10 flat rate shipping
  taxRate: 0.07,         // 7% tax
  currency: 'USD',
  locale: 'en-US'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  cart: 'so-cart',
  newsletter: 'newsletter-subscribed',
  newsletterEmail: 'newsletter-email',
  welcomeSeen: 'welcome-seen'
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  cartBounceDuration: 600,    // milliseconds
  badgePulseDuration: 600,    // milliseconds
  modalFadeIn: 300,           // milliseconds
  alertDuration: 3000,        // milliseconds
  welcomeDelay: 2000          // 2 seconds before showing welcome modal
};

// Validation Patterns
export const VALIDATION = {
  cardNumber: {
    pattern: /^\d{16}$/,
    message: 'Card number must be 16 digits'
  },
  cvv: {
    pattern: /^\d{3}$/,
    message: 'Security code must be 3 digits'
  },
  zip: {
    pattern: /^\d{5}$/,
    message: 'ZIP code must be 5 digits'
  },
  state: {
    pattern: /^[A-Z]{2}$/,
    message: 'State must be 2 letters (e.g., UT)'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  }
};

// Expiration Validation Function
export function validateExpiration(value) {
  // Format: MM/YY
  const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!pattern.test(value)) {
    return 'Expiration must be MM/YY format';
  }
  
  const [month, year] = value.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null; // Valid
}

// Responsive Breakpoints (matches CSS)
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

// Product Card Configuration
export const PRODUCT_CONFIG = {
  defaultCategory: 'tents',
  resultsPerPage: 20,
  defaultSort: 'name',
  sortOptions: [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' }
  ]
};

// Alert Types
export const ALERT_TYPES = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning'
};

// Development Mode Detection
export const DEV_MODE = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '';

// Feature Flags (for gradual rollout of new features)
export const FEATURES = {
  quickView: true,
  newsletter: true,
  welcomeModal: true,
  animations: true,
  productSearch: true
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your internet connection.',
  api: 'Unable to load data. Please try again later.',
  cart: 'Unable to update cart. Please try again.',
  checkout: 'Unable to process order. Please try again.',
  validation: 'Please check your form for errors.',
  emptyCart: 'Your cart is empty. Add some items before checking out.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  addToCart: 'Product added to cart!',
  removeFromCart: 'Product removed from cart',
  cartUpdated: 'Cart updated successfully',
  orderPlaced: 'Order placed successfully!',
  newsletter: 'Thank you for subscribing!',
  checkout: 'Your order has been placed successfully!'
};

// Path Configuration
export const PATHS = {
  home: 'index.html',
  cart: 'cart.html',
  checkout: 'checkout.html',
  productList: 'product-list.html',
  product: 'product.html'
};

// Export all as a single config object (optional)
export const CONFIG = {
  api: API_CONFIG,
  checkout: CHECKOUT_CONFIG,
  storage: STORAGE_KEYS,
  animation: ANIMATION_CONFIG,
  validation: VALIDATION,
  breakpoints: BREAKPOINTS,
  product: PRODUCT_CONFIG,
  alerts: ALERT_TYPES,
  dev: DEV_MODE,
  features: FEATURES,
  errors: ERROR_MESSAGES,
  success: SUCCESS_MESSAGES,
  paths: PATHS
};

export default CONFIG;
