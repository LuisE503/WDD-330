# 🎨 Guía Visual - SleepOutside

## 📸 Expectativas Visuales por Página

Esta guía describe exactamente cómo debe verse cada página cuando todo está funcionando correctamente.

---

## 🏠 index.html - Página Principal

### Header
```
┌─────────────────────────────────────────────────────────┐
│ [SleepOutside]  Home Tents Backpacks Sleeping-Bags ... │
│                 [🔍 Search...] [🛒 2]                   │
└─────────────────────────────────────────────────────────┘
```

**Debe verse**:
- Logo "SleepOutside" (Sleep en normal, Outside en verde claro)
- Menú de navegación horizontal
- Barra de búsqueda con ícono de lupa
- Ícono de carrito con badge rojo mostrando cantidad

### Hero Section
```
┌─────────────────────────────────────────────┐
│                                             │
│      Welcome to SleepOutside                │
│   Your trusted source for quality outdoor  │
│         gear and equipment                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Colores**:
- Fondo: Gradiente verde (primary → secondary)
- Texto: Blanco
- Patrón de estrellas sutil en el fondo

### Categories Grid
```
┌──────────────────────────────────────────────────────┐
│              Shop by Category                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │ [Img]   │  │ [Img]   │  │ [Img]   │  │ [Img]   ││
│  │         │  │         │  │         │  │         ││
│  │ Tents   │  │Backpacks│  │Sleeping │  │Hammocks ││
│  │Durable  │  │Carry... │  │Stay warm│  │Relax... ││
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘│
└──────────────────────────────────────────────────────┘
```

**Tarjetas de categoría**:
- 4 tarjetas en fila (responsive: 2x2 en tablet, 1 columna en mobile)
- Imagen placeholder de placehold.co
- Hover: Tarjeta se eleva (translateY) con sombra más grande
- Bordes redondeados (border-radius)
- Sombra sutil

### Footer
```
┌──────────────────────────────────────────────────────┐
│  About        Customer Service    Social             │
│  • About Us   • Contact            [f] [t] [i]       │
│  • Careers    • Shipping                             │
│              • Returns                                │
│  ────────────────────────────────────────────────────│
│  © 2025 SleepOutside. All rights reserved.          │
└──────────────────────────────────────────────────────┘
```

---

## 📦 product-list.html - Lista de Productos

### Breadcrumbs
```
Home > Tents > (12 products)
```

**Estilo**:
- Fondo gris claro
- Links en color primary
- Separador: ">"

### Controles
```
┌──────────────────────────────────────────────┐
│ Tents                         Sort by: [▼]  │
│ 12 products found             Name (A-Z)     │
└──────────────────────────────────────────────┘
```

**Dropdown de ordenamiento**:
- Default
- Name (A-Z)
- Name (Z-A)
- Price (Low to High)
- Price (High to Low)

### Product Grid
```
┌──────────────────────────────────────────────────────┐
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│ │[-25%]   │  │         │  │         │  │[-15%]   │ │
│ │ [Img]   │  │ [Img]   │  │ [Img]   │  │ [Img]   │ │
│ │Alpine   │  │Summit   │  │Base Camp│  │Ultra    │ │
│ │Tent     │  │Tent     │  │Tent     │  │Tent     │ │
│ │Tents    │  │Tents    │  │Tents    │  │Tents    │ │
│ │$199 $299│  │$349.99  │  │$449.99  │  │$509 $599│ │
│ └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
└──────────────────────────────────────────────────────┘
```

**Cada Product Card debe tener**:
- Badge de descuento (si aplica) en esquina superior derecha
- Imagen del producto (o placeholder)
- Nombre del producto
- Categoría en gris claro
- Precio (tachado si hay descuento)
- Precio final en verde bold

**Interacciones**:
- Hover: Card se eleva ligeramente
- Click: Navega a product.html?id={productId}

**Estado de carga**:
```
Loading products...
```

**Estado vacío** (0 productos):
```
┌─────────────────────────────┐
│  No products found.         │
│  Try adjusting your search  │
└─────────────────────────────┘
```

**Estado de error**:
```
┌─────────────────────────────┐
│ ⚠️ Error loading products.  │
│ Please try again later.     │
│                             │
│ Error: Network timeout      │
│                             │
│      [Retry]                │
└─────────────────────────────┘
```

---

## 🔍 product.html - Detalle de Producto

### Layout
```
┌────────────────────────────────────────────────────────┐
│ Home > Tents > Alpine Tent - 2 Person                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────┐    Alpine Tent - 2 Person          │
│  │ [-25%]       │    Tents                             │
│  │              │                                      │
│  │              │    ┌─────────────────────┐          │
│  │   [Image]    │    │ $299.99  Save 25%   │          │
│  │              │    │ $249.99             │          │
│  │              │    └─────────────────────┘          │
│  └──────────────┘                                      │
│                     Description                        │
│                     Perfect for weekend camping...     │
│                                                        │
│                     In Stock                           │
│                                                        │
│                     Quantity: [1] [Add to Cart]       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Sección izquierda** (Imagen):
- Imagen grande del producto
- Badge de descuento en esquina superior derecha
- Imagen responsive (cambia según viewport)

