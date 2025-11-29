/**
 * Checkout module - Handle checkout form, validation, and order submission
 */

import { getCart, setCart, getCartTotal } from './cart.js';
import { formatCurrency, getFinalPrice, showAlert, resolvePath } from './utils.js';

// Shipping and tax rates
const SHIPPING_RATE = 10; // $10 flat rate
const TAX_RATE = 0.07; // 7%

/**
 * Calculate order totals
 * @returns {Object} Object with subtotal, shipping, tax, and total
 */
function calculateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const price = getFinalPrice(item);
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const shipping = subtotal > 0 ? SHIPPING_RATE : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  };
}

/**
 * Render order items in the summary
 */
function renderOrderSummary() {
  const cart = getCart();
  const container = document.getElementById('order-items');
  
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    return;
  }

  container.innerHTML = '';
  
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    
    const productName = item.Name || item.name || 'Product';
    const price = getFinalPrice(item);
    const quantity = item.quantity || 1;
    const itemTotal = price * quantity;
    
    // Get image
    let imageSrc = '';
    if (item.Images?.PrimaryMedium) {
      imageSrc = item.Images.PrimaryMedium;
    } else if (item.images?.PrimaryMedium) {
      imageSrc = item.images.PrimaryMedium;
    } else if (item.Image || item.image) {
      imageSrc = item.Image || item.image;
    } else {
      imageSrc = `https://placehold.co/60x60/2c5f2d/ffffff?text=${encodeURIComponent(productName.substring(0, 1))}`;
    }
    
    itemDiv.innerHTML = `
      <img src="${imageSrc}" alt="${productName}" class="order-item-image" />
      <div class="order-item-details">
        <div class="order-item-name">${productName}</div>
        <div class="order-item-qty">Qty: ${quantity}</div>
      </div>
      <div class="order-item-price">${formatCurrency(itemTotal)}</div>
    `;
    
    container.appendChild(itemDiv);
  });

  // Update totals
  updateTotals();
}

/**
 * Update order totals display
 */
function updateTotals() {
  const totals = calculateTotals();
  
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('order-total');
  
  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (shippingEl) shippingEl.textContent = formatCurrency(totals.shipping);
  if (taxEl) taxEl.textContent = formatCurrency(totals.tax);
  if (totalEl) totalEl.textContent = formatCurrency(totals.total);
}

/**
 * Validate a single form field
 * @param {HTMLInputElement} field - Form field to validate
 * @returns {boolean} True if valid
 */
function validateField(field) {
  const errorSpan = field.parentElement.querySelector('.error-message');
  let isValid = true;
  let errorMessage = '';

  // Clear previous error
  if (errorSpan) errorSpan.textContent = '';
  field.classList.remove('error', 'valid');

  // Check required
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  // Check minlength
  else if (field.hasAttribute('minlength') && field.value.length < field.getAttribute('minlength')) {
    isValid = false;
    errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
  }
  // Check pattern
  else if (field.hasAttribute('pattern') && field.value) {
    const pattern = new RegExp(field.getAttribute('pattern'));
    if (!pattern.test(field.value)) {
      isValid = false;
      
      // Custom error messages based on field
      if (field.id === 'state') {
        errorMessage = 'Enter 2-letter state code (e.g., CA)';
      } else if (field.id === 'zip') {
        errorMessage = 'Enter 5-digit ZIP code';
      } else if (field.id === 'cardNumber') {
        errorMessage = 'Enter valid card number (13-19 digits)';
      } else if (field.id === 'expiration') {
        errorMessage = 'Enter date as MM/YY';
      } else if (field.id === 'code') {
        errorMessage = 'Enter 3 or 4 digit security code';
      } else {
        errorMessage = 'Invalid format';
      }
    }
  }

  // Update UI
  if (isValid) {
    field.classList.add('valid');
  } else {
    field.classList.add('error');
    if (errorSpan) errorSpan.textContent = errorMessage;
  }

  return isValid;
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} True if all fields are valid
 */
