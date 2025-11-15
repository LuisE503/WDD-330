/**
 * Header module - dynamic header with search and cart badge
 */

import { getCartCount } from './cart.js';

/**
 * Generate header HTML
 * @returns {string} Header HTML markup
 */
function getHeaderHTML() {
  const cartCount = getCartCount();
  
  return `
    <div class="header-container">
      <div class="logo">
        <a href="index.html">
          <span class="logo-text">Sleep<span class="logo-accent">Outside</span></span>
        </a>
      </div>
      
      <nav class="main-nav" aria-label="Main navigation">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="product-list.html?category=Tents">Tents</a></li>
          <li><a href="product-list.html?category=Backpacks">Backpacks</a></li>
          <li><a href="product-list.html?category=Sleeping%20Bags">Sleeping Bags</a></li>
          <li><a href="product-list.html?category=Hammocks">Hammocks</a></li>
        </ul>
      </nav>
      
      <div class="header-actions">
        <form class="search-form" role="search" aria-label="Product search">
          <input 
            type="search" 
            id="search-input" 
            name="q" 
            placeholder="Search products..." 
            aria-label="Search products"
            autocomplete="off"
          />
          <button type="submit" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </button>
        </form>
        
        <a href="cart.html" class="cart-link" aria-label="Shopping cart with ${cartCount} items">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span id="cart-count" class="cart-badge" ${cartCount === 0 ? 'style="display:none;"' : ''}>${cartCount}</span>
        </a>
      </div>
    </div>
  `;
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  
  const count = getCartCount();
  badge.textContent = count;
  
  if (count === 0) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'flex';
  }
}

/**
 * Initialize header
 */
export function initHeader() {
  const headerElement = document.getElementById('main-header');
  
  if (!headerElement) {
    console.warn('Header element #main-header not found');
    return;
  }
  
  // Inject header HTML
  headerElement.innerHTML = getHeaderHTML();
  
  // Listen for cart updates
  window.addEventListener('cart:updated', updateCartBadge);
  
  // Initialize search form handler
  const searchForm = headerElement.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearchSubmit);
  }
}

/**
 * Handle search form submission
 * @param {Event} e - Submit event
 */
function handleSearchSubmit(e) {
  e.preventDefault();
  
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput?.value.trim();
  
  if (searchTerm) {
    // Navigate to product list with search query
    window.location.href = `product-list.html?search=${encodeURIComponent(searchTerm)}`;
  }
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
