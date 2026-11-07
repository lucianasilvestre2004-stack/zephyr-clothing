import { looks } from "@/content/looks";
import { INSTAGRAM_URL, STORE_URL } from "@/content/site";
import { ButtonLink } from "./ui/ButtonLink";
import { Photo } from "./ui/Photo";

export function NewDrops() {
  return (
    <section
      id="new-drops"
      aria-labelledby="drops-title"
      className="on-dark grain relative overflow-hidden bg-ink py-20 text-white [--grain-opacity:0.16] sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 items-end gap-x-8 gap-y-6">
          <h2
            id="drops-title"
            className="type-display col-span-12 text-[clamp(4.5rem,15vw,13rem)] lg:col-span-7"
          >
            New drops
          </h2>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="max-w-[40ch] text-lg leading-relaxed text-white/85">
              Ideas de outfits para esta temporada: denim, buzos cortos y polleras, mezclados como en la calle.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={STORE_URL} external variant="outline-light">
                Ver novedades en la tienda
              </ButtonLink>
              <ButtonLink href={INSTAGRAM_URL} external variant="outline-light">
                Más looks en Instagram
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Collage editorial asimétrico */}
        <ul className="mt-16 grid grid-cols-6 items-start gap-x-4 gap-y-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          {looks.map((look) => (
            <li key={look.id} className={look.layout}>
              <figure className="group">
                <div className={`relative overflow-hidden bg-steel ${look.ratio}`}>
                  <Photo
                    photo={look.image}
                    sizes="(min-width:1024px) 34vw, (min-width:640px) 50vw, 100vw"
                    className="transition duration-700 ease-out group-hover:scale-[1.04] [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                  />
                  {/* Barrido bordó al pasar el mouse */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 bg-bordo transition-transform duration-500 group-hover:scale-x-100"
                  />
                </div>
                <figcaption className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="type-display text-[1.75rem] lg:text-[2rem]">{look.title}</span>
                  <span className="text-sm leading-snug text-concrete">{look.outfit}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-sm text-concrete lg:mt-24">
          Fotos provisionales de inspiración. No corresponden a una colección oficial de Zephyr.
        </p>
      </div>
    </section>
  );
}
