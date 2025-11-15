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
  
  // Get image - handle different API response formats
  let imageSrc = '';
  let srcset = '';
  
  if (product.Images) {
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
  
  // Fallback to placeholder
  const productName = product.Name || product.name || 'Unknown Product';
  if (!imageSrc) {
    imageSrc = `https://placehold.co/600x600/2c5f2d/ffffff?text=${encodeURIComponent(productName)}`;
  }
  
  const productId = product.Id || product.id;
  const category = product.Category || product.category;
  const description = product.DescriptionHtmlSimple || product.description;
  const originalPrice = product.SuggestedRetailPrice || product.price;
  
  // Update page title
  document.title = `${productName} - SleepOutside`;
  
  // Update breadcrumbs with product name
  if (productName && category) {
    updateProductBreadcrumb(productName, category);
  }
  
  container.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image">
        ${hasDiscount ? `<span class="badge badge-discount">-${discount}%</span>` : ''}
        <img 
          src="${imageSrc}" 
          ${srcset ? `srcset="${srcset}"` : ''}
          ${srcset ? `sizes="(max-width: 768px) 100vw, 50vw"` : ''}
          alt="${productName}"
          onerror="this.src='https://placehold.co/600x600/2c5f2d/ffffff?text=No+Image'"
        />
      </div>
      
      <div class="product-detail-info">
        <h1 class="product-detail-name">${productName}</h1>
        
        ${category ? `<p class="product-detail-category">${category}</p>` : ''}
        
        <div class="product-detail-pricing">
          ${hasDiscount ? `
            <div class="pricing-row">
              <span class="product-price-original">${formatCurrency(originalPrice)}</span>
              <span class="badge badge-discount-inline">Save ${discount}%</span>
            </div>
          ` : ''}
          <div class="product-price-final">${formatCurrency(finalPrice)}</div>
        </div>
        
        ${description ? `
          <div class="product-detail-description">
            <h2>Description</h2>
            <div>${description}</div>
          </div>
        ` : ''}
        
        <p class="product-stock in-stock">
          In Stock
        </p>
        
        <div class="product-actions">
          <label for="quantity">Quantity:</label>
          <input 
            type="number" 
            id="quantity" 
            name="quantity" 
            value="1" 
            min="1" 
            max="99"
            aria-label="Product quantity"
          />
          <button 
            id="add-to-cart-btn" 
            class="btn btn-primary"
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
        showAlert(`${productName} added to cart!`, 'success');
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
    container.innerHTML = `
      <div class="error-message">
        <p>⚠️ No product ID provided.</p>
        <a href="/index.html" class="btn btn-primary">Return to Home</a>
      </div>
    `;
    return;
  }
  
  // Show loading
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
  
  try {
    console.log('Fetching product:', productId);
    const product = await fetchProduct(productId);
    console.log('Product loaded:', product);
    
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
    
    container.innerHTML = `
      <div class="error-message">
        <p>⚠️ Error loading product. Please try again later.</p>
        <p class="error-details">${error.message}</p>
        <button onclick="window.location.reload()" class="btn btn-primary">Retry</button>
      </div>
    `;
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
