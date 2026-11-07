"use client";

import { useEffect, useRef, useState } from "react";
import { INSTAGRAM_URL, navItems, STORE_URL } from "@/content/site";
import { ExternalIcon } from "./ui/ButtonLink";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Header sticky: agrega fondo y borde al bajar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(id);
    };
  }, []);

  // Menú mobile: bloquea el scroll, atrapa el foco y cierra con Escape.
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
      if (e.key !== "Tab" || !panel || !toggleRef.current) return;
      const focusables = [toggleRef.current, ...Array.from(panel.querySelectorAll<HTMLElement>("a"))];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const dark = open;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        dark
          ? "on-dark bg-ink text-white"
          : scrolled
            ? "border-b border-ink/10 bg-paper/90 backdrop-blur-md"
            : "bg-paper"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-[4.5rem] lg:px-12">
        <a
          href="#inicio"
          onClick={() => setOpen(false)}
          className="type-display inline-flex min-h-11 items-center text-[1.9rem] leading-none"
          aria-label="Zephyr Clothing, ir al inicio"
        >
          Zephyr
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-[0.95rem] font-semibold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-bordo after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center px-3 text-sm font-bold hover:text-bordo lg:inline-flex"
          >
            Instagram
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-bordo sm:inline-flex"
          >
            Tienda
            <ExternalIcon className="size-3" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="relative -mr-2 grid size-12 place-items-center lg:hidden"
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <span aria-hidden="true" className="relative block h-3.5 w-7">
              <span
                className={`absolute left-0 top-0 h-[2.5px] w-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-[5.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 right-0 h-[2.5px] bg-current transition-all duration-300 ${
                  open ? "w-full -translate-y-[5.5px] -rotate-45" : "w-4/6"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menú mobile a pantalla completa */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="on-dark grain fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink text-white [--grain-opacity:0.18] lg:hidden"
      >
        <nav aria-label="Menú mobile" className="flex min-h-full flex-col justify-between px-5 pb-10 pt-6 sm:px-8">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="type-display block py-2 text-[clamp(3.2rem,17vw,6rem)] transition-colors hover:text-concrete"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-5 border-t border-white/20 pt-6">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 bg-white px-6 font-bold text-ink"
            >
              Ir a la tienda oficial
              <ExternalIcon />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 border-2 border-white px-6 font-bold text-white"
            >
              Seguinos en Instagram
              <ExternalIcon />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            <p className="text-sm text-concrete">Ropa urbana de mujer desde Mendoza, Argentina.</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
