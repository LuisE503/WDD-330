# 🧪 Checklist de Pruebas - Funcionalidades Implementadas

## Fecha: Noviembre 29, 2025

---

## ✅ 1. Sistema de Checkout

### Pruebas Básicas
- [ ] **Navegación al Checkout**
  1. Agrega productos al carrito
  2. Ve a `cart.html`
  3. Click en "Proceed to Checkout"
  4. **Esperado:** Redirige a `checkout.html` con formulario

- [ ] **Validación de Carrito Vacío**
  1. Borra todos los productos del carrito
  2. Navega directamente a `checkout.html`
  3. **Esperado:** Mensaje "Your Cart is Empty" con botón "Continue Shopping"

### Validación de Formulario
- [ ] **Campos Requeridos**
  1. Intenta enviar formulario vacío
  2. **Esperado:** Errores en todos los campos requeridos

- [ ] **Formato de Tarjeta**
  1. Ingresa letras en campo de tarjeta
  2. **Esperado:** Solo acepta números
  3. Ingresa `4111111111111111`
  4. **Esperado:** Formato correcto

- [ ] **Formato de Fecha**
  1. Ingresa `1225`
  2. **Esperado:** Auto-formato a `12/25`
  3. Ingresa fecha pasada (ej: `01/20`)
  4. **Esperado:** Error "Card has expired"

- [ ] **Formato de CVV**
  1. Ingresa letras
  2. **Esperado:** Solo acepta números
  3. Ingresa `123`
  4. **Esperado:** Válido

- [ ] **Formato de ZIP**
  1. Ingresa `841`
  2. **Esperado:** Requiere 5 dígitos
  3. Ingresa `84101`
  4. **Esperado:** Válido

- [ ] **Formato de State**
  1. Ingresa `utah`
  2. **Esperado:** Auto-convierte a `UT`
  3. Solo acepta 2 letras

### Cálculos
- [ ] **Totales Correctos**
  1. Verifica subtotal en resumen de orden
  2. **Esperado:** Suma de (precio × cantidad)
  3. Verifica shipping: **$10.00**
  4. Verifica tax: **7% del subtotal**
  5. Verifica total: **Subtotal + Shipping + Tax**

### Envío de Orden
- [ ] **Orden Exitosa**
  1. Llena formulario con datos válidos
  2. Click en "Complete Order"
  3. **Esperado:** 
     - Loading overlay aparece
     - Redirige a página de éxito
     - Muestra número de orden
     - Carrito se vacía

---

## ✅ 2. Animaciones del Carrito

- [ ] **Cart Icon Bounce**
  1. Agrega cualquier producto al carrito
  2. **Esperado:** Icono del carrito hace bounce (escala + rotación)
  3. Duración: 600ms

- [ ] **Cart Badge Pulse**
  1. Agrega producto
  2. **Esperado:** Badge numérico hace pulse y cambia color
  3. Duración: 600ms

- [ ] **Múltiples Adds**
  1. Agrega 3 productos rápidamente
  2. **Esperado:** Animación se repite cada vez

---

## ✅ 3. Quick View Modal

### Abrir Modal
- [ ] **Desde Product List**
  1. Ve a `product-list.html?category=Tents`
  2. Pasa mouse sobre un producto
  3. **Esperado:** Botón "Quick View" aparece
  4. Click en "Quick View"
  5. **Esperado:** Modal se abre con detalles del producto

### Contenido del Modal
- [ ] **Información Correcta**
  - Imagen del producto
  - Nombre del producto
  - Categoría
  - Precio (con descuento si aplica)
  - Descripción
  - Botón "Add to Cart"
  - Botón "View Details"

### Funcionalidad
- [ ] **Add to Cart desde Modal**
  1. Click en "Add to Cart"
  2. **Esperado:** 
     - Botón cambia a "✓ Added!"
     - Modal se cierra después de 1s
     - Badge del carrito se actualiza

- [ ] **Cerrar Modal**
  - Click en X: Modal se cierra
  - Presiona ESC: Modal se cierra
  - Click fuera del modal: Modal se cierra

---

## ✅ 4. Newsletter Signup

