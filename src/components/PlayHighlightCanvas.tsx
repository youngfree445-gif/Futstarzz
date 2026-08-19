import React, { useEffect, useRef } from 'react';
import { PlayClipType } from '../types';

// Highlight animado que dramatiza una decisión de partido en Canvas, mostrado ANTES del texto
// narrado (ver handleChoice en MatchSimulator.tsx). No es un motor de simulación jugable: es una
// coreografía corta sobre un resultado que el motor ya calculó (isSuccess), pensada para que el
// jugador "vea" la jugada en cancha antes de leer el resumen.
//
// Reescrito tras una auditoría geométrica que encontró remates que terminaban fuera de la cancha,
// goles que no llegaban a tocar el arco dibujado, y velocidades inconsistentes entre tramos
// contiguos de la misma jugada. Esta versión define el terreno y los arcos como constantes
// derivadas (nunca números sueltos), calcula la velocidad de cada tramo a partir de la distancia
// real a recorrer (no de una duración fija en ms elegida a ojo), y pasa TODA posición -- jugadores
// y pelota por igual -- por un clamp real antes de dibujarla. 'posicionamiento' se sacó del
// catálogo: no había forma de representarlo con la pelota siempre en juego sin que se viera como
// un error de renderizado, así que esas decisiones vuelven a mostrar solo el texto narrado.

interface PlayHighlightCanvasProps {
  clipType: PlayClipType;
  isSuccess: boolean;
  onComplete: () => void;
}

// --- Geometría de la cancha, todo derivado de estas 3 constantes ---
const W = 700;
const H = 340;
const MARGIN = 40;
const PITCH_MIN_X = MARGIN;
const PITCH_MAX_X = W - MARGIN;
const PITCH_MIN_Y = MARGIN;
const PITCH_MAX_Y = H - MARGIN;
const PITCH_CENTER_Y = H / 2;

const GOAL_HALF_HEIGHT = 25; // el arco mide 50px de alto, 25 arriba y 25 abajo del centro
const GOAL_DEPTH = 6; // profundidad visual del arco, hacia afuera de la cancha
const GOAL_LEFT_LINE_X = PITCH_MIN_X; // línea de meta izquierda: coincide con el borde de cancha
const GOAL_RIGHT_LINE_X = PITCH_MAX_X; // línea de meta derecha: coincide con el borde de cancha
const GOAL_TOP_Y = PITCH_CENTER_Y - GOAL_HALF_HEIGHT;
const GOAL_BOTTOM_Y = PITCH_CENTER_Y + GOAL_HALF_HEIGHT;

// Un remate "gol" debe terminar DENTRO del rectángulo del arco (entre la línea de meta y el fondo
// de la red), nunca antes de la línea (se vería que no entra) ni después de MARGIN (se saldría del
// canvas). Este es el único lugar del archivo donde se define "dónde está el arco" -- todo lo demás
// se calcula a partir de acá.
function goalMouthPoint(side: 'left' | 'right', verticalBias: number): { x: number; y: number } {
  // verticalBias en [-1, 1]: -1 = palo de arriba, 0 = centro, 1 = palo de abajo.
  const y = PITCH_CENTER_Y + verticalBias * (GOAL_HALF_HEIGHT - 6);
  const x = side === 'left' ? GOAL_LEFT_LINE_X - GOAL_DEPTH / 2 : GOAL_RIGHT_LINE_X + GOAL_DEPTH / 2;
  return { x, y };
}

