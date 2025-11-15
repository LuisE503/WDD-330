/**
 * Test utilities for SleepOutside functionality
 * Run these in browser console to test various scenarios
 */

import { addToCart, getCart, setCart, updateQuantity, removeFromCart, calculateCartTotal } from './cart.js';
import { isDiscounted, discountPercent, getFinalPrice } from './utils.js';

// Test 1: Clear cart and verify empty state
export function testEmptyCart() {
  console.log('🧪 Test 1: Empty Cart');
  localStorage.removeItem('so-cart');
  console.log('✅ Cart cleared. Reload page to see empty state.');
  return true;
}

// Test 2: Add sample items to cart
export function testAddItems() {
  console.log('🧪 Test 2: Adding sample items');
  const sampleProducts = [
    {
      id: 'tent-01',
      name: 'Alpine Tent',
      price: 299.99,
      finalPrice: 249.99,
      category: 'Tents',
      images: {
        small: 'https://placehold.co/480x360/2c5f2d/ffffff?text=Alpine+Tent',
        medium: 'https://placehold.co/1024x768/2c5f2d/ffffff?text=Alpine+Tent',
        large: 'https://placehold.co/1920x1440/2c5f2d/ffffff?text=Alpine+Tent'
      }
    },
    {
      id: 'bag-01',
      name: 'Winter Sleeping Bag',
      price: 149.99,
      category: 'Sleeping Bags',
      images: {
        small: 'https://placehold.co/480x360/97c05c/ffffff?text=Sleeping+Bag',
        medium: 'https://placehold.co/1024x768/97c05c/ffffff?text=Sleeping+Bag',
        large: 'https://placehold.co/1920x1440/97c05c/ffffff?text=Sleeping+Bag'
      }
    }
  ];
  
  sampleProducts.forEach(product => addToCart(product, 1));
  console.log('✅ Added 2 items to cart');
  console.log('Current cart:', getCart());
  return true;
}

// Test 3: Test duplicate prevention
export function testDuplicatePrevention() {
  console.log('🧪 Test 3: Duplicate Prevention');
  
  const product = {
    id: 'test-product',
    name: 'Test Product',
    price: 100,
    finalPrice: 80
  };
  
  // Add same product twice
  addToCart(product, 1);
  addToCart(product, 1);
  
  const cart = getCart();
  const testItem = cart.find(item => item.id === 'test-product');
  
  if (cart.filter(item => item.id === 'test-product').length === 1 && testItem.quantity === 2) {
    console.log('✅ PASS: Quantity incremented, no duplicates');
    return true;
  } else {
    console.error('❌ FAIL: Duplicates found or quantity incorrect');
    return false;
  }
}

// Test 4: Test quantity update
export function testQuantityUpdate() {
  console.log('🧪 Test 4: Quantity Update');
  
  const product = {
    id: 'qty-test',
    name: 'Quantity Test Product',
    price: 50
  };
  
  addToCart(product, 1);
  updateQuantity('qty-test', 5);
  
  const cart = getCart();
  const testItem = cart.find(item => item.id === 'qty-test');
  
  if (testItem && testItem.quantity === 5) {
    console.log('✅ PASS: Quantity updated correctly');
    return true;
  } else {
    console.error('❌ FAIL: Quantity not updated');
    return false;
  }
}

// Test 5: Test cart total calculation
export function testCartTotal() {
  console.log('🧪 Test 5: Cart Total Calculation');
  
  setCart([
    { id: '1', name: 'Item 1', price: 100, finalPrice: 80, quantity: 2 }, // 80 * 2 = 160
    { id: '2', name: 'Item 2', price: 50, quantity: 1 } // 50 * 1 = 50
  ]);
  
  const total = calculateCartTotal();
  const expected = 210;
  
  if (total === expected) {
    console.log(`✅ PASS: Total is ${total} (expected ${expected})`);
    return true;
  } else {
    console.error(`❌ FAIL: Total is ${total}, expected ${expected}`);
    return false;
  }
}

// Test 6: Test discount calculations
export function testDiscountCalculations() {
  console.log('🧪 Test 6: Discount Calculations');
  
  const discountedProduct = { price: 100, finalPrice: 75 };
  const regularProduct = { price: 100 };
  
  const isDisc = isDiscounted(discountedProduct);
  const percent = discountPercent(discountedProduct);
  const isNotDisc = isDiscounted(regularProduct);
  
  if (isDisc && percent === 25 && !isNotDisc) {
    console.log('✅ PASS: Discount detection and calculation correct');
    return true;
  } else {
    console.error('❌ FAIL: Discount calculation incorrect');
    console.log({ isDisc, percent, isNotDisc });
    return false;
  }
}

// Test 7: Test remove from cart
export function testRemoveFromCart() {
  console.log('🧪 Test 7: Remove from Cart');
  
  const product = { id: 'remove-test', name: 'Remove Test', price: 25 };
  addToCart(product, 1);
  
  let cart = getCart();
  const beforeCount = cart.length;
  
  removeFromCart('remove-test');
  cart = getCart();
  const afterCount = cart.length;
  
  if (afterCount === beforeCount - 1) {
    console.log('✅ PASS: Item removed successfully');
    return true;
  } else {
    console.error('❌ FAIL: Item not removed');
    return false;
  }
}

// Run all tests
export function runAllTests() {
  console.log('🚀 Running all tests...\n');
  
  // Clear cart before tests
  localStorage.removeItem('so-cart');
  
  const tests = [
    testDuplicatePrevention,
    testQuantityUpdate,
    testCartTotal,
    testDiscountCalculations,
    testRemoveFromCart
  ];
  
  const results = tests.map(test => {
    try {
      return test();
    } catch (error) {
      console.error(`❌ Test failed with error:`, error);
      return false;
    }
  });
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed');
  }
  
  return { passed, total, results };
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testUtils = {
    testEmptyCart,
    testAddItems,
    testDuplicatePrevention,
    testQuantityUpdate,
    testCartTotal,
    testDiscountCalculations,
    testRemoveFromCart,
    runAllTests
  };
  
  console.log('🛠️  Test utilities loaded. Use window.testUtils to run tests:');
  console.log('  - testUtils.runAllTests() - Run all tests');
  console.log('  - testUtils.testAddItems() - Add sample items');
  console.log('  - testUtils.testEmptyCart() - Clear cart');
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
