# SleepOutside - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  index.html  │  │product-list  │  │ product.html │      │
│  │  (Home)      │  │   .html      │  │  (Detail)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                           │                                   │
│  ┌────────────────────────▼────────────────────────┐        │
│  │             cart.html (Shopping Cart)            │        │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                    SHARED COMPONENTS                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  header.js   │  │  footer.js   │  │breadcrumbs.js│   │
│  │ - Search     │  │ - Links      │  │ - Navigation │   │
│  │ - Cart Badge │  │ - Social     │  │ - Context    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                   BUSINESS LOGIC                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   cart.js    │  │ products.js  │  │product-detail│   │
│  │ - getCart    │  │ - fetch      │  │    .js       │   │
│  │ - addToCart  │  │ - sort       │  │ - display    │   │
│  │ - update     │  │ - render     │  │ - add-to-cart│   │
│  │ - remove     │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                     UTILITIES                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │                    utils.js                         │  │
│  │  - formatCurrency()    - isDiscounted()            │  │
│  │  - apiRequest()        - discountPercent()         │  │
│  │  - getParam()          - getFinalPrice()           │  │
│  │  - getResponsiveImage() - createSrcSet()           │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                  DATA & EXTERNAL                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ localStorage │  │   REST API   │  │    CSS       │   │
│  │  'so-cart'   │  │ /products/   │  │  site.css    │   │
│  │   (Array)    │  │ /product/    │  │  base.css    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## Data Flow

### Adding Product to Cart

```
Product Detail Page (product.html)
         │
         │ 1. User clicks "Add to Cart"
         ▼
  product-detail.js
         │
         │ 2. Calls addToCart(product, quantity)
         ▼
     cart.js
         │
         │ 3. Check if product exists
         ├─── Yes → Increment quantity
         └─── No  → Add new item
         │
         │ 4. Save to localStorage
         ▼
   setCart(cart)
         │
         │ 5. Dispatch 'cart:updated' event
         ▼
    header.js (listening)
         │
         │ 6. Update cart badge
         ▼
    Cart Badge displays new count
```

### Product Listing Flow

```
User navigates to product-list.html?category=Tents
         │
         ▼
   products.js (initProductList)
         │
         │ 1. Get URL param 'category' or 'search'
         ▼
   fetchProductsByCategory(category)
         │
         │ 2. Call API
         ▼
   apiRequest('/products/search/Tents')
         │
         │ 3. Parse response
         ▼
   renderProductList(products)
         │
         │ 4. For each product
         ├─── Create product card
         ├─── Add discount badge if discounted
         ├─── Add responsive image
         └─── Append to container
         │
         ▼
   Product grid displayed
```

## Event Flow

```
┌─────────────────────────────────────────────────┐
│              CustomEvent: 'cart:updated'        │
│  Dispatched by: cart.js (setCart function)     │
└─────────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ header  │  │  cart   │  │ (other) │
   │  .js    │  │  .js    │  │ modules │
   └─────────┘  └─────────┘  └─────────┘
   Updates       Re-renders   Can listen
   badge         items        for changes
```

## Module Dependencies

```
utils.js (no dependencies)
    ▲
    │ imported by
    ├──────────────────┬──────────────────┬──────────────────┐
    │                  │                  │                  │
cart.js          products.js      product-detail.js    breadcrumbs.js
    ▲                  ▲                  ▲                  ▲
    │                  │                  │                  │
    │                  │                  └──────────────────┤
    │                  │                                     │
header.js          footer.js                           (imported)
    ▲                  ▲
    │                  │
    └──────────────────┴──────────────────────────────────┐
                                                           │
                                                     HTML Pages
                                              (index, product-list,
                                               product, cart)
```

## State Management