**Sección derecha** (Info):
- Nombre del producto (h1, grande, color primary)
- Categoría (pequeña, uppercase, gris)
- Box de precio con fondo gris claro:
  - Precio original tachado (si hay descuento)
  - Badge de "Save X%"
  - Precio final grande y bold
- Descripción del producto
- Estado de stock (verde si disponible)
- Control de cantidad (input number, min=1)
- Botón "Add to Cart" (verde, grande)

**Al hacer click en "Add to Cart"**:
```
┌────────────────────────────────────┐
│ ✓ Alpine Tent added to cart!      │
└────────────────────────────────────┘
```
- Alerta verde aparece en esquina superior derecha
- Badge del carrito se actualiza automáticamente
- Alerta desaparece después de 3 segundos

---

## 🛒 cart.html - Carrito de Compras

### Estado Vacío
```
┌────────────────────────────────────────────┐
│ Shopping Cart                              │
├────────────────────────────────────────────┤
│                                            │
│     Your cart is empty.                    │
│                                            │
│     [Continue Shopping]                    │
│                                            │
└────────────────────────────────────────────┘
```

**Mensaje**:
- Centrado
- Fondo gris claro
- Botón para regresar a home

### Estado con Items
```
┌──────────────────────────────────────────────────────────┐
│ Shopping Cart                                            │
├──────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Img]  Alpine Tent - 2 Person                   [×] │ │
│ │        $249.99                                       │ │
│ │        [-25%]                                        │ │
│ │        Quantity: [2]                                 │ │
│ │        Subtotal: $499.98                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Img]  Trail Backpack 50L                       [×] │ │
│ │        $179.99                                       │ │
│ │        Quantity: [1]                                 │ │
│ │        Subtotal: $179.99                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  Total: $679.97            [Checkout]               │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Cada Cart Item debe tener**:
- Imagen pequeña (120x120px) a la izquierda
- Nombre del producto
- Precio unitario
- Badge de descuento (si aplica)
- Control de cantidad (input editable)
- Subtotal (precio × cantidad)
- Botón de eliminar (×) rojo en esquina superior derecha

**Cart Footer**:
- Fondo gris claro
- Total grande y bold en verde
- Botón "Checkout" verde y prominente
- Sticky (se queda visible al hacer scroll)

**Interacciones**:
- Cambiar cantidad → Total se actualiza automáticamente
- Click en × → Item se elimina, total se recalcula
- Badge del header se actualiza en tiempo real

---

## 📱 Vista Responsive

### Mobile (≤480px)

**Header**:
```
┌─────────────────────┐
│ SleepOutside        │
│ [🔍 Search...] [🛒2]│
│ Home Tents Backpacks│
└─────────────────────┘
```
- Logo más pequeño
- Navegación en 2 filas
- Search bar y cart en línea separada

**Categories**:
- 1 columna (tarjetas apiladas)
- Full width

**Products**:
- 1 columna
- Tarjetas full width

**Product Detail**:
- Imagen arriba
- Info abajo
- 1 columna layout

**Cart**:
- Items en 1 columna
- Imagen arriba del texto

### Tablet (≤768px)

**Categories**:
- 2 columnas (2x2 grid)

**Products**:
- 2 columnas

**Product Detail**:
- Aún 1 columna
- Más espaciado

### Desktop (>1024px)

**Categories**:
- 4 columnas (1x4 grid)

**Products**:
- 3-4 columnas (auto-fit)

**Product Detail**:
- 2 columnas (imagen | info)

---

## 🎨 Colores y Estilos

### Paleta de Colores
```
Primary:      #2c5f2d  ███  Verde bosque
Primary Hover:#1f4521  ███  Verde oscuro
Secondary:    #97c05c  ███  Verde claro
Accent:       #ff6b35  ███  Naranja
Text:         #333333  ███  Gris oscuro
Text Light:   #666666  ███  Gris medio
Border:       #dddddd  ███  Gris claro
Background:   #f8f9fa  ███  Gris muy claro
Error:        #dc3545  ███  Rojo
Success:      #28a745  ███  Verde éxito
```

### Tipografía
- **Fuente**: System font stack (sans-serif)
- **Tamaños**:
  - h1: 2rem (32px)
  - h2: 1.5rem (24px)
  - h3: 1.25rem (20px)
  - body: 1rem (16px)
  - small: 0.875rem (14px)

### Espaciado
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Efectos
- **Border Radius**: 0.5rem (8px)
- **Box Shadow**: `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Box Shadow Hover**: `0 4px 12px rgba(0, 0, 0, 0.15)`
- **Transition**: `all 0.3s ease`

