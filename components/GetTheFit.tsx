"use client";

import { useEffect, useRef, useState } from "react";
import { products, type Product } from "@/content/products";
import { ExternalIcon } from "./ui/ButtonLink";
import { Photo } from "./ui/Photo";

const byId = (id: string) => products.find((p) => p.id === id);

export function GetTheFit() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = byId(selectedId) ?? products[0];
  const opened = openId ? byId(openId) : undefined;

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
              Elegí una prenda, mirala en detalle y armá el outfit con las que combinan.
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
                <ProductCard product={p} onOpen={() => setOpenId(p.id)} />
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
            <button
              type="button"
              onClick={() => setOpenId(selected.id)}
              className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-paper"
            >
              <span className="sr-only">Ver detalle de {selected.name}</span>
              {products.map((p) => (
                <span
                  key={p.id}
                  aria-hidden="true"
                  className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                    p.id === selected.id ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                  }`}
                >
                  <Photo photo={{ ...p.image, alt: "" }} sizes="(min-width:1024px) 55vw, 100vw" />
                </span>
              ))}
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-sm font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Ver prenda
              </span>
            </button>
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

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setOpenId(selected.id)}
                  className="inline-flex min-h-12 items-center border-2 border-ink px-6 font-bold transition-colors hover:bg-ink hover:text-white"
                >
                  Ver prenda
                </button>
                <BuyLink product={selected} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductDialog
        product={opened}
        onClose={() => setOpenId(null)}
        onSelect={(id) => {
          setOpenId(id);
          setSelectedId(id);
        }}
      />
    </section>
  );
}

/** Botón de compra: abre la página real de la prenda para elegir talle y pagar. */
function BuyLink({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 bg-ink px-6 font-bold text-white transition-colors hover:bg-bordo ${className}`}
    >
      Comprar
      <ExternalIcon />
      <span className="sr-only">{product.name} (se abre en una pestaña nueva)</span>
    </a>
  );
}

function ProductCard({ product: p, onOpen }: { product: Product; onOpen: () => void }) {
  const pairs = p.pairsWith.map((id) => byId(id)?.name).filter(Boolean);
  return (
    <article className="flex h-full flex-col">
      <button type="button" onClick={onOpen} className="text-left">
        <span className="relative block aspect-[4/5] overflow-hidden bg-paper">
          <Photo photo={p.image} sizes="(min-width:640px) 44vw, 78vw" />
        </span>
        <span className="mt-4 block text-sm font-semibold text-steel">{p.category}</span>
        <span className="type-display mt-1 block text-[2.4rem]">{p.name}</span>
        <span className="sr-only">Ver detalle</span>
      </button>
      <p className="mt-2 text-[0.95rem] leading-relaxed">{p.note}</p>
      <p className="mt-2 text-sm text-steel">Armalo con: {pairs.join(" y ")}</p>
      <div className="grow" />
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-12 items-center justify-center border-2 border-ink px-3 font-bold"
        >
          Ver prenda
        </button>
        <BuyLink product={p} className="px-3" />
      </div>
    </article>
  );
}

/** Vista de producto dentro de la página (diálogo nativo: foco atrapado y Escape para cerrar). */
function ProductDialog({
  product,
  onClose,
  onSelect,
}: {
  product: Product | undefined;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!product && dialog.open) dialog.close();
    if (!product) document.body.style.overflow = "";
  }, [product]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="producto-titulo"
      className="m-auto max-h-[92svh] w-[min(64rem,calc(100%-1.5rem))] overflow-y-auto bg-white p-0 text-ink backdrop:bg-ink/70"
    >
      {product && (
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] bg-paper md:aspect-auto md:min-h-[36rem]">
            <Photo photo={product.image} sizes="(min-width:768px) 32rem, 100vw" priority />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold text-steel">{product.category}</p>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 -mt-2 inline-flex min-h-11 items-center px-3 text-sm font-bold underline underline-offset-4"
              >
                Cerrar
              </button>
            </div>
            <h3 id="producto-titulo" className="type-display mt-2 text-[clamp(2.6rem,6vw,4rem)]">
              {product.name}
            </h3>
            <p className="mt-4 max-w-[42ch] text-lg leading-relaxed">{product.note}</p>

            <p className="mt-8 text-sm font-semibold">Combina con</p>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {product.pairsWith.map((id) => {
                const pair = byId(id);
                if (!pair) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="group flex w-full items-center gap-3 border border-ink/15 p-2 text-left transition-colors hover:border-ink"
                    >
                      <span className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden bg-paper">
                        <Photo photo={{ ...pair.image, alt: "" }} sizes="48px" />
                      </span>
                      <span className="text-sm font-semibold leading-snug">{pair.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="grow" />
            <BuyLink product={product} className="mt-10 w-full" />
            <p className="mt-3 text-sm text-steel">Elegís talle y color y pagás en la tienda online de Zephyr.</p>
          </div>
        </div>
      )}
    </dialog>
  );
}

function DemoNote({ className = "" }: { className?: string }) {
  return (
    <p className={`flex gap-2.5 text-sm leading-snug text-steel ${className}`}>
      <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 bg-bordo" />
      Fotos de demostración. Talles, colores y precios se eligen al comprar.
    </p>
  );
}
