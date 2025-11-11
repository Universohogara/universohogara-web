
# 🎨 GUÍA DE IDENTIDAD VISUAL - HOGARA PLANNER

## 📁 Ubicación de tus Logotipos

Todos tus logotipos están guardados en:
```
/home/ubuntu/hogara_planner/nextjs_space/public/images/
```

### Archivos de Logotipos:
1. **hogara-logo-main.png** - Logo principal completo (usado en header)
2. **hogara-seal-main.png** - Sello circular con "HOGARA HP PLANNER" pastel (usado en footer)
3. **hogara-seal-gold.png** - Sello circular dorado (recurso adicional)
4. **hogara-logo-h.png** - Logo simple "H" con arcoíris (recurso adicional)

### Favicon:
- **favicon.ico** - Icono de pestaña del navegador
- **favicon.png** - Favicon PNG (192x192)
- **apple-touch-icon.png** - Icono para dispositivos Apple

---

## 🔧 CÓMO EDITAR LOS LOGOTIPOS

### Cambiar el Logo del Header (Cabecera):
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/components/layout/header.tsx`

```tsx
// Línea 61-69
<div className="relative h-12 w-40 md:h-14 md:w-48">
  <Image
    src="/images/hogara-logo-main.png"  // ← Cambia aquí
    alt="Hogara Planner"
    fill
    className="object-contain object-left transition-all duration-300 group-hover:brightness-110"
    priority
  />
</div>
```

**Para cambiar:**
1. Reemplaza el archivo `/public/images/hogara-logo-main.png` con tu nuevo logo
2. O cambia la ruta `src="/images/tu-nuevo-logo.png"`

**Ajustar tamaño:** Modifica `h-12 w-40` (móvil) y `md:h-14 md:w-48` (desktop)

---

### Cambiar el Sello del Footer:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/components/layout/footer.tsx`

```tsx
// Línea 17-23
<div className="relative h-16 w-16">
  <Image
    src="/images/hogara-seal-main.png"  // ← Cambia aquí
    alt="Hogara Planner Sello"
    fill
    className="object-contain transition-all duration-300 group-hover:scale-105"
  />
</div>
```

**Para cambiar:**
1. Reemplaza el archivo `/public/images/hogara-seal-main.png`
2. O usa otro sello: `/images/hogara-seal-gold.png`

**Ajustar tamaño:** Modifica `h-16 w-16`

---

### Cambiar el Favicon (Icono del Navegador):

**Opción 1: Usando un nuevo sello**
```bash
cd /home/ubuntu/hogara_planner/nextjs_space/public
convert images/TU-NUEVO-SELLO.png -resize 32x32 favicon.ico
```

**Opción 2: Reemplazar directamente**
Simplemente reemplaza estos archivos:
- `/public/favicon.ico`
- `/public/favicon.png`
- `/public/apple-touch-icon.png`

---

## 🎨 PALETA DE COLORES HOGARA

### Archivo de Variables CSS:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/styles/tokens.css`

### Colores Actuales:
```css
:root {
  /* COLORES PRINCIPALES */
  --hogara-pink: #F7DCEB;           /* Rosa empolvado */
  --hogara-turquoise: #CFEFF3;      /* Turquesa suave */
  --hogara-cream: #FFF7F0;          /* Crema cálido */
  --hogara-gray: #6E6E6E;           /* Texto gris cálido */
  
  /* COLORES SECUNDARIOS - MAGIA SUTIL */
  --hogara-gold: #D4AF37;           /* Dorado sutil */
  --hogara-gold-light: #F4E8C1;     /* Dorado muy claro */
  --hogara-lavender: #E8E0F5;       /* Lavanda suave */
  --hogara-mint: #D5F2E3;           /* Menta pastel */
  --hogara-peach: #F9E5D3;          /* Melocotón suave */
}
```

### Para Cambiar Colores:
1. Abre `/home/ubuntu/hogara_planner/nextjs_space/styles/tokens.css`
2. Modifica los valores hexadecimales (ej: `#F7DCEB` → `#TU_COLOR`)
3. Guarda el archivo
4. Los cambios se aplicarán automáticamente en toda la web

---

## ✨ FRASE MÁGICA "Bienvenida a tu mundo de magia y calma"

### Ubicación:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/components/home/hero-section.tsx`

```tsx
// Línea 46-53
<motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}  // ← Velocidad aquí
  className="magic-text-hogara text-center"
>
  Bienvenida a tu mundo de magia y calma  // ← Texto aquí
</motion.h1>
```

### Personalización de la Animación:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/app/globals.css`

