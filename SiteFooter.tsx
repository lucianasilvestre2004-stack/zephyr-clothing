import { ADDRESS, EMAIL, INSTAGRAM_URL, navItems, STORE_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/content/site";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function SiteFooter() {
  return (
    <footer id="contacto" aria-labelledby="contacto-title">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-20">
        <div>
          <h2 id="contacto-title" className="text-lg font-medium uppercase">
            Contáctanos
          </h2>
          <ul className="mt-2 space-y-1 text-lg">
            <li>
              <a href={WHATSAPP_URL} {...ext} className="text-[#2e8fd8] hover:underline">
                {WHATSAPP_NUMBER}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="break-all text-[#2e8fd8] hover:underline">
                {EMAIL}
              </a>
            </li>
            <li>{ADDRESS}</li>
          </ul>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-2xl uppercase leading-tight text-ink">Navegá la tienda</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-10 items-center hover:text-bordo">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={STORE_URL} {...ext} className="inline-flex min-h-10 items-center font-semibold text-bordo hover:underline">
                Comprar online
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex gap-3 md:justify-end">
          <a
            href={INSTAGRAM_URL}
            {...ext}
            className="inline-flex h-11 items-center rounded-md bg-[#e1306c] px-4 text-sm font-semibold text-white hover:opacity-90"
          >
            Instagram
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <a
            href={WHATSAPP_URL}
            {...ext}
            className="inline-flex h-11 items-center rounded-md bg-[#25a244] px-4 text-sm font-semibold text-white hover:opacity-90"
          >
            WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>

      <div className="on-dark bg-ink px-5 py-6 text-center text-xs leading-relaxed text-white sm:text-sm">
        <p>Zephyr Clothing — Mendoza, Argentina.</p>
        <p className="mt-1 text-white/70">
          Rediseño académico no oficial. Las fotos y prendas son de demostración. Diseño y desarrollo: Luciana
          Silvestre.
        </p>
      </div>
    </footer>
  );
}
