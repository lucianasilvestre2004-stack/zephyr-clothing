import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zephyr Clothing — Ropa urbana de mujer, Mendoza",
  description:
    "Ropa urbana de mujer desde Mendoza: denim, buzos, polleras y camperas. Armá tu outfit con Get the fit y mirá los New drops de Zephyr Clothing.",
  openGraph: {
    title: "Zephyr Clothing — Ropa urbana de Mendoza",
    description: "Ropa urbana, denim y básicos para moverte por la ciudad.",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ececea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