```css
/* Línea 269-293 */
.magic-text-hogara {
  font-family: var(--font-heading);
  font-weight: 600;                    /* ← Grosor de letras */
  font-size: var(--text-3xl);
  letter-spacing: 0.02em;              /* ← Espaciado entre letras */
  line-height: 1.3;
  background: linear-gradient(
    90deg,
    #6E6E6E 0%,
    #D4AF37 15%,
    #F7DCEB 30%,
    #CFEFF3 45%,
    #FFF7F0 60%,
    #F7DCEB 75%,
    #D4AF37 85%,
    #6E6E6E 100%
  );                                   /* ← Gradiente arcoíris */
  animation: magic-shimmer 8s ease-in-out infinite;  /* ← Velocidad: 8s */
}

@keyframes magic-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Ajustes Rápidos:
- **Más lenta:** Cambia `8s` a `10s` o `12s`
- **Más rápida:** Cambia `8s` a `5s` o `6s`
- **Más definida:** Aumenta `font-weight: 700` o `800`
- **Más espaciada:** Aumenta `letter-spacing: 0.04em`

---

## 🖼️ TIPOGRAFÍAS

### Ubicación:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/app/globals.css`

```css
/* Línea 1-3 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
```

### Fuentes Actuales:
- **Textos:** Inter (sans-serif moderna y legible)
- **Títulos:** Playfair Display (serif elegante)

### Variables:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/styles/tokens.css`

```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Playfair Display', Georgia, serif;
  
  /* Tamaños de fuente */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
}
```

### Para Cambiar Fuentes:
1. Busca tu fuente en [Google Fonts](https://fonts.google.com)
2. Copia el código de importación
3. Pégalo en `/app/globals.css` (línea 1-3)
4. Actualiza las variables en `/styles/tokens.css`:
   ```css
   --font-primary: 'TU_FUENTE', sans-serif;
   --font-heading: 'TU_FUENTE_TITULOS', serif;
   ```

---

## 📐 ESPACIADOS Y TAMAÑOS

### Variables de Espaciado:
**Archivo:** `/home/ubuntu/hogara_planner/nextjs_space/styles/tokens.css`

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Border Radius (Esquinas redondeadas):
```css
:root {
  --radius-sm: 0.125rem;     /* 2px */
  --radius-default: 0.25rem; /* 4px */
  --radius-lg: 0.5rem;       /* 8px */
  --radius-xl: 0.75rem;      /* 12px */
  --radius-2xl: 1rem;        /* 16px */
  --radius-full: 9999px;     /* Círculo */
}
```

---

## 🎯 RECURSOS ADICIONALES DISPONIBLES

Tienes estos logotipos adicionales guardados para uso futuro:

1. **hogara-logo-h.png** - Logo simple "H" con arcoíris
   - Ideal para: favicon alternativo, watermark, elementos decorativos

2. **hogara-seal-gold.png** - Sello circular con acabado dorado
   - Ideal para: elementos premium, certificados, distintivos especiales

### Cómo usarlos:
Simplemente reemplaza la ruta en cualquier componente:
```tsx
<Image src="/images/hogara-logo-h.png" alt="..." />
```

---

## 🛠️ HERRAMIENTAS ÚTILES

### Editar archivos:
```bash
# Editar colores
nano /home/ubuntu/hogara_planner/nextjs_space/styles/tokens.css

# Editar header
nano /home/ubuntu/hogara_planner/nextjs_space/components/layout/header.tsx

# Editar footer
nano /home/ubuntu/hogara_planner/nextjs_space/components/layout/footer.tsx

# Editar frase mágica
nano /home/ubuntu/hogara_planner/nextjs_space/components/home/hero-section.tsx
```

### Reiniciar el servidor después de cambios:
```bash
cd /home/ubuntu/hogara_planner/nextjs_space
yarn dev
```

---

## 📝 RESUMEN RÁPIDO

✅ **Logos aplicados:**
- Header: Logo principal completo con arcoíris
- Footer: Sello circular "HOGARA HP PLANNER"
- Favicon: Generado desde tu sello

✅ **Estilo visual:**
- Paleta: Rosa pastel + arcoíris sutil + dorado
- Frase mágica: Animación lenta (8s) con colores arcoíris
- Letras más definidas (font-weight: 600)
- Letter-spacing mejorado para legibilidad

✅ **Todo editable:**
- Colores: `/styles/tokens.css`
- Logotipos: Archivos en `/public/images/`
- Tipografías: `/app/globals.css`
- Componentes: Carpeta `/components/`

---

## 🎨 PALETA DE COLORES PARA REFERENCIA

```
Rosa Empolvado:    #F7DCEB  █████
Turquesa Suave:    #CFEFF3  █████
Crema Cálido:      #FFF7F0  █████
Gris Cálido:       #6E6E6E  █████
Dorado Sutil:      #D4AF37  █████
Dorado Claro:      #F4E8C1  █████
Lavanda Suave:     #E8E0F5  █████
Menta Pastel:      #D5F2E3  █████
Melocotón Suave:   #F9E5D3  █████
```

---

**¿Necesitas ayuda?** Todos los archivos están comentados para facilitar la edición. Busca los comentarios con `// ←` para encontrar rápidamente qué modificar.

