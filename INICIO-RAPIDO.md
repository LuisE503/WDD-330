# 🚀 Guía de Inicio Rápido - SleepOutside

## ⚡ Inicio Inmediato

### Opción 1: Ejecutar con Servidor Local (Recomendado)
```powershell
# Ejecutar el archivo batch
.\start-server.bat

# O manualmente:
python -m http.server 8000
```

Luego abre: **http://localhost:8000**

### Opción 2: Abrir Directamente
```powershell
Start-Process "index.html"
```

**Nota**: Si los módulos no cargan, usa la Opción 1.

---

## 📋 Prueba Rápida de Funcionalidades

### 1. Navegación (30 segundos)
1. Abre `index.html`
2. Haz clic en cualquier categoría (Tents, Backpacks, etc.)
3. Verifica que los productos se cargan

**✅ Debe mostrar**: Lista de productos con imágenes y precios

### 2. Búsqueda (30 segundos)
1. En el header, escribe "tent" en la búsqueda
2. Presiona Enter
3. Verifica resultados

**✅ Debe mostrar**: Productos que coinciden con "tent"

### 3. Detalle de Producto (30 segundos)
1. Haz clic en cualquier producto
2. Cambia la cantidad a 3
3. Click en "Add to Cart"

**✅ Debe mostrar**: Alerta de éxito y badge del carrito actualizado

### 4. Carrito (1 minuto)
1. Click en el ícono del carrito (esquina superior derecha)
2. Cambia cantidad de un producto
3. Elimina un producto con el botón "×"

**✅ Debe actualizar**: Total automáticamente

### 5. Prevención de Duplicados (30 segundos)
1. Agrega el mismo producto 2 veces
2. Ve al carrito

**✅ Debe mostrar**: 1 producto con cantidad = 2 (NO 2 productos separados)

---

## 🧪 Ejecutar Pruebas Automatizadas

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Prueba completa (recomendada)
testUtils.runAllTests()

// Pruebas individuales
testUtils.testDuplicatePrevention()
testUtils.testQuantityUpdate()
testUtils.testCartTotal()
testUtils.testDiscountCalculations()
testUtils.testRemoveFromCart()

// Agregar productos de prueba
testUtils.testAddItems()

// Limpiar carrito
testUtils.testEmptyCart()
```

**Resultado esperado**:
```
🚀 Running all tests...
✅ PASS: Quantity incremented, no duplicates
✅ PASS: Quantity updated correctly
✅ PASS: Total is 210 (expected 210)
✅ PASS: Discount detection and calculation correct
✅ PASS: Item removed successfully
📊 Test Results: 5/5 passed
✅ All tests passed!
```

---

## 🔍 Verificar Errores

### En la Consola del Navegador (F12)

**No debe haber**:
- ❌ Errores de JavaScript (rojo)
- ❌ "404 Not Found" para archivos .js
- ❌ "CORS policy" errors

**Debe haber**:
- ✅ Logs informativos en azul/negro
- ✅ Confirmaciones de productos cargados
- ✅ Eventos de carrito actualizados

### Verificar localStorage

1. F12 → Application → Local Storage → `http://localhost:8000`
2. Busca la clave: `so-cart`
3. Debe contener array JSON de productos

**Ejemplo**:
```json
[
  {
    "id": "880RR",
    "name": "Alpine Tent",
    "price": 299.99,
    "quantity": 2
  }
]
```

---

## 📱 Prueba Responsive

1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Prueba en:
   - **Mobile**: iPhone SE (375x667)
   - **Tablet**: iPad (768x1024)
   - **Desktop**: 1920x1080

**Verifica**:
- ✅ Menú de navegación se adapta
- ✅ Productos se reorganizan en grid
- ✅ Imágenes cambian de tamaño
- ✅ Cart footer permanece visible

---

## ⚠️ Solución de Problemas Comunes

### Problema 1: "Los productos no se muestran"

**Síntoma**: product-list.html muestra "Loading..." indefinidamente

**Solución**:
1. Abre consola (F12)
2. Verifica errores de red
3. Asegúrate de tener conexión a internet (la API es externa)
4. URL de API: `https://wdd330-backend.onrender.com`

**Prueba manual**:
```javascript
fetch('https://wdd330-backend.onrender.com/products/search/tents')
  .then(r => r.json())
  .then(data => console.log('API Response:', data));
```

### Problema 2: "Módulos no cargan (ERR_FAILED)"

