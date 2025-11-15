# 🔧 Referencia Técnica - SleepOutside

## 📐 Arquitectura del Sistema

### Diagrama de Flujo de Datos

```
┌─────────────┐
│  index.html │
│   (Home)    │
└──────┬──────┘
       │ Click Category
       ▼
┌─────────────────────┐
│ product-list.html   │ ◄──── search from header
│  + products.js      │
│  + breadcrumbs.js   │
└──────┬──────────────┘
       │ Click Product
       ▼
┌─────────────────────┐
│   product.html      │
│ + product-detail.js │
│ + breadcrumbs.js    │
└──────┬──────────────┘
       │ Add to Cart
       ▼
┌─────────────────────┐
│    cart.html        │
│    + cart.js        │
└─────────────────────┘

     ┌────────────────────────┐
     │   localStorage         │
     │   Key: 'so-cart'       │
     │   Value: Product[]     │
     └────────────────────────┘
             ▲
             │ Read/Write
             ▼
     ┌────────────────────────┐
     │  CustomEvent           │
     │  'cart:updated'        │
     │  → Update badge        │
     └────────────────────────┘
```

---

## 📦 Estructura de Módulos

### utils.js
**Propósito**: Funciones de utilidad compartidas

**Funciones Principales**:
```javascript
formatCurrency(amount: number): string
  - Convierte número a formato USD ($X.XX)
  - Maneja strings y null/undefined
  
getFinalPrice(item: Product): number
  - Retorna finalPrice si existe, sino price
  - Maneja ambos SuggestedRetailPrice y price (API)
  
isDiscounted(item: Product): boolean
  - True si finalPrice < price
  
discountPercent(item: Product): number
  - Retorna porcentaje de descuento (0-100)
  
getResponsiveImage(images: Images): string
  - Selecciona imagen según window.innerWidth
  - <=480px: small, <=1024px: medium, >1024px: large
  
createSrcSet(images: Images): string
  - Genera atributo srcset para <img>
  
apiRequest(endpoint: string): Promise<any>
  - Fetch a https://wdd330-backend.onrender.com
  - Manejo de errores incluido
  
getParam(param: string): string|null
  - Extrae parámetro de URL
  
showAlert(message: string, type: string, duration: number): void
  - Muestra alerta temporal
```

**Campos de API Soportados**:
```typescript
type Product = {
  // Nombres de campos de API (uppercase)
  Id?: string
  Name?: string
  Category?: string
  SuggestedRetailPrice?: number
  FinalPrice?: number
  Images?: { small: string, medium: string, large: string }
  Image?: string
  DescriptionHtmlSimple?: string
  
  // Nombres alternativos (lowercase)
  id?: string
  name?: string
  category?: string
  price?: number
  finalPrice?: number
  images?: { small: string, medium: string, large: string }
  image?: string
  description?: string
  
  // Campos adicionales
  quantity?: number
}
```

---

### cart.js
**Propósito**: Gestión del carrito de compras

**Constantes**:
```javascript
const CART_KEY = 'so-cart'
```

**Funciones Exportadas**:
```javascript
getCart(): Product[]
  - Lee carrito de localStorage
  - Retorna [] si vacío o error
  
setCart(cart: Product[]): void
  - Guarda carrito en localStorage
  - Dispara CustomEvent 'cart:updated'
  
addToCart(item: Product, qty: number = 1): void
  - Agrega producto o incrementa cantidad si existe
  - Normaliza nombres de campos de API
  - Log de operaciones a consola
  
updateQuantity(id: string, qty: number): void
  - Actualiza cantidad de producto
  - Valida qty >= 1
  
removeFromCart(id: string): void
  - Elimina producto del carrito
  - Dispara re-render automático
  
calculateCartTotal(cart?: Product[]): number
  - Suma (getFinalPrice(item) * quantity) para todos los items
  
getCartCount(): number
  - Suma todas las cantidades
  
renderCartTotal(): void
  - Actualiza elemento #cart-total-amount
  - Muestra/oculta #cart-footer
  
renderCartItems(): void
  - Renderiza lista de productos en #cart-items
  - Maneja estado vacío (#cart-empty)
  - Adjunta event listeners
  
initCart(): void
  - Inicializa página del carrito
  - Escucha eventos 'cart:updated'
```

**Event Listeners Internos**:
```javascript
.quantity-input → change
  - Actualiza cantidad en cart
  - Re-renderiza items
  
.cart-remove → click
  - Elimina item
  - Re-renderiza cart
```

---

### products.js
**Propósito**: Listado y renderizado de productos