```
┌─────────────────────────────────────────────────┐
│              localStorage: 'so-cart'            │
│  Single source of truth for cart state         │
└─────────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    Write (cart.js)         Read (cart.js, header.js)
    - addToCart()           - getCart()
    - updateQuantity()      - getCartCount()
    - removeFromCart()      - calculateCartTotal()
    - setCart()
         │
         │ triggers
         ▼
   CustomEvent dispatch
         │
         │ notifies
         ▼
   All listening components
```

## Responsive Image Strategy

```
Window Width           Image Loaded
─────────────────────────────────────
0 - 480px        →    images.small
481 - 1024px     →    images.medium
1025px+          →    images.large

Implementation:
- JavaScript: getResponsiveImage(images)
- HTML: srcset with sizes attribute
- CSS: object-fit: cover
```

## URL Structure

```
Home Page
    └─ /index.html

Category Listing
    └─ /product-list.html?category=Tents
    └─ /product-list.html?category=Backpacks
    └─ /product-list.html?category=Sleeping%20Bags
    └─ /product-list.html?category=Hammocks

Search Results
    └─ /product-list.html?search=tent

Product Detail
    └─ /product.html?id=product-123

Shopping Cart
    └─ /cart.html
```

## CSS Architecture

```
base.css (existing)
    │
    │ baseline styles, resets
    ▼
site.css (new)
    ├─ CSS Variables (colors, spacing, etc.)
    ├─ Layout (header, footer, main)
    ├─ Components (cards, badges, buttons)
    ├─ Utilities (hide, loading, etc.)
    └─ Responsive (@media queries)
```

## Testing Strategy

```
┌─────────────────────────────────────────────────┐
│               test-utils.js                     │
│  Automated tests for core functionality        │
└─────────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   Unit Tests              Integration Tests
   - Discount calc         - Add to cart flow
   - Cart total            - Duplicate prevention
   - Utility functions     - Quantity update
                          - Remove from cart
```

## Performance Considerations

```
┌────────────────┐
│ Initial Load   │  - Lazy load images
│                │  - ES modules (async)
└────────────────┘  - Minimal CSS/JS

┌────────────────┐
│ Runtime        │  - Event delegation
│                │  - Debounce/throttle
└────────────────┘  - Efficient DOM updates

┌────────────────┐
│ Storage        │  - localStorage cache
│                │  - Minimal data transfer
└────────────────┘  - Gzip-friendly code
```

## Security Considerations

```
✅ XSS Prevention
   - No innerHTML with user input
   - Sanitized data display
   - CSP-ready

✅ CSRF Prevention
   - No state-changing GET requests
   - (Future: Add CSRF tokens)

✅ Data Validation
   - Input validation (quantity min/max)
   - Type checking
   - Defensive programming
```

## Accessibility Tree

```
Document
├─ Header (role: banner)
│  ├─ Logo (link)
│  ├─ Navigation (role: navigation)
│  ├─ Search (role: search)
│  └─ Cart Link (with aria-label)
├─ Breadcrumbs (role: navigation, aria-label)
├─ Main (role: main)
│  ├─ Product Grid
│  │  └─ Product Cards (article)
│  │     ├─ Image (with alt)
│  │     └─ Link (descriptive text)
│  └─ Cart List
│     └─ Cart Items (list)
│        ├─ Quantity Input (with label)
│        └─ Remove Button (with aria-label)
└─ Footer (role: contentinfo)
   └─ Links (descriptive text)
```

## Browser Console Commands

Quick reference for testing:

```javascript
// View current cart
console.log(localStorage.getItem('so-cart'))

// Run all tests
testUtils.runAllTests()

// Add sample data
testUtils.testAddItems()

// Clear cart
testUtils.testEmptyCart()

// Manual cart manipulation
localStorage.setItem('so-cart', JSON.stringify([
  {id: '1', name: 'Test', price: 100, quantity: 1}
]))
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Modular, reusable components
- ✅ Scalable structure
- ✅ Testable code
- ✅ Maintainable codebase
- ✅ Production-ready implementation
