/**
 * Products module - fetch and render product listings
 */

import { apiRequest, formatCurrency, getFinalPrice, isDiscounted, discountPercent, getResponsiveImage, createSrcSet, getParam, resolvePath } from './utils.js';
import { addToCart } from './cart.js';

/**
 * Fallback products by category (used when API fails)
 */
const FALLBACK_PRODUCTS = {
  'tents': [
    { Id: "880RR", Name: "Marmot Ajax 3 Tent", Category: "Tents", SuggestedRetailPrice: 349.99, FinalPrice: 279.99, Images: { PrimaryMedium: "https://placehold.co/400x300/2c5f2d/ffffff?text=Marmot+Ajax+3" } },
    { Id: "989CG", Name: "The North Face Talus 4", Category: "Tents", SuggestedRetailPrice: 449.99, Images: { PrimaryMedium: "https://placehold.co/400x300/4a7c59/ffffff?text=Talus+4" } },
    { Id: "344YJ", Name: "Cedar Ridge Rimrock 2", Category: "Tents", SuggestedRetailPrice: 199.99, FinalPrice: 149.99, Images: { PrimaryMedium: "https://placehold.co/400x300/6b8e23/ffffff?text=Rimrock+2" } },
    { Id: "750ZY", Name: "Kelty Galactic 6", Category: "Tents", SuggestedRetailPrice: 599.99, FinalPrice: 499.99, Images: { PrimaryMedium: "https://placehold.co/400x300/97c05c/ffffff?text=Galactic+6" } }
  ],
  'backpacks': [
    { Id: "BP100", Name: "Mountain Explorer 50L", Category: "Backpacks", SuggestedRetailPrice: 179.99, FinalPrice: 149.99, Images: { PrimaryMedium: "https://placehold.co/400x300/2c5f2d/ffffff?text=Explorer+50L" } },
    { Id: "BP200", Name: "Summit Trekker 65L", Category: "Backpacks", SuggestedRetailPrice: 229.99, Images: { PrimaryMedium: "https://placehold.co/400x300/4a7c59/ffffff?text=Trekker+65L" } },
    { Id: "BP300", Name: "Urban Commuter 30L", Category: "Backpacks", SuggestedRetailPrice: 89.99, FinalPrice: 69.99, Images: { PrimaryMedium: "https://placehold.co/400x300/6b8e23/ffffff?text=Commuter+30L" } },
    { Id: "BP400", Name: "Alpine Pro 80L", Category: "Backpacks", SuggestedRetailPrice: 299.99, FinalPrice: 249.99, Images: { PrimaryMedium: "https://placehold.co/400x300/97c05c/ffffff?text=Alpine+80L" } }
  ],
  'sleeping bags': [
    { Id: "SB100", Name: "Winter Warmer -20°F", Category: "Sleeping Bags", SuggestedRetailPrice: 189.99, FinalPrice: 159.99, Images: { PrimaryMedium: "https://placehold.co/400x300/2c5f2d/ffffff?text=Winter+Warmer" } },
    { Id: "SB200", Name: "Three Season 20°F", Category: "Sleeping Bags", SuggestedRetailPrice: 129.99, Images: { PrimaryMedium: "https://placehold.co/400x300/4a7c59/ffffff?text=Three+Season" } },
    { Id: "SB300", Name: "Ultralight Summer 40°F", Category: "Sleeping Bags", SuggestedRetailPrice: 79.99, FinalPrice: 59.99, Images: { PrimaryMedium: "https://placehold.co/400x300/6b8e23/ffffff?text=Ultralight" } },
    { Id: "SB400", Name: "Family Car Camping", Category: "Sleeping Bags", SuggestedRetailPrice: 59.99, Images: { PrimaryMedium: "https://placehold.co/400x300/97c05c/ffffff?text=Car+Camping" } }
  ],
  'hammocks': [
    { Id: "HM100", Name: "Double Paradise Hammock", Category: "Hammocks", SuggestedRetailPrice: 79.99, FinalPrice: 59.99, Images: { PrimaryMedium: "https://placehold.co/400x300/2c5f2d/ffffff?text=Paradise+Double" } },
    { Id: "HM200", Name: "Camping Hammock with Net", Category: "Hammocks", SuggestedRetailPrice: 99.99, Images: { PrimaryMedium: "https://placehold.co/400x300/4a7c59/ffffff?text=With+Net" } },
    { Id: "HM300", Name: "Ultralight Solo", Category: "Hammocks", SuggestedRetailPrice: 49.99, FinalPrice: 39.99, Images: { PrimaryMedium: "https://placehold.co/400x300/6b8e23/ffffff?text=Ultralight+Solo" } },
    { Id: "HM400", Name: "Quilted Comfort XL", Category: "Hammocks", SuggestedRetailPrice: 119.99, FinalPrice: 89.99, Images: { PrimaryMedium: "https://placehold.co/400x300/97c05c/ffffff?text=Quilted+XL" } }
  ]
};

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProductsByCategory(category) {
  try {
    // API returns products for specific category
    const endpoint = `/products/search/${encodeURIComponent(category)}`;
    const data = await apiRequest(endpoint);
    
    // If API returns data, use it
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    
    // Otherwise, use fallback products
    console.warn(`No products from API for "${category}", using fallback data`);
    const categoryKey = category.toLowerCase();
    return FALLBACK_PRODUCTS[categoryKey] || [];
    
  } catch (error) {
    console.error('Error fetching products by category:', error);
    
    // Use fallback products on error
    const categoryKey = category.toLowerCase();
    return FALLBACK_PRODUCTS[categoryKey] || [];
  }
}

