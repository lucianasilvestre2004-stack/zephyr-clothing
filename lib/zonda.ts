import { useSyncExternalStore } from "react";

/**
 * DESCUENTO DEL JUEGO ZONDA
 * Se guarda en el navegador de la usuaria (localStorage) junto con la fecha del día.
 * Al día siguiente deja de ser válido: el descuento dura solo el día en que se gana.
 */
const KEY = "zephyr-zonda";
export const ZONDA_DISCOUNT = 0.1;

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Reward = { date: string; code: string };

function read(): Reward | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const reward = JSON.parse(raw) as Reward;
    return reward.date === todayKey() ? reward : null;
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Devuelve el código del día si la usuaria ya ganó hoy, o "" si no. */
export function useZondaCode() {
  return useSyncExternalStore(
    subscribe,
    () => read()?.code ?? "",
    () => "",
  );
}

/** Desbloquea el 10% del día y devuelve el código. */
export function unlockZonda() {
  const now = new Date();
  const code = `ZONDA10-${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}`;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ date: todayKey(now), code }));
  } catch {
    // Sin almacenamiento disponible: el descuento vale mientras la página esté abierta.
  }
  emit();
  return code;
}

/** Milisegundos que faltan para la medianoche (cuando vence el descuento). */
export function msUntilMidnight(now = new Date()) {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now.getTime();
}

export const withDiscount = (price: number) => Math.round(price * (1 - ZONDA_DISCOUNT));
