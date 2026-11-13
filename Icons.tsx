/** Íconos de línea simples, dibujados a mano (sin librerías). */
type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const SearchIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const UserIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const CartIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 4h2.5l2.2 11h10.6L20.5 7H7" />
    <circle cx="9.5" cy="19.5" r="1.5" />
    <circle cx="17" cy="19.5" r="1.5" />
  </svg>
);

export const MenuIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const TruckIcon = ({ className = "size-24" }: P) => (
  <svg viewBox="0 0 64 64" className={className} {...base} strokeWidth={3}>
    <path d="M4 12h30v30H4zM34 22h12l10 10v10H34z" />
    <circle cx="14" cy="46" r="6" fill="#fff" />
    <circle cx="46" cy="46" r="6" fill="#fff" />
  </svg>
);

export const ExchangeIcon = ({ className = "size-24" }: P) => (
  <svg viewBox="0 0 64 64" className={className} {...base} strokeWidth={3}>
    <path d="M50 22A20 20 0 0 0 14 20" />
    <path d="M12 8v12h12" />
    <path d="M14 42a20 20 0 0 0 36 2" />
    <path d="M52 56V44H40" />
  </svg>
);

export const ChatIcon = ({ className = "size-24" }: P) => (
  <svg viewBox="0 0 64 64" className={className} {...base} strokeWidth={3}>
    <path d="M32 6a24 24 0 0 0-21 35.6L7 57l15.8-4.1A24 24 0 1 0 32 6z" />
    <path d="M24 22c0 10 8 18 18 18l3-4-6-3-3 2c-3-1.5-5.5-4-7-7l2-3-3-6z" />
  </svg>
);
