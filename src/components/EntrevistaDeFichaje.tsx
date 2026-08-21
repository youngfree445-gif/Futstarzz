// LA ENTREVISTA DE PRESENTACIÓN: la sala de prensa del día que firmás.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ES UNA PANTALLA ENTERA Y NO UN CUADRITO
// ---------------------------------------------------------------------------------------------
//
// Es obligatoria (ver src/entrevistaDeFichaje.ts): no hay botón de saltear, y eso es a propósito.
// La presentación es el único momento de la carrera en el que hablás de un club en el que todavía
// no jugaste nada, y por eso es el único donde tu palabra pesa más que tu rendimiento.
//
// ---------------------------------------------------------------------------------------------
// SE CONTESTA DE A UNA, Y CADA UNA TE RESPONDEN
// ---------------------------------------------------------------------------------------------
//
// Tres preguntas en una lista con tres botones cada una serían un formulario. Acá va una por vez y
// el periodista contesta antes de la siguiente: sin esa devolución, elegir la respuesta arriesgada
// y elegir la tibia se sienten igual, y entonces da lo mismo cuál toques.
//
// Los números NO se muestran en los botones a propósito. Si al lado de cada respuesta dice "+14
// fans", ya no estás eligiendo qué decir: estás sumando. El saldo aparece al final, cuando ya no
// podés cambiarlo.

import React, { useMemo, useState } from 'react';
import type { Club, PlayerProfile } from '../types';
import {
  preguntasDeLaPresentacion, saldoDe,
  type OpcionDeEntrevista,
} from '../entrevistaDeFichaje';

/** Los colores del club, o el dorado del juego si el club no declara ninguno. */
function coloresDe(club: Club): { primario: string; secundario: string } {
  const t = (club as { themeColor?: { primary: string; secondary: string } }).themeColor;
  return { primario: t?.primary ?? '#D8A03A', secundario: t?.secondary ?? '#7A1E2B' };
}

