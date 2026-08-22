// LA BARRA DE LA PESTAÑA, dentro del contenido y sólo en celular.
//
// ---------------------------------------------------------------------------------------------
// QUÉ PROBLEMA RESUELVE
// ---------------------------------------------------------------------------------------------
//
// Varias pestañas del juego están armadas como dos o tres columnas. En escritorio se ven todas
// juntas y no hay nada que elegir; en un teléfono las columnas se apilan y la pestaña se convierte
// en un scroll de varias pantallas donde lo que buscabas siempre está abajo.
//
// Esta barra muestra UNA columna por vez y deja elegir cuál.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ YA NO VA PEGADA ABAJO (y esto es la regla, no una preferencia)
// ---------------------------------------------------------------------------------------------
//
// Antes era `fixed bottom-0`. Al agregar la barra de la APP -- que también va abajo, porque es la
// navegación principal del teléfono -- quedaban DOS barras fijas peleando por el mismo borde, y la
// que ganaba dependía del orden del DOM.
//
// La jerarquía ahora es explícita:
//
//     abajo y fija  ->  navegación de la APP    (ver BarraDeApp: Carrera, Club, Entreno, Tablas, Menú)
//     en el flujo   ->  navegación de la PESTAÑA (ésta: las columnas de la pestaña en la que estás)
//
// Que ésta viaje con el contenido además es lo correcto por otro motivo: elige entre cosas que
// están JUSTO ABAJO, así que tiene que estar al lado de ellas y no en la otra punta de la pantalla.
//
// ---------------------------------------------------------------------------------------------
// LO QUE SÍ SE MANTIENE
// ---------------------------------------------------------------------------------------------
//
//   . 44px de alto mínimo: sigue siendo un blanco de pulgar de verdad.
//   . No existe en escritorio. Ahí las columnas se ven juntas y una barra para elegir entre cosas
//     que ya están todas a la vista sería ruido.
import React from 'react';

/** Alto mínimo de cada botón: un blanco de pulgar de verdad. */
export const BOTON_ALTO = 'min-h-[44px]';

export interface DestinoDeLaBarra<T extends string> {
  id: T;
  texto: string;
  Icono: React.ComponentType<{ size?: number }>;
}

export interface BarraDeSeccionesProps<T extends string> {
  destinos: readonly DestinoDeLaBarra<T>[];
  activa: T;
  onCambiar: (id: T) => void;
  /** Para que los lectores de pantalla sepan de qué pestaña es esta barra. */
  etiqueta: string;
}

// NO SE VUELVE ARRIBA AL CAMBIAR DE COLUMNA.
//
// Antes sí: la barra estaba pegada abajo y al elegir otra columna se hacía scroll al tope, con el
// argumento de que si no aterrizabas a mitad de la columna nueva.
//
// Desde que la barra viaja CON el contenido eso dejó de ser cierto y pasó a ser un estorbo: está
// justo arriba de lo que elegís, así que al tocarla no te moviste de lugar -- y el scroll te
// mandaba al principio de la pantalla, lejos de lo que acababas de pedir. Reportado en el plantel:
// "si escojo para ver portero, defensas o atacantes, siempre la página me lleva para arriba".
export function BarraDeSecciones<T extends string>({
  destinos, activa, onCambiar, etiqueta,
}: BarraDeSeccionesProps<T>) {
  return (
    <nav
      aria-label={etiqueta}
      data-barra-de-secciones={etiqueta}
      className="md:hidden flex gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800"
    >
      {destinos.map(({ id, texto, Icono }) => (
        <button
          key={id}
          type="button"
          onClick={() => onCambiar(id)}
          aria-current={activa === id ? 'page' : undefined}
          className={`flex-1 min-w-0 ${BOTON_ALTO} flex items-center justify-center gap-1.5 rounded-xl font-black uppercase tracking-wider text-4xs transition-colors ${
            activa === id
              ? 'bg-gold-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Icono size={14} />
          <span className="truncate">{texto}</span>
        </button>
      ))}
    </nav>
  );
}

/**
 * La clase que esconde una columna cuando no es la elegida.
 *
 * En escritorio TODAS se muestran (`md:block`): la barra no existe ahí y esconder columnas dejaría
 * la pantalla a medias.
 */
export function soloEnSeccion<T extends string>(actual: T, cual: T): string {
  return actual === cual ? 'block' : 'hidden md:block';
}

// ==================================================================================================
// LA OTRA BARRA: ATAJOS, NO PESTAÑAS
// ==================================================================================================
//
// Copas y Tablas y Traspasos también se vuelven un scroll largo en el teléfono, pero NO se arreglan
// escondiendo columnas como Mi Carrera. Ahí querés poder comparar: la tabla de posiciones con el
// cuadro de la copa, tus ofertas con el radar de clubes que todavía no te alcanzan. Esconder una
// para ver la otra sería peor que el scroll.
//
// Lo que falta ahí no es elegir una columna: es LLEGAR. Así que estos botones no seleccionan nada,
// te llevan.
//
// Y POR ESO NO TIENEN ESTADO ACTIVO, a propósito. Un resaltado tendría que seguir el scroll para no
// mentir, y un resaltado que miente -- que dice "estás en la tabla" cuando bajaste a la copa a mano
// -- es peor que ninguno. Tres botones que te llevan a algún lado no pueden equivocarse.

export interface AtajoDeLaBarra {
  /** El id del elemento al que lleva. Tiene que existir en la pestaña o el botón no hace nada. */
  ancla: string;
  texto: string;
  Icono: React.ComponentType<{ size?: number }>;
}

export function BarraDeAtajos({ atajos, etiqueta }: { atajos: readonly AtajoDeLaBarra[]; etiqueta: string }) {
  if (atajos.length === 0) return null;
  return (
    <nav
      aria-label={etiqueta}
      data-barra-de-atajos={etiqueta}
      className="md:hidden flex gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800"
    >
      {atajos.map(({ ancla, texto, Icono }) => (
        <button
          key={ancla}
          type="button"
          onClick={() => {
            document.getElementById(ancla)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={`flex-1 min-w-0 ${BOTON_ALTO} flex items-center justify-center gap-1.5 rounded-xl font-black uppercase tracking-wider text-4xs text-slate-400 transition-colors active:text-gold-400`}
        >
          <Icono size={14} />
          <span className="truncate">{texto}</span>
        </button>
      ))}
    </nav>
  );
}
