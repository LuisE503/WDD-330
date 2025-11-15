/**
 * Product detail module - single product display and add to cart
 */

import { apiRequest, formatCurrency, getFinalPrice, isDiscounted, discountPercent, getResponsiveImage, createSrcSet, getParam, showAlert } from './utils.js';
import { addToCart } from './cart.js';
import { updateProductBreadcrumb } from './breadcrumbs.js';

/**
 * Fetch single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
async function fetchProduct(productId) {
  try {
    const endpoint = `/product/${encodeURIComponent(productId)}`;
    const product = await apiRequest(endpoint);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Render product detail
 * @param {Object} product - Product object
 * @param {HTMLElement} container - Container element
 */
function renderProductDetail(product, container) {
  if (!container) return;
  
  const finalPrice = getFinalPrice(product);
  const hasDiscount = isDiscounted(product);
  const discount = hasDiscount ? discountPercent(product) : 0;
  
  // Get responsive image
  const imageSrc = product.images ? getResponsiveImage(product.images) : (product.image ?? '');
  const srcset = product.images ? createSrcSet(product.images) : '';
  
  // Update page title
  document.title = `${product.name ?? 'Product'} - SleepOutside`;
  
  // Update breadcrumbs with product name
  if (product.name && product.category) {
    updateProductBreadcrumb(product.name, product.category);
  }
  
  container.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image">
        ${hasDiscount ? `<span class="badge badge-discount">-${discount}%</span>` : ''}
        <img 
          src="${imageSrc}" 
          ${srcset ? `srcset="${srcset}"` : ''}
          ${srcset ? `sizes="(max-width: 768px) 100vw, 50vw"` : ''}
          alt="${product.name ?? 'Product'}"
        />
      </div>
      
      <div class="product-detail-info">
        <h1 class="product-detail-name">${product.name ?? 'Unknown Product'}</h1>
        
        ${product.category ? `<p class="product-detail-category">${product.category}</p>` : ''}
        
        <div class="product-detail-pricing">
          ${hasDiscount ? `
            <div class="pricing-row">
              <span class="product-price-original">${formatCurrency(product.price)}</span>
              <span class="badge badge-discount-inline">Save ${discount}%</span>
            </div>
          ` : ''}
          <div class="product-price-final">${formatCurrency(finalPrice)}</div>
        </div>
        
        ${product.description ? `
          <div class="product-detail-description">
            <h2>Description</h2>
            <p>${product.description}</p>
          </div>
        ` : ''}
        
        ${product.stock !== undefined ? `
          <p class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
            ${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>
        ` : ''}
        
        <div class="product-actions">
          <label for="quantity">Quantity:</label>
          <input 
            type="number" 
            id="quantity" 
            name="quantity" 
            value="1" 
            min="1" 
            ${product.stock !== undefined ? `max="${product.stock}"` : ''}
            aria-label="Product quantity"
          />
          <button 
            id="add-to-cart-btn" 
            class="btn btn-primary"
            ${product.stock === 0 ? 'disabled' : ''}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Attach add to cart handler
  const addToCartBtn = container.querySelector('#add-to-cart-btn');
  const quantityInput = container.querySelector('#quantity');
  
  if (addToCartBtn && quantityInput) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value, 10);
      
      if (quantity > 0) {
        addToCart(product, quantity);
        showAlert(`${product.name} added to cart!`, 'success');
      }
    });
  }
}

/**
 * Initialize product detail page
 */
export async function initProductDetail() {
  const container = document.getElementById('product-detail-container');
  const loadingElement = document.getElementById('loading');
  
  if (!container) {
    console.warn('Product detail container not found');
    return;
  }
  
  const productId = getParam('id');
  
  if (!productId) {
    container.innerHTML = '<p class="error-message">No product ID provided.</p>';
    return;
  }
  
  // Show loading
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
  
  try {
    const product = await fetchProduct(productId);
    
    // Hide loading
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    renderProductDetail(product, container);
  } catch (error) {
    console.error('Error initializing product detail:', error);
    
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    container.innerHTML = '<p class="error-message">Error loading product. Please try again later.</p>';
  }
}

// Auto-initialize if on product detail page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-detail-container')) {
      initProductDetail();
    }
  });
} else {
  if (document.getElementById('product-detail-container')) {
    initProductDetail();
  }
}