### Desde Index
- [ ] **Botón de Newsletter**
  1. Ve a `index.html`
  2. Baja hasta sección "Stay Updated"
  3. Click en "Sign Up Now"
  4. **Esperado:** Modal de newsletter se abre

### Modal de Newsletter
- [ ] **Formulario**
  1. Intenta enviar sin email
  2. **Esperado:** Error de validación
  3. Ingresa email inválido (sin @)
  4. **Esperado:** Error
  5. Ingresa email válido: `test@example.com`
  6. Click "Subscribe"
  7. **Esperado:**
     - Loading de 1 segundo
     - Mensaje "✓ Thank You!"
     - Muestra el email ingresado
     - Guarda en localStorage `newsletter-subscribed`

- [ ] **Prevención de Duplicados**
  1. Abre localStorage en DevTools
  2. Verifica que exista `newsletter-subscribed: true`
  3. Intenta suscribirte de nuevo
  4. **Esperado:** Modal funciona normalmente (no hay prevención activa, es informativo)

---

## ✅ 5. Welcome Modal (First Visit)

### Primera Visita
- [ ] **Modal Automático**
  1. Abre DevTools (F12)
  2. Application → Local Storage
  3. Elimina key `welcome-seen`
  4. Recarga `index.html`
  5. **Esperado:**
     - Espera 2 segundos
     - Modal de bienvenida aparece automáticamente

### Contenido
- [ ] **Información del Giveaway**
  - Ícono 🎁
  - Título "Welcome to SleepOutside!"
  - Información del sorteo $500
  - Lista de premios (tent, sleeping bag, backpack)
  - Botón "Register Now"
  - Botón "Maybe Later"

### Funcionalidad
- [ ] **No Mostrar de Nuevo**
  1. Cierra el modal (con X, ESC o "Maybe Later")
  2. **Esperado:** localStorage guarda `welcome-seen: true`
  3. Recarga la página
  4. **Esperado:** Modal NO aparece

- [ ] **Register Now**
  1. Click en "Register Now"
  2. **Esperado:** Abre modal de newsletter (reutiliza funcionalidad)

---

## ✅ 6. Breadcrumbs en Checkout

- [ ] **Navegación**
  1. Ve a `checkout.html`
  2. **Esperado:** Breadcrumb muestra "Home > Checkout"
  3. Click en "Home"
  4. **Esperado:** Regresa a index.html

---

## ✅ 7. Validación de Cantidad en Carrito

- [ ] **Cantidad Mínima**
  1. Agrega producto al carrito
  2. Ve a `cart.html`
  3. Cambia cantidad a `0` o negativo
  4. **Esperado:** Se resetea a `1` automáticamente

- [ ] **Actualización de Total**
  1. Cambia cantidad de un producto
  2. **Esperado:** 
     - Subtotal del producto se actualiza
     - Total general se actualiza
     - Badge del carrito se actualiza

---

## 🎯 Pruebas de Integración

### Flujo Completo de Compra
- [ ] **E2E Test**
  1. Navega a `product-list.html?category=Tents`
  2. Usa Quick View para ver un producto
  3. Agrega al carrito desde Quick View
  4. Observa animaciones del carrito
  5. Agrega 2 productos más (desde tarjetas)
  6. Ve al carrito
  7. Cambia cantidad de un producto
  8. Elimina un producto
  9. Click "Proceed to Checkout"
  10. Llena formulario con datos de prueba:
      - Nombre: John Doe
      - Dirección: 123 Main St
      - Ciudad: Salt Lake City
      - State: UT
      - ZIP: 84101
      - Tarjeta: 4111111111111111
      - Exp: 12/25
      - CVV: 123
  11. Verifica cálculos en resumen
  12. Click "Complete Order"
  13. **Esperado:** 
      - Loading overlay
      - Página de éxito
      - Orden confirmada
      - Carrito vacío

### Newsletter + Welcome Flow
- [ ] **First Visit Flow**
  1. Limpia localStorage
  2. Ve a `index.html`
  3. Espera welcome modal (2s)
  4. Click "Register Now"
  5. Ingresa email en newsletter
  6. Verifica confirmación
  7. Recarga página
  8. **Esperado:** Welcome modal NO aparece

