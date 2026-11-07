# Zephyr Clothing — rediseño one-page

Rediseño académico no oficial de la web de **Zephyr Clothing**, marca de ropa urbana de mujer de Mendoza, Argentina.
Instagram oficial: https://www.instagram.com/zephyr_clothingmdz/
Hecho con **Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript**.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
npm run export   # versión estática en /out (para hostear en cualquier lado)
```

## Desplegar

- **Vercel:** subí la carpeta a un repo de GitHub → "Add New Project" en Vercel → importar. No necesita configuración.
- **v0:** importá el repo de GitHub desde v0 (o subí el .zip). Es un proyecto Next.js estándar.

## Estructura

```
app/
  layout.tsx        metadatos, idioma es-AR, link "Saltar al contenido"
  page.tsx          orden de las secciones
  globals.css       paleta, tipografía, textura de grano, animación, movimiento reducido
components/
  SiteHeader.tsx    header sticky + menú hamburguesa mobile (foco atrapado, Escape)
  Hero.tsx          composición fotográfica + wordmark gigante con entrada "ráfaga"
  GetTheFit.tsx     selector de prendas (desktop) / carrusel deslizable (mobile)
  NewDrops.tsx      collage editorial asimétrico de outfits
  Identity.tsx      sección Nosotros + símbolo gráfico del viento
  Closing.tsx       cierre / contacto con CTA a la tienda
  SiteFooter.tsx
  ui/ButtonLink.tsx enlaces con forma de botón (internos o externos)
  ui/Photo.tsx      wrapper de next/image para fotos locales o remotas
content/
  images.ts         ← TODAS LAS FOTOS (cambiar acá)
  products.ts       ← prendas de GET THE FIT
  looks.ts          ← outfits de NEW DROPS y su posición en el collage
  site.ts           ← URL de la tienda, Instagram y menú
```

## Reemplazar fotos

Editá `content/images.ts`. Cada foto tiene `src`, `alt` y un `focus` opcional (encuadre).

- **Foto local:** guardala en `public/images/` y usá `src: "/images/archivo.webp"`.
- **Foto de Pinterest:** clic derecho sobre la imagen → "Copiar dirección de imagen" y pegá la URL
  (`https://i.pinimg.com/...`). El dominio ya está habilitado en `next.config.ts`.
- Para otro dominio, agregalo en `next.config.ts` → `images.remotePatterns`.

## Productos reales

En `content/products.ts` cambiá `name`, `image` y `href` por la URL de cada producto en
zephyrclothing.com.ar. A propósito no hay precios ni talles: se consultan en la tienda oficial.

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| paper | `#ECECEA` | fondo base (gris hormigón, no beige) |
| ink | `#000000` | texto, NEW DROPS, footer |
| bordo | `#6E0F1F` | acento: cierre, foco, detalles |
| concrete | `#B9BAB6` | texto secundario sobre negro |
| steel | `#555653` | texto secundario sobre claro |

Tipografía: **Archivo** variable (una sola familia) usando su eje de ancho: condensada al 62% y
peso 900 para titulares; ancho normal para lectura. Se sirve desde npm (`@fontsource-variable/archivo`),
sin depender de Google Fonts.

Concepto gráfico: *Zephyr* es el nombre del viento del oeste. El wordmark del hero entra como una
ráfaga (del ancho expandido al condensado) y un símbolo de tres trazos se repite en el hero, en
Nosotros y en el cierre.

## Accesibilidad y movimiento

- HTML semántico con secciones etiquetadas, `lang="es-AR"` y link para saltar al contenido.
- Foco visible en bordó (blanco sobre fondos oscuros).
- Botones y enlaces con altura táctil mínima de 44–48 px.
- `prefers-reduced-motion`: desactiva animaciones, transiciones y scroll suave.
- Los enlaces externos avisan que abren pestaña nueva (texto para lectores de pantalla).

## Créditos de fotos (provisionales)

Fotos tomadas de repositorios públicos de GitHub solo como material de demostración:

- `FedeHide/attire-ecommerce-app`: fotos de estudio (prendas de GET THE FIT, looks y Nosotros).
- `mauropineyro/nomadastoreba`: fotos de calle (hero y looks).
- `akshaysanil/Under-Town`: foto de calle (look "Recreo").
- `IBsai2112/MOVAA-Clothing-Brand` (plantilla de moda en React): foto secundaria del hero.

No son fotos ni productos de Zephyr. Reemplazalas por material propio o con permiso antes de
publicar el sitio.