function validateForm(form) {
  const fields = form.querySelectorAll('input[required], input[pattern], input[minlength]');
  let allValid = true;

  fields.forEach(field => {
    if (!validateField(field)) {
      allValid = false;
    }
  });

  return allValid;
}

/**
 * Package order data for submission
 * @param {FormData} formData - Form data
 * @returns {Object} Order object
 */
function packageOrder(formData) {
  const cart = getCart();
  const totals = calculateTotals();
  
  const order = {
    orderDate: new Date().toISOString(),
    fname: formData.get('fname'),
    lname: formData.get('lname'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
    cardNumber: formData.get('cardNumber'),
    expiration: formData.get('expiration'),
    code: formData.get('code'),
    items: cart.map(item => ({
      id: item.Id || item.id,
      name: item.Name || item.name,
      price: getFinalPrice(item),
      quantity: item.quantity || 1
    })),
    orderTotal: totals.total,
    shipping: totals.shipping,
    tax: totals.tax
  };

  return order;
}

/**
 * Submit order to server
 * @param {Object} order - Order object
 * @returns {Promise<Object>} Server response
 */
async function submitOrder(order) {
  try {
    const response = await fetch('https://wdd330-backend.onrender.com/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Show loading overlay
 */
function showLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

/**
 * Show success page
 * @param {string} orderNumber - Order confirmation number
 */
function showSuccessPage(orderNumber) {
  const container = document.querySelector('.checkout-container');
  if (!container) return;

  container.innerHTML = `
    <div class="success-page">
      <div class="success-icon">✓</div>
      <h1>Order Confirmed!</h1>
      <p class="order-number">Order Number: <strong>${orderNumber}</strong></p>
      <p>Thank you for your purchase! You will receive a confirmation email shortly.</p>
      <div>
        <a href="${resolvePath('index.html')}" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>
  `;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  
  // Validate form
  if (!validateForm(form)) {
    showAlert('Please correct the errors in the form', 'error');
    // Scroll to first error
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
    return;
  }

  // Check if cart is empty
  const cart = getCart();
  if (cart.length === 0) {
    showAlert('Your cart is empty', 'error');
    return;
  }

  try {
    showLoading();
    
    const formData = new FormData(form);
    const order = packageOrder(formData);
    
    const result = await submitOrder(order);
    
    hideLoading();
    
    // Clear cart
    setCart([]);
    
    // Show success page
    const orderNumber = result.orderId || result.id || Math.random().toString(36).substring(2, 10).toUpperCase();
    showSuccessPage(orderNumber);
    
    showAlert('Order placed successfully!', 'success');
    
  } catch (error) {
    hideLoading();
    console.error('Checkout error:', error);
    showAlert(`Order failed: ${error.message}. Please try again.`, 'error');
  }
}

/**
 * Initialize checkout page
 */
function initCheckout() {
  const form = document.getElementById('checkout-form');
  
  if (!form) {
    console.warn('Checkout form not found');
    return;
  }

  // Check if cart is empty
  const cart = getCart();
  if (cart.length === 0) {
    const container = document.querySelector('.checkout-container');
    if (container) {
      container.innerHTML = `
        <div class="empty-cart-page">
          <h1>Your Cart is Empty</h1>
          <p>Add some items to your cart before checking out.</p>
          <a href="${resolvePath('index.html')}" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
    }
    return;
  }

  // Render order summary
  renderOrderSummary();

  // Add form validation on blur
  const fields = form.querySelectorAll('input');
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', handleCheckoutSubmit);

  // Format card number input
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      e.target.value = value;
    });
  }

  // Format expiration input
  const expirationInput = document.getElementById('expiration');
  if (expirationInput) {
    expirationInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Format security code input
  const codeInput = document.getElementById('code');
  if (codeInput) {
    codeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Format ZIP code input
  const zipInput = document.getElementById('zip');
  if (zipInput) {
    zipInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 5);
    });
  }

  // Format state input
  const stateInput = document.getElementById('state');
  if (stateInput) {
    stateInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
    });
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}

export { initCheckout, calculateTotals };
