"use client";

import { useEffect, useRef, useState } from "react";
import { INSTAGRAM_URL, navItems, PROMO_TEXT, STORE_URL, WHATSAPP_URL } from "@/content/site";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./ui/Icons";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Panel del menú: bloquea el scroll, atrapa el foco y cierra con Escape.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>("a, button"));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Barra de promociones: cinta que corre hacia la izquierda y se repite */}
      <div className="promo-bar group overflow-hidden bg-ink py-2.5 text-white">
        <p className="sr-only">{PROMO_TEXT}</p>
        <div aria-hidden="true" className="promo-track flex w-max group-hover:[animation-play-state:paused]">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="whitespace-nowrap px-8 text-xs font-semibold uppercase tracking-wide md:text-sm">
                  {PROMO_TEXT}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p aria-hidden="true" className="promo-static hidden px-4 text-center text-xs font-semibold uppercase tracking-wide md:text-sm">
          {PROMO_TEXT}
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 md:h-28 lg:px-20">
          <a href="#inicio" aria-label="Zephyr, ir al inicio" className="flex items-start">
            <span className="text-[2.6rem] font-extrabold leading-none tracking-[-0.03em] text-bordo sm:text-5xl md:text-[4.6rem]">
              ZEPHYR
            </span>
            <span className="ml-1 mt-0.5 text-xs font-semibold text-bordo md:text-base">JS</span>
          </a>

          <nav aria-label="Accesos" className="flex items-center gap-1 sm:gap-3 md:gap-6">
            <a href={STORE_URL} {...ext} className="hidden min-h-11 items-center gap-2 px-2 text-lg font-medium hover:text-bordo lg:inline-flex">
              <SearchIcon /> Buscar
              <span className="sr-only">(en la tienda online, pestaña nueva)</span>
            </a>
            <a href={STORE_URL} {...ext} className="hidden min-h-11 items-center gap-2 px-2 text-lg font-medium hover:text-bordo lg:inline-flex">
              <UserIcon /> Usuario
              <span className="sr-only">(en la tienda online, pestaña nueva)</span>
            </a>
            <a href={STORE_URL} {...ext} className="inline-flex min-h-11 items-center gap-2 px-2 text-lg font-medium hover:text-bordo">
              <CartIcon />
              <span className="hidden sm:inline">Carrito</span>
              <span className="sr-only">(en la tienda online, pestaña nueva)</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-principal"
              className="inline-flex min-h-11 items-center gap-2 px-2 text-lg font-medium hover:text-bordo"
            >
              <MenuIcon />
              <span className="hidden sm:inline">Menú</span>
              <span className="sr-only sm:hidden">Abrir menú</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Menú lateral con las anclas de la página */}
      <div
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="menu-principal"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        hidden={!open}
        className="fixed inset-y-0 right-0 z-50 flex w-[min(24rem,88vw)] flex-col bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide">Menú</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
            className="-mr-2 inline-flex size-11 items-center justify-center hover:text-bordo"
          >
            <CloseIcon />
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>
        <nav aria-label="Secciones" className="mt-8">
          <ul className="divide-y divide-line border-y border-line">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center text-xl font-medium uppercase text-ink hover:text-bordo"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto grid gap-3 pt-8">
          <a href={STORE_URL} {...ext} className="inline-flex min-h-12 items-center justify-center rounded-full bg-bordo px-6 font-semibold text-white hover:bg-bordo-deep">
            Comprar online
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a href={INSTAGRAM_URL} {...ext} className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/20 font-semibold text-ink hover:border-ink">
              Instagram
            </a>
            <a href={WHATSAPP_URL} {...ext} className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/20 font-semibold text-ink hover:border-ink">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
