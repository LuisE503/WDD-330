# 🎯 Guía de Prueba - Nuevas Funcionalidades

## Instrucciones de Prueba Rápida (10 minutos)

---

## ✅ 1. Welcome Modal

**Tiempo:** 30 segundos

### Pasos:
1. Abre `index.html` en tu navegador
2. Espera 2 segundos
3. **Verás:** Modal de bienvenida automático con sorteo de $500

### Para probar de nuevo:
```javascript
// En la consola del navegador (F12):
localStorage.removeItem('welcome-seen');
location.reload();
```

---

## ✅ 2. Newsletter Signup

**Tiempo:** 1 minuto

### Pasos:
1. En `index.html`, desplázate hasta "Stay Updated"
2. Click en "Sign Up Now"
3. Modal de newsletter aparece
4. Ingresa tu email: `test@example.com`
5. Click "Subscribe"
6. **Verás:** Mensaje de confirmación

---

## ✅ 3. Quick View de Productos

**Tiempo:** 1 minuto

### Pasos:
1. Ve a `product-list.html?category=Tents`
2. Pasa el mouse sobre cualquier producto
3. Aparece botón "Quick View"
4. Click en "Quick View"
5. **Verás:** Modal con detalles del producto
6. Click "Add to Cart" dentro del modal
7. Modal se cierra automáticamente después de 1 segundo
8. **Verás:** Badge del carrito se actualiza

---

## ✅ 4. Animaciones del Carrito

**Tiempo:** 30 segundos

### Pasos:
1. Desde cualquier lista de productos
2. Click "Add to Cart" en cualquier producto
3. **Verás:** 
   - Icono del carrito hace "bounce" (escala + rotación)
   - Badge numérico hace "pulse" (escala + color)
   - Duración: 600ms

### Probar múltiples veces:
```
Agrega 3 productos consecutivos y observa 
que la animación se repite cada vez
```

---

## ✅ 5. Sistema de Checkout

**Tiempo:** 3 minutos

### 5.1. Preparación
1. Agrega 2-3 productos al carrito
2. Ve a `cart.html`
3. Click "Proceed to Checkout"

### 5.2. Validación de Carrito Vacío
**Prueba alternativa:**
1. Vacía el carrito
2. Navega directamente a `checkout.html`
3. **Verás:** Mensaje "Your Cart is Empty" con botón "Continue Shopping"

### 5.3. Llenar Formulario

**Usa estos datos de prueba:**

```
Shipping Information:
--------------------
First Name:      John
Last Name:       Doe
Street Address:  123 Main St
City:            Salt Lake City
State:           UT
ZIP:             84101

Payment Information:
-------------------
Card Number:     4111111111111111
Expiration:      12/25
Security Code:   123
```

### 5.4. Probar Validaciones

**Intenta estos escenarios:**

1. **Enviar formulario vacío**
   - Click "Complete Order" sin llenar nada
   - **Verás:** Errores en todos los campos requeridos

2. **Validación de tarjeta**
   - Ingresa letras: `abcd1234`
   - **Verás:** Solo acepta números
   - Ingresa números incompletos: `4111`
   - **Verás:** Requiere 16 dígitos

3. **Validación de fecha**
   - Ingresa: `1220` (fecha pasada)
   - **Verás:** Error "Card has expired"
   - Ingresa: `1225`
   - **Verás:** Auto-formato a "12/25" ✓

4. **Validación de ZIP**
   - Ingresa: `841`
   - **Verás:** Requiere 5 dígitos
   - Ingresa: `84101`
   - **Verás:** Válido ✓

5. **Validación de State**
   - Ingresa: `utah`
   - **Verás:** Auto-convierte a "UT"

### 5.5. Verificar Cálculos

En el resumen de orden (sidebar derecho):
```
Subtotal:  Suma de (precio × cantidad)
Shipping:  $10.00 (flat rate)
Tax:       7% del subtotal
Total:     Subtotal + Shipping + Tax
```

### 5.6. Completar Orden

1. Click "Complete Order"
2. **Verás:** Loading overlay con spinner
3. Espera 2 segundos (simulación de API)
4. **Verás:** Página de confirmación
5. Muestra número de orden
6. Carrito se vacía automáticamente

---

## 🧪 Comandos de Consola Útiles

### Ver contenido del carrito
```javascript
console.log(JSON.parse(localStorage.getItem('so-cart')));
```

