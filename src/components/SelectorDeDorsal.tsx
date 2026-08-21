// EL CUADRO PARA ELEGIR TU DORSAL AL FICHAR.
//
// ---------------------------------------------------------------------------------------------
// LO QUE HABÍA ERA UN HASH INVENTADO
// ---------------------------------------------------------------------------------------------
//
// El selector viejo era un desplegable del 1 al 33 y decidía si el número estaba ocupado así:
//
//     const dorsalOcupado = (offer.club.id.length + pendingTransferDorsal) % 7 === 0;
//
// Su propio comentario lo admitía -- "no hay datos reales de dorsales ocupados en el juego". Con
// eso, en un club te bloqueaba el 7 y en otro el 12, sin ninguna relación con quién juega ahí.
//
// Ahora los hay: la base de planteles trae el dorsal real de cada jugador (ver
// `scripts/enriquecer_dorsales.mjs`), y 472 de los 473 clubes con plantel no repiten ninguno.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ UNA GRILLA Y NO UN DESPLEGABLE
// ---------------------------------------------------------------------------------------------
//
// La pregunta que estás contestando no es "¿qué número quiero?" sino "¿cuáles puedo?". Un
// desplegable esconde eso: hay que abrirlo y bajar de a uno. La grilla lo muestra de una -- los
// libres se ven, los tomados se ven, y encima se ve DE QUIÉN son.
//
// Y eso último es lo que la hace del juego y no un formulario: el 10 no está "ocupado", lo lleva
// Yimmi Chará. Elegir el 23 porque el 10 es de alguien con nombre es una decisión; elegirlo porque
// una casilla está gris es un trámite.
//
// ---------------------------------------------------------------------------------------------
// LO QUE NO SE SABE, SE DICE
// ---------------------------------------------------------------------------------------------
//
// Al 28% de los jugadores no le sabemos el número -- son los que cambiaron de club, y el dorsal
// viejo no vale en el club nuevo. A esos NO se les reserva un número: bloquear un dorsal que a lo
// mejor está libre sería inventar en la otra dirección. El cuadro dice cuántos son.

import React, { useMemo, useState } from 'react';
import { dorsalesOcupados, type JugadorDelPlantel } from '../laCamiseta';

export const DORSAL_MAXIMO = 99;

export function SelectorDeDorsal({
  plantel, clubName, valor, onElegir,
}: {
  plantel: JugadorDelPlantel[];
  clubName: string;
  valor: number | null;
  onElegir: (n: number) => void;
}) {
  const [verTodos, setVerTodos] = useState(false);
  const ocupados = useMemo(() => dorsalesOcupados(plantel), [plantel]);
  const sinNumero = plantel.filter(j => j.dorsal == null).length;

  // Del 1 al 30 entra el 90% de lo que alguien elige, y noventa y nueve casillas de golpe son una
  // pared. El resto está a un clic.
  const hasta = verTodos ? DORSAL_MAXIMO : 30;

  return (
    <div data-selector-dorsal={clubName} className="w-full">
      <p className="text-3xs text-slate-500 font-bold uppercase tracking-widest mb-1">
        Elegí tu dorsal en {clubName}
      </p>
      <p className="text-3xs text-slate-500 mb-2 leading-snug">
        {ocupados.size > 0
          ? <>Los tachados ya los lleva alguien del plantel. {sinNumero > 0 && <span className="text-slate-600">({sinNumero} jugadores sin número conocido: sus dorsales quedan libres)</span>}</>
          : <>En este plantel no hay dorsales cargados: podés elegir el que quieras.</>}
      </p>

      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: hasta }, (_, i) => i + 1).map(n => {
          const dueno = ocupados.get(n);
          const elegido = valor === n;
          return (
            <button
              key={n}
              type="button"
              disabled={!!dueno}
              onClick={() => onElegir(n)}
              title={dueno ? `El ${n} lo lleva ${dueno}` : `Elegir el ${n}`}
              aria-label={dueno ? `${n}, ocupado por ${dueno}` : `${n}, libre`}
              className={`aspect-square rounded-md text-2xs font-black font-mono flex items-center justify-center border transition-colors ${
                dueno
                  ? 'bg-slate-950 border-slate-800/60 text-slate-700 line-through cursor-not-allowed'
                  : elegido
                  ? 'bg-gold-500 border-gold-400 text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50 hover:text-white cursor-pointer'
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {!verTodos && (
        <button
          type="button"
          onClick={() => setVerTodos(true)}
          className="mt-1.5 text-3xs text-slate-500 hover:text-gold-400 font-bold uppercase tracking-wider cursor-pointer"
        >
          Ver hasta el {DORSAL_MAXIMO}
        </button>
      )}

      {valor != null && ocupados.get(valor) == null && (
        <p className="mt-2 text-2xs text-gold-400 font-bold">
          Vas a llevar el <span className="font-black">#{valor}</span> en {clubName}.
        </p>
      )}
    </div>
  );
}