**Funciones Exportadas**:
```javascript
fetchProductsByCategory(category: string): Promise<Product[]>
  - GET /products/search/{category}
  - Retorna array vacío en error
  
fetchProductsBySearch(searchTerm: string): Promise<Product[]>
  - GET /products/search/{searchTerm}
  - Retorna array vacío en error
  
sortProducts(products: Product[], criteria: string): Product[]
  - Criterios: 'name-asc', 'name-desc', 'price-asc', 'price-desc'
  - Retorna nuevo array ordenado
  
renderProductList(products: Product[], container: HTMLElement): void
  - Limpia container
  - Renderiza product cards
  - Maneja estado vacío
  
initProductList(): Promise<void>
  - Lee parámetros URL (category o search)
  - Fetch productos
  - Renderiza con loading state
  - Configura sort handler
```

**Estructura de Product Card**:
```html
<article class="product-card">
  <a href="/product.html?id={id}">
    <span class="badge badge-discount">-{X}%</span>
    <div class="product-image">
      <img src="{imageSrc}" srcset="{srcset}" alt="{name}">
    </div>
    <div class="product-info">
      <h3 class="product-name">{name}</h3>
      <p class="product-category">{category}</p>
      <div class="product-pricing">
        <span class="product-price-original">{originalPrice}</span>
        <span class="product-price">{finalPrice}</span>
      </div>
    </div>
  </a>
</article>
```

---

### product-detail.js
**Propósito**: Página de detalle de producto individual

**Funciones Exportadas**:
```javascript
fetchProduct(productId: string): Promise<Product>
  - GET /product/{productId}
  - Throw error si falla
  
renderProductDetail(product: Product, container: HTMLElement): void
  - Renderiza detalle completo
  - Configura add-to-cart handler
  - Actualiza breadcrumbs
  - Actualiza document.title
  
initProductDetail(): Promise<void>
  - Lee parámetro 'id' de URL
  - Fetch producto
  - Renderiza con loading/error states
```

**Add to Cart Handler**:
```javascript
#add-to-cart-btn → click
  1. Lee cantidad de #quantity input
  2. Llama addToCart(product, quantity)
  3. Muestra alerta de éxito
  4. Badge se actualiza automáticamente vía evento
```

---

### header.js
**Propósito**: Header dinámico con navegación y búsqueda

**Funciones Exportadas**:
```javascript
initHeader(): void
  - Inyecta HTML en #main-header
  - Configura search form listener
  - Escucha 'cart:updated' para badge
```

**Componentes del Header**:
```html
<div class="header-container">
  <div class="logo">SleepOutside</div>
  <nav class="main-nav">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="?category=Tents">Tents</a></li>
      <!-- ... más categorías ... -->
    </ul>
  </nav>
  <div class="header-actions">
    <form class="search-form">
      <input id="search-input" type="search">
      <button type="submit">🔍</button>
    </form>
    <a href="/cart.html" class="cart-link">
      🛒
      <span id="cart-count" class="cart-badge">{count}</span>
    </a>
  </div>
</div>
```

**Search Handler**:
```javascript
.search-form → submit
  1. Previene default
  2. Lee valor de #search-input
  3. Redirige a /product-list.html?search={term}
```

---

### footer.js
**Propósito**: Footer dinámico reutilizable

**Funciones Exportadas**:
```javascript
initFooter(): void
  - Inyecta HTML en #main-footer
  - Incluye año actual automáticamente
```

---

### breadcrumbs.js
**Propósito**: Navegación breadcrumb contextual

**Funciones Exportadas**:
```javascript
initBreadcrumbs(): void
  - Determina breadcrumb según URL
  - Renderiza en #breadcrumb-container
  
updateProductBreadcrumb(productName: string, category: string): void
  - Actualiza breadcrumb con nombre de producto
  
updateResultCountBreadcrumb(count: number): void
  - Agrega contador de resultados
```

**Estructura de Breadcrumb**:
```
Home → Category → (X items)
Home → Search: "term" → (X items)
Home → Category → Product Name
```

---

### test-utils.js
**Propósito**: Suite de pruebas automatizadas

**Funciones Exportadas**:
```javascript
testEmptyCart(): boolean
testAddItems(): boolean
testDuplicatePrevention(): boolean
testQuantityUpdate(): boolean
testCartTotal(): boolean
testDiscountCalculations(): boolean
testRemoveFromCart(): boolean
runAllTests(): void
```

**Uso**:
```javascript
// En consola del navegador
testUtils.runAllTests()

// O individual
testUtils.testDuplicatePrevention()
```

---

## 🎨 Sistema de Estilos (CSS)

### Variables CSS

