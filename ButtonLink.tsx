import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "light" | "outline-light";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-white hover:bg-bordo",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
  light: "bg-white text-ink hover:bg-ink hover:text-white",
  "outline-light": "border-2 border-white text-white hover:bg-white hover:text-ink",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

/** Enlace con forma de botón. Siempre navega: a un ancla de la página o a un sitio externo real. */
export function ButtonLink({ href, children, variant = "solid", external, className = "" }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 px-6 text-[0.95rem] font-bold tracking-tight transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
      {external && (
        <>
          <ExternalIcon />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </>
      )}
    </a>
  );
}

export function ExternalIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M5 3h8v8M13 3 3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
