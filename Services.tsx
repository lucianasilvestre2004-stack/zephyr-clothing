import { WHATSAPP_URL } from "@/content/site";
import { ChatIcon, ExchangeIcon, TruckIcon } from "./ui/Icons";

/** Envíos, cambios y consultas: los tres beneficios del diseño de WordPress. */
export function Services() {
  return (
    <section id="envios-y-cambios" aria-labelledby="servicios-title" className="py-16 sm:py-20">
      <h2 id="servicios-title" className="sr-only">
        Envíos, cambios y consultas
      </h2>
      <ul className="mx-auto grid max-w-[1500px] gap-14 px-5 text-center sm:px-8 md:grid-cols-3 md:gap-10 lg:px-20">
        <li className="flex flex-col items-center">
          <TruckIcon className="size-20 text-ink sm:size-24" />
          <h3 className="mt-8 text-2xl font-medium uppercase">Envíos</h3>
          <p className="mt-5 max-w-[36ch] text-sm leading-7">
            Envíos a todo el país con Andreani. Si estás en Mendoza, ¡recibís tu pedido en el mismo día!
          </p>
        </li>
        <li className="flex flex-col items-center">
          <ExchangeIcon className="size-20 text-ink sm:size-24" />
          <h3 className="mt-8 text-2xl font-medium uppercase">Cambios</h3>
          <p className="mt-5 max-w-[36ch] text-sm leading-7">
            Cambios hasta 15 días posteriores a tu compra. La prenda debe conservar su etiqueta y empaque.
          </p>
        </li>
        <li className="flex flex-col items-center">
          <ChatIcon className="size-20 text-ink sm:size-24" />
          <h3 className="mt-8 text-2xl font-medium uppercase">Consultas</h3>
          <p className="mt-5 max-w-[36ch] text-sm leading-7">
            Atención personalizada y directa por WhatsApp. Consultanos tus dudas y te asesoramos al instante.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center rounded-full border border-ink/25 px-6 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            Escribinos por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
