/**
 * Products module - fetch and render product listings
 */

import { apiRequest, formatCurrency, getFinalPrice, isDiscounted, discountPercent, getResponsiveImage, createSrcSet, getParam } from './utils.js';

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
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
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
  
  // Get responsive image
  const imageSrc = product.images ? getResponsiveImage(product.images) : (product.image ?? '');
  const srcset = product.images ? createSrcSet(product.images) : '';
  
  card.innerHTML = `
    <a href="/product.html?id=${product.id}" class="product-link">
      ${hasDiscount ? `<span class="badge badge-discount">-${discount}%</span>` : ''}
      <div class="product-image">
        <img 
          src="${imageSrc}" 
          ${srcset ? `srcset="${srcset}"` : ''}
          ${srcset ? `sizes="(max-width: 480px) 480px, (max-width: 1024px) 1024px, 1920px"` : ''}
          alt="${product.name ?? 'Product'}"
          loading="lazy"
        />
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name ?? 'Unknown Product'}</h3>
        ${product.category ? `<p class="product-category">${product.category}</p>` : ''}
        <div class="product-pricing">
          ${hasDiscount ? `<span class="product-price-original">${formatCurrency(product.price)}</span>` : ''}
          <span class="product-price">${formatCurrency(finalPrice)}</span>
        </div>
      </div>
    </a>
  `;
  
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
  
  let products = [];
  
  try {
    if (category) {
      products = await fetchProductsByCategory(category);
    } else if (searchTerm) {
      products = await fetchProductsBySearch(searchTerm);
    }
    
    // Hide loading
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    // Update results count
    if (resultsCount) {
      resultsCount.textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'} found`;
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
    container.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
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
