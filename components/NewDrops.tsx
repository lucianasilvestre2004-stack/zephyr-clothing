"use client";

import { dropProducts, type Product } from "@/content/products";
import { requestOpenProduct } from "@/lib/store";
import { Price } from "./GetTheFit";
import { Photo } from "./ui/Photo";

/** Collage del WordPress: cuatro prendas chicas a la izquierda y una grande a la derecha. */
const small = dropProducts.slice(0, 4);
const big = dropProducts[4];

export function NewDrops() {
  return (
    <section id="new-drops" aria-labelledby="drops-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-20">
        <h2 id="drops-title" className="section-title">
          New drops
        </h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-center">Lo último que llegó. Tocá una prenda para verla y agregarla al carrito.</p>

        <div className="mt-10 grid gap-x-4 gap-y-8 sm:mt-14 md:grid-cols-[1fr_1fr_2.2fr] md:gap-x-8">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:col-span-2 md:gap-x-8">
            {small.map((p) => (
              <li key={p.id}>
                <DropCard product={p} ratio="aspect-[4/5]" sizes="(min-width:768px) 20vw, 46vw" />
              </li>
            ))}
          </ul>
          {big && <DropCard product={big} ratio="aspect-[4/5] md:aspect-auto md:h-[calc(100%-4.5rem)]" sizes="(min-width:768px) 42vw, 100vw" big />}
        </div>
      </div>
    </section>
  );
}

function DropCard({ product: p, ratio, sizes, big = false }: { product: Product; ratio: string; sizes: string; big?: boolean }) {
  return (
    <button type="button" onClick={() => requestOpenProduct(p.id)} className={`group block w-full text-left ${big ? "md:h-full" : ""}`}>
      <span className={`relative block overflow-hidden rounded-xl bg-soft ${ratio}`}>
        <Photo photo={p.image} sizes={sizes} className="transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-ink">
          Nuevo
        </span>
      </span>
      <span className={`mt-3 block uppercase leading-snug text-ink ${big ? "text-base" : "text-sm sm:text-base"}`}>{p.name}</span>
      {p.price && (
        <span className="mt-1 block text-sm sm:text-base">
          <Price price={p.price} />
        </span>
      )}
      <span className="mt-1.5 block text-sm font-medium text-bordo underline-offset-4 group-hover:underline">Ver prenda</span>
    </button>
  );
}
