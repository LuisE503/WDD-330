/**
 * Product module - handles product display and discount calculations
 */

/**
 * Check if a product is discounted
 * @param {Object} item - Product item
 * @returns {boolean} True if discounted
 */
export function isDiscounted(item) {
  return item.finalPrice != null && item.finalPrice < item.price;
}

/**
 * Calculate discount percentage
 * @param {Object} item - Product item
 * @returns {number} Discount percentage (rounded)
 */
export function getDiscountPercentage(item) {
  if (!isDiscounted(item)) return 0;
  return Math.round(100 * (1 - item.finalPrice / item.price));
}

/**
 * Create discount badge HTML
 * @param {Object} item - Product item
 * @returns {string} HTML string for discount badge or empty string
 */
export function createDiscountBadge(item) {
  if (!isDiscounted(item)) return '';
  const percentage = getDiscountPercentage(item);
  return `<span class="discount-badge" aria-label="${percentage}% off">-${percentage}%</span>`;
}
