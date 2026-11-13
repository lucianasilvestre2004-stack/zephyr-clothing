"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./Icons";

/**
 * Panel con <dialog> nativo: atrapa el foco, cierra con Escape y tocando afuera.
 * side="right" = panel lateral; side="top" = buscador que baja desde arriba.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "right" | "top";
  children: ReactNode;
}) {
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

  const position =
    side === "right"
      ? "ml-auto mr-0 h-dvh max-h-dvh w-[min(26rem,92vw)]"
      : "mx-auto mt-0 w-full max-w-none";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={`${position} bg-white p-0 text-gray-text backdrop:bg-ink/50`}
    >
      {open && (
        <div className={`flex flex-col ${side === "right" ? "h-full" : ""}`}>
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-ink">{title}</span>
            <button type="button" onClick={onClose} className="-mr-2 inline-flex size-11 items-center justify-center hover:text-bordo">
              <CloseIcon />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