/**
 * Los colores de los jugadores salen del TEMA DEL CLUB, no de un hex escrito acá.
 *
 * clubTheme.ts repinta toda la app reescribiendo --color-gold-* y --color-burgundy-* con una escala
 * derivada del color de camiseta del club (Club.themeColor en data.ts). Como Tailwind referencia
 * esas variables con var(...), cualquier bg-gold-400 de cualquier pantalla se repinta solo.
 *
 * Este canvas no: dibuja con ctx.fillStyle, que no pasa por CSS. Con los hex fijos que había antes
 * -- gold-400 y burgundy-600 del tema por defecto -- era el ÚNICO elemento del juego que se quedaba
 * dorado mientras el resto de la pantalla se ponía roja jugando con Junior, o verde con Nacional.
 *
 * Se leen en cada corrida y no una sola vez al cargar el módulo: el jugador cambia de club a mitad
 * de carrera y las variables cambian con él.
 */
function colorDelTema(variable: string, porDefecto: string): string {
  if (typeof window === 'undefined') return porDefecto;
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || porDefecto;
}
const GK_COLOR = '#d9dcd8';
const PITCH_COLOR = '#0f2417';
const OK = '#7fb87f';
const BAD = '#d1547a'; // burgundy-400, para que el rojo de fallo no desentone con la paleta del juego

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOutSine(t: number) { return -(Math.cos(Math.PI * t) - 1) / 2; }
function dist(a: { x: number; y: number }, b: { x: number; y: number }) { return Math.hypot(b.x - a.x, b.y - a.y); }

interface Vec { x: number; y: number; }
interface Entity extends Vec { r: number; color: string; }

// Todo punto que se vaya a dibujar pasa por acá, jugador o pelota por igual -- así ningún ajuste
// futuro de MARGIN o de una posición de spawn puede volver a sacar algo del rectángulo de cancha
// sin que se note.
function clampToPitch<T extends Vec>(p: T): T {
  return { ...p, x: Math.min(PITCH_MAX_X, Math.max(PITCH_MIN_X, p.x)), y: Math.min(PITCH_MAX_Y, Math.max(PITCH_MIN_Y, p.y)) };
}

// Un remate al arco es el único movimiento que legítimamente cruza la línea de meta -- clampear
// esas trayectorias con clampToPitch las dejaría rebotando en el borde antes de entrar. Este clamp
// aparte solo evita que la pelota se vaya del canvas entero (con margen para el fondo de la red).
function clampToCanvas(p: Vec): Vec {
  return { x: Math.min(W - 4, Math.max(4, p.x)), y: Math.min(H - 4, Math.max(4, p.y)) };
}

// Duración de un tramo a partir de la distancia real a recorrer, no un número fijo elegido a ojo:
// evita el salto de ritmo entre tramos contiguos que tenía la versión anterior (un sprint de golpe
// seguido de un tramo casi congelado). speedPxPerMs se ajusta por "carácter" de la jugada (un
// trote es más lento que un remate), pero dentro de un mismo tramo la velocidad es constante.
function durationFor(distancePx: number, speedPxPerMs: number, minMs = 220, maxMs = 1100) {
  return Math.min(maxMs, Math.max(minMs, distancePx / speedPxPerMs));
}

const SPEED_TROTE = 0.42; // desplazamiento caminando/trotando (posicionamiento eliminado, pero se reusa para arranques)
const SPEED_CARRERA = 0.58; // sprint con la pelota dominada
const SPEED_PASE = 0.62; // pelota viajando en un pase
const SPEED_REMATE = 0.95; // pelota viajando tras un disparo

