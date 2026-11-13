import { images, type Photo } from "./images";

/**
 * CONTENIDO DEL JUEGO "SE VIENE EL ZONDA"
 * Cada día hay una misión de clima. Las prendas correctas son las que sirven para ese clima.
 */
export type ZondaItem = {
  id: string;
  name: string;
  /** Foto de una prenda de Get the fit, o un emoji para los accesorios. */
  photo?: Photo;
  emoji?: string;
};

export const zondaItems: ZondaItem[] = [
  { id: "puffer", name: "Campera puffer bordó", photo: images.fitPuffer },
  { id: "jean", name: "Jean wide leg", photo: images.fitJeanWide },
  { id: "sweater", name: "Sweater corto verde", photo: images.fitSweater },
  { id: "pollera", name: "Pollera cargo beige", photo: images.fitPollera },
  { id: "buzo", name: "Buzo crop gris", photo: images.fitBuzo },
  { id: "mini", name: "Mini de jean negra", photo: images.fitMini },
  { id: "anteojos", name: "Anteojos de sol", emoji: "🕶️" },
  { id: "gorra", name: "Gorra", emoji: "🧢" },
  { id: "bufanda", name: "Bufanda", emoji: "🧣" },
  { id: "guantes", name: "Guantes", emoji: "🧤" },
  { id: "ojotas", name: "Ojotas", emoji: "🩴" },
  { id: "botas", name: "Botas", emoji: "👢" },
];

export type ZondaMission = {
  id: string;
  title: string;
  forecast: string;
  tip: string;
  /** Prendas que sirven para el clima de la misión. */
  correct: string[];
  /** Colores del tablero según el clima. */
  sky: string;
};

export const zondaMissions: ZondaMission[] = [
  {
    id: "zonda",
    title: "Día de Zonda",
    forecast: "31° · viento caliente y seco",
    tip: "Prendas livianas y algo para el sol. Nada de abrigo.",
    correct: ["pollera", "mini", "anteojos", "gorra", "ojotas"],
    sky: "from-[#e8c9a0] via-[#dcae7d] to-[#c98f5c]",
  },
  {
    id: "helada",
    title: "Mañana helada",
    forecast: "3° · cielo despejado y frío seco",
    tip: "Abrigo y capas. Lo de verano queda en el placard.",
    correct: ["puffer", "sweater", "jean", "bufanda", "guantes", "botas"],
    sky: "from-[#cfd9e3] via-[#b7c6d4] to-[#9eb1c3]",
  },
  {
    id: "amplitud",
    title: "Amplitud térmica",
    forecast: "8° a la mañana · 25° a la tarde",
    tip: "Capas que se sacan fácil: base liviana y algo para el frío de la mañana.",
    correct: ["buzo", "jean", "sweater", "gorra", "anteojos"],
    sky: "from-[#dfe4ea] via-[#e9d9c3] to-[#d9b892]",
  },
];

/** La misión cambia todos los días. */
export function missionOfTheDay(date = new Date()): ZondaMission {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return zondaMissions[day % zondaMissions.length];
}

export const TARGET = 3; // prendas correctas para ganar
export const LIVES = 3; // errores permitidos
export const ROUND_SECONDS = 30;