### Vaciar carrito
```javascript
localStorage.removeItem('so-cart');
location.reload();
```

### Reset welcome modal
```javascript
localStorage.removeItem('welcome-seen');
location.reload();
```

### Ver todos los datos guardados
```javascript
console.table({
  cart: localStorage.getItem('so-cart'),
  newsletter: localStorage.getItem('newsletter-subscribed'),
  welcome: localStorage.getItem('welcome-seen')
});
```

---

## 📱 Pruebas Responsive

### Móvil (< 768px)
```
F12 → Toggle Device Toolbar → iPhone 12 Pro
- Checkout: 1 columna
- Modales: Ancho completo
- Animaciones: Funcionan
```

### Tablet (768px - 1024px)
```
F12 → Toggle Device Toolbar → iPad
- Checkout: Layout adaptado
- Quick View: 2 columnas
```

### Desktop (> 1024px)
```
F12 → Toggle Device Toolbar → Responsive (1440px)
- Checkout: 2 columnas (form + summary)
- Modales: Max-width 900px centrado
```

---

## ✅ Checklist de Verificación Rápida

Marca cada item después de probarlo:

```
□ Welcome modal aparece automáticamente en index.html
□ Newsletter signup funciona y muestra confirmación
□ Quick View abre modal con detalles del producto
□ Add to Cart desde Quick View funciona
□ Animaciones del carrito se ven smooth (bounce + pulse)
□ Checkout valida campos vacíos
□ Checkout valida formato de tarjeta
□ Checkout valida fecha de expiración
□ Checkout valida CVV (3 dígitos)
□ Checkout valida ZIP (5 dígitos)
□ Checkout auto-formatea State a mayúsculas
□ Checkout calcula totales correctamente
□ Checkout muestra loading al enviar
□ Checkout muestra página de confirmación
□ Carrito se vacía después de checkout exitoso
□ No hay errores en consola (F12)
```

---

## 🎓 Script de Demostración (5 minutos)

### Para presentar al profesor:

**Minuto 1:**
```
1. Abre index.html
2. Muestra welcome modal (espera 2s)
3. Cierra y abre newsletter
4. Suscribe con email
```

**Minuto 2:**
```
5. Ve a product-list.html?category=Tents
6. Hover sobre producto → Quick View
7. Add to Cart desde modal
8. Muestra animaciones del carrito
```

**Minuto 3:**
```
9. Ve a cart.html
10. Click "Proceed to Checkout"
11. Muestra layout (form + summary)
12. Intenta enviar vacío → errores
```

**Minuto 4:**
```
13. Llena formulario con datos de prueba
14. Muestra validación en tiempo real
15. Muestra auto-formato de inputs
16. Verifica cálculo de totales
```

**Minuto 5:**
```
17. Click "Complete Order"
18. Muestra loading
19. Muestra confirmación
20. Verifica carrito vacío
```

---

## 🐛 Troubleshooting

### ❌ Modal no aparece
```javascript
// Verifica en consola:
console.log(document.querySelector('link[href*="modal.css"]'));
// Debe mostrar el elemento <link>
```

### ❌ Animaciones no se ven
```javascript
// Verifica en consola:
const cart = document.querySelector('.cart-link');
console.log(getComputedStyle(cart).animationName);
// Debe mostrar "cartBounce" cuando se agrega al carrito
```

### ❌ Checkout muestra "Cart is empty"
```
Agrega productos primero desde product-list.html
```

---

## 📊 Datos de Prueba - Copiar y Pegar

### Tarjeta Visa
```
4111111111111111
```

### Fecha de Expiración
```
12/25
```

### CVV
```
123
```

### Dirección Completa
```
John Doe
123 Main St
Salt Lake City
UT
84101
```

### Email
```
test@example.com
```

---

## 📚 Documentación Completa

Para más detalles, consulta:

- **NUEVAS-FUNCIONALIDADES.md** → Detalles técnicos de implementación
- **TEST-CHECKLIST.md** → Casos de prueba exhaustivos (50+)
- **RESUMEN-FINAL.md** → Resumen ejecutivo del proyecto

---

## 🎉 ¡Todo Listo!

Si todos los checkboxes están marcados y no hay errores en consola:

**✅ El proyecto está funcionando correctamente**

Tiempo total de prueba: ~10 minutos  
Complejidad: ⭐⭐ (Fácil)
