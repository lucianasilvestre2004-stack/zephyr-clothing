"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { images } from "@/content/images";
import { useUser } from "@/lib/store";
import { CloseIcon } from "./ui/Icons";
import { Photo } from "./ui/Photo";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Banner con foto de fondo + cartel de suscripción a beneficios. */
export function Benefits() {
  const [open, setOpen] = useState(false);

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
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-bordo hover:text-white"
        >
          Quiero mis beneficios
        </button>
      </div>

      <SignupDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function SignupDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!open && dialog.open) dialog.close();
    if (!open) document.body.style.overflow = "";
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="suscripcion-titulo"
      className="m-auto w-[min(56rem,calc(100%-1.5rem))] overflow-hidden rounded-3xl bg-white p-0 text-gray-text backdrop:bg-ink/60"
    >
      {open && <SignupContent onClose={onClose} />}
    </dialog>
  );
}

function SignupContent({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const [done, setDone] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ nombre?: string; email?: string }>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const next: typeof errors = {};
    if (!nombre) next.nombre = "Contanos cómo te llamás.";
    if (!EMAIL_OK.test(email)) next.email = "Revisá tu email: tiene que ser del tipo nombre@mail.com.";
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      window.localStorage.setItem("zephyr-beneficios", JSON.stringify({ nombre, email }));
    } catch {
      // Sin almacenamiento: igual mostramos la confirmación.
    }
    setDone(nombre);
  };

  return (
    <div className="grid md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden bg-soft md:block">
        <Photo photo={images.drops1} sizes="400px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <p className="absolute inset-x-6 bottom-6 text-2xl font-semibold uppercase leading-tight text-white">
          Lo nuevo de Zephyr,
          <br />
          antes que nadie
        </p>
      </div>

      <div className="relative p-7 sm:p-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center text-ink hover:text-bordo"
        >
          <CloseIcon />
          <span className="sr-only">Cerrar</span>
        </button>

        {done ? (
          <div className="flex min-h-[22rem] flex-col justify-center" role="status">
            <span className="grid size-14 place-items-center rounded-full bg-bordo text-2xl text-white" aria-hidden="true">
              ✓
            </span>
            <p id="suscripcion-titulo" className="mt-6 text-3xl font-semibold uppercase leading-tight text-ink">
              ¡Ya sos parte, {done}!
            </p>
            <p className="mt-3 max-w-[36ch] leading-relaxed">
              Vas a ser de las primeras en enterarte de los nuevos ingresos, los descuentos y las promos de Zephyr.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-ink px-8 font-semibold uppercase tracking-wide text-white hover:bg-bordo"
            >
              Seguir mirando
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bordo">Beneficios exclusivos</p>
            <p id="suscripcion-titulo" className="mt-3 text-3xl font-semibold uppercase leading-tight text-ink">
              ¡Dejá tus datos y enterate de lo mejor!
            </p>
            <p className="mt-3 max-w-[38ch] leading-relaxed">
              Nuevos ingresos, descuentos y promos especiales directo a tu mail. Prometemos no llenarte la casilla.
            </p>

            <label htmlFor="sus-nombre" className="mt-7 block text-sm font-semibold uppercase text-ink">
              Nombre
            </label>
            <input
              id="sus-nombre"
              name="nombre"
              autoComplete="given-name"
              defaultValue={user?.nombre ?? ""}
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={errors.nombre ? "sus-nombre-error" : undefined}
              className="mt-2 min-h-12 w-full rounded-lg border border-line px-4 text-ink focus:border-ink"
            />
            {errors.nombre && (
              <p id="sus-nombre-error" className="mt-1.5 text-sm font-medium text-bordo">
                {errors.nombre}
              </p>
            )}

            <label htmlFor="sus-email" className="mt-5 block text-sm font-semibold uppercase text-ink">
              Email
            </label>
            <input
              id="sus-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@mail.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "sus-email-error" : undefined}
              className="mt-2 min-h-12 w-full rounded-lg border border-line px-4 text-ink placeholder:text-gray-text/50 focus:border-ink"
            />
            {errors.email && (
              <p id="sus-email-error" className="mt-1.5 text-sm font-medium text-bordo">
                {errors.email}
              </p>
            )}

            <button
              type="submit"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-bordo px-6 font-semibold uppercase tracking-wide text-white hover:bg-bordo-deep"
            >
              Quiero enterarme
            </button>
            <p className="mt-4 text-xs leading-relaxed">
              Demostración: tus datos se guardan solo en este navegador y no se envían a ningún lado.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
