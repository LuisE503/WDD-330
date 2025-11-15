# SleepOutside Cart - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Client                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐              ┌──────────────┐                 │
│  │ index.html   │              │  cart.html   │                 │
│  │ (Products)   │◄────────────►│  (Cart)      │                 │
│  └──────┬───────┘              └──────┬───────┘                 │
│         │                             │                          │
│         │  ┌──────────────────────────┘                          │
│         │  │                                                     │
│         ▼  ▼                                                     │
│  ┌─────────────────┐                                            │
│  │   header.js     │ ◄─── renderCartCount()                     │
│  │   (Badge)       │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           │ imports                                              │
│           ▼                                                      │
│  ┌─────────────────┐         ┌──────────────┐                  │
│  │    cart.js      │         │  product.js  │                  │
│  │  (Core Logic)   │◄────────┤ (Discounts)  │                  │
│  └────────┬────────┘         └──────────────┘                  │
│           │                                                      │
│           │ reads/writes                                         │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  localStorage   │                                            │
│  │  'so-cart'      │                                            │
│  │  [Array<Item>]  │                                            │
│  └─────────────────┘                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Adding to Cart

```
User clicks "Add to Cart"
         │
         ▼
   addToCart(product)
         │
         ├─► getCart() ──► Read localStorage
         │
         ├─► Find/Update item in array
         │
         ├─► setCart(cart) ──► Write localStorage
         │
         └─► renderCartCount() ──► Update badge
```

### Viewing Cart

```
Page Load (cart.html)
         │
         ▼
   renderCartItems()
         │
         ├─► getCart() ──► Read localStorage
         │
         ├─► For each item:
         │   └─► Create <li> with details
         │
         ├─► Attach remove listeners
         │
         └─► renderCartTotal()
                   │
                   ├─► calculateCartTotal(cart)
                   │        │
                   │        └─► Sum (finalPrice ?? price) * quantity
                   │
                   └─► formatUSD(total) ──► Display "$XX.XX"
```

### Removing from Cart

```
User clicks × button
         │
         ▼
   removeFromCart(itemId)
         │
         ├─► getCart() ──► Read localStorage
         │
         ├─► Filter out item
         │
         ├─► setCart(cart) ──► Write localStorage
         │
         ├─► renderCartItems() ──► Re-render list
         │
         └─► renderCartCount() ──► Update badge
```

---

## Module Dependency Graph

```
index.html
    │
    ├── cart.js (imports)
    │     ├── addToCart()
    │     └── formatUSD()
    │
    ├── header.js (imports)
    │     ├── renderCartCount()
    │     └── imports cart.js ──► getCart()
    │
    └── product.js (imports)
          ├── isDiscounted()
          └── createDiscountBadge()

cart.html
    │
    ├── cart.js (imports)
    │     ├── renderCartItems()
    │     ├── renderCartTotal()
    │     └── removeFromCart()
    │
    └── header.js (imports)
          └── renderCartCount()
```

---

## Component Breakdown

### cart.js (Core Module)
```
┌─────────────────────────────────┐
│         cart.js                  │
├─────────────────────────────────┤
│ Storage Functions:               │
│  • getCart()                     │
│  • setCart(cart)                 │
├─────────────────────────────────┤
│ Calculation Functions:           │
│  • calculateCartTotal(cart)      │
│  • formatUSD(value)              │
├─────────────────────────────────┤
│ Render Functions:                │
│  • renderCartTotal()             │
│  • renderCartItems()             │
├─────────────────────────────────┤
│ Mutation Functions:              │
│  • addToCart(product)            │
│  • removeFromCart(itemId)        │
└─────────────────────────────────┘
```

### header.js (Badge Module)
```
┌─────────────────────────────────┐
│        header.js                 │
├─────────────────────────────────┤
│  • getCartCount()                │
│     └─► Sums all quantities      │
│                                  │
│  • renderCartCount()             │
│     └─► Updates badge DOM        │
│                                  │
│  • window.renderCartCount        │
│     └─► Global for cart.js       │
└─────────────────────────────────┘
```

### product.js (Discount Module)
```
┌─────────────────────────────────┐
│       product.js                 │
├─────────────────────────────────┤
│  • isDiscounted(item)            │
│     └─► finalPrice < price?      │
│                                  │
│  • getDiscountPercentage(item)   │
│     └─► round(100*(1-f/p))       │
│                                  │
│  • createDiscountBadge(item)     │
│     └─► Returns HTML string      │
└─────────────────────────────────┘
```

