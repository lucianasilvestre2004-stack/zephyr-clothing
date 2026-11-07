"use client";

import { useState } from "react";
import { products, type Product } from "@/content/products";
import { ExternalIcon } from "./ui/ButtonLink";
import { Photo } from "./ui/Photo";

const byId = (id: string) => products.find((p) => p.id === id);

export function GetTheFit() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const selected = byId(selectedId) ?? products[0];

  return (
    <section id="get-the-fit" aria-labelledby="fit-title" className="bg-white py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Encabezado */}
        <div className="grid grid-cols-12 items-end gap-x-8 gap-y-6">
          <h2 id="fit-title" className="type-display col-span-12 text-[clamp(4.5rem,15vw,13rem)] lg:col-span-8">
            Get the fit
          </h2>
          <div className="col-span-12 lg:col-span-4 lg:pb-3">
            <p className="max-w-[40ch] text-lg leading-relaxed">
              Elegí una prenda, mirala en grande y armá el outfit con las que combinan.
            </p>
            <DemoNote className="mt-4" />
          </div>
        </div>

        {/* Mobile y tablet: carrusel con scroll horizontal */}
        <div className="mt-12 lg:hidden">
          <ul
            className="relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-6 sm:-mx-8 sm:scroll-px-8 sm:px-8 [scrollbar-width:thin]"
            aria-label="Prendas de Get the fit"
          >
            {products.map((p) => (
              <li key={p.id} className="relative w-[78%] shrink-0 snap-start sm:w-[44%]">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <p className="text-sm text-steel" aria-hidden="true">
            Deslizá para ver más prendas
          </p>
        </div>

        {/* Desktop: selector editorial */}
        <div className="mt-16 hidden grid-cols-12 gap-x-10 lg:grid">
          <div className="col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-paper">
              {products.map((p) => (
                <div
                  key={p.id}
                  aria-hidden={p.id !== selected.id}
                  className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                    p.id === selected.id ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                  }`}
                >
                  <Photo photo={p.image} sizes="(min-width:1024px) 55vw, 100vw" />
                </div>
              ))}
              <span className="absolute left-4 top-4 bg-white px-2.5 py-1 text-xs font-bold">
                Prenda de demostración
              </span>
            </div>
          </div>

          <div className="col-span-5 flex flex-col">
            <ul className="border-t border-ink/15" aria-label="Elegí una prenda">
              {products.map((p) => {
                const active = p.id === selected.id;
                return (
                  <li key={p.id} className="border-b border-ink/15">
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      aria-pressed={active}
                      aria-controls="fit-detalle"
                      className={`group relative flex w-full items-center gap-5 py-3.5 pl-5 text-left transition-colors ${
                        active ? "text-ink" : "text-ink/45 hover:text-ink"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-2 left-0 w-1.5 origin-top bg-bordo transition-transform duration-300 ${
                          active ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      <span className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden bg-paper">
                        <Photo
                          photo={{ ...p.image, alt: "" }}
                          sizes="48px"
                          className={`transition duration-300 ${active ? "" : "grayscale group-hover:grayscale-0"}`}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="type-display block text-[2.15rem] xl:text-[2.6rem]">{p.name}</span>
                        <span className="mt-1 block text-sm font-medium text-steel">{p.category}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div id="fit-detalle" aria-live="polite" className="mt-auto pt-10">
              <p className="text-sm font-semibold text-steel">{selected.category}</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{selected.name}</h3>
              <p className="mt-2 max-w-[44ch] leading-relaxed">{selected.note}</p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-sm font-semibold">Armalo con</span>
                {selected.pairsWith.map((id) => {
                  const pair = byId(id);
                  if (!pair) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedId(id)}
                      className="min-h-10 border border-ink/25 px-3.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {pair.name}
                    </button>
                  );
                })}
              </div>

              <a
                href={selected.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-12 items-center gap-2.5 bg-ink px-6 font-bold text-white transition-colors hover:bg-bordo"
              >
                Ver en la tienda oficial
                <ExternalIcon />
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const pairs = p.pairsWith.map((id) => byId(id)?.name).filter(Boolean);
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <Photo photo={p.image} sizes="(min-width:640px) 44vw, 78vw" />
        <span className="absolute left-3 top-3 bg-white px-2 py-0.5 text-[0.7rem] font-bold">Demo</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-steel">{p.category}</p>
      <h3 className="type-display mt-1 text-[2.4rem]">{p.name}</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed">{p.note}</p>
      <p className="mt-2 text-sm text-steel">Armalo con: {pairs.join(" y ")}</p>
      <div className="grow" />
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-12 items-center justify-center gap-2.5 border-2 border-ink px-5 font-bold transition-colors hover:bg-ink hover:text-white"
      >
        Ver en la tienda
        <ExternalIcon />
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    </article>
  );
}

function DemoNote({ className = "" }: { className?: string }) {
  return (
    <p className={`flex gap-2.5 text-sm leading-snug text-steel ${className}`}>
      <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 bg-bordo" />
      Prendas y fotos de demostración. Modelos, talles y precios reales en la tienda oficial.
    </p>
  );
}
