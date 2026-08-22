// DÓNDE VAS EN CADA TORNEO, de un vistazo.
//
// ---------------------------------------------------------------------------------------------
// QUÉ PROBLEMA RESUELVE
// ---------------------------------------------------------------------------------------------
//
// Copas y Tablas es la pestaña más larga del juego después del plantel: la tabla de posiciones, los
// goleadores, el cuadro de la copa continental y el de la nacional, uno abajo del otro. Y la
// pregunta con la que uno entra casi siempre es la más corta de todas -- "¿cómo voy?" --, que hasta
// ahora había que contestar bajando por cuatro paneles y leyendo cada uno.
//
// Esta tira la contesta arriba de todo y en una línea por torneo.
//
// ---------------------------------------------------------------------------------------------
// NO CALCULA NADA
// ---------------------------------------------------------------------------------------------
//
// Recibe las líneas ya resueltas. Es a propósito: cada número de acá ya existe en el panel de más
// abajo -- la posición sale de la misma tabla, los goles del mismo listado de goleadores -- y si
// esta tira los volviera a deducir por su cuenta habría dos fuentes contestando la misma pregunta,
// que en este juego ya terminó mal varias veces. Acá se muestra lo que el panel de abajo dice.
//
// Por eso también es la que se queda vacía sin dramatizar: un club sin copa continental
// simplemente tiene una línea menos, no un cartel de "no clasificado".

import React from 'react';

export interface LineaDeCompeticion {
  /** El torneo. */
  rotulo: string;
  /** Dónde vas, en dos o tres palabras: "3º (3 pts)", "Grupo C", "Final ida". */
  valor: string;
  /** Sólo para el que va primero o está en una final: es lo único que merece destacarse. */
  destacado?: boolean;
}

export function ResumenDeCompeticiones({
  nota, titulo, bajada, lineas,
}: {
  /** Tu calificación del último partido, la misma que muestra la ficha. */
  nota: number | null;
  titulo: string;
  bajada: string;
  lineas: LineaDeCompeticion[];
}) {
  return (
    <div data-resumen-de-competiciones={String(lineas.length)} className="space-y-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3">
        {nota != null && (
          <div className="w-14 h-14 shrink-0 rounded-full border-2 border-gold-500/60 bg-gold-950/30 flex flex-col items-center justify-center">
            <span className="text-3xs text-gold-400/70 font-mono leading-none">★</span>
            <span className="text-sm font-black text-gold-400 leading-none tabular-nums">{nota.toFixed(1)}</span>
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white leading-tight">
            {titulo}
          </h2>
          <p className="text-2xs text-slate-400 leading-snug">{bajada}</p>
        </div>
      </div>

      {lineas.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {lineas.map(l => (
            <div
              key={l.rotulo}
              data-linea-de-competicion={l.rotulo}
              className={`rounded-2xl border px-3 py-2.5 min-w-0 ${
                l.destacado
                  ? 'bg-gold-950/25 border-gold-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <p className="text-4xs font-black uppercase tracking-widest text-slate-500 truncate">{l.rotulo}</p>
              <p className={`text-2xs font-black truncate ${l.destacado ? 'text-gold-400' : 'text-slate-200'}`}>
                {l.valor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
