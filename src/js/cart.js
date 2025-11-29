/**
 * Cart module - handles cart operations and rendering
 */

import { formatCurrency, getFinalPrice, isDiscounted, discountPercent, getResponsiveImage, createSrcSet } from './utils.js';

const CART_KEY = 'so-cart';

/**
 * Get cart items from localStorage
 * @returns {Array} Array of cart items (empty array if none)
 */
export function getCart() {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
}

/**
 * Save cart items to localStorage and dispatch update event
 * @param {Array} cart - Array of cart items
 */
export function setCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch custom event so other components can react to cart changes
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

/**
 * Add item to cart or increment quantity if already exists
 * @param {Object} item - Product item to add
 * @param {number} qty - Quantity to add (default 1)
 */
export function addToCart(item, qty = 1) {
  if (!item) {
    console.error('Invalid item:', item);
    return;
  }
  
  // Handle different ID field names from API
  const itemId = item.Id || item.id;
  if (!itemId) {
    console.error('Item has no ID:', item);
    return;
  }
  
  const cart = getCart();
  const existingItem = cart.find(cartItem => {
    const cartItemId = cartItem.Id || cartItem.id;
    return cartItemId === itemId;
  });
  
  if (existingItem) {
    // Item already in cart - increment quantity
    existingItem.quantity = (existingItem.quantity || 1) + qty;
    console.log(`Updated quantity for ${item.Name || item.name} to ${existingItem.quantity}`);
  } else {
    // New item - normalize the item structure
    const normalizedItem = {
      id: itemId,
      Id: itemId,
      name: item.Name || item.name,
      Name: item.Name || item.name,
      price: item.SuggestedRetailPrice || item.price,
      SuggestedRetailPrice: item.SuggestedRetailPrice || item.price,
      finalPrice: item.FinalPrice || item.finalPrice,
      FinalPrice: item.FinalPrice || item.finalPrice,
      category: item.Category || item.category,
      Category: item.Category || item.category,
      images: item.Images || item.images,
      Images: item.Images || item.images,
      image: item.Image || item.image,
      Image: item.Image || item.image,
      quantity: qty
    };
    cart.push(normalizedItem);
    console.log(`Added ${normalizedItem.name} to cart with quantity ${qty}`);
  }
  
  setCart(cart);
}

/**
 * Update quantity of item in cart
 * @param {string} id - Product ID
 * @param {number} qty - New quantity (must be >= 1)
 */
export function updateQuantity(id, qty) {
  if (qty < 1) {
    console.error('Quantity must be at least 1');
    return;
  }
  
  const cart = getCart();
  const item = cart.find(cartItem => cartItem.id === id);
  
  if (item) {
    item.quantity = qty;
    setCart(cart);
  }
}

/**
 * Remove item from cart
 * @param {string} id - Product ID to remove
 */
export function removeFromCart(id) {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.id !== id);
  setCart(filteredCart);
}

/**
 * Calculate total price of cart items
 * @param {Array} cart - Array of cart items (optional, will fetch if not provided)
 * @returns {number} Total price
 */
export function calculateCartTotal(cart = null) {
  const cartItems = cart || getCart();
  return cartItems.reduce((total, item) => {
    const price = getFinalPrice(item);
    const quantity = item.quantity ?? 1;
    return total + (price * quantity);
  }, 0);
}

// Alias for compatibility
export const getCartTotal = calculateCartTotal;

/**
 * Get total number of items in cart
 * @returns {number} Total item count
 */
export function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + (item.quantity || 1), 0);
}

/**
 * Render cart total in the footer
 */
export function renderCartTotal() {
  const cart = getCart();
  const footer = document.getElementById('cart-footer');
  const totalElement = document.getElementById('cart-total-amount');

  if (!footer || !totalElement) return;

  if (cart.length === 0) {
    footer.classList.add('hide');
  } else {
    footer.classList.remove('hide');
    const total = calculateCartTotal(cart);
    totalElement.textContent = formatCurrency(total);
  }
}

/**
 * Render a single cart item
 * @param {Object} item - Cart item to render
 * @returns {HTMLElement} Cart item element
 */