---

## State Management

```
┌────────────────────────────────────────┐
│        localStorage ('so-cart')        │
│  ┌──────────────────────────────────┐  │
│  │  Single Source of Truth          │  │
│  │  [                               │  │
│  │    { id, name, price, ... },     │  │
│  │    { id, name, price, ... }      │  │
│  │  ]                               │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
                  ▲
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
    getCart()            setCart()
        │                    ▲
        │                    │
        └────► Compute ──────┘
               Render
               Mutate
```

---

## UI Component Hierarchy

### index.html (Product Listing)
```
<body>
  ├── <header>
  │     └── <nav>
  │           ├── <a class="logo">SleepOutside</a>
  │           └── <a class="cart-link">
  │                 ├── <svg class="icon-backpack">
  │                 └── <span id="cart-count" class="badge">
  │
  └── <main>
        └── <ul id="product-list" class="product-list">
              ├── <li class="product-card">
              │     ├── <img class="product-image">
              │     ├── <h2 class="product-name">
              │     ├── <span class="discount-badge">
              │     ├── <p class="product-price">
              │     └── <button class="add-to-cart-btn">
              │
              └── ... (more products)
```

### cart.html (Shopping Cart)
```
<body>
  ├── <header>
  │     └── (same as index.html)
  │
  └── <main class="cart-container">
        ├── <h1>Your Shopping Cart</h1>
        │
        ├── <div id="cart-empty" class="cart-empty">
        │     └── "Your cart is empty."
        │
        ├── <ul id="cart-items" class="cart-items">
        │     ├── <li class="cart-item">
        │     │     ├── <div class="cart-item-image">
        │     │     │     └── <img>
        │     │     ├── <div class="cart-item-details">
        │     │     │     ├── <h3 class="cart-item-name">
        │     │     │     ├── <p class="cart-item-price">
        │     │     │     ├── <p class="cart-item-quantity">
        │     │     │     └── <p class="cart-item-total">
        │     │     └── <button class="cart-remove" data-id="...">
        │     │
        │     └── ... (more items)
        │
        └── <div id="cart-footer" class="cart-footer">
              └── <p class="cart-total">
                    └── Total: <span id="cart-total-amount">
```

---

## Event Flow

### Page Load Events
```
DOMContentLoaded
      │
      ├─► index.html
      │     ├─► renderCartCount()
      │     └─► renderProducts()
      │
      └─► cart.html
            ├─► renderCartCount()
            └─► renderCartItems()
                  └─► renderCartTotal()
```

### User Interaction Events
```
Click "Add to Cart"
      └─► addToCart() ──► setCart() ──► renderCartCount()

Click "Remove (×)"
      └─► removeFromCart() ──► setCart() ──► renderCartItems()
                                          ──► renderCartCount()
```

---

## Error Handling Strategy

```
┌─────────────────────────────┐
│  Defensive Programming      │
├─────────────────────────────┤
│                             │
│  getCart()                  │
│    └─► try/catch            │
│        └─► return []        │
│                             │
│  setCart()                  │
│    └─► try/catch            │
│        └─► console.error    │
│                             │
│  renderCartItems()          │
│    └─► nullish coalescing   │
│        • price ?? 0         │
│        • quantity ?? 1      │
│        • image ?? fallback  │
│                             │
└─────────────────────────────┘
```

---

## Performance Optimizations

1. **Minimal DOM Manipulation**
   - Batch updates with innerHTML
   - Single render per mutation

2. **localStorage Efficiency**
   - Read once per operation
   - Write only on change

3. **Event Delegation**
   - Attach listeners after render
   - Remove on cleanup

4. **CSS Performance**
   - Hardware-accelerated transforms
   - Minimal repaints

---

## Accessibility Flow

```
Keyboard Navigation
      │
      ├─► Tab to next element
      │
      ├─► Enter/Space on buttons
      │
      └─► Esc to close/cancel

Screen Reader
      │
      ├─► aria-label on icons
      │
      ├─► aria-label on badges
      │
      └─► Semantic HTML (ul, li, button)
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Unidirectional data flow
✅ Single source of truth
✅ Modular, testable code
✅ Graceful error handling