/**
 * Fetch products by search term
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProductsBySearch(searchTerm) {
  try {
    const endpoint = `/products/search/${encodeURIComponent(searchTerm)}`;
    const data = await apiRequest(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Sort products by criteria
 * @param {Array} products - Array of products
 * @param {string} criteria - Sort criteria: 'name-asc', 'name-desc', 'price-asc', 'price-desc'
 * @returns {Array} Sorted products
 */
export function sortProducts(products, criteria) {
  const sorted = [...products];
  
  switch (criteria) {
    case 'name-asc':
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'name-desc':
      sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'price-asc':
      sorted.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
      break;
    case 'price-desc':
      sorted.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
      break;
    default:
      break;
  }
  
  return sorted;
}

/**
 * Render a product card
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function renderProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  
  const finalPrice = getFinalPrice(product);
  const hasDiscount = isDiscounted(product);
  const discount = hasDiscount ? discountPercent(product) : 0;
  
  // Get image - handle different API response formats
  let imageSrc = '';
  let srcset = '';
  
  if (product.Images) {
    // API returns Images with capital I
    imageSrc = getResponsiveImage(product.Images);
    srcset = createSrcSet(product.Images);
  } else if (product.images) {
    imageSrc = getResponsiveImage(product.images);
    srcset = createSrcSet(product.images);
  } else if (product.Image) {
    imageSrc = product.Image;
  } else if (product.image) {
    imageSrc = product.image;
  }
  
  // Fallback to placeholder if no image
  if (!imageSrc) {
    imageSrc = `https://placehold.co/400x300/2c5f2d/ffffff?text=${encodeURIComponent(product.Name || product.name || 'Product')}`;
  }
  
  // Get product name - handle different API formats
  const productName = product.Name || product.name || 'Unknown Product';
  const productId = product.Id || product.id;
  const category = product.Category || product.category;
  
  card.innerHTML = `
    <a href="${resolvePath(`product.html?id=${productId}`)}" class="product-link">
      ${hasDiscount ? `<span class="badge badge-discount">-${discount}%</span>` : ''}
      <div class="product-image">
        <img 
          src="${imageSrc}" 
          ${srcset ? `srcset="${srcset}"` : ''}
          ${srcset ? `sizes="(max-width: 480px) 480px, (max-width: 1024px) 1024px, 1920px"` : ''}
          alt="${productName}"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x300/2c5f2d/ffffff?text=No+Image'"
        />
      </div>
      <div class="product-info">
        <h3 class="product-name">${productName}</h3>
        ${category ? `<p class="product-category">${category}</p>` : ''}
        <div class="product-pricing">
          ${hasDiscount ? `<span class="product-price-original">${formatCurrency(product.SuggestedRetailPrice || product.price)}</span>` : ''}
          <span class="product-price ${hasDiscount ? 'product-price-discounted' : ''}">${formatCurrency(finalPrice)}</span>
        </div>
      </div>
    </a>
    <button class="btn btn-primary add-to-cart-btn" data-product-id="${productId}">
      Add to Cart
    </button>
  `;
  
  // Add event listener to the button
  const addToCartBtn = card.querySelector('.add-to-cart-btn');
  addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    
    // Visual feedback
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = '✓ Added!';
    addToCartBtn.disabled = true;
    
    setTimeout(() => {
      addToCartBtn.textContent = originalText;
      addToCartBtn.disabled = false;
    }, 1500);
  });
  
  return card;
}

/**
 * Render product list
 * @param {Array} products - Array of products
 * @param {HTMLElement} container - Container element
 */
