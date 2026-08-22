// EL HEXÁGONO: la FORMA de tu jugador, no sus números.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ HACE FALTA SI YA ESTÁN LAS BARRAS
// ---------------------------------------------------------------------------------------------
//
// Las seis barras contestan "¿cuánto tengo de cada cosa?". Ésta contesta otra pregunta, que hasta
// ahora el juego no contestaba en ningún lado: "¿qué CLASE de jugador soy?".
//
// Un central de 78 de media y un delantero de 78 de media tienen barras casi iguales -- seis
// rectángulos parecidos, uno abajo del otro -- y son dos futbolistas que no se parecen en nada. En
// el hexágono se ven a un metro de distancia: uno es un rombo estirado hacia defensa y físico, el
// otro un pico hacia tiro y ritmo.
//
// Y eso importa acá más que en otros juegos, porque en éste tu forma CAMBIA sola: una lesión mal
// curada redistribuye atributos (ver src/secuela.ts), la reconversión de puesto mueve otros, y a
// los 32 el ritmo y el físico empiezan a caer. La silueta de tu jugador a los 19 y a los 33 son dos
// dibujos distintos, y eso hasta ahora no se veía.
//
// ---------------------------------------------------------------------------------------------
// LA ESCALA ES FIJA DE 0 A 99, Y ESO ES LA DECISIÓN IMPORTANTE
// ---------------------------------------------------------------------------------------------
//
// Lo natural sería estirar el dibujo hasta el atributo más alto de cada jugador, para que siempre
// se vea grande. Es exactamente lo que NO hay que hacer: normalizando contra tu propio máximo, un
// juvenil de 55 y un crack de 95 dibujan el mismo hexágono, y la única cosa que este gráfico existe
// para mostrar -- cuánto creciste y hacia dónde -- desaparece.
//
// Con la escala fija, el dibujo de un pibe es chiquito y el de un crack llena el marco. Crecer se
// ve.
//
// ---------------------------------------------------------------------------------------------
// EL ORDEN DE LOS EJES NO ES ALFABÉTICO
// ---------------------------------------------------------------------------------------------
//
// Va ritmo, tiro, pase, regate, defensa, físico. Así cada eje queda ENFRENTADO a su opuesto:
// ritmo↔regate, tiro↔defensa, pase↔físico. Un jugador desbalanceado sale como una figura torcida
// hacia un lado; con los ejes en otro orden, el mismo jugador sale como una estrella irregular que
// no dice nada.

import React from 'react';
import type { PlayerStats } from '../types';

/** El techo de la escala. Fijo a propósito: ver la cabecera. */
export const TOPE = 99;

/** Los seis ejes, en el orden que enfrenta cada uno con su opuesto. */
export const EJES: readonly { clave: keyof PlayerStats; corto: string }[] = [
  { clave: 'ritmo', corto: 'RIT' },
  { clave: 'tiro', corto: 'TIR' },
  { clave: 'pase', corto: 'PAS' },
  { clave: 'regate', corto: 'REG' },
  { clave: 'defensa', corto: 'DEF' },
  { clave: 'fisico', corto: 'FÍS' },
];

const CENTRO = 50;
const RADIO = 33;
/** Cuánto afuera del hexágono va el rótulo de cada eje. */
const RADIO_ROTULO = RADIO + 12;

/** El punto de un eje, a la altura que le corresponde a `valor`. */
export function puntoDelEje(indice: number, valor: number, radio = RADIO): { x: number; y: number } {
  // -90° para que el primer eje quede arriba y no a la derecha.
  const angulo = (-90 + indice * (360 / EJES.length)) * (Math.PI / 180);
  const largo = radio * Math.max(0, Math.min(1, valor / TOPE));
  return { x: CENTRO + Math.cos(angulo) * largo, y: CENTRO + Math.sin(angulo) * largo };
}

const aPuntos = (ps: { x: number; y: number }[]) => ps.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

export function HexagonoDeAtributos({ atributos, className = '' }: {
  atributos: PlayerStats;
  className?: string;
}) {
  const tuya = EJES.map((e, i) => puntoDelEje(i, atributos[e.clave]));
  // Los anillos de referencia: 25, 50, 75 y el borde. Sin ellos el dibujo flota y no se puede
  // estimar un valor mirándolo.
  const anillos = [0.25, 0.5, 0.75, 1].map(f => EJES.map((_, i) => puntoDelEje(i, TOPE * f)));

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      data-hexagono-de-atributos={EJES.map(e => atributos[e.clave]).join('-')}
      aria-label={`Atributos: ${EJES.map(e => `${e.clave} ${atributos[e.clave]}`).join(', ')}`}
      className={`w-full h-auto ${className}`}
    >
      {anillos.map((anillo, i) => (
        <polygon
          key={i}
          points={aPuntos(anillo)}
          fill="none"
          stroke="currentColor"
          strokeWidth={i === anillos.length - 1 ? 0.7 : 0.35}
          className="text-slate-700"
        />
      ))}
      {/* Los radios, para que cada punta se lea contra su eje y no contra el aire. */}
      {EJES.map((_, i) => {
        const p = puntoDelEje(i, TOPE);
        return <line key={i} x1={CENTRO} y1={CENTRO} x2={p.x} y2={p.y} stroke="currentColor" strokeWidth={0.3} className="text-slate-800" />;
      })}

      <polygon
        points={aPuntos(tuya)}
        className="fill-gold-500/25 stroke-gold-400"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      {tuya.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.2} className="fill-gold-300" />
      ))}

      {EJES.map((e, i) => {
        const p = puntoDelEje(i, TOPE, RADIO_ROTULO);
        // El rótulo se ancla según de qué lado del centro cae, o los de la izquierda se salen del
        // marco y los de arriba y abajo quedan corridos.
        const anchor = p.x < CENTRO - 1 ? 'end' : p.x > CENTRO + 1 ? 'start' : 'middle';
        return (
          <text
            key={e.clave}
            x={p.x}
            y={p.y + (p.y < CENTRO ? 0 : 2)}
            textAnchor={anchor}
            className="fill-slate-500 font-mono font-bold"
            style={{ fontSize: '5.2px' }}
          >
            {e.corto} <tspan className="fill-slate-300">{atributos[e.clave]}</tspan>
          </text>
        );
      })}
    </svg>
  );
}
