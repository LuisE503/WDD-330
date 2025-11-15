/**
 * Utility functions for SleepOutside e-commerce site
 */

/**
 * Format price as USD currency
 * @param {number} amount - Price to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (typeof numAmount !== 'number' || isNaN(numAmount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
}

/**
 * Check if product has a discount
 * @param {Object} item - Product item
 * @returns {boolean} True if discounted
 */
export function isDiscounted(item) {
  if (!item) return false;
  
  // Handle different API field names
  const price = item.SuggestedRetailPrice || item.price;
  const finalPrice = item.FinalPrice || item.finalPrice;
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numFinalPrice = finalPrice ? (typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice) : null;
  
  if (typeof numPrice !== 'number' || isNaN(numPrice)) return false;
  if (numFinalPrice === null || isNaN(numFinalPrice)) return false;
  
  return numFinalPrice < numPrice;
}

/**
 * Calculate discount percentage
 * @param {Object} item - Product item
 * @returns {number} Discount percentage (0-100)
 */
export function discountPercent(item) {
  if (!isDiscounted(item)) return 0;
  
  const price = item.SuggestedRetailPrice || item.price;
  const finalPrice = item.FinalPrice || item.finalPrice;
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numFinalPrice = typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice;
  
  return Math.round(((numPrice - numFinalPrice) / numPrice) * 100);
}

/**
 * Get final price for product
 * @param {Object} item - Product item
 * @returns {number} Final price to charge
 */
export function getFinalPrice(item) {
  if (!item) return 0;
  
  // Handle different API field names (SuggestedRetailPrice, FinalPrice, price, finalPrice)
  const price = item.SuggestedRetailPrice || item.price;
  const finalPrice = item.FinalPrice || item.finalPrice;
  
  // Convert to numbers if strings
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numFinalPrice = finalPrice ? (typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice) : null;
  
  if (typeof numPrice !== 'number' || isNaN(numPrice)) return 0;
  
  return numFinalPrice !== null && !isNaN(numFinalPrice) ? numFinalPrice : numPrice;
}

/**
 * Make API request with error handling
 * @param {string} endpoint - API endpoint (e.g., '/products/search/tent')
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint) {
  try {
    const baseURL = 'https://wdd330-backend.onrender.com';
    const url = `${baseURL}${endpoint}`;
    
    console.log(`[API] Requesting: ${url}`);
    
    const response = await fetch(url);
    
    console.log(`[API] Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`[API] Data received:`, data);
    
    return data;
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Select responsive image based on screen width
 * @param {Object} images - Images object with small, medium, large properties
 * @returns {string} Best image URL for current viewport
 */
export function getResponsiveImage(images) {
  if (!images) return '';
  
  // Handle if images is a string (single image)
  if (typeof images === 'string') return images;
  
  const width = window.innerWidth;
  
  if (width <= 480 && images.small) {
    return images.small;
  } else if (width <= 1024 && images.medium) {
    return images.medium;
  } else if (images.large) {
    return images.large;
  }
  
  // Fallback order
  return images.medium || images.large || images.small || '';
}

/**
 * Create srcset string from images object
 * @param {Object} images - Images object with small, medium, large properties
 * @returns {string} srcset attribute value
 */
export function createSrcSet(images) {
  if (!images) return '';
  
  // Handle if images is a string (single image)
  if (typeof images === 'string') return '';
  
  const srcset = [];
  if (images.small) srcset.push(`${images.small} 480w`);
  if (images.medium) srcset.push(`${images.medium} 1024w`);
  if (images.large) srcset.push(`${images.large} 1920w`);
  
  return srcset.join(', ');
}

/**
 * Render alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type: 'success', 'error', 'info'
 * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
 */
export function showAlert(message, type = 'info', duration = 3000) {
  const alertContainer = document.getElementById('alert-container') || createAlertContainer();
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.setAttribute('role', 'alert');
  alert.textContent = message;
  
  alertContainer.appendChild(alert);
  
  if (duration > 0) {
    setTimeout(() => {
      alert.remove();
    }, duration);
  }
}

function createAlertContainer() {
  const container = document.createElement('div');
  container.id = 'alert-container';
  container.className = 'alert-container';
  document.body.prepend(container);
  return container;
}
