# SleepOutside E-Commerce Implementation

## Overview
Complete implementation of the SleepOutside e-commerce site with modular JavaScript, responsive design, and accessibility features.

## Features Implemented

### 1. Dynamic Header and Footer
- **Files**: `src/js/header.js`, `src/js/footer.js`
- Dynamic HTML injection for header and footer
- Search form with autocomplete
- Cart badge that updates in real-time
- Responsive navigation
- Social media links in footer

### 2. Cart Management
- **File**: `src/js/cart.js`
- Functions: `getCart()`, `setCart()`, `addToCart()`, `updateQuantity()`, `removeFromCart()`, `calculateCartTotal()`
- Duplicate item prevention (increments quantity instead)
- Quantity controls with validation (min: 1)
- Real-time cart updates via CustomEvent 'cart:updated'
- Displays discount badges on cart items
- Responsive cart layout with image thumbnails

### 3. Product Listing
- **Files**: `src/js/products.js`, `product-list.html`
- Fetch products by category or search term
- Sort by: name (asc/desc), price (asc/desc)
- Responsive product cards with hover effects
- Discount badges on discounted products
- Pagination-ready structure (returns all results)
- Loading states and error handling

### 4. Product Search
- **Integration**: `src/js/header.js`, `src/js/products.js`
- Search form in header navbar
- Calls `/products/search/{term}` endpoint
- Navigates to product-list.html with search results
- Displays search term in breadcrumbs

### 5. Product Detail
- **Files**: `src/js/product-detail.js`, `product.html`
- Fetches single product via `/product/{id}`
- Displays full description, pricing, stock status
- Add to cart with quantity selector
- Responsive images with srcset support
- Discount badges with percentage display
- Success notification on add to cart

### 6. Breadcrumbs
- **File**: `src/js/breadcrumbs.js`
- Context-aware breadcrumbs based on URL params
- Shows: Home → Category → Product
- Updates with result count on listing pages
- Accessible with aria attributes

### 7. Responsive Images
- **Implementation**: `src/js/utils.js`
- Functions: `getResponsiveImage()`, `createSrcSet()`
- Supports small (≤480px), medium (≤1024px), large (>1024px)
- Uses srcset and sizes attributes
- Lazy loading for performance

### 8. Discount Handling
- **File**: `src/js/utils.js`
- Functions: `isDiscounted()`, `discountPercent()`, `getFinalPrice()`
- Calculates discount: `(price - finalPrice) / price * 100`
- Displays discount badges on listings and detail pages
- Uses finalPrice for cart total calculations

## File Structure

```
d:\wdd\WDD-330\
├── index.html                    # Home page with category tiles
├── product-list.html             # Product listing with sort controls
├── product.html                  # Product detail page
├── cart.html                     # Shopping cart page
├── src/
│   ├── js/
│   │   ├── utils.js              # Utility functions (currency, discounts, API, images)
│   │   ├── cart.js               # Cart operations and rendering
│   │   ├── header.js             # Dynamic header with search and cart badge
│   │   ├── footer.js             # Dynamic footer
│   │   ├── products.js           # Product fetching, sorting, rendering
│   │   ├── product-detail.js     # Single product display
│   │   └── breadcrumbs.js        # Dynamic breadcrumb navigation
│   └── css/
│       ├── base.css              # Base styles (existing)
│       └── site.css              # Main site styles (new)
```

## Testing Scenarios

### Cart Duplicate Prevention
1. Navigate to product detail page
2. Add product to cart
3. Navigate back and add same product again
4. **Expected**: Quantity increments, no duplicate entries in localStorage

### Cart Quantity Controls
1. Add item to cart
2. Go to cart page
3. Change quantity input to 3
4. **Expected**: localStorage updates, subtotal recalculates, header badge updates

### Empty Cart State
1. Clear all items from cart (or start fresh)
2. Navigate to cart.html
3. **Expected**: Shows "Your cart is empty" message, no errors in console

### Product Search
1. Use search form in header
2. Enter "tent" and submit
3. **Expected**: Redirects to product-list.html?search=tent with results displayed

### Product Sorting
1. Navigate to product-list.html?category=Tents
2. Select "Price (Low to High)" from sort dropdown
3. **Expected**: Products reorder by ascending price

### Responsive Images
1. Open product listing on mobile viewport (≤480px)
2. Inspect image src
3. **Expected**: Uses small image variant
4. Resize to desktop (>1024px)
5. **Expected**: Uses large image variant

### Discount Display
1. View product with finalPrice < price
2. **Expected**: Shows discount badge with percentage (e.g., "-15%")
3. Add to cart
4. **Expected**: Cart uses finalPrice for calculations

### Breadcrumb Navigation
1. Navigate to product-list.html?category=Tents
2. **Expected**: Breadcrumb shows "Home / Tents (N items)"
3. Click on product
4. **Expected**: Breadcrumb shows "Home / Tents / Product Name"