```css
:root {
  /* Colores */
  --primary-color: #2c5f2d;      /* Verde bosque */
  --primary-hover: #1f4521;       /* Verde oscuro */
  --secondary-color: #97c05c;     /* Verde claro */
  --accent-color: #ff6b35;        /* Naranja */
  
  --text-color: #333;
  --text-light: #666;
  --border-color: #ddd;
  --bg-color: #fff;
  --bg-light: #f8f9fa;
  
  --error-color: #dc3545;
  --success-color: #28a745;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-xxl: 3rem;     /* 48px */
  
  /* Efectos */
  --border-radius: 0.5rem;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --box-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  --max-width: 1200px;
}
```

### Clases de Utilidad

```css
.hide { display: none !important; }

.loading {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: 1.25rem;
  color: var(--text-light);
}

.error-message {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  text-align: center;
}

.no-results {
  text-align: center;
  padding: var(--spacing-xxl);
  font-size: 1.25rem;
  color: var(--text-light);
  border: 2px dashed var(--border-color);
}
```

### Breakpoints Responsive

```css
/* Mobile First Approach */

/* Tablet: 768px */
@media (max-width: 768px) {
  .header-container { flex-direction: column; }
  .product-detail { grid-template-columns: 1fr; }
}

/* Mobile: 480px */
@media (max-width: 480px) {
  .logo-text { font-size: 1.25rem; }
  .category-grid, .product-grid { grid-template-columns: 1fr; }
}
```

---

## 🔄 Flujo de Eventos

### 1. Agregar al Carrito

```
Usuario click "Add to Cart"
  ↓
product-detail.js: addToCart(product, qty)
  ↓
cart.js: addToCart()
  ├─ Verifica duplicados
  ├─ Normaliza campos de API
  └─ setCart(updatedCart)
      ↓
      localStorage.setItem('so-cart', JSON.stringify(cart))
      ↓
      window.dispatchEvent(new CustomEvent('cart:updated'))
      ↓
      ┌─────────────────────────────────┐
      │ header.js escucha evento        │
      │ → updateCartBadge()             │
      │ → badge.textContent = newCount  │
      └─────────────────────────────────┘
      ↓
Usuario ve alert "Product added to cart!"
Usuario ve badge actualizado
```

### 2. Cambiar Cantidad en Carrito

```
Usuario cambia input de cantidad
  ↓
cart.js: .quantity-input → change event
  ↓
updateQuantity(id, newQty)
  ↓
setCart(updatedCart)
  ↓
CustomEvent 'cart:updated' → badge actualizado
  ↓
renderCartItems()
  ↓
Total y subtotales re-calculados
```

### 3. Búsqueda de Productos

```
Usuario escribe "tent" y presiona Enter
  ↓
header.js: .search-form → submit event
  ↓
handleSearchSubmit(e)
  ↓
window.location.href = "/product-list.html?search=tent"
  ↓
products.js: initProductList()
  ├─ getParam('search') = "tent"
  ├─ fetchProductsBySearch('tent')
  │   ↓
  │   GET https://wdd330-backend.onrender.com/products/search/tent
  │   ↓
  │   return products[]
  └─ renderProductList(products)
      ↓
Product cards renderizados
```

---

## 🌐 API Reference

### Base URL
```
https://wdd330-backend.onrender.com
```

### Endpoints

#### 1. Search Products
```http
GET /products/search/{term}
```

**Ejemplos**:
```javascript
fetch('https://wdd330-backend.onrender.com/products/search/tents')
fetch('https://wdd330-backend.onrender.com/products/search/backpacks')
```

**Response**:
```json
[
  {
    "Id": "880RR",
    "Name": "Rimrock Tent - 2 Person",
    "Brand": {
      "Id": "bran01",
      "Name": "The North Face"
    },
    "Category": "Tents",
    "SuggestedRetailPrice": 299.99,
    "FinalPrice": 249.99,
    "Images": {
      "Primary": "https://...",
      "PrimarySmall": "https://...",
      "PrimaryMedium": "https://...",
      "PrimaryLarge": "https://..."
    },
    "DescriptionHtmlSimple": "<p>...</p>"
  }
]
```

#### 2. Get Product Detail
```http
GET /product/{id}
```

**Ejemplo**:
```javascript
fetch('https://wdd330-backend.onrender.com/product/880RR')
```

**Response**: Same structure as search, but single object

---

## 🧩 Patrones de Código

### Pattern 1: Manejo Defensive de API

