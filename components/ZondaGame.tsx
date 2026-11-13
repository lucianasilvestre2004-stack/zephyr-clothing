"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  LIVES,
  missionOfTheDay,
  ROUND_SECONDS,
  TARGET,
  zondaItems,
  zondaMissions,
  type ZondaItem,
  type ZondaMission,
} from "@/content/zonda";
import { msUntilMidnight, unlockZonda, useZondaCode } from "@/lib/zonda";
import { Photo } from "./ui/Photo";

type Phase = "intro" | "playing" | "won" | "lost";

type Flying = {
  key: number;
  item: ZondaItem;
  x: number; // posición horizontal en % del tablero
  y: number; // altura base en %
  speed: number; // % por segundo
  wobble: number; // fase del vaivén
};

type Pop = { key: number; x: number; y: number; good: boolean };

const noop = () => () => {};
const byId = (id: string) => zondaItems.find((i) => i.id === id)!;

/** La misión se calcula en el navegador (depende de la fecha de la usuaria). */
function useMissionId() {
  return useSyncExternalStore(noop, () => missionOfTheDay().id, () => "");
}

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function ZondaGame() {
  const missionId = useMissionId();
  const mission = zondaMissions.find((m) => m.id === missionId);
  const prefersReduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("intro");
  const [calm, setCalm] = useState(false); // modo sin movimiento
  const [caught, setCaught] = useState<string[]>([]);
  const [lives, setLives] = useState(LIVES);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [flying, setFlying] = useState<Flying[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [lostReason, setLostReason] = useState("");
  const [grid, setGrid] = useState<ZondaItem[]>([]);

  const keyRef = useRef(0);
  const board = useRef<HTMLDivElement>(null);
  const staticMode = calm || prefersReduced;

  const start = useCallback(() => {
    if (!mission) return;
    setCaught([]);
    setLives(LIVES);
    setTimeLeft(ROUND_SECONDS);
    setFlying([]);
    setPops([]);
    setLostReason("");
    setGrid([...zondaItems].sort(() => Math.random() - 0.5).slice(0, 9));
    setPhase("playing");
  }, [mission]);

  // Bucle del viento: mueve las prendas de oeste a este y suma nuevas.
  useEffect(() => {
    if (phase !== "playing" || staticMode || !mission) return;
    let raf = 0;
    let last = performance.now();
    let sinceSpawn = 0;
    const startedAt = last;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = (now - startedAt) / 1000;
      sinceSpawn += dt;

      setFlying((list) => {
        const next = list
          .map((f) => ({ ...f, x: f.x + f.speed * dt, wobble: f.wobble + dt * 3 }))
          .filter((f) => f.x < 112);
        const every = Math.max(0.45, 0.9 - elapsed * 0.015); // cada vez más viento
        if (sinceSpawn >= every) {
          sinceSpawn = 0;
          const good = Math.random() < 0.45;
          const pool = zondaItems.filter((i) => mission.correct.includes(i.id) === good);
          const item = pool[Math.floor(Math.random() * pool.length)];
          next.push({
            key: ++keyRef.current,
            item,
            x: -14,
            y: 24 + Math.random() * 46,
            speed: 18 + Math.random() * 10 + elapsed * 0.6,
            wobble: Math.random() * 6,
          });
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, staticMode, mission]);

  // Reloj de la ronda.
  useEffect(() => {
    if (phase !== "playing") return;
    const deadline = Date.now() + ROUND_SECONDS * 1000;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) {
        setLostReason("Se terminó el tiempo antes de completar tu fit.");
        setPhase("lost");
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  const catchItem = (item: ZondaItem, x: number, y: number, key?: number) => {
    if (phase !== "playing" || !mission) return;
    const good = mission.correct.includes(item.id);
    setPops((p) => [...p, { key: ++keyRef.current, x, y, good }]);
    if (key !== undefined) setFlying((list) => list.filter((f) => f.key !== key));
    if (staticMode) setGrid((g) => g.filter((i) => i.id !== item.id));

    if (good) {
      if (caught.includes(item.id)) return;
      const next = [...caught, item.id];
      setCaught(next);
      if (next.length >= TARGET) setPhase("won");
    } else {
      board.current?.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
        { duration: 260 },
      );
      const left = lives - 1;
      setLives(left);
      if (left <= 0) {
        setLostReason(`Agarraste prendas que no sirven para un día así.`);
        setPhase("lost");
      }
    }
  };

  return (
    <section id="zonda" aria-labelledby="zonda-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-20">
        <h2 id="zonda-title" className="section-title">
          Se viene el Zonda
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-center leading-relaxed">
          En Mendoza el clima cambia en un rato. Atrapá las prendas justas para el día de hoy antes de que se las
          lleve el viento… y descubrí qué te deja el Zonda.
        </p>

        <div
          ref={board}
          className={`relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-b ${mission?.sky ?? "from-soft to-line"} text-ink shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]`}
        >
          {mission && <Landscape mission={mission} moving={!staticMode} />}

          <div className="relative min-h-[30rem] sm:min-h-[34rem]">
            {!mission && <p className="p-10 text-center">Cargando el pronóstico…</p>}

            {/* HUD: tarjeta de clima + vidas y tiempo */}
            {mission && phase === "playing" && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6">
                <WeatherCard mission={mission} compact />
                <div className="flex flex-col items-end gap-2" aria-live="polite">
                  <span className="rounded-full bg-white/85 px-3 py-1 text-lg tracking-widest text-bordo" aria-label={`${lives} vidas`}>
                    {"♥".repeat(lives)}
                    <span className="text-ink/20">{"♥".repeat(LIVES - lives)}</span>
                  </span>
                  <TimerRing seconds={timeLeft} />
                </div>
              </div>
            )}

            {/* INICIO */}
            {mission && phase === "intro" && <Intro mission={mission} onStart={start} calm={calm} setCalm={setCalm} showCalmToggle={!prefersReduced} />}

            {/* JUEGO CON VIENTO */}
            {mission && phase === "playing" && !staticMode && (
              <div className="absolute inset-0 z-10" aria-label="Prendas volando con el viento">
                {flying.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-label={f.item.name}
                    onPointerDown={() => catchItem(f.item, f.x, f.y + Math.sin(f.wobble) * 4, f.key)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && catchItem(f.item, f.x, f.y, f.key)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 touch-none"
                    style={{ left: `${f.x}%`, top: `${f.y + Math.sin(f.wobble) * 4}%`, rotate: `${Math.sin(f.wobble) * 16}deg` }}
                  >
                    <ItemBubble item={f.item} />
                  </button>
                ))}
              </div>
            )}

            {/* JUEGO SIN MOVIMIENTO */}
            {mission && phase === "playing" && staticMode && (
              <ul className="relative z-10 grid grid-cols-3 gap-4 px-6 pb-28 pt-36 sm:grid-cols-5 sm:px-10">
                {grid.map((item) => (
                  <li key={item.id} className="flex justify-center">
                    <button type="button" aria-label={item.name} onClick={() => catchItem(item, 50, 50)} className="flex flex-col items-center gap-2">
                      <ItemBubble item={item} />
                      <span className="rounded-full bg-white/80 px-2 text-xs font-semibold">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Tu fit: casilleros que se llenan */}
            {mission && phase === "playing" && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-3 p-4 sm:p-5">
                <span className="mr-1 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Tu fit</span>
                {Array.from({ length: TARGET }, (_, i) => {
                  const id = caught.at(i);
                  return (
                    <span
                      key={i}
                      className={`grid size-12 place-items-center overflow-hidden rounded-xl border-2 sm:size-14 ${
                        id ? "zonda-slot border-white bg-white" : "border-dashed border-white/80 bg-white/25"
                      }`}
                    >
                      {id ? <SlotIcon item={byId(id)} /> : <span className="text-lg font-semibold text-white">?</span>}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Feedback +1 / ✕ */}
            {!staticMode &&
              pops.slice(-6).map((p) => (
                <span
                  key={p.key}
                  aria-hidden="true"
                  className={`zonda-pop pointer-events-none absolute z-30 -translate-x-1/2 text-3xl font-extrabold drop-shadow ${p.good ? "text-white" : "text-bordo"}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {p.good ? "+1" : "✕"}
                </span>
              ))}

            {/* GANÓ: regalo sorpresa */}
            {mission && phase === "won" && <Surprise caught={caught} onReplay={start} />}

            {/* PERDIÓ */}
            {mission && phase === "lost" && (
              <Overlay>
                <p className="text-sm font-semibold uppercase tracking-[0.25em]">Ráfaga fuerte</p>
                <p className="mt-2 text-4xl font-extrabold uppercase sm:text-5xl">El Zonda te ganó</p>
                <p className="mt-3 max-w-[40ch] leading-relaxed">{lostReason}</p>
                <p className="mt-2 max-w-[44ch] text-sm">Servían: {mission.correct.map((id) => byId(id).name).join(", ")}.</p>
                <PrimaryButton onClick={start}>Reintentar</PrimaryButton>
              </Overlay>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Escenografía ---------- */

/** Cielo con sol, cordillera de los Andes en dos capas, polvo y ráfagas. */
function Landscape({ mission, moving }: { mission: ZondaMission; moving: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute right-[12%] top-[10%] size-24 rounded-full blur-[1px] sm:size-32" style={{ background: mission.sun, boxShadow: `0 0 80px 30px ${mission.sun}` }} />
      {moving && <div className="zonda-wind absolute inset-0 opacity-70" />}
      {moving && <div className="zonda-dust absolute inset-0" />}
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[38%] w-full">
        <path
          d="M0 210 L90 140 L160 180 L260 70 L330 130 L420 90 L520 160 L610 60 L700 140 L790 100 L880 170 L980 80 L1080 150 L1200 110 L1200 300 L0 300Z"
          fill={mission.mountainFar}
          opacity="0.75"
        />
        <path d="M250 74 L260 70 L282 92 L268 88Z M600 66 L610 60 L634 84 L618 80Z M970 86 L980 80 L1002 102 L988 98Z" fill="#fff" opacity="0.8" />
        <path
          d="M0 260 L120 200 L220 240 L340 170 L450 230 L560 190 L680 250 L800 200 L920 245 L1040 195 L1200 240 L1200 300 L0 300Z"
          fill={mission.mountainNear}
        />
      </svg>
    </div>
  );
}

function WeatherCard({ mission, compact = false }: { mission: ZondaMission; compact?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white/85 text-left shadow-sm backdrop-blur ${compact ? "px-4 py-2.5" : "px-6 py-4"}`}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-text">Pronóstico de hoy · Mendoza</p>
      <p className={`font-extrabold leading-none text-ink ${compact ? "mt-1 text-3xl" : "mt-2 text-5xl"}`}>{mission.temp}</p>
      <p className={`font-semibold uppercase ${compact ? "text-xs" : "mt-1 text-sm"}`}>{mission.title}</p>
      {!compact && <p className="mt-1 text-sm text-gray-text">{mission.forecast}</p>}
    </div>
  );
}

function TimerRing({ seconds }: { seconds: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-14 place-items-center rounded-full bg-white/85">
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={seconds <= 8 ? "#9b1b1e" : "#0d0d0d"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - seconds / ROUND_SECONDS)}
          style={{ transition: "stroke-dashoffset 0.25s linear" }}
        />
      </svg>
      <span className="relative text-sm font-bold">{seconds}s</span>
    </span>
  );
}

/* ---------- Pantallas ---------- */

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-20 flex min-h-[30rem] items-center justify-center p-5 sm:min-h-[34rem]">
      <div className="flex w-full max-w-xl flex-col items-center rounded-3xl bg-white/80 px-6 py-10 text-center shadow-lg backdrop-blur-md" role="status">
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-9 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-bordo"
    >
      {children}
    </button>
  );
}

function Intro({
  mission,
  onStart,
  calm,
  setCalm,
  showCalmToggle,
}: {
  mission: ZondaMission;
  onStart: () => void;
  calm: boolean;
  setCalm: (v: boolean) => void;
  showCalmToggle: boolean;
}) {
  return (
    <Overlay>
      <WeatherCard mission={mission} />
      <p className="mt-6 max-w-[40ch] leading-relaxed">
        {mission.tip} Tocá <strong>{TARGET} prendas</strong> que sirvan para hoy antes de que se las lleve el viento.
      </p>
      <ul className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-semibold uppercase">
        <li className="rounded-full bg-ink/5 px-3 py-1">♥ {LIVES} vidas</li>
        <li className="rounded-full bg-ink/5 px-3 py-1">⏱ {ROUND_SECONDS} segundos</li>
        <li className="rounded-full bg-ink/5 px-3 py-1">🎁 Sorpresa al final</li>
      </ul>
      <PrimaryButton onClick={onStart}>Jugar</PrimaryButton>
      {showCalmToggle && (
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={calm} onChange={(e) => setCalm(e.target.checked)} className="size-4 accent-bordo" />
          Jugar sin movimiento
        </label>
      )}
    </Overlay>
  );
}

/** Regalo cerrado que se abre al tocarlo y revela el premio. */
function Surprise({ caught, onReplay }: { caught: string[]; onReplay: () => void }) {
  const [opened, setOpened] = useState(false);
  const code = useZondaCode();

  if (!opened) {
    return (
      <Overlay>
        <p className="text-sm font-semibold uppercase tracking-[0.25em]">¡Sobreviviste al Zonda!</p>
        <p className="mt-2 text-2xl font-semibold uppercase sm:text-3xl">El viento te dejó algo</p>
        <button
          type="button"
          onClick={() => {
            unlockZonda();
            setOpened(true);
          }}
          className="zonda-gift mt-8 rounded-2xl focus-visible:outline-offset-8"
          aria-label="Abrir tu sorpresa"
        >
          <GiftBox />
        </button>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide">Tocá el regalo para abrirlo</p>
      </Overlay>
    );
  }

  return <Reveal code={code} caught={caught} onReplay={onReplay} />;
}

function Reveal({ code, caught, onReplay }: { code: string; caught: string[]; onReplay: () => void }) {
  const [left, setLeft] = useState(() => msUntilMidnight());
  useEffect(() => {
    const id = window.setInterval(() => setLeft(msUntilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);

  return (
    <div className="relative z-20">
      <Confetti />
      <Overlay>
        <p className="text-sm font-semibold uppercase tracking-[0.25em]">Tu sorpresa</p>
        <p className="zonda-reveal mt-2 text-6xl font-extrabold uppercase text-bordo sm:text-7xl">10% OFF</p>
        <p className="mt-2 text-lg font-medium">en toda la tienda, solo por hoy</p>

        <div className="mt-6 rounded-2xl border-2 border-dashed border-bordo bg-white px-6 py-4">
          <p className="text-xs uppercase tracking-wide">Tu código</p>
          <p className="mt-1 text-2xl font-bold tracking-widest text-ink">{code}</p>
          <p className="mt-1 text-sm">
            Vence en {pad(h)}:{pad(m)}:{pad(s)}
          </p>
        </div>

        <ul className="mt-6 flex items-center gap-3" aria-label="Tu fit del día">
          {caught.map((id) => (
            <li key={id} className="grid size-14 place-items-center overflow-hidden rounded-xl border-2 border-white bg-white shadow">
              <SlotIcon item={byId(id)} />
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#get-the-fit"
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-bordo"
          >
            Ver precios con descuento
          </a>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex min-h-12 items-center rounded-full border border-ink/25 bg-white px-7 font-semibold uppercase tracking-wide hover:border-ink"
          >
            Jugar otra vez
          </button>
        </div>
        <p className="mt-5 max-w-[46ch] text-xs text-gray-text">
          Proyecto académico: el descuento y el código son de demostración y no se aplican en la tienda online real.
        </p>
      </Overlay>
    </div>
  );
}

/* ---------- Piezas ---------- */

function ItemBubble({ item }: { item: ZondaItem }) {
  return (
    <span className="relative grid size-16 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-110 sm:size-20">
      {item.photo ? <Photo photo={{ ...item.photo, alt: "" }} sizes="80px" /> : <span className="text-3xl sm:text-4xl">{item.emoji}</span>}
    </span>
  );
}

function SlotIcon({ item }: { item: ZondaItem }) {
  return item.photo ? (
    <span className="relative block size-full">
      <Photo photo={{ ...item.photo, alt: "" }} sizes="56px" />
    </span>
  ) : (
    <span className="text-2xl">{item.emoji}</span>
  );
}

function GiftBox() {
  return (
    <svg viewBox="0 0 160 150" className="w-36 sm:w-44" aria-hidden="true">
      <rect x="18" y="62" width="124" height="80" rx="10" fill="#0d0d0d" />
      <rect x="10" y="40" width="140" height="30" rx="8" fill="#1f1f1f" />
      <rect x="72" y="40" width="16" height="102" fill="#9b1b1e" />
      <path d="M80 40 C60 10, 30 18, 44 36 C50 44, 70 42, 80 40Z" fill="#9b1b1e" />
      <path d="M80 40 C100 10, 130 18, 116 36 C110 44, 90 42, 80 40Z" fill="#9b1b1e" />
      <circle cx="80" cy="40" r="7" fill="#6e1215" />
      <text x="80" y="112" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="Poppins, sans-serif">
        ?
      </text>
    </svg>
  );
}

/** Papelitos que caen al revelar el premio (respuesta a la acción de abrir el regalo). */
function Confetti() {
  const colors = ["#9b1b1e", "#0d0d0d", "#f0f0f0", "#c98f5c", "#4f6377"];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 26 }, (_, i) => (
        <span
          key={i}
          className="zonda-confetti absolute top-[-10%] block h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors.at(i % colors.length),
            animationDelay: `${(i % 9) * 0.12}s`,
            animationDuration: `${2.4 + (i % 5) * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
