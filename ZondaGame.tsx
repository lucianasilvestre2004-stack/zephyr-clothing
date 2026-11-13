"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LIVES, missionOfTheDay, ROUND_SECONDS, TARGET, zondaItems, zondaMissions, type ZondaItem } from "@/content/zonda";
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
  const code = useZondaCode();
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
  const shake = useRef<HTMLDivElement>(null);
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
            y: 12 + Math.random() * 62,
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
      if (next.length >= TARGET) {
        unlockZonda();
        setPhase("won");
      }
    } else {
      shake.current?.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
        { duration: 260 },
      );
      const left = lives - 1;
      setLives(left);
      if (left <= 0) {
        setLostReason(`Agarraste prendas que no sirven para un día de ${mission.title.toLowerCase()}.`);
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
        <p className="mx-auto mt-4 max-w-[52ch] text-center leading-relaxed">
          En Mendoza el clima cambia en un rato. Atrapá las prendas que sirven para el clima de hoy y ganá{" "}
          <strong className="font-semibold text-bordo">10% OFF en toda la tienda, solo por hoy</strong>.
        </p>

        <div
          ref={shake}
          className={`relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-br ${mission?.sky ?? "from-soft to-line"} text-ink`}
        >
          {/* Ráfagas de viento de fondo */}
          {!staticMode && (
            <div aria-hidden="true" className="zonda-wind pointer-events-none absolute inset-0 opacity-60" />
          )}

          {/* Marcador */}
          {mission && (
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white/55 px-4 py-3 text-sm backdrop-blur sm:px-6">
              <p>
                <span className="font-semibold uppercase">{mission.title}</span>
                <span className="ml-2 text-gray-text">{mission.forecast}</span>
              </p>
              {phase === "playing" && (
                <p className="flex items-center gap-4 font-semibold" aria-live="polite">
                  <span>
                    Fit {caught.length}/{TARGET}
                  </span>
                  <span aria-label={`${lives} vidas`}>{"♥".repeat(lives)}<span className="text-ink/25">{"♥".repeat(LIVES - lives)}</span></span>
                  <span>{timeLeft}s</span>
                </p>
              )}
            </div>
          )}

          <div className="relative min-h-[26rem] sm:min-h-[30rem]">
            {!mission && <p className="p-10 text-center">Cargando el pronóstico…</p>}

            {/* INICIO */}
            {mission && phase === "intro" && (
              <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Misión del día</p>
                <p className="mt-3 text-3xl font-semibold uppercase sm:text-4xl">{mission.title}</p>
                <p className="mt-2 text-lg">{mission.forecast}</p>
                <p className="mt-6 max-w-[42ch] leading-relaxed">
                  {mission.tip} Tocá {TARGET} prendas correctas antes de que se las lleve el viento. Tenés {LIVES}{" "}
                  vidas y {ROUND_SECONDS} segundos.
                </p>
                {code && (
                  <p className="mt-6 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-bordo">
                    Ya ganaste tu 10% de hoy. Podés jugar igual.
                  </p>
                )}
                <button
                  type="button"
                  onClick={start}
                  className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-8 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-bordo"
                >
                  Jugar
                </button>
                {!prefersReduced && (
                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={calm} onChange={(e) => setCalm(e.target.checked)} className="size-4 accent-bordo" />
                    Jugar sin movimiento
                  </label>
                )}
              </div>
            )}

            {/* JUEGO CON VIENTO */}
            {mission && phase === "playing" && !staticMode && (
              <div className="absolute inset-0" aria-label="Prendas volando con el viento">
                {flying.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-label={f.item.name}
                    onPointerDown={() => catchItem(f.item, f.x, f.y + Math.sin(f.wobble) * 4, f.key)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && catchItem(f.item, f.x, f.y, f.key)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 touch-none"
                    style={{ left: `${f.x}%`, top: `${f.y + Math.sin(f.wobble) * 4}%`, rotate: `${Math.sin(f.wobble) * 14}deg` }}
                  >
                    <ItemBubble item={f.item} />
                  </button>
                ))}
              </div>
            )}

            {/* JUEGO SIN MOVIMIENTO */}
            {mission && phase === "playing" && staticMode && (
              <ul className="relative z-10 grid grid-cols-3 gap-4 p-6 sm:grid-cols-5 sm:p-10">
                {grid.map((item) => (
                  <li key={item.id} className="flex justify-center">
                    <button type="button" aria-label={item.name} onClick={() => catchItem(item, 50, 50)} className="flex flex-col items-center gap-2">
                      <ItemBubble item={item} />
                      <span className="text-xs font-semibold">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Feedback +1 / ✕ */}
            {!staticMode &&
              pops.slice(-6).map((p) => (
                <span
                  key={p.key}
                  aria-hidden="true"
                  className={`zonda-pop pointer-events-none absolute z-20 -translate-x-1/2 text-2xl font-extrabold ${p.good ? "text-[#1d7a3a]" : "text-bordo"}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {p.good ? "+1" : "✕"}
                </span>
              ))}

            {/* GANÓ */}
            {mission && phase === "won" && <WinPanel code={code} caught={caught} onReplay={start} />}

            {/* PERDIÓ */}
            {mission && phase === "lost" && (
              <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center" role="status">
                <p className="text-3xl font-semibold uppercase">El Zonda te ganó</p>
                <p className="mt-3 max-w-[40ch] leading-relaxed">{lostReason}</p>
                <p className="mt-2 text-sm">Prendas que servían: {mission.correct.map((id) => byId(id).name).join(", ")}.</p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-8 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-bordo"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs">
          Proyecto académico: el descuento y el código son de demostración y no se aplican en la tienda online real.
        </p>
      </div>
    </section>
  );
}

function ItemBubble({ item }: { item: ZondaItem }) {
  return (
    <span className="relative grid size-16 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-md transition-transform hover:scale-110 sm:size-20">
      {item.photo ? (
        <Photo photo={{ ...item.photo, alt: "" }} sizes="80px" />
      ) : (
        <span className="text-3xl sm:text-4xl">{item.emoji}</span>
      )}
    </span>
  );
}

function WinPanel({ code, caught, onReplay }: { code: string; caught: string[]; onReplay: () => void }) {
  const [left, setLeft] = useState(() => msUntilMidnight());
  useEffect(() => {
    const id = window.setInterval(() => setLeft(msUntilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center" role="status">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">¡Sobreviviste al Zonda!</p>
      <p className="mt-3 text-4xl font-extrabold uppercase text-bordo sm:text-5xl">10% OFF</p>
      <p className="mt-2 text-lg font-medium">en toda la tienda, solo por hoy</p>

      <div className="mt-6 rounded-xl border-2 border-dashed border-bordo bg-white/85 px-6 py-4">
        <p className="text-xs uppercase tracking-wide">Tu código</p>
        <p className="mt-1 text-2xl font-bold tracking-widest text-ink">{code}</p>
        <p className="mt-1 text-sm">
          Vence en {pad(h)}:{pad(m)}:{pad(s)}
        </p>
      </div>

      <p className="mt-6 text-sm">Tu fit del día: {caught.map((id) => byId(id).name).join(" + ")}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href="#get-the-fit"
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-bordo"
        >
          Ver precios con descuento
        </a>
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex min-h-12 items-center rounded-full border border-ink/30 bg-white/70 px-7 font-semibold uppercase tracking-wide hover:border-ink"
        >
          Jugar otra vez
        </button>
      </div>
    </div>
  );
}