export function renderProductList(products, container) {
  if (!container) {
    console.error('Container element not provided');
    return;
  }
  
  // Clear existing content
  container.innerHTML = '';
  
  if (products.length === 0) {
    container.innerHTML = '<p class="no-results">No products found.</p>';
    return;
  }
  
  // Render each product
  products.forEach(product => {
    const card = renderProductCard(product);
    container.appendChild(card);
  });
}

/**
 * Initialize product list page
 */
export async function initProductList() {
  const container = document.getElementById('product-list');
  const sortSelect = document.getElementById('sort-select');
  const loadingElement = document.getElementById('loading');
  const resultsCount = document.getElementById('results-count');
  const pageTitle = document.getElementById('page-title');
  
  if (!container) {
    console.warn('Product list container not found');
    return;
  }
  
  // Show loading state
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
  
  // Determine if category or search
  const category = getParam('category');
  const searchTerm = getParam('search');
  
  // Update page title
  if (pageTitle) {
    if (category) {
      pageTitle.textContent = category;
    } else if (searchTerm) {
      pageTitle.textContent = `Search Results for "${searchTerm}"`;
    } else {
      pageTitle.textContent = 'All Products';
    }
  }
  
  let products = [];
  
  try {
    if (category) {
      console.log('Fetching products for category:', category);
      products = await fetchProductsByCategory(category);
    } else if (searchTerm) {
      console.log('Searching products for term:', searchTerm);
      products = await fetchProductsBySearch(searchTerm);
    } else {
      // Default to showing tents if no parameters
      console.log('No category or search term, showing default products');
      products = await fetchProductsByCategory('tents');
    }
    
    console.log('Products loaded:', products.length, products);
    
    // Hide loading
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    // Update results count
    if (resultsCount) {
      const count = products.length;
      resultsCount.textContent = `${count} ${count === 1 ? 'product' : 'products'} found`;
    }
    
    // Render products
    renderProductList(products, container);
    
    // Setup sort handler
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        const sortedProducts = sortProducts(products, e.target.value);
        renderProductList(sortedProducts, container);
      });
    }
  } catch (error) {
    console.error('Error initializing product list:', error);
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    container.innerHTML = `
      <div class="error-message">
        <p>⚠️ Error loading products. Please try again later.</p>
        <p class="error-details">${error.message}</p>
        <button onclick="window.location.reload()" class="btn btn-primary">Retry</button>
      </div>
    `;
  }
}

// Auto-initialize if on product list page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-list')) {
      initProductList();
    }
  });
} else {
  if (document.getElementById('product-list')) {
    initProductList();
  }
}
