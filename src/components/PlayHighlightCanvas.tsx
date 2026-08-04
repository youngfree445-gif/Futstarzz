import React, { useEffect, useRef } from 'react';
import { PlayClipType } from '../types';

// Highlight animado que dramatiza una decisión de partido en Canvas, mostrado ANTES del texto
// narrado (ver handleChoice en MatchSimulator.tsx). No es un motor de simulación jugable: es una
// coreografía corta sobre un resultado que el motor ya calculó (isSuccess), pensada para que el
// jugador "vea" la jugada en cancha antes de leer el resumen. Todo el movimiento usa curvas ease
// in-out para que se lea natural, y ninguna posición puede salir del rectángulo de juego (mismo
// criterio validado en la demo de prototipo).

interface PlayHighlightCanvasProps {
  clipType: PlayClipType;
  isSuccess: boolean;
  onComplete: () => void;
}

const HOME = '#c0a047'; // gold-400 del juego (tailwind.config.js)
const RIVAL = '#7d0e2d'; // burgundy-600 del juego
const GK = '#d9dcd8';
const PITCH = '#0f2417';
const OK = '#7fb87f';
const BAD = '#d1547a'; // burgundy-400, para que el rojo de fallo no desentone con la paleta del juego

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOutSine(t: number) { return -(Math.cos(Math.PI * t) - 1) / 2; }

interface Entity { x: number; y: number; r: number; color: string; }