function renderCartItem(item) {
  const li = document.createElement('li');
  li.className = 'cart-item';
  li.setAttribute('data-id', item.id || item.Id);
  
  const price = getFinalPrice(item);
  const quantity = item.quantity ?? 1;
  const itemTotal = price * quantity;
  
  // Get image - handle different API response formats
  let imageSrc = '';
  if (item.Images) {
    imageSrc = getResponsiveImage(item.Images);
  } else if (item.images) {
    imageSrc = getResponsiveImage(item.images);
  } else if (item.Image) {
    imageSrc = item.Image;
  } else if (item.image) {
    imageSrc = item.image;
  }
  
  // Fallback to placeholder
  if (!imageSrc) {
    const productName = item.Name || item.name || 'Product';
    imageSrc = `https://placehold.co/120x120/2c5f2d/ffffff?text=${encodeURIComponent(productName)}`;
  }
  
  const productName = item.Name || item.name || 'Unknown Product';
  const productId = item.Id || item.id;
  
  li.innerHTML = `
    <div class="cart-item-image">
      <img 
        src="${imageSrc}" 
        alt="${productName}"
        onerror="this.src='https://placehold.co/120x120/2c5f2d/ffffff?text=No+Image'"
      />
    </div>
    <div class="cart-item-details">
      <h3 class="cart-item-name">${productName}</h3>
      <p class="cart-item-price">${formatCurrency(price)}</p>
      ${isDiscounted(item) ? `<span class="badge badge-discount-inline">-${discountPercent(item)}%</span>` : ''}
      <div class="cart-item-quantity">
        <label for="qty-${productId}">Quantity:</label>
        <input type="number" 
               id="qty-${productId}" 
               class="quantity-input" 
               value="${quantity}" 
               min="1" 
               data-id="${productId}"
               aria-label="Quantity for ${productName}">
      </div>
      <p class="cart-item-total">Subtotal: ${formatCurrency(itemTotal)}</p>
    </div>
    <button class="cart-remove" data-id="${productId}" aria-label="Remove ${productName} from cart">
      <span aria-hidden="true">×</span>
    </button>
  `;
  
  return li;
}

/**
 * Render cart items in the list
 */
export function renderCartItems() {
  const cart = getCart();
  const listContainer = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('cart-empty');

  if (!listContainer) return;

  // Clear existing items
  listContainer.innerHTML = '';

  if (cart.length === 0) {
    // Show empty state
    if (emptyMessage) {
      emptyMessage.classList.remove('hide');
    }
    listContainer.innerHTML = '';
  } else {
    // Hide empty state
    if (emptyMessage) {
      emptyMessage.classList.add('hide');
    }

    // Render each item
    cart.forEach(item => {
      const itemElement = renderCartItem(item);
      listContainer.appendChild(itemElement);
    });

    // Attach event listeners
    attachQuantityListeners();
    attachRemoveListeners();
  }

  // Always update the total
  renderCartTotal();
}

/**
 * Attach event listeners to quantity inputs
 */
function attachQuantityListeners() {
  const quantityInputs = document.querySelectorAll('.quantity-input');
  
  quantityInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const newQty = parseInt(e.target.value, 10);
      
      if (newQty >= 1) {
        updateQuantity(id, newQty);
        renderCartItems(); // Re-render to update subtotals
      } else {
        e.target.value = 1; // Reset to minimum
      }
    });
  });
}

/**
 * Attach event listeners to remove buttons
 */
function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll('.cart-remove');
  removeButtons.forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });
}

/**
 * Handle remove item click
 * @param {Event} event - Click event
 */
function handleRemoveItem(event) {
  const button = event.currentTarget;
  const itemId = button.getAttribute('data-id');
  
  if (itemId) {
    removeFromCart(itemId);
    renderCartItems(); // Re-render cart
  }
}

/**
 * Initialize cart page
 */
export function initCart() {
  renderCartItems();
  
  // Listen for cart updates from other sources
  window.addEventListener('cart:updated', () => {
    renderCartItems();
  });

  // Handle checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      // Import resolvePath
      import('./utils.js').then(({ resolvePath }) => {
        window.location.href = resolvePath('checkout.html');
      });
    });
  }
}

// Auto-initialize if cart page elements exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
      initCart();
    }
  });
} else {
  if (document.getElementById('cart-items')) {
    initCart();
  }
}

