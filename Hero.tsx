import { images } from "@/content/images";
import { Photo } from "./ui/Photo";

const heroPhotos = [images.portada1, images.portada2, images.portada3];

/** Hero del diseño de WordPress: tres fotos a todo el ancho, con el CTA principal encima. */
export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative">
      <h1 id="hero-title" className="sr-only">
        Zephyr Clothing, ropa urbana de mujer de Mendoza
      </h1>
      <div className="grid grid-cols-3">
        {heroPhotos.map((photo) => (
          <div key={photo.src} className="relative aspect-[3/5] sm:aspect-[3/4] lg:aspect-[5/6]">
            <Photo photo={photo} priority sizes="34vw" />
          </div>
        ))}
      </div>

      {/* CTA principal */}
      <div className="flex justify-center bg-ink px-5 py-6 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:bg-gradient-to-t sm:from-ink/55 sm:to-transparent sm:pb-12 sm:pt-24">
        <div className="text-center text-white sm:pointer-events-auto">
          <p className="text-sm font-medium uppercase tracking-[0.2em] sm:text-base">Nueva temporada</p>
          <a
            href="#get-the-fit"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-bordo hover:text-white"
          >
            Elegí tu fit
          </a>
        </div>
      </div>
    </section>
  );
}
