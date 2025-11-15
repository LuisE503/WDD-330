/**
 * Header module - handles cart badge and header interactions
 */

import { getCart } from './cart.js';

/**
 * Calculate total quantity of items in cart
 * @returns {number} Total quantity
 */
export function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + (item.quantity ?? 1);
  }, 0);
}

/**
 * Render cart count badge in header
 */
export function renderCartCount() {
  const badge = document.getElementById('cart-count');
  
  if (!badge) return;
  
  const count = getCartCount();
  
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hide');
  } else {
    badge.textContent = '';
    badge.classList.add('hide');
  }
}

// Make renderCartCount available globally for cart.js to call
if (typeof window !== 'undefined') {
  window.renderCartCount = renderCartCount;
}
