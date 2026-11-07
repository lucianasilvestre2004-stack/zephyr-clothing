import { images, type Photo } from "./images";

/**
 * LOOKS de NEW DROPS (inspiración de outfits).
 * `layout` controla la posición de cada foto en el collage:
 *   - mobile: grilla de 6 columnas
 *   - desktop (lg): grilla de 12 columnas con desplazamientos verticales
 */
export type Look = {
  id: string;
  title: string;
  outfit: string;
  image: Photo;
  layout: string;
  ratio: string;
};

export const looks: Look[] = [
  {
    id: "domingo",
    title: "Domingo",
    outfit: "Vestido largo, campera de jean atada y borcegos.",
    image: images.lookDomingo,
    layout: "col-span-6 lg:col-span-5 lg:col-start-1",
    ratio: "aspect-[4/5] lg:aspect-[3/4]",
  },
  {
    id: "pared",
    title: "Recreo",
    outfit: "Campera de jean clara y mochila al hombro.",
    image: images.lookPared,
    layout: "col-span-3 lg:col-span-3 lg:col-start-7 lg:mt-40",
    ratio: "aspect-[3/4] lg:aspect-square",
  },
  {
    id: "cuadros",
    title: "Cuadros",
    outfit: "Saco corto y mini escocesa, el conjunto que se nota.",
    image: images.lookCuadros,
    layout: "col-span-3 mt-16 lg:mt-0 lg:col-span-3 lg:col-start-10",
    ratio: "aspect-[2/3]",
  },
  {
    id: "plaza",
    title: "Plaza",
    outfit: "Remera estampada, calza biker y campera de jean.",
    image: images.lookPlaza,
    layout: "col-span-3 lg:col-span-3 lg:col-start-2 lg:mt-16",
    ratio: "aspect-[3/4] lg:aspect-[2/3]",
  },
  {
    id: "rosa",
    title: "Rosa",
    outfit: "Puffer rosa sobre jean estampado.",
    image: images.lookRosa,
    layout: "col-span-3 mt-16 lg:col-span-4 lg:col-start-6 lg:mt-24",
    ratio: "aspect-[3/4] lg:aspect-[4/5]",
  },
  {
    id: "espalda",
    title: "Cintura baja",
    outfit: "Sweater corto y jean negro ancho con tachas.",
    image: images.lookEspalda,
    layout: "col-span-6 lg:col-span-3 lg:col-start-10 lg:-mt-20",
    ratio: "aspect-[4/5] lg:aspect-[2/3]",
  },
];
