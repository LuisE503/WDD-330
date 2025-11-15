/**
 * Breadcrumbs module - dynamic breadcrumb navigation
 */

import { getParam } from './utils.js';

/**
 * Generate breadcrumb items based on current page context
 * @returns {Array} Array of breadcrumb objects {label, url}
 */
function getBreadcrumbItems() {
  const breadcrumbs = [];
  const path = window.location.pathname;
  
  // Always start with Home (except on home page)
  if (!path.endsWith('index.html') && path !== '/') {
    breadcrumbs.push({ label: 'Home', url: '/index.html' });
  }
  
  // Product list page
  if (path.includes('product-list')) {
    const category = getParam('category');
    const searchTerm = getParam('search');
    
    if (category) {
      breadcrumbs.push({ label: category, url: null }); // Current page, no link
    } else if (searchTerm) {
      breadcrumbs.push({ label: `Search: "${searchTerm}"`, url: null });
    } else {
      breadcrumbs.push({ label: 'Products', url: null });
    }
  }
  
  // Product detail page
  if (path.includes('product.html')) {
    const productId = getParam('id');
    // We'd need the product name from localStorage or API
    // For now, just show "Product Details"
    breadcrumbs.push({ label: 'Product Details', url: null });
  }
  
  // Cart page
  if (path.includes('cart.html')) {
    breadcrumbs.push({ label: 'Shopping Cart', url: null });
  }
  
  return breadcrumbs;
}

/**
 * Render breadcrumbs
 * @param {Array} items - Array of breadcrumb objects
 * @returns {string} Breadcrumb HTML
 */
function renderBreadcrumbs(items) {
  if (items.length === 0) {
    return '';
  }
  
  const breadcrumbItems = items.map((item, index) => {
    const isLast = index === items.length - 1;
    
    if (isLast || !item.url) {
      // Current page - no link
      return `<li aria-current="page">${item.label}</li>`;
    } else {
      // Link to previous page
      return `<li><a href="${item.url}">${item.label}</a></li>`;
    }
  }).join('<li class="breadcrumb-separator" aria-hidden="true">/</li>');
  
  return `
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
      <ol class="breadcrumb">
        ${breadcrumbItems}
      </ol>
    </nav>
  `;
}

/**
 * Update breadcrumb with product name (for product detail page)
 * @param {string} productName - Product name
 * @param {string} category - Product category (optional)
 */
export function updateProductBreadcrumb(productName, category) {
  const breadcrumbNav = document.querySelector('.breadcrumb-nav');
  if (!breadcrumbNav) return;
  
  const breadcrumbs = [
    { label: 'Home', url: '/index.html' }
  ];
  
  if (category) {
    breadcrumbs.push({ 
      label: category, 
      url: `/product-list.html?category=${encodeURIComponent(category)}` 
    });
  }
  
  breadcrumbs.push({ label: productName, url: null });
  
  breadcrumbNav.outerHTML = renderBreadcrumbs(breadcrumbs);
}

/**
 * Update breadcrumb with result count (for product list page)
 * @param {number} count - Number of products
 */
export function updateResultCountBreadcrumb(count) {
  const breadcrumbNav = document.querySelector('.breadcrumb-nav');
  if (!breadcrumbNav) return;
  
  const currentItem = breadcrumbNav.querySelector('li[aria-current="page"]');
  if (currentItem) {
    const currentText = currentItem.textContent;
    currentItem.textContent = `${currentText} (${count} ${count === 1 ? 'item' : 'items'})`;
  }
}

/**
 * Initialize breadcrumbs
 */
export function initBreadcrumbs() {
  const breadcrumbContainer = document.getElementById('breadcrumb-container');
  
  if (!breadcrumbContainer) {
    return; // No breadcrumb container on this page
  }
  
  const items = getBreadcrumbItems();
  const html = renderBreadcrumbs(items);
  
  breadcrumbContainer.innerHTML = html;
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBreadcrumbs);
} else {
  initBreadcrumbs();
}
