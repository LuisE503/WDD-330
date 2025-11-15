# SleepOutside - Quick Start Guide

## Getting Started

### 1. Open the Site
Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

No build process required - this is vanilla JavaScript with ES modules.

### 2. Test in Browser Console

Load any page and open browser console (F12), then run:

```javascript
// Run all automated tests
testUtils.runAllTests()

// Add sample items to cart
testUtils.testAddItems()

// Clear cart
testUtils.testEmptyCart()

// Test duplicate prevention
testUtils.testDuplicatePrevention()
```

### 3. Manual Testing Flow

#### A. Browse Products
1. Start at `index.html` (home page)
2. Click on any category tile (e.g., "Tents")
3. View product list at `product-list.html?category=Tents`

#### B. Search Products
1. Use search form in header
2. Type "tent" and press Enter
3. View search results at `product-list.html?search=tent`

#### C. Sort Products
1. On product list page, use "Sort by" dropdown
2. Try: Name (A-Z), Price (Low to High), etc.
3. Products reorder instantly

#### D. View Product Details
1. Click any product card
2. View full details at `product.html?id={productId}`
3. Change quantity and click "Add to Cart"

#### E. Manage Cart
1. Click cart icon in header (shows badge count)
2. View cart at `cart.html`
3. Change quantities using number inputs
4. Remove items with × button
5. Watch total update automatically

#### F. Test Cart Features
1. Add same product twice from detail page
   - **Expected**: Quantity increments (no duplicate)
2. Change quantity to 0
   - **Expected**: Resets to 1 (minimum)
3. Remove all items
   - **Expected**: Shows empty state message

### 4. Test Responsive Design

#### Desktop (>1024px)
- Full navigation bar
- Multi-column product grid
- Large product images

#### Tablet (768-1024px)
- Responsive navigation
- 2-3 column product grid
- Medium product images

#### Mobile (≤768px)
- Stacked navigation
- Single column layout
- Small product images
- Touch-friendly buttons

**Tip**: Use browser DevTools (F12) → Device Toolbar to test different viewports

### 5. Test Accessibility

1. **Keyboard Navigation**:
   - Press Tab to navigate through links/buttons
   - Press Enter/Space to activate
   - All interactive elements should be focusable

2. **Screen Reader** (if available):
   - ARIA labels on search form, cart link
   - Alt text on all images
   - Semantic HTML structure

3. **Color Contrast**:
   - Text should be readable
   - Focus indicators visible

### 6. Check Browser Console

Look for:
- ✅ No red errors
- ✅ No 404s for missing files
- ℹ️ Info logs for module loading (expected)

### 7. Inspect localStorage

Open DevTools → Application → Local Storage → your domain

Look for:
```json
so-cart: [
  {
    "id": "product-123",
    "name": "Product Name",
    "price": 100,
    "finalPrice": 80,
    "quantity": 2,
    ...
  }
]
```

## Common Issues & Solutions

### Issue: Images not loading
**Solution**: 
1. Add images to `images/categories/` folder
2. Or update `index.html` to use placeholder URLs:
   ```html
   <img src="https://placehold.co/400x300/2c5f2d/ffffff?text=Tents" alt="Tents">
   ```

### Issue: API calls failing
**Expected**: API calls will fail in local development since we don't have a backend.
The code includes error handling to show friendly messages.

**For testing with real API**:
Update `src/js/utils.js` baseURL to your API endpoint.

### Issue: Cart badge not updating
**Check**:
1. Is `cart:updated` event dispatching? (see cart.js `setCart()`)
2. Is header.js listening for the event? (see `initHeader()`)
3. Check browser console for errors

### Issue: Module import errors
**Check**:
1. Are you opening HTML files directly (file://)? 
   - Some browsers restrict ES modules on file://
   - Use a local server (see below)

### Issue: CORS errors
**Solution**: Use a local development server:

**Option 1 - Python**:
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

**Option 2 - Node.js**:
```bash
npx serve
```

**Option 3 - VS Code**:
Install "Live Server" extension and click "Go Live"

## Development Workflow

### Make Changes
1. Edit JavaScript files in `src/js/`
2. Edit styles in `src/css/site.css`
3. Edit HTML templates in module files

### Test Changes
1. Refresh browser (Ctrl+R / Cmd+R)
2. Clear cache if needed (Ctrl+Shift+R / Cmd+Shift+R)
3. Clear localStorage if testing cart: `localStorage.clear()`

### Debug Issues
1. Check browser console for errors
2. Use `console.log()` in JavaScript
3. Use browser DevTools debugger
4. Inspect Network tab for API calls
5. Check Elements tab for DOM structure

## Performance Tips

1. **Image Optimization**:
   - Use WebP format where possible
   - Compress images before adding
   - Ensure correct sizes (480px, 1024px, 1920px widths)

2. **Caching**:
   - Browser caches CSS/JS automatically
   - Images cached via srcset

3. **Loading Speed**:
   - Lazy loading enabled on images
   - ES modules load asynchronously
   - CSS loads in <head> for fast render

## Browser Extensions for Testing

Recommended:
- **React DevTools** - Inspect component state (not needed here but useful)
- **axe DevTools** - Accessibility testing
- **Lighthouse** - Performance/accessibility audit (built into Chrome)
- **JSON Formatter** - View localStorage nicely

## Next Steps

1. **Add Real Images**:
   - Replace placeholder images
   - Optimize for web (compress, resize)

2. **Connect to API**:
   - Update baseURL in utils.js
   - Test with real product data

3. **Add Features**:
   - Checkout flow
   - User authentication
   - Product filters
   - Wishlist

4. **Deploy**:
   - GitHub Pages
   - Netlify
   - Vercel

## Support

For issues or questions:
1. Check IMPLEMENTATION.md for detailed docs
2. Check browser console for errors
3. Review test-utils.js for testing examples
4. Check localStorage schema in IMPLEMENTATION.md

## Quick Reference

**Key Files**:
- `src/js/cart.js` - Cart operations
- `src/js/header.js` - Header with cart badge
- `src/js/products.js` - Product listing
- `src/js/utils.js` - Shared utilities
- `src/css/site.css` - All styles

**Key Functions**:
- `addToCart(item, qty)` - Add item to cart
- `updateQuantity(id, qty)` - Update cart quantity
- `removeFromCart(id)` - Remove from cart
- `calculateCartTotal()` - Get cart total
- `getCart()` - Get cart contents

**Events**:
- `cart:updated` - Fired when cart changes
- Listen: `window.addEventListener('cart:updated', handler)`

**localStorage Key**:
- `so-cart` - Cart contents array

Happy coding! 🚀