export function EntrevistaDeFichaje({
  perfil, club, anterior, onTerminar,
}: {
  perfil: PlayerProfile;
  club: Club;
  anterior: Club | null;
  /** Se llama una sola vez, al final: los efectos se aplican juntos. */
  onTerminar: (r: { fans: number; prestigio: number; declaracion: OpcionDeEntrevista | null }) => void;
}) {
  const preguntas = useMemo(() => preguntasDeLaPresentacion(club, anterior), [club, anterior]);
  const { primario, secundario } = coloresDe(club);
  const escudo = club.badgeImageUrl ?? club.badgeLogoUrl ?? null;

  const [indice, setIndice] = useState(0);
  const [elegidas, setElegidas] = useState<OpcionDeEntrevista[]>([]);
  const [respondida, setRespondida] = useState<OpcionDeEntrevista | null>(null);

  const pregunta = preguntas[indice];
  const terminada = indice >= preguntas.length;

  const fans = elegidas.reduce((s, o) => s + o.fans, 0);
  const prestigio = elegidas.reduce((s, o) => s + o.prestigio, 0);

  const responder = (o: OpcionDeEntrevista) => {
    if (respondida) return;
    setRespondida(o);
    setElegidas(prev => [...prev, o]);
  };

  const seguir = () => {
    setRespondida(null);
    setIndice(i => i + 1);
  };

  const cerrar = () => {
    // A la hemeroteca va la más fuerte de las tres, no las tres: el archivo guarda una frase por
    // acto, igual que la rueda de prensa (ver src/hemeroteca.ts).
    const laMasFuerte = [...elegidas].sort((a, b) => saldoDe(b) - saldoDe(a))[0] ?? null;
    onTerminar({ fans, prestigio, declaracion: laMasFuerte });
  };

  return (
    <div
      data-entrevista-de-fichaje={club.name}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950"
    >
      {/* El backdrop de la sala de prensa: la pared de patrocinadores es del club. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${primario}33, transparent 60%),`
            + `radial-gradient(circle at 10% 100%, ${secundario}33, transparent 55%)`,
        }}
      />

      <section className="relative w-full max-w-xl bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <header className="px-5 py-3 border-b border-slate-800 flex items-center gap-3">
          {escudo && <img src={escudo} alt="" aria-hidden="true" className="w-8 h-8 object-contain shrink-0" />}
          <div className="min-w-0 flex-1">
            <p className="text-3xs font-black uppercase tracking-[0.18em] text-slate-500">Presentación oficial</p>
            <p className="text-xs font-bold text-white truncate">{perfil.name} · {club.name}</p>
          </div>
          {/* Las tres preguntas, marcadas. Sirve para saber cuánto falta: sin esto la entrevista es
              una pantalla que no se sabe cuándo termina, y eso se siente como un castigo. */}
          <div className="flex gap-1 shrink-0" aria-label={`Pregunta ${Math.min(indice + 1, preguntas.length)} de ${preguntas.length}`}>
            {preguntas.map((p, i) => (
              <span
                key={p.clave}
                className="w-6 h-1 rounded-full transition-colors"
                style={{ background: i < elegidas.length ? primario : '#1e293b' }}
              />
            ))}
          </div>
        </header>

        {!terminada && pregunta && (
          <div className="p-5 space-y-4" data-pregunta={pregunta.clave}>
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0" aria-hidden="true">{pregunta.avatar}</span>
              <div className="min-w-0">
                <p className="text-3xs font-black uppercase tracking-widest mb-1" style={{ color: primario }}>
                  {pregunta.medio}
                </p>
                <p className="text-sm text-white font-bold leading-snug text-balance">{pregunta.pregunta}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {pregunta.opciones.map(o => {
                const esta = respondida === o;
                return (
                  <button
                    key={o.texto}
                    type="button"
                    disabled={!!respondida}
                    onClick={() => responder(o)}
                    className={`text-left text-xs leading-snug rounded-2xl border px-4 py-3 min-h-[48px] transition-colors ${
                      esta
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : respondida
                        ? 'bg-slate-950 border-slate-800/60 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-600 hover:text-white cursor-pointer'
                    }`}
                  >
                    <span aria-hidden="true" className="text-slate-500">“</span>{o.texto}<span aria-hidden="true" className="text-slate-500">”</span>
                  </button>
                );
              })}
            </div>

            {respondida && (
              <div className="pt-1 space-y-3" data-reaccion={pregunta.clave}>
                <p className="text-2xs text-slate-400 italic leading-snug border-l-2 pl-3" style={{ borderColor: primario }}>
                  {respondida.reaccion}
                </p>
                <button
                  type="button"
                  onClick={seguir}
                  autoFocus
                  className="btn-fx w-full min-h-[44px] rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-2xs transition-colors cursor-pointer"
                >
                  {indice + 1 < preguntas.length ? 'Siguiente pregunta' : 'Terminar la rueda'}
                </button>
              </div>
            )}
          </div>
        )}

        {terminada && (
          <div className="p-5 space-y-4" data-entrevista-terminada={String(fans + prestigio)}>
            <p className="text-sm text-white font-bold leading-snug">
              Se terminó la rueda de prensa. Ya sos jugador de {club.name}.
            </p>

            {/* Recién acá aparecen los números: durante la entrevista taparían la decisión. */}
            <dl className="grid grid-cols-2 gap-3">
              {([['Hinchada', fans], ['Prestigio', prestigio]] as const).map(([k, v]) => (
                <div key={k} className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3">
                  <dt className="text-4xs font-mono uppercase tracking-widest text-slate-500">{k}</dt>
                  <dd className={`text-lg font-black tabular-nums ${v > 0 ? 'text-emerald-400' : v < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {v > 0 ? '+' : ''}{v}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-3xs text-slate-500 leading-snug">
              Lo que dijiste hoy queda en el archivo de los diarios. Si las cosas se dan vuelta, te lo van a sacar.
            </p>

            <button
              type="button"
              onClick={cerrar}
              autoFocus
              className="btn-fx w-full min-h-[48px] rounded-2xl font-black uppercase tracking-widest text-sm text-slate-950 transition-transform cursor-pointer"
              style={{ background: primario }}
            >
              Entrar al vestuario
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
