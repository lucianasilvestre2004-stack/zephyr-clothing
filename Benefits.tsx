import { images } from "@/content/images";
import { WHATSAPP_URL } from "@/content/site";
import { Photo } from "./ui/Photo";

const message = encodeURIComponent("¡Hola! Quiero recibir los beneficios exclusivos de Zephyr.");

/** Banner con foto de fondo: la capa de fondo trabajada de la página. */
export function Benefits() {
  return (
    <section id="beneficios" aria-labelledby="beneficios-title" className="on-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <Photo photo={images.benefits} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/45" />
      </div>
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center text-white sm:py-24">
        <h2 id="beneficios-title" className="text-3xl font-medium uppercase sm:text-4xl">
          Beneficios exclusivos
        </h2>
        <p className="mt-4 max-w-[46ch] font-medium">
          Sumate a la lista de Zephyr y enterate primero de los nuevos ingresos, descuentos y promociones.
        </p>
        <a
          href={`${WHATSAPP_URL}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-bordo hover:text-white"
        >
          Quiero mis beneficios
          <span className="sr-only"> (abre WhatsApp en una pestaña nueva)</span>
        </a>
      </div>
    </section>
  );
}
