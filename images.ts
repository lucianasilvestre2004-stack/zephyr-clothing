/**
 * REGISTRO DE FOTOS
 * -----------------
 * Todas las fotos de la página salen de este archivo.
 * Para reemplazar una foto cambiá solo `src` (y el `alt`):
 *
 *   - Foto local:     "/images/mi-foto.webp"  (guardala en /public/images)
 *   - Foto remota:    "https://i.pinimg.com/originals/xx/xx/xx/foto.jpg"
 *                     (Pinterest, Unsplash y la tienda oficial ya están
 *                     habilitados en next.config.ts → images.remotePatterns)
 *
 * Las fotos actuales son PROVISIONALES, de proyectos públicos de GitHub
 * (ver README → Créditos). No son productos ni campañas oficiales de Zephyr.
 */

export type Photo = {
  src: string;
  alt: string;
  /** Punto de encuadre para object-position (ej. "50% 20%"). */
  focus?: string;
};

export const images = {
  heroMain: {
    src: "/images/hero-principal.webp",
    alt: "Chica con vestido largo mostaza, campera de jean atada a la cintura y borcegos, contra un portón blanco",
    focus: "50% 30%",
  },
  heroSecondary: {
    src: "/images/hero-secundaria.webp",
    alt: "Chica con conjunto rojo y anteojos de sol posando contra una pared roja",
    focus: "50% 40%",
  },

  // PORTADA (fotos elegidas por Luciana)
  portada1: { src: "/images/portada-1.webp", alt: "Chica sonriendo agachada, con campera de jean oversize, corbata a rayas y zapatos rojos", focus: "50% 30%" },
  portada2: { src: "/images/portada-2.webp", alt: "Chica en blanco y negro sentada sobre una caja, con remera blanca y jean claro", focus: "50% 40%" },
  portada3: { src: "/images/portada-3.webp", alt: "Chica sentada en el piso con campera y jean de denim azul", focus: "60% 35%" },

  // NEW DROPS (fotos elegidas por Luciana)
  dropsGrande: { src: "/images/drops-grande.webp", alt: "Chica en la calle con tapado largo marrón, sweater gris, jean blanco y gorra", focus: "50% 12%" },
  drops1: { src: "/images/drops-1.webp", alt: "Chica sonriendo en una esquina, con remera blanca corta, camisa a cuadros atada y pantalón negro ancho", focus: "50% 40%" },
  drops2: { src: "/images/drops-2.webp", alt: "Chica con campera de cuero negra, camisa a cuadros atada y jean oscuro ancho frente a una reja", focus: "50% 40%" },
  drops3: { src: "/images/drops-3.webp", alt: "Chica caminando con blazer camel, musculosa blanca, jean claro ancho y gorra", focus: "50% 35%" },
  drops4: { src: "/images/drops-4.webp", alt: "Chica cruzando la calle con campera negra, mini pollera beige y botas altas negras", focus: "50% 35%" },

  // GET THE FIT
  fitPuffer: { src: "/images/fit-puffer-bordo.webp", alt: "Campera puffer bordó con capucha", focus: "50% 25%" },
  fitJeanWide: { src: "/images/fit-jean-wide.webp", alt: "Jean wide leg azul con top blanco", focus: "50% 55%" },
  fitSweater: { src: "/images/fit-sweater-verde.webp", alt: "Sweater corto verde de lanilla con jean negro", focus: "50% 30%" },
  fitPollera: { src: "/images/fit-pollera-cargo.webp", alt: "Pollera cargo beige con bolsillo lateral", focus: "50% 40%" },
  fitBuzo: { src: "/images/fit-buzo-gris.webp", alt: "Buzo crop gris con cuello redondo y jean verde", focus: "50% 30%" },
  fitMini: { src: "/images/fit-mini-negra.webp", alt: "Mini pollera de jean negra con tablas", focus: "50% 45%" },

  // NEW DROPS
  lookDomingo: {
    src: "/images/look-domingo.webp",
    alt: "Chica de perfil con vestido largo mostaza, campera de jean y borcegos negros",
    focus: "50% 40%",
  },
  lookPared: {
    src: "/images/look-pared.webp",
    alt: "Chica con campera de jean y mochila verde frente a una pared celeste y rosa",
    focus: "45% 40%",
  },
  lookCuadros: {
    src: "/images/look-cuadros.webp",
    alt: "Chica con conjunto de saco corto y mini pollera escocesa roja",
    focus: "50% 35%",
  },
  lookPlaza: {
    src: "/images/look-plaza.webp",
    alt: "Chica en una plaza con remera blanca estampada, campera de jean y calza biker",
    focus: "50% 35%",
  },
  lookRosa: {
    src: "/images/look-rosa.webp",
    alt: "Chica con campera puffer rosa y jean estampado",
    focus: "50% 30%",
  },
  lookEspalda: {
    src: "/images/look-espalda.webp",
    alt: "Chica de espaldas con sweater corto verde y jean negro ancho",
    focus: "50% 40%",
  },

  // BENEFICIOS (banner con foto de fondo)
  benefits: {
    src: "/images/hero-secundaria.webp",
    alt: "",
    focus: "50% 80%",
  },

  // NOSOTROS
  identity: {
    src: "/images/identidad.webp",
    alt: "Chica con gorro de lana negro y sweater corto verde",
    focus: "50% 30%",
  },
} satisfies Record<string, Photo>;
