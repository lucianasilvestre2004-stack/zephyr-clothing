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
    href: STORE_URL,
    pairsWith: ["jean-wide", "buzo-gris"],
  },
  {
    id: "jean-wide",
    name: "Jean wide leg",
    category: "Denim",
    note: "Pierna ancha y tiro medio. La base de todos los días.",
    image: images.fitJeanWide,
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
    href: STORE_URL,
    pairsWith: ["sweater-verde", "puffer-bordo"],
  },
];