---

## 🐛 Indicadores de Problemas

### ❌ Señales de que algo NO funciona:

1. **Productos no visibles**:
   - Mensaje "Loading products..." permanece indefinidamente
   - Ver consola: Verificar errores de red

2. **Imágenes rotas**:
   - Ícono de imagen rota (🖼️)
   - Debe haber placeholder verde con texto

3. **Badge del carrito no actualiza**:
   - Agregar producto pero badge no cambia
   - Verificar CustomEvent en consola

4. **Errores en consola**:
   - Texto rojo en consola del navegador
   - "404 Not Found" para archivos .js
   - "CORS error"

5. **Estilos no aplicados**:
   - Página sin colores
   - Layout roto
   - Verificar que site.css cargue

### ✅ Señales de que TODO funciona:

1. **Productos visibles**:
   - Cards con imágenes, nombres, precios
   - Hover effects funcionan

2. **Imágenes cargan**:
   - Todas las imágenes son verdes (placehold.co)
   - O imágenes reales de la API

3. **Badge actualiza**:
   - Agrega producto → badge incrementa
   - Elimina producto → badge decrementa
   - Badge se oculta cuando = 0

4. **Consola limpia**:
   - Solo logs informativos (azul/negro)
   - No hay errores rojos
   - Logs de "Product loaded:", "Cart updated:", etc.

5. **Estilos aplicados**:
   - Colores verdes predominantes
   - Sombras y transiciones visibles
   - Layout responsive funciona

---

## 📊 Checklist Visual

Usa este checklist para verificar cada página:

### index.html
- [ ] Header verde con logo visible
- [ ] Menú de navegación completo
- [ ] Search bar funcional
- [ ] Cart badge visible (si hay items)
- [ ] Hero section con gradiente verde
- [ ] 4 tarjetas de categoría
- [ ] Imágenes de categorías cargadas
- [ ] Footer completo
- [ ] Hover effects en categorías

### product-list.html
- [ ] Breadcrumbs visibles
- [ ] Título de categoría/búsqueda
- [ ] Contador de productos
- [ ] Dropdown de ordenamiento
- [ ] Product cards en grid
- [ ] Imágenes de productos cargadas
- [ ] Precios formateados como $X.XX
- [ ] Badges de descuento (si aplica)
- [ ] Hover effects en cards
- [ ] Click lleva a product.html

### product.html
- [ ] Breadcrumbs con nombre de producto
- [ ] Imagen grande del producto
- [ ] Nombre del producto como h1
- [ ] Categoría visible
- [ ] Precio en box gris claro
- [ ] Badge de descuento (si aplica)
- [ ] Descripción del producto
- [ ] "In Stock" visible
- [ ] Control de cantidad funcional
- [ ] Botón "Add to Cart"
- [ ] Click muestra alerta de éxito
- [ ] Badge del header se actualiza

### cart.html
- [ ] Breadcrumb "Shopping Cart"
- [ ] Items listados correctamente
- [ ] Imágenes de items cargadas
- [ ] Precios y subtotales correctos
- [ ] Controles de cantidad funcionan
- [ ] Botones × para eliminar
- [ ] Total se calcula correctamente
- [ ] Cart footer sticky visible
- [ ] Botón "Checkout" prominente
- [ ] Estado vacío si no hay items

### Responsive
- [ ] Mobile: 1 columna en todo
- [ ] Tablet: 2 columnas en grids
- [ ] Desktop: 3-4 columnas en grids
- [ ] Navegación se adapta
- [ ] Imágenes responsive
- [ ] No hay overflow horizontal

---

## 🎯 Referencias Visuales Rápidas

### Header
- **Altura**: ~80px
- **Fondo**: Verde (#2c5f2d)
- **Sticky**: Sí (permanece arriba al scroll)

### Footer
- **Fondo**: Verde (#2c5f2d)
- **Texto**: Blanco
- **Links**: Verde claro al hover

### Buttons
- **Primary**: Verde con gradiente
- **Hover**: Se eleva 2px
- **Shadow**: Aumenta al hover

### Cards
- **Border Radius**: 8px
- **Shadow**: Sutil
- **Hover**: Se eleva 4px

### Badges
- **Descuento**: Naranja (#ff6b35)
- **Cart**: Naranja en header
- **Position**: Absolute, top-right

---

**Usa esta guía para comparar lo que ves en tu navegador con lo que debería verse. Si algo no coincide, revisa la consola del navegador y el código correspondiente.**
