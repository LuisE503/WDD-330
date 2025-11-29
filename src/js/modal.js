/**
 * Modal module - Reusable modal functionality
 */

import { resolvePath } from './utils.js';

/**
 * Create a modal overlay
 * @param {string} modalClass - Additional CSS class for the modal
 * @returns {HTMLElement} Modal overlay element
 */
export function createModal(modalClass = '') {
  const overlay = document.createElement('div');
  overlay.className = `modal-overlay ${modalClass}`;
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" aria-label="Close modal">×</button>
      <div class="modal-content"></div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });
  
  // Close button
  const closeBtn = overlay.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => closeModal(overlay));
  
  // Close on ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(overlay);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  
  return overlay;
}

/**
 * Open a modal
 * @param {HTMLElement} modal - Modal overlay element
 */
export function openModal(modal) {
  if (!modal) return;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus trap
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/**
 * Close a modal
 * @param {HTMLElement} modal - Modal overlay element
 */
export function closeModal(modal) {
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Remove after animation
  setTimeout(() => {
    modal.remove();
  }, 300);
}

/**
 * Show quick view modal for a product
 * @param {Object} product - Product object
 */
export async function showQuickView(product) {
  const { formatCurrency, getFinalPrice, isDiscounted, discountPercent, getResponsiveImage } = await import('./utils.js');
  const { addToCart } = await import('./cart.js');
  
  const modal = createModal('quick-view-modal');
  const content = modal.querySelector('.modal-content');
  
  const productName = product.Name || product.name || 'Product';
  const productId = product.Id || product.id;
  const category = product.Category || product.category;
  const finalPrice = getFinalPrice(product);
  const hasDiscount = isDiscounted(product);
  const discount = hasDiscount ? discountPercent(product) : 0;
  const originalPrice = product.SuggestedRetailPrice || product.price;
  
  // Get image
  let imageSrc = '';
  if (product.Images) {
    imageSrc = getResponsiveImage(product.Images);
  } else if (product.images) {
    imageSrc = getResponsiveImage(product.images);
  } else if (product.Image || product.image) {
    imageSrc = product.Image || product.image;
  } else {
    imageSrc = `https://placehold.co/400x400/2c5f2d/ffffff?text=${encodeURIComponent(productName)}`;
  }
  
  // Get description
  const description = product.DescriptionHtmlSimple || product.description || 'No description available.';
  
  content.innerHTML = `
    <div class="modal-body">
      <div class="quick-view-image">
        <img src="${imageSrc}" alt="${productName}" onerror="this.src='https://placehold.co/400x400/2c5f2d/ffffff?text=No+Image'" />
      </div>
      <div class="quick-view-details">
        ${category ? `<p class="quick-view-category">${category}</p>` : ''}
        <h2>${productName}</h2>
        <div class="quick-view-pricing">
          ${hasDiscount ? `
            <span class="badge badge-discount">-${discount}%</span>
            <span class="quick-view-price-original">${formatCurrency(originalPrice)}</span>
          ` : ''}
          <div class="quick-view-price">${formatCurrency(finalPrice)}</div>
        </div>
        <div class="quick-view-description">
          ${description}
        </div>
        <div class="quick-view-actions">
          <button class="btn btn-primary" id="quick-add-to-cart">
            Add to Cart
          </button>
          <a href="${resolvePath(`product.html?id=${productId}`)}" class="btn btn-secondary">
            View Details
          </a>
        </div>
      </div>
    </div>
  `;
  
  // Add to cart button handler
  const addToCartBtn = content.querySelector('#quick-add-to-cart');
  addToCartBtn.addEventListener('click', () => {
    addToCart(product, 1);
    addToCartBtn.textContent = '✓ Added!';
    addToCartBtn.disabled = true;
    
    setTimeout(() => {
      closeModal(modal);
    }, 1000);
  });
  
  openModal(modal);
}

/**
 * Show newsletter signup modal
 */
export function showNewsletterModal() {
  const modal = createModal('newsletter-modal');
  const content = modal.querySelector('.modal-content');
  
  content.innerHTML = `
    <h2>📧 Subscribe to Our Newsletter</h2>
    <p>Get exclusive deals, outdoor tips, and early access to new products!</p>
    <form class="newsletter-form" id="newsletter-form">
      <input 
        type="email" 
        name="email" 
        placeholder="Enter your email address" 
        required 
        aria-label="Email address"
      />
      <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
  `;
  
  const form = content.querySelector('#newsletter-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = form.querySelector('input[name="email"]').value;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      content.innerHTML = `
        <h2>✓ Thank You!</h2>
        <p>You've been subscribed to our newsletter.</p>
        <p><strong>${email}</strong></p>
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').querySelector('.modal-close').click()">
          Close
        </button>
      `;
      
      // Store subscription in localStorage
      localStorage.setItem('newsletter-subscribed', 'true');
      
    } catch (error) {
      alert('Subscription failed. Please try again.');
    }
  });
  
  openModal(modal);
}

/**
 * Show welcome/registration modal for first-time visitors
 */
export function showWelcomeModal() {
  // Check if already shown
  const hasSeenWelcome = localStorage.getItem('welcome-seen');
  if (hasSeenWelcome) return;
  
  const modal = createModal('welcome-modal');
  const content = modal.querySelector('.modal-content');
  
  content.innerHTML = `
    <div class="welcome-icon">🎁</div>
    <h2>Welcome to SleepOutside!</h2>
    <p>Join our community of outdoor enthusiasts</p>
    <div class="giveaway-info">
      <h3>🎉 Special Giveaway</h3>
      <div class="giveaway-prize">Win a $500 Gear Package!</div>
      <p>Register now for a chance to win premium outdoor equipment</p>
      <ul style="text-align: left; display: inline-block; margin-top: var(--spacing-md);">
        <li>Premium tent</li>
        <li>Sleeping bag</li>
        <li>Backpack</li>
        <li>And more!</li>
      </ul>
    </div>
    <div class="actions">
      <button class="btn btn-primary" id="show-register">
        Register Now
      </button>
      <button class="btn btn-secondary" id="maybe-later">
        Maybe Later
      </button>
    </div>
  `;
  
  const registerBtn = content.querySelector('#show-register');
  registerBtn.addEventListener('click', () => {
    localStorage.setItem('welcome-seen', 'true');
    closeModal(modal);
    showNewsletterModal();
  });
  
  const laterBtn = content.querySelector('#maybe-later');
  laterBtn.addEventListener('click', () => {
    localStorage.setItem('welcome-seen', 'true');
    closeModal(modal);
  });
  
  // Show after a short delay
  setTimeout(() => {
    openModal(modal);
  }, 2000);
}
