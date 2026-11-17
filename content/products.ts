import { images, type Photo } from "./images";
import { STORE_URL } from "./site";

/**
 * PRENDAS DE DEMOSTRACIÓN para GET THE FIT.
 * No tienen precio ni talles a propósito: esa información vive en la tienda oficial.
 * Cuando tengas los productos reales, cambiá `name`, `image` y `href`
 * (la URL del producto en zephyrclothing.com.ar).
 */
export type Product = {
  id: string;
  name: string;
  category: string;
  note: string;
  image: Photo;
  /** Precio en pesos argentinos (referencia). */
  price?: number;
  /** Talles disponibles. */
  sizes?: string[];
  href: string;
  /** ids de otras prendas con las que se arma el outfit */
  pairsWith: string[];
};

export const products: Product[] = [
  {
    id: "puffer-bordo",
    name: "Campera puffer bordó",
    category: "Camperas",
    note: "Abrigada y corta, con capucha. El color que levanta cualquier outfit.",
    image: images.fitPuffer,
    price: 70000,
    sizes: ["S", "M", "L"],
    href: STORE_URL,
    pairsWith: ["jean-wide", "buzo-gris"],
  },
  {
    id: "jean-wide",
    name: "Jean wide leg",
    category: "Denim",
    note: "Pierna ancha y tiro medio. La base de todos los días.",
    image: images.fitJeanWide,
    price: 50000,
    sizes: ["34", "36", "38", "40", "42"],
    href: STORE_URL,
    pairsWith: ["sweater-verde", "puffer-bordo"],
  },
  {
    id: "sweater-verde",
    name: "Sweater corto verde",
    category: "Sweaters",
    note: "Lanilla suave y largo al ombligo. Ideal con jeans de tiro bajo.",
    image: images.fitSweater,
    href: STORE_URL,
    pairsWith: ["jean-wide", "mini-negra"],
  },
  {
    id: "pollera-cargo",
    name: "Pollera cargo beige",
    category: "Polleras",
    note: "Gabardina con bolsillos y cordón. Va con borcegos o zapatillas.",
    image: images.fitPollera,
    price: 45000,
    sizes: ["36", "38", "40"],
    href: STORE_URL,
    pairsWith: ["buzo-gris", "puffer-bordo"],
  },
  {
    id: "buzo-gris",
    name: "Buzo crop gris",
    category: "Buzos",
    note: "Básico de cuello redondo para usar solo o debajo de una campera.",
    image: images.fitBuzo,
    href: STORE_URL,
    pairsWith: ["pollera-cargo", "jean-wide"],
  },
  {
    id: "mini-negra",
    name: "Mini de jean negra",
    category: "Polleras",
    note: "Tablas y ruedo desflecado. Con medias negras para el invierno.",
    image: images.fitMini,
    price: 35000,
    sizes: ["34", "36", "38"],
    href: STORE_URL,
    pairsWith: ["sweater-verde", "puffer-bordo"],
  },
];

/**
 * PRENDAS DE NEW DROPS (misma dinámica que Get the fit: se tocan, se ven en detalle y van al carrito).
 * `drop` indica qué foto del collage corresponde a cada prenda.
 */
export const dropProducts: Product[] = [
  {
    id: "remera-baby-tee",
    name: "Remera baby tee blanca",
    category: "Remeras",
    note: "Corta, al cuerpo y de algodón con lycra. La base de cualquier look de calle.",
    image: images.drops1,
    price: 22000,
    sizes: ["S", "M", "L"],
    href: STORE_URL,
    pairsWith: ["jean-wide", "campera-cuero-negra"],
  },
  {
    id: "campera-cuero-negra",
    name: "Campera de cuero negra",
    category: "Camperas",
    note: "Ecocuero con cuello alto y puños elastizados. Oversize para usar con jeans anchos.",
    image: images.drops2,
    price: 85000,
    sizes: ["S", "M", "L"],
    href: STORE_URL,
    pairsWith: ["remera-baby-tee", "jean-wide"],
  },
  {
    id: "blazer-camel",
    name: "Blazer oversize camel",
    category: "Sacos",
    note: "Paño suave, hombros marcados y largo a la cadera. Suma estilo a una remera y un jean.",
    image: images.drops3,
    price: 78000,
    sizes: ["S", "M", "L"],
    href: STORE_URL,
    pairsWith: ["remera-baby-tee", "jean-wide"],
  },
  {
    id: "mini-gabardina",
    name: "Mini de gabardina beige",
    category: "Polleras",
    note: "Tiro medio con cinto y bolsillos. Ideal con botas altas y una campera corta.",
    image: images.drops4,
    price: 38000,
    sizes: ["34", "36", "38", "40"],
    href: STORE_URL,
    pairsWith: ["campera-cuero-negra", "tapado-marron"],
  },
  {
    id: "tapado-marron",
    name: "Tapado largo marrón",
    category: "Abrigos",
    note: "Largo al tobillo y de solapas anchas. El abrigo que transforma cualquier outfit en invierno.",
    image: images.dropsGrande,
    price: 120000,
    sizes: ["S", "M", "L"],
    href: STORE_URL,
    pairsWith: ["remera-baby-tee", "mini-gabardina"],
  },
];

/** Todas las prendas de la tienda (para el buscador, el carrito y la vista de producto). */
export const allProducts: Product[] = [...products, ...dropProducts];
