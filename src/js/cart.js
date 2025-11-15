/**
 * Cart module - handles cart operations and rendering
 */

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
 * Save cart items to localStorage
 * @param {Array} cart - Array of cart items
 */
export function setCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

/**
 * Calculate total price of cart items
 * @param {Array} cart - Array of cart items
 * @returns {number} Total price
 */
export function calculateCartTotal(cart) {
  return cart.reduce((total, item) => {
    const price = item.finalPrice ?? item.price ?? 0;
    const quantity = item.quantity ?? 1;
    return total + (price * quantity);
  }, 0);
}

/**
 * Format number as USD currency
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
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
    totalElement.textContent = formatUSD(total);
  }
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
      const li = document.createElement('li');
      li.className = 'cart-item';
      
      const price = item.finalPrice ?? item.price ?? 0;
      const quantity = item.quantity ?? 1;
      const itemTotal = price * quantity;
      
      li.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image ?? 'placeholder.jpg'}" alt="${item.name ?? 'Product'}" />
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name ?? 'Unknown Product'}</h3>
          <p class="cart-item-price">${formatUSD(price)}</p>
          <p class="cart-item-quantity">Quantity: ${quantity}</p>
          <p class="cart-item-total">Subtotal: ${formatUSD(itemTotal)}</p>
        </div>
        <button class="cart-remove" data-id="${item.id}" aria-label="Remove ${item.name ?? 'item'} from cart">×</button>
      `;
      
      listContainer.appendChild(li);
    });

    // Add event listeners for remove buttons
    attachRemoveListeners();
  }

  // Always update the total
  renderCartTotal();
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
  }
}

/**
 * Remove item from cart by ID
 * @param {string} itemId - Product ID to remove
 */
export function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== itemId);
  setCart(cart);
  
  // Re-render cart UI
  renderCartItems();
  
  // Update header badge if function is available
  if (window.renderCartCount) {
    window.renderCartCount();
  }
}

/**
 * Add item to cart (or update quantity if exists)
 * @param {Object} product - Product to add
 */
export function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity ?? 1) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  setCart(cart);
  
  // Update header badge if function is available
  if (window.renderCartCount) {
    window.renderCartCount();
  }
}