```javascript
function renderProductCard(product) {
  // Maneja ambos formatos de API
  const productName = product.Name || product.name || 'Unknown Product';
  const productId = product.Id || product.id;
  const category = product.Category || product.category;
  
  // Fallback para imágenes
  let imageSrc = '';
  if (product.Images) {
    imageSrc = getResponsiveImage(product.Images);
  } else if (product.images) {
    imageSrc = getResponsiveImage(product.images);
  } else if (product.Image || product.image) {
    imageSrc = product.Image || product.image;
  }
  
  // Placeholder si no hay imagen
  if (!imageSrc) {
    imageSrc = `https://placehold.co/400x300/2c5f2d/ffffff?text=${encodeURIComponent(productName)}`;
  }
  
  // ...resto del código
}
```

### Pattern 2: Event-Driven Updates

```javascript
// cart.js
export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  
  // Notificar a todos los listeners
  window.dispatchEvent(new CustomEvent('cart:updated', { 
    detail: { cart } 
  }));
}

// header.js
window.addEventListener('cart:updated', updateCartBadge);

// cart.html
window.addEventListener('cart:updated', renderCartItems);
```

### Pattern 3: Auto-Initialization

```javascript
// Patrón usado en todos los módulos
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('target-element')) {
      initModule();
    }
  });
} else {
  if (document.getElementById('target-element')) {
    initModule();
  }
}
```

### Pattern 4: Error Boundaries

```javascript
export async function initProductList() {
  try {
    // Show loading
    loadingElement.style.display = 'block';
    
    // Fetch data
    const products = await fetchProductsByCategory(category);
    
    // Hide loading
    loadingElement.style.display = 'none';
    
    // Render
    renderProductList(products, container);
    
  } catch (error) {
    console.error('Error:', error);
    
    // Hide loading
    loadingElement.style.display = 'none';
    
    // Show user-friendly error
    container.innerHTML = `
      <div class="error-message">
        <p>⚠️ Error loading products.</p>
        <p class="error-details">${error.message}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}
```

---

## 📈 Optimizaciones

### Performance

1. **Lazy Loading de Imágenes**
```html
<img src="..." loading="lazy" alt="...">
```

2. **Responsive Images con srcset**
```html
<img 
  src="medium.jpg"
  srcset="small.jpg 480w, medium.jpg 1024w, large.jpg 1920w"
  sizes="(max-width: 480px) 480px, (max-width: 1024px) 1024px, 1920px"
>
```

3. **Event Delegation** (no implementado, pero recomendado)
```javascript
// En lugar de múltiples listeners
document.getElementById('product-list').addEventListener('click', (e) => {
  if (e.target.matches('.add-to-cart-btn')) {
    handleAddToCart(e);
  }
});
```

### Memory

1. **Clear timers en alerts**
```javascript
setTimeout(() => alert.remove(), duration);
```

2. **Event listeners limpios**
```javascript
// Listeners se agregan solo una vez
// Se re-renderizan elementos en lugar de acumular listeners
```

---

## 🔐 Seguridad

### localStorage Safety

```javascript
// Siempre usar try-catch
try {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
} catch (error) {
  console.error('localStorage error:', error);
  // Manejo alternativo
}
```

### XSS Prevention

```javascript
// NO: innerHTML con contenido no sanitizado
element.innerHTML = userInput;

// SÍ: textContent o createElement
element.textContent = userInput;

// O sanitizar HTML
const clean = DOMPurify.sanitize(userInput);
```

**Nota**: El proyecto usa `innerHTML` pero con data de API confiable. Para input de usuario, usar sanitización.

---

## 🚀 Deployment Checklist

- [ ] Todos los paths son absolutos o relativos correctos
- [ ] API URL es correcta (https://wdd330-backend.onrender.com)
- [ ] No hay console.log excesivos en producción
- [ ] localStorage tiene fallback de errores
- [ ] Imágenes tienen alt text
- [ ] Todos los tests pasan (runAllTests)
- [ ] No hay errores en consola
- [ ] Responsive funciona en 3 breakpoints
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## 📚 Recursos Adicionales

### Documentación del Proyecto
- `README.md` - Overview general
- `ARCHITECTURE.md` - Arquitectura detallada
- `INICIO-RAPIDO.md` - Guía de inicio
- `RUBRICA-CHECKLIST.md` - Checklist de funcionalidades
- `TESTING.md` - Guía de pruebas

### APIs y Librerías Usadas
- localStorage API
- Fetch API
- CustomEvent API
- Intl.NumberFormat (formateo de moneda)
- ES6 Modules (import/export)

### Convenciones de Código
- **Nombres de archivos**: kebab-case (product-detail.js)
- **Nombres de funciones**: camelCase (renderProductCard)
- **Nombres de constantes**: SCREAMING_SNAKE_CASE (CART_KEY)
- **Comentarios**: JSDoc para funciones exportadas

---

**Última actualización**: 2025-11-15
**Versión**: 1.0.0
**Autor**: LuisE503