export default function PlayHighlightCanvas({ clipType, isSuccess, onComplete }: PlayHighlightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let cancelled = false;

    // El color del club, leído al empezar la jugada (ver colorDelTema arriba).
    const HOME = colorDelTema('--color-gold-400', '#c0a047');
    const RIVAL = colorDelTema('--color-burgundy-600', '#7d0e2d');

    function drawPitch() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = PITCH_COLOR;
      ctx!.fillRect(0, 0, W, H);
      for (let i = 0; i < 10; i++) {
        ctx!.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.06)';
        ctx!.fillRect((W / 10) * i, 0, W / 10, H);
      }
      ctx!.strokeStyle = 'rgba(243,241,234,0.35)';
      ctx!.lineWidth = 2;
      ctx!.strokeRect(PITCH_MIN_X, PITCH_MIN_Y, PITCH_MAX_X - PITCH_MIN_X, PITCH_MAX_Y - PITCH_MIN_Y);
      ctx!.beginPath();
      ctx!.moveTo(W / 2, PITCH_MIN_Y);
      ctx!.lineTo(W / 2, PITCH_MAX_Y);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(W / 2, PITCH_CENTER_Y, 55, 0, Math.PI * 2);
      ctx!.stroke();
      // Áreas grandes, del ancho del arco + margen táctico.
      ctx!.strokeRect(PITCH_MIN_X, PITCH_CENTER_Y - 90, 95, 180);
      ctx!.strokeRect(PITCH_MAX_X - 95, PITCH_CENTER_Y - 90, 95, 180);
      // Arcos: red hacia afuera de la cancha, palos sobre la línea de meta.
      ctx!.fillStyle = 'rgba(243,241,234,0.12)';
      ctx!.fillRect(GOAL_LEFT_LINE_X - GOAL_DEPTH, GOAL_TOP_Y, GOAL_DEPTH, GOAL_BOTTOM_Y - GOAL_TOP_Y);
      ctx!.fillRect(GOAL_RIGHT_LINE_X, GOAL_TOP_Y, GOAL_DEPTH, GOAL_BOTTOM_Y - GOAL_TOP_Y);
      ctx!.fillStyle = 'rgba(243,241,234,0.75)';
      ctx!.fillRect(GOAL_LEFT_LINE_X - 2, GOAL_TOP_Y, 2, GOAL_BOTTOM_Y - GOAL_TOP_Y);
      ctx!.fillRect(GOAL_RIGHT_LINE_X, GOAL_TOP_Y, 2, GOAL_BOTTOM_Y - GOAL_TOP_Y);
    }

    function drawPlayer(p: Entity, opts?: { squashX?: number; squashY?: number; rotate?: number }) {
      const o = opts || {};
      ctx!.save();
      if (o.rotate) { ctx!.translate(p.x, p.y); ctx!.rotate(o.rotate); ctx!.translate(-p.x, -p.y); }
      ctx!.beginPath();
      ctx!.ellipse(p.x, p.y, p.r * (o.squashX ?? 1), p.r * (o.squashY ?? 1), 0, 0, Math.PI * 2);
      ctx!.fillStyle = p.color;
      ctx!.fill();
      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx!.stroke();
      ctx!.restore();
    }

    // Pelota reconocible como balón: blanco con los "gajos" pentagonales clásicos, no un círculo
    // liso. Gira acumulando spin proporcional a la distancia recorrida (no a los frames), así una
    // pelota quieta no gira y una que viaja rápido gira más rápido -- coherente con rodar de verdad.
    let ballSpin = 0;
    function drawBall(x: number, y: number, r = 6.5) {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(ballSpin);
      ctx!.beginPath();
      ctx!.arc(0, 0, r, 0, Math.PI * 2);
      ctx!.fillStyle = '#f5f3ec';
      ctx!.fill();
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx!.stroke();
      ctx!.fillStyle = '#232a25';
      const drawPentagon = (cx: number, cy: number, size: number, rot: number) => {
        ctx!.beginPath();
        for (let i = 0; i < 5; i++) {
          const ang = rot + (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const px = cx + Math.cos(ang) * size;
          const py = cy + Math.sin(ang) * size;
          if (i === 0) ctx!.moveTo(px, py); else ctx!.lineTo(px, py);
        }
        ctx!.closePath();
        ctx!.fill();
      };
      drawPentagon(0, 0, r * 0.42, 0);
      for (let i = 0; i < 5; i++) {
        const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        drawPentagon(Math.cos(ang) * r * 0.72, Math.sin(ang) * r * 0.72, r * 0.24, ang);
      }
      ctx!.restore();
    }

    function ballAtFoot(owner: Vec, angleDeg: number, offset: number): Vec {
      const rad = (angleDeg * Math.PI) / 180;
      return { x: owner.x + Math.cos(rad) * offset, y: owner.y + Math.sin(rad) * offset };
    }

    function wait(ms: number) { return new Promise<void>(res => setTimeout(res, ms)); }

    // Interpola una entidad de start a end en línea recta a velocidad constante (px/ms real, no una
    // duración inventada), reportando t en cada frame para que el caller pueda sumar efectos (arco
    // parabólico, squash, etc.) sobre esa base. Clampea el resultado antes de devolverlo.
    function tween(start: Vec, end: Vec, speedPxPerMs: number, draw: (p: Vec, t: number) => void, opts?: { canvasOnly?: boolean; minMs?: number; maxMs?: number }) {
      const d = dist(start, end);
      const durationMs = durationFor(d, speedPxPerMs, opts?.minMs, opts?.maxMs);
      const clamp = opts?.canvasOnly ? clampToCanvas : clampToPitch;
      return new Promise<void>(resolve => {
        const t0 = performance.now();
        function frame(now: number) {
          if (cancelled) { resolve(); return; }
          const t = Math.min(1, (now - t0) / durationMs);
          const raw = { x: lerp(start.x, end.x, t), y: lerp(start.y, end.y, t) };
          const p = clamp(raw);
          ballSpin += (d / durationMs) * 0.02;
          draw(p, t);
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    }

    function showVerdict(text: string, ok: boolean) {
      const el = verdictRef.current;
      if (!el) return;
      el.textContent = text;
      el.style.color = ok ? OK : BAD;
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%, 0)';
    }
    function hideVerdict() {
      const el = verdictRef.current;
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, 10px)';
    }

    async function run() {
      // Posiciones base: jugador propio a la izquierda de cancha, compañero adelantado, rival
      // entre ambos, arquero rival sobre su línea de meta -- todas ya dentro del rectángulo.
      const me: Entity = { x: PITCH_MIN_X + 120, y: PITCH_CENTER_Y, r: 15, color: HOME };
      const mate: Entity = { x: W / 2 + 140, y: PITCH_CENTER_Y - 55, r: 15, color: HOME };
      const rival: Entity = { x: W / 2 + 10, y: PITCH_CENTER_Y - 30, r: 15, color: RIVAL };
      const gk: Entity = { x: PITCH_MAX_X - 30, y: PITCH_CENTER_Y, r: 14, color: GK_COLOR };
      let ball: Vec = ballAtFoot(me, 0, 20);

      const renderAll = () => {
        drawPitch();
        drawPlayer(rival);
        drawPlayer(mate);
        drawPlayer(me);
        drawPlayer(gk);
        drawBall(ball.x, ball.y);
      };

      renderAll();
      await wait(280);

      switch (clipType) {
        // -----------------------------------------------------------------
        // GOL: carrera hacia el área rival, remate a un punto DENTRO del
        // rectángulo del arco (nunca antes de la línea de meta).
        // -----------------------------------------------------------------
        case 'gol': {
          const runTarget = { x: PITCH_MAX_X - 170, y: PITCH_CENTER_Y - 10 };
          await tween(me, runTarget, SPEED_CARRERA, p => {
            me.x = p.x; me.y = p.y;
            ball = ballAtFoot(me, 0, 20);
            drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(gk); drawPlayer(me); drawBall(ball.x, ball.y);
          });

          if (isSuccess) {
            const target = goalMouthPoint('right', -0.4); // arriba del centro, clásico ángulo de gol
            await tween(ball, target, SPEED_REMATE, p => {
              ball = p;
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(me);
              drawPlayer(gk, { squashX: 0.9, squashY: 1.1 });
              drawBall(ball.x, ball.y);
            }, { canvasOnly: true });
            showVerdict('¡GOL!', true);
          } else {
            const savePoint = { x: gk.x - 14, y: gk.y };
            await tween(ball, savePoint, SPEED_REMATE, p => {
              ball = p;
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(me);
              drawPlayer(gk, { squashX: 1.15, squashY: 0.88 });
              drawBall(ball.x, ball.y);
            });
            // Rebote corto a la misma velocidad de "trote" que el resto del archivo usa para
            // movimientos post-contacto, no un tramo casi congelado.
            const rebound = ballAtFoot(gk, 180, 16);
            await tween(ball, rebound, SPEED_TROTE, p => {
              ball = p;
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(me); drawPlayer(gk); drawBall(ball.x, ball.y);
            });
            showVerdict('ATAJADA', false);
          }
          break;
        }

        // -----------------------------------------------------------------
        // PASE: la pelota viaja de mí al compañero (éxito) o es cortada por
        // el rival exactamente en su posición (fallo).
        // -----------------------------------------------------------------
        case 'pase': {
          if (isSuccess) {
            const start = ballAtFoot(me, -20, 20);
            const end = ballAtFoot(mate, 200, 20);
            const apexBias = -38;
            await tween(start, end, SPEED_PASE, (p, t) => {
              const arc = Math.sin(t * Math.PI) * apexBias;
              ball = clampToPitch({ x: p.x, y: p.y + arc });
              renderAll();
            });
            showVerdict('PASE COMPLETADO', true);
          } else {
            const start = ballAtFoot(me, -20, 20);
            const interceptPoint = { x: rival.x - 10, y: rival.y };
            await tween(start, interceptPoint, SPEED_PASE, p => {
              ball = p;
              renderAll();
            });
            // Traspaso: el rival arranca a correr con la pelota pegada a sus pies.
            const rivalRunTo = clampToPitch({ x: interceptPoint.x + 60, y: interceptPoint.y });
            await tween(rival, rivalRunTo, SPEED_TROTE, p => {
              rival.x = p.x; rival.y = p.y;
              ball = ballAtFoot(rival, 200, 18);
              drawPitch(); drawPlayer(me); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(rival, { squashX: 1.05, squashY: 0.97 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('INTERCEPTADO', false);
          }
          break;
        }

        // -----------------------------------------------------------------
        // GAMBETA: la pelota nunca se separa de mí en el éxito (amague por
        // afuera del rival); en el fallo, el rival la gana en el contacto.
        // -----------------------------------------------------------------
        case 'gambeta': {
          if (isSuccess) {
            // La posición LÓGICA de "me" viaja en línea recta (target.y === me.y de partida); el
            // arco de la finta se aplica únicamente al punto que se dibuja, nunca al estado real
            // -- así no hay drift acumulado entre la posición que el código sabe que tiene y la
            // que efectivamente se ve en pantalla.
            const target = clampToPitch({ x: me.x + 210, y: me.y });
            const baseY = me.y;
            await tween(me, target, SPEED_CARRERA, (p, t) => {
              me.x = p.x; me.y = p.y;
              const arc = Math.sin(t * Math.PI) * 50;
              const drawY = baseY - arc;
              ball = ballAtFoot({ x: p.x, y: drawY }, 0, 20);
              drawPitch(); drawPlayer(rival); drawPlayer(mate); drawPlayer(gk);
              drawPlayer({ ...me, y: drawY }, { rotate: -0.05 * Math.sin(t * Math.PI) });
              drawBall(ball.x, ball.y);
            });
            showVerdict('SE LO LLEVÓ PUESTO', true);
          } else {
            const approach = clampToPitch({ x: me.x + 100, y: me.y });
            await tween(me, approach, SPEED_CARRERA, p => {
              me.x = p.x; me.y = p.y;
              ball = ballAtFoot(me, 0, 20);
              renderAll();
            });
            const stolenPoint = { x: rival.x - 8, y: rival.y };
            await tween(ball, stolenPoint, SPEED_TROTE, p => {
              ball = p;
              drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(rival);
              drawPlayer(me, { squashX: 1.1, squashY: 0.92 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('TE QUITÓ LA PELOTA', false);
          }
          break;
        }

        // -----------------------------------------------------------------
        // DEFENSA: el rival avanza con la pelota; en el éxito, el corte pasa
        // por un punto de contacto real antes de que salga jugando; en el
        // fallo, el rival gana la posición y sigue de largo.
        // -----------------------------------------------------------------
        case 'defensa': {
          rival.x = W / 2 - 40; rival.y = PITCH_CENTER_Y + 15;
          me.x = W / 2 - 170; me.y = PITCH_CENTER_Y + 30;
          ball = ballAtFoot(rival, 0, 20);
          const rivalAdvanceTo = clampToPitch({ x: rival.x + 140, y: rival.y });
          await tween(rival, rivalAdvanceTo, SPEED_TROTE, p => {
            rival.x = p.x; rival.y = p.y;
            ball = ballAtFoot(rival, 0, 20);
            drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(me); drawPlayer(rival); drawBall(ball.x, ball.y);
          });

          if (isSuccess) {
            const contactPoint = { x: rival.x - 10, y: rival.y };
            await tween(me, contactPoint, SPEED_CARRERA, p => {
              me.x = p.x; me.y = p.y;
              ball = ballAtFoot(rival, 0, 20);
              drawPitch(); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(rival, { squashX: 1.06, squashY: 0.96 });
              drawPlayer(me);
              drawBall(ball.x, ball.y);
            });
            ball = ballAtFoot(me, -150, 18);
            const clearTo = clampToPitch({ x: me.x - 90, y: me.y });
            await tween(me, clearTo, SPEED_TROTE, (p, t) => {
              me.x = p.x; me.y = p.y;
              ball = ballAtFoot(me, -150, 18);
              drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(rival);
              drawPlayer(me, { rotate: -0.05 * t });
              drawBall(ball.x, ball.y);
            });
            showVerdict('PELOTA RECUPERADA', true);
          } else {
            const wobbleTarget = clampToPitch({ x: rival.x + 65, y: rival.y });
            await tween(rival, wobbleTarget, SPEED_CARRERA, (p, t) => {
              const wobble = Math.sin(t * Math.PI) * 16;
              rival.x = p.x; rival.y = p.y - wobble;
              const meTarget = clampToPitch({ x: me.x + 12 * t, y: me.y + 10 * t });
              me.x = meTarget.x; me.y = meTarget.y;
              ball = ballAtFoot({ x: rival.x, y: rival.y - wobble }, 10, 18);
              drawPitch(); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(me, { squashX: 1.1, squashY: 0.92 });
              drawPlayer({ ...rival, y: rival.y - wobble });
              drawBall(ball.x, ball.y);
            });
            showVerdict('TE GANÓ LA POSICIÓN', false);
          }
          break;
        }

        // -----------------------------------------------------------------
        // DUELO FÍSICO: disputa aérea en el medio de la cancha. El ganador
        // se queda con la pelota y sale con ella, no la manda a la nada.
        // -----------------------------------------------------------------
        case 'duelo_fisico': {
          me.x = W / 2 - 30; me.y = PITCH_CENTER_Y + 10;
          rival.x = W / 2 + 30; rival.y = PITCH_CENTER_Y - 5;
          const ballDrop: Vec = { x: W / 2, y: PITCH_CENTER_Y - 60 };
          ball = ballDrop;
          drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(me); drawPlayer(rival); drawBall(ball.x, ball.y);
          await wait(150);

          const winner = isSuccess ? me : rival;
          const loser = isSuccess ? rival : me;
          const contactPoint = { x: (me.x + rival.x) / 2, y: PITCH_CENTER_Y - 8 };

          // La pelota cae desde arriba hacia el punto de contacto: quien gana el duelo queda del
          // lado correcto para que el "empuje" visual tenga sentido (avanza HACIA donde se dirige,
          // no hacia el ganador -- antes esto estaba invertido).
          await tween(ballDrop, contactPoint, SPEED_TROTE, (p, t) => {
            ball = p;
            const winnerPush = 6 * t; // el ganador gana terreno
            const loserPush = -4 * t; // el perdedor cede terreno
            drawPitch(); drawPlayer(mate); drawPlayer(gk);
            const winnerDraw = { ...winner, x: winner.x + (winner === rival ? -winnerPush : winnerPush) };
            const loserDraw = { ...loser, x: loser.x + (loser === rival ? -loserPush : loserPush) };
            drawPlayer(loserDraw, { squashX: 1 + Math.abs(loserPush) * 0.02 });
            drawPlayer(winnerDraw, { squashX: 1 + Math.abs(winnerPush) * 0.02 });
            drawBall(ball.x, ball.y);
          }, { minMs: 500 });

          // El ganador se queda con la pelota y sale jugando hacia su propio campo (izquierda si
          // es "me", derecha si es el rival) -- nunca "hacia la nada".
          const exitDir = winner === me ? -1 : 1;
          const exitTarget = clampToPitch({ x: contactPoint.x + exitDir * 110, y: contactPoint.y });
          await tween(contactPoint, exitTarget, SPEED_CARRERA, p => {
            ball = p;
            drawPitch(); drawPlayer(mate); drawPlayer(gk);
            drawPlayer(loser);
            drawPlayer(winner, { squashX: 1.08, squashY: 0.95 });
            drawBall(ball.x, ball.y);
          });
          showVerdict(isSuccess ? 'GANASTE EL DUELO' : 'PERDISTE EL DUELO', isSuccess);
          break;
        }

        // -----------------------------------------------------------------
        // ARQUERO: remate rival contra nuestro propio arco (izquierdo). El
        // gol en contra entra DENTRO del rectángulo del arco, nunca fuera
        // del canvas -- este era el bug confirmado de la versión anterior.
        // -----------------------------------------------------------------
        case 'arquero': {
          const shooter: Entity = { x: W / 2 + 90, y: PITCH_CENTER_Y, r: 15, color: RIVAL };
          const goalie: Entity = { x: GOAL_LEFT_LINE_X + 22, y: PITCH_CENTER_Y, r: 15, color: HOME };
          ball = ballAtFoot(shooter, 180, 22);
          drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(shooter); drawPlayer(goalie); drawBall(ball.x, ball.y);
          await wait(200);

          if (isSuccess) {
            const savePoint = { x: goalie.x - 6, y: goalie.y - 6 };
            await tween(ball, savePoint, SPEED_REMATE, p => {
              ball = p;
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(shooter);
              drawPlayer(goalie, { squashX: 1.15, squashY: 0.88 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('ATAJADA SEGURA', true);
          } else {
            const target = goalMouthPoint('left', 0.5); // abajo del centro, al segundo palo
            await tween(ball, target, SPEED_REMATE, p => {
              ball = p;
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(shooter);
              drawPlayer(goalie, { squashX: 0.92, squashY: 1.05 });
              drawBall(ball.x, ball.y);
            }, { canvasOnly: true });
            showVerdict('GOL EN CONTRA', false);
          }
          break;
        }
      }

      await wait(500);
      hideVerdict();
      await wait(220);
      if (!cancelled) onComplete();
    }

    run();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipType, isSuccess]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <canvas ref={canvasRef} width={W} height={H} className="w-full h-auto block" style={{ background: PITCH_COLOR }} />
      <div
        ref={verdictRef}
        className="absolute left-1/2 bottom-[12%] -translate-x-1/2 translate-y-2.5 opacity-0 transition-all duration-300 font-black uppercase tracking-wide text-lg sm:text-xl pointer-events-none whitespace-nowrap"
        style={{ textShadow: '0 3px 14px rgba(0,0,0,0.65)' }}
      />
    </div>
  );
}