export default function PlayHighlightCanvas({ clipType, isSuccess, onComplete }: PlayHighlightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const MARGIN = 40;
    let cancelled = false;

    function clampToPitch(p: { x: number; y: number }) {
      p.x = Math.min(W - MARGIN, Math.max(MARGIN, p.x));
      p.y = Math.min(H - MARGIN, Math.max(MARGIN, p.y));
      return p;
    }

    function drawPitch() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = PITCH;
      ctx!.fillRect(0, 0, W, H);
      for (let i = 0; i < 10; i++) {
        ctx!.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.06)';
        ctx!.fillRect((W / 10) * i, 0, W / 10, H);
      }
      ctx!.strokeStyle = 'rgba(243,241,234,0.35)';
      ctx!.lineWidth = 2;
      ctx!.strokeRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);
      ctx!.beginPath();
      ctx!.moveTo(W / 2, MARGIN);
      ctx!.lineTo(W / 2, H - MARGIN);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(W / 2, H / 2, 55, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.strokeRect(MARGIN, H / 2 - 90, 95, 180);
      ctx!.strokeRect(W - MARGIN - 95, H / 2 - 90, 95, 180);
      ctx!.fillStyle = 'rgba(243,241,234,0.7)';
      ctx!.fillRect(MARGIN - 6, H / 2 - 25, 6, 50);
      ctx!.fillRect(W - MARGIN, H / 2 - 25, 6, 50);
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
    // liso. El patrón gira levemente con la rotación acumulada para sugerir que rueda al moverse.
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
      // Pentágono central + 5 "pétalos" alrededor, estilo balón clásico.
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

    function ballAtFoot(owner: Entity, angleDeg: number, dist: number) {
      const rad = (angleDeg * Math.PI) / 180;
      return { x: owner.x + Math.cos(rad) * dist, y: owner.y + Math.sin(rad) * dist };
    }

    function wait(ms: number) { return new Promise<void>(res => setTimeout(res, ms)); }
    function animate(durationMs: number, draw: (t: number) => void) {
      return new Promise<void>(resolve => {
        const start = performance.now();
        function frame(now: number) {
          if (cancelled) { resolve(); return; }
          const t = Math.min(1, (now - start) / durationMs);
          draw(t);
          ballSpin += 0.12;
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
      const me: Entity = { x: W / 2 - 190, y: H / 2, r: 15, color: HOME };
      const mate: Entity = { x: W / 2 + 140, y: H / 2 - 55, r: 15, color: HOME };
      const rival: Entity = { x: W / 2 + 10, y: H / 2 - 30, r: 15, color: RIVAL };
      const gk: Entity = { x: W - 70, y: H / 2, r: 14, color: GK };
      let ball = ballAtFoot(me, 0, 20);

      const renderBase = (extra?: () => void) => {
        drawPitch();
        drawPlayer(rival);
        drawPlayer(mate);
        drawPlayer(me);
        drawPlayer(gk);
        drawBall(ball.x, ball.y);
        if (extra) extra();
      };

      drawPitch();
      drawPlayer(rival);
      drawPlayer(mate);
      drawPlayer(me);
      drawBall(ball.x, ball.y);
      await wait(280);

      switch (clipType) {
        case 'gol': {
          const start = me.x;
          await animate(750, t => {
            const e = easeInOutSine(t);
            me.x = start + (W - 210 - start) * e;
            ball = ballAtFoot(me, 0, 20);
            drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(gk); drawPlayer(me); drawBall(ball.x, ball.y);
          });
          const shotStart = ballAtFoot(me, 0, 20);
          if (isSuccess) {
            const target = { x: W - 45, y: H / 2 - 30 };
            await animate(420, t => {
              const e = easeInOutSine(t);
              ball = { x: lerp(shotStart.x, target.x, e), y: lerp(shotStart.y, target.y, e) };
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(me);
              drawPlayer(gk, { squashX: 0.9, squashY: 1.1 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('¡GOL!', true);
          } else {
            const save = { x: gk.x - 12, y: gk.y };
            await animate(380, t => {
              const e = easeInOutSine(t);
              ball = { x: lerp(shotStart.x, save.x, e), y: lerp(shotStart.y, save.y, e) };
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(me);
              drawPlayer(gk, { squashX: 1.15, squashY: 0.88 });
              drawBall(ball.x, ball.y);
            });
            await animate(260, () => {
              ball = ballAtFoot(gk, 180, 18);
              drawPitch(); drawPlayer(mate); drawPlayer(rival); drawPlayer(me); drawPlayer(gk); drawBall(ball.x, ball.y);
            });
            showVerdict('ATAJADA', false);
          }
          break;
        }

        case 'pase': {
          if (isSuccess) {
            const start = ballAtFoot(me, 200, 20);
            const end = ballAtFoot(mate, 200, 20);
            await animate(900, t => {
              const e = easeInOutSine(t);
              const arc = Math.sin(t * Math.PI) * -42;
              ball = { x: lerp(start.x, end.x, e), y: lerp(start.y, end.y, e) + arc };
              renderBase();
            });
            showVerdict('PASE COMPLETADO', true);
          } else {
            const start = ballAtFoot(me, 200, 20);
            const intercept = { x: rival.x - 10, y: rival.y };
            await animate(500, t => {
              const e = easeInOutSine(t);
              ball = { x: lerp(start.x, intercept.x, e), y: lerp(start.y, intercept.y, e) };
              renderBase();
            });
            await animate(600, t => {
              const e = easeInOutSine(t);
              rival.x = clampToPitch({ x: intercept.x + 60 * e, y: rival.y }).x;
              ball = ballAtFoot(rival, 200, 18);
              drawPitch(); drawPlayer(me); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(rival, { squashX: 1.05, squashY: 0.97 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('INTERCEPTADO', false);
          }
          break;
        }

        case 'gambeta': {
          if (isSuccess) {
            const startX = me.x, startY = me.y;
            await animate(1000, t => {
              const e = easeInOutSine(t);
              const arc = Math.sin(t * Math.PI) * 50;
              const target = clampToPitch({ x: startX + 210 * e, y: startY - arc });
              me.x = target.x; me.y = target.y;
              ball = ballAtFoot(me, 0, 20);
              drawPitch(); drawPlayer(rival); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(me, { rotate: -0.05 * Math.sin(t * Math.PI) });
              drawBall(ball.x, ball.y);
            });
            showVerdict('SE LO LLEVÓ PUESTO', true);
          } else {
            const startX = me.x;
            await animate(650, t => {
              const e = easeInOutSine(t);
              me.x = clampToPitch({ x: startX + 100 * e, y: me.y }).x;
              ball = ballAtFoot(me, 0, 20);
              renderBase();
            });
            await animate(420, t => {
              const e = easeInOutSine(t);
              ball = { x: lerp(ball.x, rival.x - 8, e), y: lerp(ball.y, rival.y, e) };
              drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(rival);
              drawPlayer(me, { squashX: 1.1, squashY: 0.92 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('TE QUITÓ LA PELOTA', false);
          }
          break;
        }

        case 'defensa': {
          rival.x = W / 2 - 40; rival.y = H / 2 + 15;
          me.x = W / 2 - 170; me.y = H / 2 + 30;
          ball = ballAtFoot(rival, 0, 20);
          const rivalStart = rival.x;
          await animate(850, t => {
            const e = easeInOutSine(t);
            rival.x = clampToPitch({ x: rivalStart + 140 * e, y: rival.y }).x;
            ball = ballAtFoot(rival, 0, 20);
            drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(me); drawPlayer(rival); drawBall(ball.x, ball.y);
          });
          if (isSuccess) {
            await animate(600, t => {
              const e = easeInOutSine(t);
              me.x = lerp(me.x, rival.x - 24, e);
              ball = t < 0.5 ? ballAtFoot(rival, 0, 20) : ballAtFoot(me, -150, 18);
              drawPitch(); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(rival, { squashX: 1.06, squashY: 0.96 });
              drawPlayer(me);
              drawBall(ball.x, ball.y);
            });
            const meAfterX = me.x;
            await animate(700, t => {
              const e = easeInOutSine(t);
              me.x = clampToPitch({ x: meAfterX - 55 * e, y: me.y }).x;
              ball = ballAtFoot(me, -150, 18);
              drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(rival);
              drawPlayer(me, { rotate: -0.05 * e });
              drawBall(ball.x, ball.y);
            });
            showVerdict('PELOTA RECUPERADA', true);
          } else {
            const meStartX = me.x, meStartY = me.y;
            const rivalStartX = rival.x, rivalStartY = rival.y;
            await animate(650, t => {
              const e = easeInOutSine(t);
              const wobble = Math.sin(t * Math.PI) * 16;
              const rt = clampToPitch({ x: rivalStartX + 65 * e, y: rivalStartY - wobble });
              rival.x = rt.x; rival.y = rt.y;
              const mt = clampToPitch({ x: meStartX + 12 * e, y: meStartY + 10 * e });
              me.x = mt.x; me.y = mt.y;
              ball = ballAtFoot(rival, 10, 18);
              drawPitch(); drawPlayer(mate); drawPlayer(gk);
              drawPlayer(me, { squashX: 1.1, squashY: 0.92 });
              drawPlayer(rival);
              drawBall(ball.x, ball.y);
            });
            showVerdict('TE GANÓ LA POSICIÓN', false);
          }
          break;
        }

        case 'duelo_fisico': {
          me.x = W / 2 - 30; me.y = H / 2 + 10;
          rival.x = W / 2 + 30; rival.y = H / 2 - 5;
          ball = { x: W / 2, y: H / 2 - 60 };
          drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(me); drawPlayer(rival); drawBall(ball.x, ball.y);
          await wait(150);
          // La pelota cae desde arriba (disputa aérea) mientras los dos cuerpos se cierran.
          const ballStartY = ball.y;
          await animate(700, t => {
            const e = easeInOutSine(t);
            ball = { x: W / 2 + (isSuccess ? -14 : 14) * e, y: lerp(ballStartY, H / 2 - 8, e) };
            const pushMe = isSuccess ? -6 * e : 6 * e;
            const pushRival = isSuccess ? 6 * e : -6 * e;
            drawPitch(); drawPlayer(mate); drawPlayer(gk);
            drawPlayer({ ...me, x: me.x + pushRival }, { squashX: 1 + Math.abs(pushRival) * 0.01 });
            drawPlayer({ ...rival, x: rival.x + pushMe }, { squashX: 1 + Math.abs(pushMe) * 0.01 });
            drawBall(ball.x, ball.y);
          });
          if (isSuccess) {
            await animate(500, t => {
              const e = easeInOutSine(t);
              ball = { x: lerp(ball.x, me.x - 130 * e, e), y: lerp(ball.y, me.y, e) };
              drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(rival);
              drawPlayer(me, { squashX: 1.08, squashY: 0.95 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('GANASTE EL DUELO', true);
          } else {
            await animate(500, t => {
              const e = easeInOutSine(t);
              ball = { x: lerp(ball.x, rival.x + 130 * e, e), y: lerp(ball.y, rival.y, e) };
              drawPitch(); drawPlayer(mate); drawPlayer(gk); drawPlayer(me);
              drawPlayer(rival, { squashX: 1.08, squashY: 0.95 });
              drawBall(ball.x, ball.y);
            });
            showVerdict('PERDISTE EL DUELO', false);
          }
          break;
        }

        case 'posicionamiento': {
          // Sin protagonismo de la pelota: el jugador se desplaza leyendo el espacio, la pelota
          // queda quieta en el punto de partida (jugada de lectura/orden táctico, no de contacto).
          const startX = me.x, startY = me.y;
          await animate(1000, t => {
            const e = easeInOutSine(t);
            const drift = Math.sin(t * Math.PI) * 30;
            const target = clampToPitch({ x: startX + 90 * e, y: startY - drift });
            me.x = target.x; me.y = target.y;
            drawPitch(); drawPlayer(rival); drawPlayer(mate); drawPlayer(gk); drawPlayer(me);
            drawBall(ball.x, ball.y);
          });
          if (isSuccess) {
            showVerdict('LECTURA CORRECTA', true);
          } else {
            showVerdict('MAL LEÍDA', false);
          }
          break;
        }

        case 'arquero': {
          const shooterX = W / 2 + 60;
          const goalie: Entity = { x: MARGIN + 25, y: H / 2, r: 15, color: HOME };
          ball = { x: shooterX, y: H / 2 };
          drawPitch(); drawPlayer(rival); drawPlayer(mate); drawPlayer(goalie); drawBall(ball.x, ball.y);
          await wait(200);
          const shotTarget = isSuccess
            ? { x: goalie.x - 4, y: H / 2 - 4 } // le queda cerca, ataja
            : { x: MARGIN - 6, y: H / 2 - 32 }; // se le va, entra
          await animate(650, t => {
            const e = easeInOutSine(t);
            ball = { x: lerp(shooterX, shotTarget.x, e), y: lerp(H / 2, shotTarget.y, e) };
            drawPitch(); drawPlayer(rival); drawPlayer(mate);
            drawPlayer(goalie, { squashX: isSuccess ? 1.15 : 0.95, squashY: isSuccess ? 0.88 : 1.05 });
            drawBall(ball.x, ball.y);
          });
          showVerdict(isSuccess ? 'ATAJADA SEGURA' : 'GOL EN CONTRA', isSuccess);
          break;
        }
      }

      await wait(500);
      hideVerdict();
      await wait(220);
      if (!cancelled) {
        doneRef.current = true;
        onComplete();
      }
    }

    run();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipType, isSuccess]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <canvas ref={canvasRef} width={700} height={340} className="w-full h-auto block" style={{ background: PITCH }} />
      <div
        ref={verdictRef}
        className="absolute left-1/2 bottom-[12%] -translate-x-1/2 translate-y-2.5 opacity-0 transition-all duration-300 font-black uppercase tracking-wide text-lg sm:text-xl pointer-events-none whitespace-nowrap"
        style={{ textShadow: '0 3px 14px rgba(0,0,0,0.65)' }}
      />
    </div>
  );
}