**Síntoma**: 
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain"
```

**Solución**: Usa servidor HTTP local
```powershell
python -m http.server 8000
```

### Problema 3: "Cart badge no se actualiza"

**Solución**:
1. Abre consola
2. Ejecuta: `testUtils.testAddItems()`
3. Recarga la página

### Problema 4: "Imágenes no cargan"

**Verifica**:
- ✅ URLs de imágenes son de `placehold.co` (categorías en index.html)
- ✅ Conexión a internet activa
- ✅ No hay bloqueadores de contenido

---

## 📊 Checklist de Funcionalidades

Marca cada característica después de probarla:

### Navegación y UI
- [ ] Header se muestra en todas las páginas
- [ ] Footer se muestra en todas las páginas
- [ ] Logo "SleepOutside" es clickeable y lleva a home
- [ ] Menú de navegación tiene 5 links (Home, Tents, Backpacks, Sleeping Bags, Hammocks)
- [ ] Breadcrumbs aparecen en páginas de productos

### Búsqueda
- [ ] Formulario de búsqueda en header
- [ ] Búsqueda redirige a product-list.html?search=TERM
- [ ] Resultados de búsqueda se muestran correctamente
- [ ] Mensaje "X products found" aparece

### Productos
- [ ] Categorías en home page son clickeables
- [ ] Lista de productos carga desde API
- [ ] Imágenes de productos se muestran
- [ ] Precios formateados como USD ($X.XX)
- [ ] Badges de descuento aparecen cuando aplica
- [ ] Ordenamiento funciona (Name A-Z, Z-A, Price Low-High, High-Low)

### Detalle de Producto
- [ ] Página de detalle carga correctamente
- [ ] Imagen grande se muestra
- [ ] Descripción del producto visible
- [ ] Control de cantidad funciona (min: 1)
- [ ] Botón "Add to Cart" funcional

### Carrito
- [ ] Badge del carrito muestra cantidad correcta
- [ ] Badge se oculta cuando carrito está vacío
- [ ] Badge se actualiza en tiempo real
- [ ] Página del carrito muestra items correctamente
- [ ] Mensaje "Your cart is empty" cuando corresponde
- [ ] Controles de cantidad funcionan
- [ ] Botón de eliminar (×) funciona
- [ ] Total se calcula correctamente
- [ ] Total se actualiza al cambiar cantidades

### Lógica de Negocio
- [ ] Productos duplicados incrementan cantidad (no crean duplicados)
- [ ] Descuentos se calculan correctamente (finalPrice < price)
- [ ] Porcentaje de descuento es correcto
- [ ] Cart persiste en localStorage
- [ ] Cart se mantiene al recargar página

### Responsive Design
- [ ] Layout se adapta en mobile (<=480px)
- [ ] Layout se adapta en tablet (<=768px)
- [ ] Layout funciona en desktop (>1024px)
- [ ] Imágenes responsive cargan tamaño apropiado
- [ ] Navegación mobile es usable

### Accesibilidad
- [ ] Navegación por teclado funciona (Tab)
- [ ] Todos los botones tienen aria-label
- [ ] Todas las imágenes tienen alt text
- [ ] Formularios tienen labels asociados
- [ ] Focus visible en elementos interactivos

---

## 🎯 Métricas de Éxito

### Rendimiento
- **Tiempo de carga inicial**: < 3 segundos
- **Carga de productos**: < 2 segundos
- **Respuesta del carrito**: Instantánea

### Funcionalidad
- **Pruebas automatizadas**: 5/5 deben pasar ✅
- **Errores en consola**: 0 ❌
- **Funciones críticas**: 100% operativas

### UX
- **Navegación intuitiva**: ✅
- **Feedback visual**: ✅ (alertas al agregar al carrito)
- **Estados de carga**: ✅ (spinners/mensajes)
- **Mensajes de error**: ✅ (claros y accionables)

---

## 📞 Soporte

### Si algo no funciona:

1. **Revisa la consola del navegador** (F12)
2. **Ejecuta las pruebas**: `testUtils.runAllTests()`
3. **Verifica localStorage**: Application → Local Storage
4. **Comprueba la conexión a internet**
5. **Usa servidor local**: `python -m http.server 8000`

### Logs Útiles

```javascript
// Ver estado del carrito
console.log('Cart:', localStorage.getItem('so-cart'));

// Ver cantidad de items
import { getCartCount } from './src/js/cart.js';
console.log('Cart count:', getCartCount());

// Probar API
fetch('https://wdd330-backend.onrender.com/products/search/tents')
  .then(r => r.json())
  .then(d => console.log('API works:', d));
```

---

## ✅ Completado

Si todas las pruebas pasan y el checklist está completo:

**¡Tu proyecto SleepOutside está 100% funcional! 🎉**

**Siguiente paso**: Preparar commits para git

```powershell
git add .
git commit -m "feat: complete SleepOutside e-commerce implementation"
git push origin main
```
