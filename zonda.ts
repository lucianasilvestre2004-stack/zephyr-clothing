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
  /** Temperatura grande para la tarjeta de clima. */
  temp: string;
  /** Colores del tablero según el clima. */
  sky: string;
  sun: string;
  mountainFar: string;
  mountainNear: string;
};

export const zondaMissions: ZondaMission[] = [
  {
    id: "zonda",
    title: "Día de Zonda",
    forecast: "31° · viento caliente y seco",
    tip: "Prendas livianas y algo para el sol. Nada de abrigo.",
    correct: ["pollera", "mini", "anteojos", "gorra", "ojotas"],
    temp: "31°",
    sky: "from-[#f3d9b1] via-[#e6b47e] to-[#c9824f]",
    sun: "#fff1c9",
    mountainFar: "#b9765a",
    mountainNear: "#7d4433",
  },
  {
    id: "helada",
    title: "Mañana helada",
    forecast: "3° · cielo despejado y frío seco",
    tip: "Abrigo y capas. Lo de verano queda en el placard.",
    correct: ["puffer", "sweater", "jean", "bufanda", "guantes", "botas"],
    temp: "3°",
    sky: "from-[#e6eef5] via-[#c3d3e2] to-[#9fb4c9]",
    sun: "#ffffff",
    mountainFar: "#8fa3b8",
    mountainNear: "#4f6377",
  },
  {
    id: "amplitud",
    title: "Amplitud térmica",
    forecast: "8° a la mañana · 25° a la tarde",
    tip: "Capas que se sacan fácil: base liviana y algo para el frío de la mañana.",
    correct: ["buzo", "jean", "sweater", "gorra", "anteojos"],
    temp: "8° → 25°",
    sky: "from-[#dbe5ee] via-[#efdcc2] to-[#dcae7f]",
    sun: "#fff6dc",
    mountainFar: "#a58a7c",
    mountainNear: "#5e4a45",
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
