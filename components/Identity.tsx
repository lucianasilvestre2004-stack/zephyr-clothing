import { images } from "@/content/images";
import { Photo } from "./ui/Photo";

const principles = [
  {
    title: "Comodidad primero",
    text: "Calces amplios y telas que acompañan el movimiento, de la mañana a la noche.",
  },
  {
    title: "Básicos que combinan",
    text: "Prendas simples que se mezclan entre sí, para armar muchos outfits con poco.",
  },
  {
    title: "Estilo de calle",
    text: "Denim, buzos cortos y polleras: lo que se usa en la calle, sin complicarse.",
  },
];

export function Identity() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="grain relative bg-paper py-20 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-8 gap-y-14 px-5 sm:px-8 lg:px-12">
        <div className="col-span-12 lg:col-span-7">
          <WindMark className="w-24 text-bordo sm:w-32" />
          <h2
            id="nosotros-title"
            className="type-display mt-8 max-w-[12ch] text-[clamp(3.6rem,9.5vw,9rem)]"
          >
            Ropa urbana desde Mendoza
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-10">
            <p className="text-lg leading-relaxed">
              Zephyr Clothing es una marca de ropa de mujer de Mendoza. Hacemos prendas urbanas para el día
              a día: cómodas, simples y con onda.
            </p>
            <p className="text-lg leading-relaxed text-steel">
              La idea es que armes tus outfits fácil: básicos que combinan entre sí y algunas prendas con
              más personalidad para cuando querés destacarte.
            </p>
          </div>

          <ul className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {principles.map((p) => (
              <li key={p.title} className="border-t-2 border-ink pt-4">
                <h3 className="text-lg font-extrabold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-steel">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9 lg:mt-24">
          <div aria-hidden="true" className="absolute -left-3 -top-3 h-2/3 w-2/3 bg-bordo sm:-left-5 sm:-top-5" />
          <div className="relative aspect-[3/4] overflow-hidden bg-concrete">
            <Photo photo={images.identity} sizes="(min-width:1024px) 30vw, (min-width:640px) 66vw, 100vw" />
          </div>
          <p className="mt-4 text-sm text-steel">Mendoza, Argentina</p>
        </div>
      </div>
    </section>
  );
}

/** Tres trazos de viento: el símbolo gráfico de la página. */
export function WindMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className={className}>
      <path d="M0 10h78c12 0 18-4 18-10" stroke="currentColor" strokeWidth="6" />
      <path d="M0 28h108c6 0 12 4 12 10" stroke="currentColor" strokeWidth="6" />
      <path d="M0 46h60" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}