### Cart Badge Updates
1. Open two tabs to index.html
2. Add item to cart in tab 1
3. **Expected**: Header badge updates in tab 2 automatically

## API Endpoints Used

- `GET /products/search/{term}` - Returns array of products matching term or category
- `GET /product/{id}` - Returns single product object

**Base URL**: `https://wdd330-backend.onrender.com`

## localStorage Schema

**Key**: `so-cart`

**Value**: Array of cart items
```json
[
  {
    "id": "product-123",
    "name": "Alpine Tent",
    "category": "Tents",
    "price": 299.99,
    "finalPrice": 249.99,
    "quantity": 2,
    "images": {
      "small": "url-480.jpg",
      "medium": "url-1024.jpg",
      "large": "url-1920.jpg"
    },
    "description": "Product description",
    "stock": 10
  }
]
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text on all images
- Form labels properly associated
- Screen reader friendly alerts

## Performance Optimizations

- Lazy loading images with `loading="lazy"`
- Srcset for responsive images
- CSS animations with transform/opacity (GPU accelerated)
- Minimal JavaScript bundle (ES modules)
- Event delegation where appropriate

## Manual Testing Checklist

- [ ] Header renders on all pages
- [ ] Footer renders on all pages
- [ ] Search form redirects correctly
- [ ] Cart badge updates on cart changes
- [ ] Add to cart prevents duplicates
- [ ] Quantity controls work and validate
- [ ] Remove from cart works
- [ ] Cart total calculates correctly
- [ ] Empty cart shows empty state
- [ ] Product list loads by category
- [ ] Product list loads by search
- [ ] Sort controls reorder products
- [ ] Product detail loads correctly
- [ ] Add to cart from detail page works
- [ ] Discount badges show on discounted items
- [ ] Responsive images switch at breakpoints
- [ ] Breadcrumbs show correct path
- [ ] Mobile responsive (≤768px)
- [ ] Tablet responsive (769-1024px)
- [ ] Desktop responsive (>1024px)
- [ ] No console errors

## Commit Messages

```
feat(header): add dynamic header with search and cart badge
feat(footer): add dynamic footer with social links
feat(cart): implement cart operations with duplicate prevention
feat(cart): add quantity controls and real-time updates
feat(products): add product listing with sort and filters
feat(search): implement product search functionality
feat(ui): add breadcrumb navigation
feat(ui): add responsive images with srcset
feat(discounts): show discount badges and percentages
feat(product-detail): add product detail page with add-to-cart
style(site): add comprehensive site styles with responsive design
docs(readme): add implementation guide and testing scenarios
```

## Pull Request Description

### SleepOutside E-Commerce Implementation

**Summary**: Complete implementation of core e-commerce features for SleepOutside including cart management, product browsing, search, and responsive design.

**Files Changed**:
- Added: `src/js/utils.js`, `src/js/header.js`, `src/js/footer.js`, `src/js/products.js`, `src/js/product-detail.js`, `src/js/breadcrumbs.js`
- Modified: `src/js/cart.js`, `index.html`, `cart.html`
- Added: `product-list.html`, `product.html`, `src/css/site.css`

**Features**:
- ✅ Dynamic header/footer templating
- ✅ Cart duplicate prevention (increments quantity)
- ✅ Quantity controls with validation
- ✅ Product listing with sort (name/price asc/desc)
- ✅ Product search via navbar
- ✅ Responsive images (small/medium/large)
- ✅ Discount badges with percentages
- ✅ Breadcrumb navigation
- ✅ Real-time cart badge updates
- ✅ Accessible and responsive design

**Testing**:
1. Load index.html → verify category tiles render
2. Click category → verify products load and sort controls work
3. Search for "tent" → verify results display
4. Click product → verify detail page loads with correct info
5. Add to cart twice → verify quantity increments (no duplicate)
6. Go to cart → verify quantity controls and remove work
7. Check mobile viewport → verify responsive layout
8. Check discount products → verify badges show

**Breaking Changes**: None

**Dependencies**: None (vanilla JavaScript)

## Notes for Developers

- All modules use ES6 modules (import/export)
- Auto-initialization on DOMContentLoaded
- Defensive programming with null checks
- CustomEvent 'cart:updated' for cross-module communication
- CSS variables for easy theming
- Mobile-first responsive design

## Known Limitations

- Images require `/images/` directory with category and product images
- Logo requires `/images/logo.svg`
- Checkout functionality not implemented (button present but inactive)
- No user authentication or backend persistence
- Product stock not enforced on add-to-cart (validation only)

## Future Enhancements

- Implement checkout flow
- Add product filters (price range, rating)
- Add pagination for large result sets
- Implement wishlist functionality
- Add product reviews and ratings
- Integrate payment processing
- Add user accounts and order history
