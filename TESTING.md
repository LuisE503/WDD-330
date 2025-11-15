# Testing Guide - SleepOutside Cart

## Manual Testing Steps

### Setup
1. Open `index.html` in a browser (use local server for best results)
2. Open browser DevTools (F12)
3. Check Console and Application → Local Storage tabs

---

## Test Suite

### Test 1: Empty Cart State ✅
**Scenario:** No items in cart

**Steps:**
1. Open DevTools → Console
2. Run: `localStorage.removeItem('so-cart')`
3. Reload page

**Expected Results:**
- ✅ Badge on cart icon is hidden
- ✅ Navigate to cart.html
- ✅ "Your cart is empty." message is visible
- ✅ Cart footer with total is hidden
- ✅ No JavaScript errors in console

---

### Test 2: Add Single Item ✅
**Scenario:** Add one product from listing

**Steps:**
1. Clear cart: `localStorage.removeItem('so-cart')`
2. Reload `index.html`
3. Click "Add to Cart" on any product
4. Observe badge change

**Expected Results:**
- ✅ Badge appears with number "1"
- ✅ Button shows "Added!" briefly
- ✅ Navigate to cart.html
- ✅ Item displays with correct name, price, image
- ✅ Footer shows correct total
- ✅ Total matches product price

---

### Test 3: Multiple Items ✅
**Scenario:** Add multiple different products

**Steps:**
1. Clear cart
2. Add "Alpine Tent" (click Add to Cart)
3. Add "Winter Sleeping Bag"
4. Add "Trail Backpack 50L"
5. Check badge count

**Expected Results:**
- ✅ Badge shows "3"
- ✅ Cart page shows all 3 items
- ✅ Each item rendered correctly
- ✅ Total = $249.99 + $149.99 + $134.99 = $534.97

---

### Test 4: Multiple Quantities ✅
**Scenario:** Add same item multiple times

**Steps:**
1. Clear cart
2. Click "Add to Cart" on same item 3 times
3. Check badge

**Expected Results:**
- ✅ Badge shows "3" (quantity sum)
- ✅ Cart shows single item with quantity: 3
- ✅ Subtotal = price × 3
- ✅ Total calculated correctly

---

### Test 5: Discounted Items ✅
**Scenario:** Items with finalPrice < price

**Steps:**
1. Check "Alpine Tent" on product listing
2. Check "Trail Backpack 50L"

**Expected Results:**
- ✅ Red discount badge visible (−17% and −25%)
- ✅ Discounted price shown in red
- ✅ Original price shown with strikethrough
- ✅ Cart total uses finalPrice not original price

**Calculations:**
- Alpine Tent: (1 - 249.99/299.99) × 100 = 17% ✅
- Trail Backpack: (1 - 134.99/179.99) × 100 = 25% ✅

---

### Test 6: Remove from Cart ✅
**Scenario:** Remove items via × button

**Steps:**
1. Add 2-3 items to cart
2. Navigate to cart.html
3. Click × button on one item
4. Observe changes

**Expected Results:**
- ✅ Item removed from list immediately
- ✅ Total recalculated
- ✅ Badge count decreased
- ✅ localStorage updated (check in DevTools)
- ✅ If last item removed: empty message appears

---

### Test 7: Empty Cart by Removing All ✅
**Scenario:** Remove all items one by one

**Steps:**
1. Add 2 items
2. Remove first item
3. Remove second item

**Expected Results:**
- ✅ After first removal: 1 item remains, total updates
- ✅ After second removal: "Your cart is empty." appears
- ✅ Footer hidden
- ✅ Badge hidden
- ✅ localStorage shows empty array `[]`

---

### Test 8: Manual localStorage Test ✅
**Scenario:** Test with manual data entry

**Steps:**
1. Open DevTools → Console
2. Paste and run:
```javascript
localStorage.setItem('so-cart', JSON.stringify([
  {
    id: 'test-1',
    name: 'Test Product',
    price: 100,
    finalPrice: 80,
    quantity: 2,
    image: 'https://via.placeholder.com/150'
  }
]));
```
3. Reload page

**Expected Results:**
- ✅ Badge shows "2"
- ✅ Cart shows Test Product
- ✅ Quantity: 2
- ✅ Total: $160.00 (80 × 2)

