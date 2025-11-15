/**
 * Test utilities for SleepOutside cart functionality
 * Run these in browser console to test various scenarios
 */

// Test 1: Clear cart and verify empty state
function testEmptyCart() {
  console.log('Test 1: Empty Cart');
  localStorage.removeItem('so-cart');
  window.location.reload();
}

// Test 2: Add sample items to cart
function testAddItems() {
  console.log('Test 2: Adding sample items');
  const cart = [
    {
      id: 'tent-01',
      name: 'Alpine Tent',
      price: 299.99,
      finalPrice: 249.99,
      quantity: 1,
      image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Alpine+Tent'
    },
    {
      id: 'bag-01',
      name: 'Winter Sleeping Bag',
      price: 149.99,
      quantity: 2,
      image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Sleeping+Bag'
    }
  ];
  localStorage.setItem('so-cart', JSON.stringify(cart));
  window.location.reload();
}

// Test 3: Add item with missing optional fields
function testPartialItem() {
  console.log('Test 3: Item with missing fields');
  const cart = [
    {
      id: 'minimal-01',
      name: 'Minimal Item',
      price: 99.99
      // Missing: finalPrice, quantity, image
    }
  ];
  localStorage.setItem('so-cart', JSON.stringify(cart));
  window.location.reload();
}

// Test 4: Test with high quantities
function testHighQuantity() {
  console.log('Test 4: High quantity items');
  const cart = [
    {
      id: 'backpack-01',
      name: 'Trail Backpack 50L',
      price: 179.99,
      finalPrice: 134.99,
      quantity: 5,
      image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Backpack'
    }
  ];
  localStorage.setItem('so-cart', JSON.stringify(cart));
  window.location.reload();
}

// Test 5: Test malformed data
function testMalformedData() {
  console.log('Test 5: Malformed data');
  localStorage.setItem('so-cart', 'invalid json');
  window.location.reload();
}

// Test 6: View current cart
function viewCart() {
  console.log('Current cart:', JSON.parse(localStorage.getItem('so-cart') || '[]'));
}

// Test 7: Calculate expected total
function calculateExpectedTotal() {
  const cart = JSON.parse(localStorage.getItem('so-cart') || '[]');
  const total = cart.reduce((sum, item) => {
    const price = item.finalPrice ?? item.price ?? 0;
    const quantity = item.quantity ?? 1;
    return sum + (price * quantity);
  }, 0);
  console.log('Expected total: $' + total.toFixed(2));
  return total;
}

// Export test functions
if (typeof window !== 'undefined') {
  window.cartTests = {
    testEmptyCart,
    testAddItems,
    testPartialItem,
    testHighQuantity,
    testMalformedData,
    viewCart,
    calculateExpectedTotal
  };
  console.log('Cart tests loaded. Run: cartTests.testAddItems() etc.');
}
