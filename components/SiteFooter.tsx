import { INSTAGRAM_HANDLE, INSTAGRAM_URL, navItems, STORE_URL } from "@/content/site";
import { ExternalIcon } from "./ui/ButtonLink";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <a href="#inicio" className="type-display text-[clamp(4rem,12vw,8rem)] leading-none">
              Zephyr
            </a>
            <p className="mt-4 max-w-[34ch] text-concrete">Ropa urbana de mujer desde Mendoza, Argentina.</p>
          </div>

          <nav aria-label="Pie de página" className="col-span-6 sm:col-span-4 lg:col-span-3 lg:col-start-7">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-10 items-center font-semibold hover:text-concrete">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 sm:col-span-4 lg:col-span-3">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 font-semibold hover:text-concrete"
            >
              Tienda online
              <ExternalIcon className="size-3" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            <p className="mt-1 break-all text-sm text-concrete">zephyrclothing.com.ar</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-10 items-center gap-2 font-semibold hover:text-concrete"
            >
              Instagram
              <ExternalIcon className="size-3" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            <p className="mt-1 break-all text-sm text-concrete">{INSTAGRAM_HANDLE}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs leading-relaxed text-concrete sm:flex-row sm:justify-between">
          <p className="max-w-[70ch]">
            Rediseño académico no oficial de Zephyr Clothing. Las fotos y prendas son provisionales, con fines de
            demostración; no son productos ni campañas de la marca.
          </p>
          <p>Diseño y desarrollo: Luciana Silvestre</p>
        </div>
      </div>
    </footer>
  );
}
