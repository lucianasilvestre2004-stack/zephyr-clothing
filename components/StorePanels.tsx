"use client";

import { useState, type FormEvent } from "react";
import { products } from "@/content/products";
import { clearCart, logout, requestOpenProduct, saveUser, setQty, useCart, useUser } from "@/lib/store";
import { useZondaCode, withDiscount } from "@/lib/zonda";
import { Drawer } from "./ui/Drawer";
import { Photo } from "./ui/Photo";

const formatPrice = (n: number) => `$ ${n.toLocaleString("es-AR")}`;
const shoppable = products.filter((p) => p.price && p.sizes);
const byId = (id: string) => products.find((p) => p.id === id);

/** Quita tildes y pasa a minúsculas para que "bordo" encuentre "bordó". */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/* ---------- Buscar ---------- */

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());
  const results = q ? shoppable.filter((p) => normalize(`${p.name} ${p.category}`).includes(q)) : shoppable;

  return (
    <Drawer open={open} onClose={onClose} title="Buscar" side="top">
      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        <label htmlFor="buscar" className="sr-only">
          Buscar prendas
        </label>
        <input
          id="buscar"
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá una prenda: jean, campera, pollera…"
          className="w-full border-b-2 border-ink bg-transparent py-3 text-xl text-ink outline-none placeholder:text-gray-text/60 focus-visible:outline-none"
        />
        <p className="mt-4 text-sm" aria-live="polite">
          {q ? (results.length ? `${results.length} resultado${results.length > 1 ? "s" : ""}` : `No encontramos "${query}". Probá con jean, campera, pollera o mini.`) : "Prendas destacadas"}
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-4 pb-2 sm:grid-cols-4">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setQuery("");
                  requestOpenProduct(p.id);
                }}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-square overflow-hidden rounded-xl bg-soft">
                  <Photo photo={p.image} sizes="180px" className="transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="mt-2 block text-sm uppercase leading-snug text-ink">{p.name}</span>
                <span className="block text-sm">{formatPrice(p.price!)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
}

/* ---------- Usuario ---------- */

