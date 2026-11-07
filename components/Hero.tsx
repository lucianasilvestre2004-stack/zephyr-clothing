import { images } from "@/content/images";
import { STORE_URL } from "@/content/site";
import { ButtonLink } from "./ui/ButtonLink";
import { Photo } from "./ui/Photo";

const WORD = "Zephyr".split("");

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="grain relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-x-4 pt-6 sm:pt-10 lg:gap-x-8 lg:pt-12">
          {/* Texto + CTA */}
          <div className="col-span-12 flex flex-col lg:col-span-5 lg:pb-[13vw] lg:pt-6">
            <p className="max-w-[17ch] text-[clamp(1.75rem,3.4vw,3.1rem)] font-extrabold leading-[1.02] tracking-[-0.02em] [font-stretch:80%]">
              Ropa urbana para moverte por la ciudad.
            </p>
            <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-steel sm:text-lg">
              Ropa de mujer con estilo urbano: denim, buzos, polleras y camperas para todos los días. Desde Mendoza.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#get-the-fit">Elegí tu fit</ButtonLink>
              <ButtonLink href={STORE_URL} external variant="outline">
                Comprar online
              </ButtonLink>
            </div>
          </div>

          {/* Composición fotográfica asimétrica */}
          <div className="relative col-span-12 mt-10 lg:col-span-7 lg:mt-0">
            <div className="relative ml-auto aspect-[3/4] w-[72%] overflow-hidden bg-concrete sm:w-[62%] lg:aspect-[4/5] lg:w-[64%]">
              <Photo photo={images.heroMain} sizes="(min-width:1024px) 38vw, 70vw" priority />
            </div>
            <div className="absolute left-0 top-[14%] aspect-[2/3] w-[38%] overflow-hidden border-[6px] border-paper bg-concrete sm:left-[6%] sm:w-[30%] lg:left-[2%] lg:w-[32%]">
              <Photo photo={images.heroSecondary} sizes="(min-width:1024px) 20vw, 38vw" priority />
            </div>
            {/* Marca gráfica: la flecha del viento del oeste */}
            <svg
              aria-hidden="true"
              viewBox="0 0 120 40"
              className="absolute left-[2%] top-[2%] hidden w-20 text-bordo sm:block lg:left-[4%]"
            >
              <path d="M0 8h86c10 0 16 6 16 12" stroke="currentColor" strokeWidth="5" fill="none" />
              <path d="M0 22h64" stroke="currentColor" strokeWidth="5" />
              <path d="M0 36h100" stroke="currentColor" strokeWidth="5" />
            </svg>
          </div>
        </div>

        {/* Wordmark gigante: entra como una ráfaga de viento (una sola vez) */}
        <h1
          id="hero-title"
          className="type-display relative z-10 -mt-[11vw] select-none whitespace-nowrap pb-4 text-[31vw] leading-[0.78] lg:-mt-[12.5vw] lg:text-[min(32.5vw,32rem)]"
        >
          <span className="sr-only">Zephyr Clothing, ropa urbana de mujer de Mendoza</span>
          <span aria-hidden="true" className="flex justify-between">
            {WORD.map((letter, i) => (
              <span
                key={i}
                className="inline-block animate-gust"
                style={{ animationDelay: `${120 + i * 70}ms` }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>
      </div>
    </section>
  );
}
