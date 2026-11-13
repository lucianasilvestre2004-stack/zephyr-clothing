import { images, type Photo as PhotoType } from "@/content/images";
import { Photo } from "./ui/Photo";

/** Collage del WordPress: cuatro fotos chicas a la izquierda y una grande a la derecha. */
const small: PhotoType[] = [images.drops1, images.drops2, images.drops3, images.drops4];
const big = images.dropsGrande;

export function NewDrops() {
  return (
    <section id="new-drops" aria-labelledby="drops-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-20">
        <h2 id="drops-title" className="section-title">
          New drops
        </h2>

        <div className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-[1fr_1fr_2.2fr] md:gap-8">
          <div className="grid grid-cols-2 gap-4 md:col-span-2 md:gap-8">
            {small.map((photo) => (
              <figure key={photo.src} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-soft">
                <Photo
                  photo={photo}
                  sizes="(min-width:768px) 20vw, 46vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
          <figure className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-soft md:aspect-auto">
            <Photo
              photo={big}
              sizes="(min-width:768px) 42vw, 100vw"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </figure>
        </div>

        <p className="mt-8 text-center text-sm">Fotos de inspiración. No son producciones oficiales de la marca.</p>
      </div>
    </section>
  );
}
