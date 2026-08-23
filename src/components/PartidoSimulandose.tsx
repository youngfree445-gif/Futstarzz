// LA PANTALLA DE "SE ESTÁ JUGANDO SIN VOS".
//
// El botón "Simular partido" antes te metía igual a la pantalla del partido, con la velocidad al
// máximo y contestando las decisiones por vos: seguías mirando los noventa minutos, sólo que rápido
// y sin tocar nada -- lo peor de las dos opciones. Pedido textual: "que lo simule literal, no que te
// meta al partido, así como cuando te sancionan".
//
// POR QUÉ HAY UNA PANTALLA Y NO NADA. El partido se resuelve de una, en un instante, así que lo
// honesto sería no mostrar nada. Pero el contexto del partido -- rival, localía, copa, si arrancás
// o entrás -- vive en el estado de React que `startMatchflow` acaba de escribir, y leerlo en el
// mismo tick daría los valores viejos: el partido se resolvería contra el rival de la fecha
// anterior. Así que esto se monta, deja que el estado se asiente, y recién ahí resuelve.
//
// Y de paso hace algo que sí vale: DECIR CONTRA QUIÉN. Un resultado que aparece de la nada, sin
// haber visto el nombre del rival, se lee como que el juego se salteó una fecha.

import React, { useEffect, useRef } from 'react';
import { playSfx } from '../audio';

export function PartidoSimulandose({
  rival, escudoUrl, onResolver,
}: {
  rival: string;
  escudoUrl?: string | null;
  onResolver: () => void;
}) {
  // Una sola vez. Sin el ref, un re-render del padre volvería a resolver el mismo partido y el
  // jugador cobraría dos veces la misma fecha.
  const yaResolvio = useRef(false);
  useEffect(() => {
    if (yaResolvio.current) return;
    yaResolvio.current = true;
    const t = setTimeout(onResolver, 650);
    return () => clearTimeout(t);
  }, [onResolver]);

  // SIMULAR NO PUEDE SER MUDO.
  //
  // Esta pantalla nunca tuvo un solo sonido, así que tocar "Simular" daba un partido en silencio
  // absoluto mientras el jugado sonaba a cancha llena. Reportado tal cual: "hay partidos donde no
  // se escucha".
  //
  // No va el ambiente: dura menos de un segundo y arrancar un estadio para apagarlo enseguida suena
  // peor que el silencio. Va el silbato, que es lo que de verdad pasa -- se juega el partido, no lo
  // ves.
  useEffect(() => {
    playSfx('whistle_end');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4 px-6">
      <span className="text-2xs font-black uppercase tracking-[0.2em] text-slate-500 font-mono">
        Simulando el partido
      </span>
      <div className="flex items-center gap-3">
        {escudoUrl && <img src={escudoUrl} alt="" className="w-10 h-10 object-contain" />}
        <h2 className="text-xl font-black uppercase tracking-tight text-white text-center">
          vs {rival}
        </h2>
      </div>
      <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-gold-500 rounded-full animate-[barra_0.65s_linear_forwards]" />
      </div>
      <p className="text-3xs text-slate-500 font-mono text-center max-w-xs leading-relaxed">
        Jugás igual: el partido corre con las mismas reglas, sólo que no tenés que decidir nada.
      </p>
    </div>
  );
}
