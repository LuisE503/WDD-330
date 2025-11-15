# SleepOutside - Shopping Cart Implementation

Modern, accessible shopping cart implementation using vanilla JavaScript ES Modules.

## Features Implemented

### 1. Cart Total Display ✅
- Footer shows total in USD with proper formatting
- Hidden when cart is empty
- Uses `finalPrice` if available, otherwise `price`
- Multiplies by quantity for accurate totals

### 2. Cart Count Badge ✅
- Superscript badge on cart icon in header
- Shows sum of all item quantities
- Hidden when cart is empty
- Updates after add/remove operations

### 3. Empty Cart Handling ✅
- Safe rendering with empty or malformed localStorage
- Displays "Your cart is empty." message
- Defensive programming with nullish coalescing
- Always returns array from `getCart()`

### 4. Remove from Cart ✅
- Remove button (×) on each cart item
- Updates localStorage, UI, total, and badge
- Accessible with aria-labels

### 5. Discount Indicators ✅
- Visual badge showing percentage off
- Calculates: `round(100 * (1 - finalPrice/price))`
- Displayed on product listing
- Accessible styling

## Project Structure

```
d:\byu\
├── index.html              # Product listing page
├── cart.html               # Shopping cart page
└── src/
    ├── css/
    │   └── cart.css        # All styles (cart, badge, products)
    └── js/
        ├── cart.js         # Cart utilities and rendering
        ├── header.js       # Cart badge functionality
        └── product.js      # Discount calculations
```

## Module APIs

### cart.js
```javascript
export function getCart()                    // Get cart from localStorage
export function setCart(cart)                // Save cart to localStorage
export function calculateCartTotal(cart)     // Calculate total price
export function formatUSD(value)             // Format as USD currency
export function renderCartTotal()            // Render total in footer
export function renderCartItems()            // Render all cart items
export function removeFromCart(itemId)       // Remove item by ID
export function addToCart(product)           // Add/update item in cart
```

### header.js
```javascript
export function getCartCount()               // Get total quantity
export function renderCartCount()            // Update badge display
```

### product.js
```javascript
export function isDiscounted(item)           // Check if item is discounted
export function getDiscountPercentage(item)  // Calculate discount %
export function createDiscountBadge(item)    // Generate badge HTML
```

## Storage Format

**localStorage key:** `so-cart`

**Item shape:**
```javascript
{
  id: string,           // Required: unique product ID
  name: string,         // Required: product name
  price: number,        // Required: original price
  finalPrice?: number,  // Optional: discounted price
  quantity?: number,    // Optional: defaults to 1
  image?: string        // Optional: product image URL
}
```

## Testing Scenarios

### Scenario 1: No localStorage
- **Expected:** Badge hidden, cart footer hidden, "Your cart is empty." visible
- **Test:** Clear localStorage and reload pages

### Scenario 2: Single Item
- **Expected:** Total shows item price, badge shows 1
- **Test:** Add one item from product listing

### Scenario 3: Multiple Items with Quantities
- **Expected:** Correct total sum, badge equals total quantity
- **Test:** Add multiple items, some with quantity > 1

### Scenario 4: Discounted Items
- **Expected:** Total uses finalPrice, discount badge shows percentage
- **Test:** Add "Alpine Tent" (−17%) or "Trail Backpack 50L" (−25%)

### Scenario 5: Remove Item
- **Expected:** Item removed, UI updated, localStorage saved, badge updated
- **Test:** Click × button on any cart item

## Running the Project

### Option 1: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then open: `http://localhost:8000`

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: File Protocol (Limited)
Open `index.html` directly - ES Modules may require CORS configuration.

## Git Commits

Suggested commit sequence:
```bash
git add src/js/cart.js
git commit -m "feat(cart): render cart total in USD"

git add src/js/header.js
git commit -m "feat(header): add cart count badge"

git add src/js/cart.js
git commit -m "fix(cart): handle empty cart without errors"

git add src/js/cart.js
git commit -m "feat(cart): remove from cart via data-id"

git add src/js/product.js
git commit -m "feat(product): discount badge calculations"

git add src/css/cart.css
git commit -m "style(cart): add cart, badge, and product styles"

git add index.html cart.html
git commit -m "feat(pages): add product listing and cart pages"
```

## Accessibility Features

- ✅ Semantic HTML (ul/li for lists)
- ✅ ARIA labels on buttons and icons
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ Screen reader friendly (descriptive labels)
- ✅ Color contrast compliance

## Browser Compatibility

- ✅ ES Modules (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)
- ✅ Nullish coalescing (??) - polyfill for older browsers if needed
- ✅ localStorage API
- ✅ Intl.NumberFormat for currency

## Future Enhancements

- Persistent cart across sessions
- Quantity increment/decrement controls
- Cart persistence with backend API
- Product search and filtering
- Checkout process
- Order history

## License

Educational project for BYU coursework.
