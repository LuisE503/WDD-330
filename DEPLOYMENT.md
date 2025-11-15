# 🚀 GitHub Pages Deployment Guide

## ✅ Sistema de Rutas Dinámicas Implementado

Este proyecto ahora detecta automáticamente si está corriendo en **desarrollo local** o en **GitHub Pages** y ajusta las rutas según corresponda.

---

## 📋 Cambios Aplicados

### Archivos Modificados:
- ✅ `src/js/utils.js` - Agregadas funciones `getBasePath()` y `resolvePath()`
- ✅ `src/js/header.js` - Actualizado para usar rutas dinámicas
- ✅ `src/js/products.js` - Actualizado para usar rutas dinámicas
- ✅ `src/js/breadcrumbs.js` - Actualizado para usar rutas dinámicas
- ✅ `index.html` - Fix de links de categorías

### Archivos Nuevos:
- ✅ `.nojekyll` - Previene procesamiento Jekyll en GitHub Pages

---

## 🔧 Cómo Funciona

### Detección Automática:
```javascript
// En LOCAL (Live Server):
resolvePath('index.html') → 'index.html'
resolvePath('product-list.html?category=Tents') → 'product-list.html?category=Tents'

// En GITHUB PAGES:
resolvePath('index.html') → '/WDD-330/index.html'
resolvePath('product-list.html?category=Tents') → '/WDD-330/product-list.html?category=Tents'
```

La función detecta si la URL contiene `/WDD-330/` y ajusta automáticamente.

---

## 📤 Pasos para Deploy en GitHub Pages

### 1. Commit los Cambios:
```bash
git add .
git commit -m "Fix: Dynamic routes for GitHub Pages compatibility"
```

### 2. Push al Repositorio:
```bash
git push origin main
```

### 3. Configurar GitHub Pages (Si aún no está configurado):
1. Ve a tu repositorio en GitHub: https://github.com/LuisE503/WDD-330
2. Click en **Settings** (⚙️)
3. Click en **Pages** en el menú lateral
4. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### 4. Esperar el Deploy:
- GitHub Pages tarda **1-2 minutos** en compilar y publicar
- Verás un mensaje: "Your site is live at https://luise503.github.io/WDD-330/"

---

## 🌐 URLs del Sitio

### GitHub Pages (Producción):
- **Home**: https://luise503.github.io/WDD-330/
- **Tents**: https://luise503.github.io/WDD-330/product-list.html?category=Tents
- **Backpacks**: https://luise503.github.io/WDD-330/product-list.html?category=Backpacks
- **Cart**: https://luise503.github.io/WDD-330/cart.html

### Local (Desarrollo):
- **Home**: http://127.0.0.1:5500/index.html
- **Tents**: http://127.0.0.1:5500/product-list.html?category=Tents
- **Backpacks**: http://127.0.0.1:5500/product-list.html?category=Backpacks
- **Cart**: http://127.0.0.1:5500/cart.html

---

## 🧪 Testing

### Antes de Push (Local):
1. Abre Live Server en VS Code
2. Navega a todas las páginas
3. Verifica que:
   - ✅ Logo va a home
   - ✅ Links de categorías funcionan
   - ✅ Add to Cart funciona
   - ✅ Carrito muestra productos

### Después de Deploy (GitHub Pages):
1. Espera 2 minutos después del push
2. Visita: https://luise503.github.io/WDD-330/
3. Verifica lo mismo:
   - ✅ Logo va a home
   - ✅ Links de categorías funcionan (NO 404!)
   - ✅ Add to Cart funciona
   - ✅ Carrito muestra productos

---

## 🐛 Troubleshooting

### Problema: Sigo viendo 404 en GitHub Pages
**Solución:**
1. Limpia el caché del navegador (Ctrl + Shift + R)
2. Espera 5 minutos para que se propague el deploy
3. Verifica que el push se hizo correctamente: `git log`

### Problema: CSS no carga en GitHub Pages
**Solución:**
- Los archivos CSS están en `/src/css/` y usan rutas relativas
- Deberían cargar automáticamente
- Si no cargan, verifica la consola del navegador

### Problema: JavaScript no funciona
**Solución:**
1. Abre DevTools (F12)
2. Ve a Console
3. Mira si hay errores de CORS o módulos
4. Verifica que `.nojekyll` existe en la raíz

---

## ✅ Checklist Pre-Deploy

Antes de hacer push, verifica:

- [ ] `getBasePath()` está en `src/js/utils.js`
- [ ] `resolvePath()` está en `src/js/utils.js`
- [ ] `header.js` importa y usa `resolvePath()`
- [ ] `products.js` importa y usa `resolvePath()`
- [ ] `breadcrumbs.js` importa y usa `resolvePath()`
- [ ] `.nojekyll` existe en la raíz
- [ ] Funciona en local con Live Server
- [ ] No hay errores en la consola

---

## 📞 Soporte

Si después del deploy sigues viendo errores 404:

1. **Verifica la URL**: Debe incluir `/WDD-330/`
2. **Revisa GitHub Actions**: Ve a la pestaña "Actions" en tu repo
3. **Mira los logs**: Busca errores en el deploy
4. **Force refresh**: Ctrl + Shift + R en el navegador

---

## 🎉 ¡Éxito!

Una vez que veas el sitio funcionando en GitHub Pages sin errores 404:

✅ **El sistema de rutas dinámicas está funcionando correctamente**
✅ **Puedes desarrollar localmente sin problemas**
✅ **GitHub Pages muestra todo correctamente**

---

**Última actualización**: 15 de Noviembre, 2025