---

### Test 9: Missing Optional Fields ✅
**Scenario:** Items without finalPrice, quantity, or image

**Steps:**
```javascript
localStorage.setItem('so-cart', JSON.stringify([
  {
    id: 'minimal',
    name: 'Minimal Item',
    price: 50
    // No finalPrice, quantity, or image
  }
]));
```
Reload page

**Expected Results:**
- ✅ No errors in console
- ✅ Uses price (not finalPrice)
- ✅ Quantity defaults to 1
- ✅ Placeholder image or broken image handled gracefully
- ✅ Total: $50.00

---

### Test 10: Malformed Data ✅
**Scenario:** Invalid JSON in localStorage

**Steps:**
```javascript
localStorage.setItem('so-cart', 'not valid json');
```
Reload page

**Expected Results:**
- ✅ No page crash
- ✅ Console shows error (gracefully handled)
- ✅ Cart treated as empty
- ✅ "Your cart is empty." message displays

---

### Test 11: Currency Formatting ✅
**Scenario:** Verify USD formatting

**Steps:**
1. Add items to get various totals
2. Check displayed amounts

**Expected Format:**
- ✅ Dollar sign: $
- ✅ Two decimal places: XX.XX
- ✅ Comma separators for 1000+: $1,234.56

**Test values:**
- $0.99 → "$0.99" ✅
- $1234.567 → "$1,234.57" ✅
- $0.1 → "$0.10" ✅

---

### Test 12: Accessibility ✅
**Scenario:** Keyboard and screen reader support

**Steps:**
1. Tab through page (don't use mouse)
2. Use Enter/Space on buttons
3. Check aria-labels with screen reader

**Expected Results:**
- ✅ All interactive elements reachable via Tab
- ✅ Visible focus indicators
- ✅ Buttons activate with Enter/Space
- ✅ Cart icon has aria-label "Cart"
- ✅ Badge has aria-label "Items in cart"
- ✅ Remove buttons have descriptive aria-labels

---

### Test 13: Responsive Design ✅
**Scenario:** Different screen sizes

**Steps:**
1. Resize browser to mobile (375px)
2. Resize to tablet (768px)
3. Resize to desktop (1200px+)

**Expected Results:**
- ✅ Header adapts properly
- ✅ Product grid adjusts columns
- ✅ Cart items stack on mobile
- ✅ No horizontal scrolling
- ✅ Touch targets adequate size (44×44px minimum)

---

## Automated Console Tests

Load test utilities in console:
```javascript
// Add to page temporarily
const script = document.createElement('script');
script.type = 'module';
script.src = './src/js/test-utils.js';
document.head.appendChild(script);
```

Then run:
```javascript
cartTests.testEmptyCart();      // Test 1
cartTests.testAddItems();       // Test 2
cartTests.testPartialItem();    // Test 3
cartTests.testHighQuantity();   // Test 4
cartTests.testMalformedData();  // Test 5
cartTests.viewCart();           // View current state
cartTests.calculateExpectedTotal(); // Verify total
```

---

## Performance Checks

### Load Time
- ✅ Page loads in < 1s on good connection
- ✅ No layout shift
- ✅ CSS loads before render

### Runtime Performance
- ✅ Cart renders in < 100ms
- ✅ No memory leaks (check DevTools Memory)
- ✅ Event listeners properly attached/removed

---

## Browser Compatibility

Test in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Check:
- ES Modules support
- localStorage API
- Nullish coalescing (??)
- Optional chaining (?.)
- Intl.NumberFormat

---

## Bug Reporting Template

If you find issues, report with:
```
**Browser:** Chrome 120
**OS:** Windows 11
**Steps:**
1. Clear cart
2. Add item
3. Expected X, got Y

**Console Errors:**
[Paste any errors]

**Screenshot:**
[Attach if visual issue]
```

---

## Success Criteria Summary

✅ All features implemented
✅ No console errors in normal use
✅ Graceful handling of edge cases
✅ Accessible to keyboard/screen readers
✅ Responsive across device sizes
✅ Data persists in localStorage correctly
✅ Currency formatting correct
✅ Discount calculations accurate
