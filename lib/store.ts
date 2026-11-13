import { useSyncExternalStore } from "react";

/**
 * ESTADO DE LA TIENDA (usuario y carrito)
 * Se guarda en el navegador de la clienta (localStorage). No hay servidor ni cuentas reales.
 */

export type CartLine = { id: string; size: string; qty: number };
export type User = { nombre: string; apellido: string };

const CART_KEY = "zephyr-cart";
const USER_KEY = "zephyr-user";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => (e.key === CART_KEY || e.key === USER_KEY) && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(key: string) {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento: los cambios duran mientras la página esté abierta.
    memory.set(key, value === null ? "" : JSON.stringify(value));
  }
  emit();
}

const memory = new Map<string, string>();
const snapshot = (key: string) => readRaw(key) || memory.get(key) || "";

function parse<T>(raw: string, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/* ---------- Carrito ---------- */

export function useCart(): CartLine[] {
  const raw = useSyncExternalStore(subscribe, () => snapshot(CART_KEY), () => "");
  return parse<CartLine[]>(raw, []);
}

const currentCart = () => parse<CartLine[]>(snapshot(CART_KEY), []);

export function addToCart(id: string, size: string) {
  const cart = currentCart();
  const line = cart.find((l) => l.id === id && l.size === size);
  if (line) line.qty += 1;
  else cart.push({ id, size, qty: 1 });
  write(CART_KEY, cart);
}

export function setQty(id: string, size: string, qty: number) {
  const cart = currentCart()
    .map((l) => (l.id === id && l.size === size ? { ...l, qty } : l))
    .filter((l) => l.qty > 0);
  write(CART_KEY, cart);
}

export const clearCart = () => write(CART_KEY, []);

/* ---------- Usuario ---------- */

export function useUser(): User | null {
  const raw = useSyncExternalStore(subscribe, () => snapshot(USER_KEY), () => "");
  return parse<User | null>(raw, null);
}

export const saveUser = (user: User) => write(USER_KEY, user);
export const logout = () => write(USER_KEY, null);

/* ---------- Pedidos entre componentes ---------- */

/** El buscador pide abrir una prenda; Get the fit la muestra en su vista de producto. */
export function requestOpenProduct(id: string) {
  window.dispatchEvent(new CustomEvent("zephyr:open-product", { detail: id }));
}

/** Pide abrir el carrito (por ejemplo, después de agregar una prenda). */
export function requestOpenCart() {
  window.dispatchEvent(new Event("zephyr:open-cart"));
}