---

## 🐛 Casos Edge

### Checkout
- [ ] **API Fallida**
  1. Desconecta internet
  2. Intenta hacer checkout
  3. **Esperado:** Error message amigable

- [ ] **Carrito modificado durante checkout**
  1. Abre checkout en pestaña 1
  2. Vacía carrito en pestaña 2
  3. Intenta enviar orden en pestaña 1
  4. **Esperado:** Detecta carrito vacío

### Modales
- [ ] **Múltiples Modales**
  1. Abre Quick View
  2. Presiona ESC rápidamente múltiples veces
  3. **Esperado:** Modal se cierra correctamente sin errores

- [ ] **Scroll Lock**
  1. Abre cualquier modal
  2. Intenta hacer scroll en la página
  3. **Esperado:** Scroll bloqueado
  4. Cierra modal
  5. **Esperado:** Scroll funciona de nuevo

### Animaciones
- [ ] **Rápido Add to Cart**
  1. Click "Add to Cart" 5 veces en 2 segundos
  2. **Esperado:** 
     - Cantidad aumenta correctamente
     - Animaciones se ejecutan cada vez
     - No hay lag ni errores

---

## 📱 Responsive Testing

### Mobile (< 768px)
- [ ] Checkout: Formulario en 1 columna
- [ ] Modales: Se ajustan al ancho de pantalla
- [ ] Newsletter: Botón y texto legibles
- [ ] Animaciones: Funcionan correctamente

### Tablet (768px - 1024px)
- [ ] Checkout: Layout se adapta
- [ ] Quick View: Imagen + info side by side

### Desktop (> 1024px)
- [ ] Checkout: 2 columnas (form + summary)
- [ ] Modales: Tamaño máximo 900px
- [ ] Todo centrado correctamente

---

## 🔍 DevTools Checks

### Console
- [ ] No hay errores en rojo
- [ ] No hay warnings críticos
- [ ] Logs informativos están presentes

### Network
- [ ] CSS/JS cargan correctamente
- [ ] API call a `/checkout` se ejecuta
- [ ] Imágenes se cargan (o fallback funciona)

### Application → Local Storage
- [ ] `so-cart`: Array de productos
- [ ] `newsletter-subscribed`: Boolean
- [ ] `welcome-seen`: Boolean

### Performance
- [ ] Lighthouse Score > 80
- [ ] Animaciones smooth (60fps)
- [ ] No memory leaks

---

## ✅ Acceptance Criteria

Para considerar la implementación completa:

- [ ] Todas las pruebas básicas pasan
- [ ] No hay errores en consola
- [ ] Validación funciona correctamente
- [ ] Animaciones son smooth
- [ ] Modales funcionan en todos los escenarios
- [ ] Responsive en todos los tamaños
- [ ] localStorage persiste datos
- [ ] Flujo E2E funciona completo

---

## 📝 Notas de Testing

### Datos de Prueba Recomendados

**Tarjetas de Prueba:**
- Visa: `4111111111111111`
- Mastercard: `5500000000000004`
- Amex: `340000000000009`

**Emails de Prueba:**
- `test@example.com`
- `john.doe@test.com`
- `user+test@domain.com`

**Direcciones de Prueba:**
- 123 Main St, Salt Lake City, UT 84101
- 456 Oak Ave, Provo, UT 84601
- 789 Pine Rd, Ogden, UT 84404

---

## 🚀 Pre-Production Checklist

Antes de deployment:
- [ ] Todas las pruebas pasan
- [ ] No hay console errors
- [ ] API endpoints verificados
- [ ] Imágenes optimizadas
- [ ] localStorage keys documentadas
- [ ] Error messages son user-friendly
- [ ] Loading states son claros
- [ ] Accesibilidad verificada (tab navigation)
- [ ] SEO meta tags presentes
- [ ] Analytics configurado (si aplica)

---

**Última actualización:** Noviembre 29, 2025  
**Versión:** 1.0  
**Testeado por:** _________________  
**Fecha de testing:** _________________
