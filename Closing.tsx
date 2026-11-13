import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_URL } from "@/content/site";
import { ButtonLink } from "./ui/ButtonLink";
import { WindMark } from "./Identity";

export function Closing() {
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="on-dark grain relative overflow-hidden bg-bordo py-20 text-white [--grain-opacity:0.2] sm:py-28 lg:py-32"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <WindMark className="pointer-events-none absolute right-12 top-28 hidden w-[30vw] max-w-[28rem] text-bordo-deep lg:block" />
        <h2 id="contacto-title" className="type-display text-[clamp(4rem,14.5vw,14rem)]">
          ¿Ya tenés
          <br />
          tu fit?
        </h2>
        <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-8 lg:mt-14">
          <p className="col-span-12 max-w-[42ch] text-lg leading-relaxed text-white/90 lg:col-span-5">
            Todos los modelos, talles y precios están en la tienda online. Para consultas sobre talles, envíos o
            cambios, escribinos por Instagram: {INSTAGRAM_HANDLE}.
          </p>
          <div className="col-span-12 flex flex-wrap items-start gap-3 lg:col-span-6 lg:col-start-7 lg:justify-end">
            <ButtonLink href={STORE_URL} external variant="light">
              Comprar online
            </ButtonLink>
            <ButtonLink href={INSTAGRAM_URL} external variant="outline-light">
              Escribinos por Instagram
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
