// LA PORTADA DEL DIARIO, el día que te fichan.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Un traspaso era un aviso: "TRASPASO CONFIRMADO, todo listo para presentarte en X". Un toast que
// se lee una vez y se va, para el momento que más cambia una carrera.
//
// En el fútbol un fichaje es una PORTADA. Por eso esto no es un cartel de confirmación: es la
// primera plana del día siguiente, con el escudo grande, el titular, y los números del contrato
// abajo como una ficha de diario.
//
// ---------------------------------------------------------------------------------------------
// EL FONDO SALE DEL CLUB, NO DE UNA PALETA
// ---------------------------------------------------------------------------------------------
//
// Los colores del degradado son los de la camiseta (`themeColor`, el mismo dato con el que la app
// entera se repinta al cambiar de club). Así la portada del Boca es azul y oro y la del Junior es
// roja, sin que haya que dibujar 697 portadas.
//
// Y el escudo va DIFUMINADO Y ENORME detrás, además de nítido y chico adelante. Es un truco viejo de
// diagramación: la mancha de color grande da el clima, la pieza chica da la información. Con el
// escudo una sola vez, la portada queda vacía o queda ilegible.
//
// Si el club no declara colores, se cae al dorado del juego. No es un caso raro: muchos de los 697
// no los tienen.

import React from 'react';
import type { Club, PlayerProfile } from '../types';

/** Los colores del club, o el dorado del juego si el club no declara ninguno. */
function coloresDe(club: Club): { primario: string; secundario: string } {
  const t = (club as { themeColor?: { primary: string; secondary: string } }).themeColor;
  return { primario: t?.primary ?? '#D8A03A', secundario: t?.secondary ?? '#7A1E2B' };
}

export function PortadaDeFichaje({
  perfil, club, anterior, salario, prima, dorsal, onContinuar,
}: {
  perfil: PlayerProfile;
  club: Club;
  anterior: Club | null;
  salario: number;
  prima: number;
  dorsal: number;
  onContinuar: () => void;
}) {
  const { primario, secundario } = coloresDe(club);
  const escudo = club.badgeImageUrl ?? club.badgeLogoUrl ?? null;
  const hoy = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      data-portada-de-fichaje={club.name}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950"
    >
      {/* La mancha de color: dos manchas del club sobre el fondo oscuro. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 25% 15%, ${primario}55, transparent 55%),`
            + `radial-gradient(circle at 80% 85%, ${secundario}55, transparent 55%)`,
        }}
      />
      {/* El escudo difuminado y enorme: da el clima sin competir con el texto. */}
      {escudo && (
        <img
          src={escudo}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] max-w-none opacity-[0.13] blur-2xl pointer-events-none"
        />
      )}

      <article className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* La cabecera del diario. */}
        <header
          className="px-6 py-3 flex items-baseline justify-between gap-3 border-b-2"
          style={{ borderColor: primario }}
        >
          <span className="text-sm font-black uppercase tracking-[0.2em] text-white">El Deportivo</span>
          <span className="text-3xs font-mono uppercase tracking-widest text-slate-500">{hoy}</span>
        </header>

        <div className="px-6 py-6 space-y-5">
          <p className="text-2xs font-black uppercase tracking-[0.18em]" style={{ color: primario }}>
            Mercado de pases
          </p>

          <h1 className="text-3xl sm:text-4xl font-black uppercase leading-[0.95] text-white text-balance">
            {perfil.name} es del {club.name}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {anterior
              ? <>Deja {anterior.name} y firma por {club.name}. Llevará la <strong className="text-white">#{dorsal}</strong>.</>
              : <>Firma por {club.name} y llevará la <strong className="text-white">#{dorsal}</strong>.</>}
          </p>

          <div className="flex items-center gap-4 pt-1">
            {escudo && (
              <img
                src={escudo}
                alt={club.name}
                className="w-20 h-20 object-contain shrink-0 drop-shadow-lg"
              />
            )}
            {/* Los numeros del contrato, como la ficha de datos de un diario. */}
            <dl className="grid grid-cols-3 gap-x-4 gap-y-1 flex-1 min-w-0 border-l border-slate-800 pl-4">
              {([
                ['Dorsal', `#${dorsal}`],
                ['Salario', `$${salario.toLocaleString()}/sem`],
                ['Prima', `$${prima.toLocaleString()}`],
              ] as const).map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-4xs font-mono uppercase tracking-widest text-slate-500">{k}</dt>
                  <dd className="text-xs font-black text-white truncate tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <footer className="px-6 pb-6">
          <button
            type="button"
            onClick={onContinuar}
            autoFocus
            className="btn-fx w-full min-h-[48px] rounded-2xl font-black uppercase tracking-widest text-sm text-slate-950 transition-transform"
            style={{ background: primario }}
          >
            Ir a la presentación
          </button>
          <p className="text-3xs text-slate-500 text-center mt-2">
            Te esperan los micrófonos.
          </p>
        </footer>
      </article>
    </div>
  );
}
