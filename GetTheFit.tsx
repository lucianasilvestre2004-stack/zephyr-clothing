"use client";

import { useEffect, useRef, useState } from "react";
import { products, type Product } from "@/content/products";
import { Photo } from "./ui/Photo";

const byId = (id: string) => products.find((p) => p.id === id);

const formatPrice = (n: number) => `$ ${n.toLocaleString("es-AR")}`;

/** Las prendas que se muestran en la grilla (el diseño de WordPress usa 4). */
const featured = ["puffer-bordo", "jean-wide", "pollera-cargo", "mini-negra"]
  .map(byId)
  .filter((p): p is Product => Boolean(p));

export function GetTheFit() {
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = openId ? byId(openId) : undefined;

  return (
    <section id="get-the-fit" aria-labelledby="fit-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-20">
        <h2 id="fit-title" className="section-title">
          Get the fit
        </h2>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 lg:grid-cols-4 lg:gap-x-12">
          {featured.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setOpenId(p.id)} className="group block w-full text-left">
                <span className="relative block aspect-square overflow-hidden rounded-xl bg-soft">
                  <Photo
                    photo={p.image}
                    sizes="(min-width:1024px) 22vw, 46vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="mt-4 block text-sm uppercase leading-snug text-ink sm:text-base">{p.name}</span>
                {p.price && <span className="mt-1 block text-sm sm:text-base">{formatPrice(p.price)}</span>}
                <span className="mt-2 block text-sm font-medium text-bordo underline-offset-4 group-hover:underline">
                  Ver prenda
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm">
          Fotos de demostración. Precios de referencia: confirmalos en la tienda online.
        </p>
      </div>

      <ProductDialog product={opened} onClose={() => setOpenId(null)} onSelect={setOpenId} />
    </section>
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
      className="m-auto max-h-[92svh] w-[min(60rem,calc(100%-1.5rem))] overflow-y-auto rounded-2xl bg-white p-0 text-gray-text backdrop:bg-ink/60"
    >
      {product && <ProductDetail key={product.id} product={product} onClose={onClose} onSelect={onSelect} />}
    </dialog>
  );
}

function ProductDetail({
  product,
  onClose,
  onSelect,
}: {
  product: Product;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <>
      {(
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] bg-soft md:aspect-auto md:min-h-[34rem]">
            <Photo photo={product.image} sizes="(min-width:768px) 30rem, 100vw" priority />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm uppercase tracking-wide">{product.category}</p>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 -mt-2 inline-flex min-h-11 items-center px-3 text-sm font-semibold text-ink underline underline-offset-4"
              >
                Cerrar
              </button>
            </div>
            <h3 id="producto-titulo" className="mt-2 text-2xl font-medium uppercase text-ink sm:text-3xl">
              {product.name}
            </h3>
            {product.price && (
              <p className="mt-2 text-2xl text-ink">
                {formatPrice(product.price)}
                <span className="ml-2 align-middle text-xs text-gray-text">precio de referencia</span>
              </p>
            )}
            <p className="mt-4 leading-relaxed">{product.note}</p>

            {product.sizes && (
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold uppercase text-ink">Talles disponibles</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <label key={s} className="cursor-pointer">
                      <input
                        type="radio"
                        name={`talle-${product.id}`}
                        value={s}
                        checked={size === s}
                        onChange={() => setSize(s)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex size-12 items-center justify-center rounded-lg border border-line text-sm font-semibold text-ink transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bordo">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm" aria-live="polite">
                  {size ? `Elegiste talle ${size}.` : "Elegí tu talle."}
                </p>
              </fieldset>
            )}

            <p className="mt-8 text-sm font-semibold uppercase text-ink">Combina con</p>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {product.pairsWith.map((id) => {
                const pair = byId(id);
                if (!pair) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="flex w-full items-center gap-3 rounded-lg border border-line p-2 text-left transition-colors hover:border-ink"
                    >
                      <span className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-md bg-soft">
                        <Photo photo={{ ...pair.image, alt: "" }} sizes="48px" />
                      </span>
                      <span className="text-sm leading-snug text-ink">{pair.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="grow" />
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-bordo px-6 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-bordo-deep"
            >
              Comprar
              <span className="sr-only"> {product.name} (se abre en una pestaña nueva)</span>
            </a>
            <p className="mt-3 text-center text-sm">
              {size ? `Te llevamos a la tienda online para terminar tu compra en talle ${size}.` : "Terminás tu compra en la tienda online."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