export function UserPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useUser();
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const apellido = String(data.get("apellido") ?? "").trim();
    if (!nombre || !apellido) {
      setError("Completá tu nombre y tu apellido.");
      return;
    }
    setError("");
    saveUser({ nombre, apellido });
  };

  return (
    <Drawer open={open} onClose={onClose} title="Mi cuenta">
      <div className="flex flex-1 flex-col px-6 py-8">
        {user ? (
          <>
            <span className="grid size-16 place-items-center rounded-full bg-bordo text-2xl font-semibold uppercase text-white">
              {user.nombre.at(0)}
              {user.apellido.at(0)}
            </span>
            <p className="mt-5 text-2xl text-ink">Hola, {user.nombre}</p>
            <p className="mt-1">
              {user.nombre} {user.apellido}
            </p>
            <p className="mt-6 text-sm leading-relaxed">
              Ya podés agregar prendas a tu carrito y jugar al Zonda para ganar tu sorpresa del día.
            </p>
            <button
              type="button"
              onClick={logout}
              className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full border border-ink/25 px-6 font-semibold text-ink hover:border-ink"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
            <p className="text-2xl text-ink">Ingresá a tu cuenta</p>
            <p className="mt-2 text-sm leading-relaxed">Dejanos tu nombre para personalizar tu experiencia en la tienda.</p>
            <label htmlFor="nombre" className="mt-8 text-sm font-semibold uppercase text-ink">
              Nombre
            </label>
            <input id="nombre" name="nombre" autoComplete="given-name" className="mt-2 min-h-12 rounded-lg border border-line px-4 text-ink focus:border-ink" />
            <label htmlFor="apellido" className="mt-5 text-sm font-semibold uppercase text-ink">
              Apellido
            </label>
            <input id="apellido" name="apellido" autoComplete="family-name" className="mt-2 min-h-12 rounded-lg border border-line px-4 text-ink focus:border-ink" />
            {error && (
              <p role="alert" className="mt-3 text-sm font-medium text-bordo">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-bordo px-6 font-semibold uppercase tracking-wide text-white hover:bg-bordo-deep"
            >
              Ingresar
            </button>
            <p className="mt-auto pt-8 text-xs leading-relaxed">
              Demostración: tus datos se guardan solo en este navegador. No se crea una cuenta real.
            </p>
          </form>
        )}
      </div>
    </Drawer>
  );
}

/* ---------- Carrito ---------- */

export function CartPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState<{ lines: string[]; total: string } | null>(null);
  const close = () => {
    setDone(null);
    onClose();
  };
  const cart = useCart();
  const user = useUser();
  const code = useZondaCode();

  const lines = cart
    .map((l) => ({ ...l, product: byId(l.id) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => Boolean(l.product?.price));
  const subtotal = lines.reduce((sum, l) => sum + l.product.price! * l.qty, 0);
  const total = code ? withDiscount(subtotal) : subtotal;

  const finish = () => {
    setDone({
      lines: lines.map((l) => `${l.product.name} · talle ${l.size} · x${l.qty}`),
      total: formatPrice(total),
    });
    clearCart();
  };

  return (
    <Drawer open={open} onClose={close} title={done ? "Pedido confirmado" : "Tu carrito"}>
      {done ? (
        <div className="flex flex-1 flex-col px-6 py-8">
          <span className="grid size-14 place-items-center rounded-full bg-bordo text-2xl text-white" aria-hidden="true">
            ✓
          </span>
          <p className="mt-5 text-2xl text-ink">¡Gracias{user ? `, ${user.nombre}` : ""}! Tu pedido está confirmado.</p>
          <ul className="mt-6 space-y-2 border-y border-line py-4 text-sm text-ink">
            {done.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between text-lg font-semibold text-ink">
            <span>Total</span>
            <span>{done.total}</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed">
            Esta demostración llega hasta acá: el pago y el envío no forman parte del proyecto.
          </p>
          <button
            type="button"
            onClick={close}
            className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold uppercase tracking-wide text-white hover:bg-bordo"
          >
            Seguir mirando
          </button>
        </div>
      ) : lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="text-2xl text-ink">Tu carrito está vacío</p>
          <p className="mt-2 max-w-[28ch] text-sm leading-relaxed">Elegí una prenda en Get the fit y agregala con tu talle.</p>
          <a
            href="#get-the-fit"
            onClick={close}
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-semibold uppercase tracking-wide text-white hover:bg-bordo"
          >
            Ver prendas
          </a>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {lines.map((l) => (
              <li key={`${l.id}-${l.size}`} className="flex gap-4 py-5">
                <span className="relative block size-20 shrink-0 overflow-hidden rounded-lg bg-soft">
                  <Photo photo={{ ...l.product.image, alt: "" }} sizes="80px" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm uppercase leading-snug text-ink">{l.product.name}</p>
                  <p className="mt-0.5 text-sm">Talle {l.size}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-full border border-line">
                      <button type="button" onClick={() => setQty(l.id, l.size, l.qty - 1)} className="size-9 text-lg text-ink" aria-label={`Quitar una unidad de ${l.product.name}`}>
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-ink" aria-live="polite">
                        {l.qty}
                      </span>
                      <button type="button" onClick={() => setQty(l.id, l.size, l.qty + 1)} className="size-9 text-lg text-ink" aria-label={`Sumar una unidad de ${l.product.name}`}>
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-ink">{formatPrice(l.product.price! * l.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line px-6 py-5">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {code && (
              <div className="mt-1 flex justify-between text-sm font-semibold text-bordo">
                <span>10% sorpresa Zonda</span>
                <span>− {formatPrice(subtotal - total)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between text-lg font-semibold text-ink">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={finish}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-bordo px-6 font-semibold uppercase tracking-wide text-white hover:bg-bordo-deep"
            >
              Finalizar compra
            </button>
            <button type="button" onClick={clearCart} className="mt-3 w-full text-center text-sm underline underline-offset-4 hover:text-bordo">
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
}
