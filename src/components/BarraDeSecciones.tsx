// LA BARRA DE ABAJO, SÓLO EN CELULAR.
//
// ---------------------------------------------------------------------------------------------
// QUÉ PROBLEMA RESUELVE
// ---------------------------------------------------------------------------------------------
//
// Varias pestañas del juego están armadas como dos o tres columnas. En escritorio se ven todas
// juntas y no hay nada que elegir; en un teléfono las columnas se apilan y la pestaña se convierte
// en un scroll de varias pantallas donde lo que buscabas siempre está abajo.
//
// La solución que ya funcionaba en Mi Carrera: en celular se muestra UNA columna por vez y se
// cambia con una barra fija abajo. Esto es esa barra, sacada de ahí para poder usarla en las otras
// pestañas que tienen el mismo problema, en vez de copiarla tres veces.
//
// ---------------------------------------------------------------------------------------------
// LAS TRES DECISIONES QUE HAY QUE RESPETAR AL USARLA
// ---------------------------------------------------------------------------------------------
//
//   1. VA ABAJO, NO ARRIBA. Es donde llega el pulgar. Una barra de navegación arriba en un teléfono
//      obliga a estirar la mano en cada cambio.
//   2. 56px DE ALTO Y UN TERCIO DE ANCHO. Es un blanco de pulgar de verdad; más chico se falla.
//   3. EL CONTENIDO NECESITA COLCHÓN ABAJO. La barra es `fixed`, así que tapa el final de lo que
//      estés leyendo. Quien la use tiene que poner `pb-20` en su contenido -- por eso `BOTON_ALTO`
//      y `COLCHON` se exportan: para que el que arma la pestaña no tenga que adivinar el número.
//
// Y una cosa que NO hace: no existe en escritorio. Ahí las columnas se ven juntas y una barra para
// elegir entre cosas que ya están todas a la vista sería ruido.

import React from 'react';

/** Alto de cada botón. Es lo que hace que se pueda tocar con el pulgar sin apuntar. */
export const BOTON_ALTO = 'h-14';
/**
 * El colchón que tiene que llevar el contenido de la pestaña para que la barra no le tape el final.
 * Se exporta para que quien use la barra no tenga que deducirlo del alto de los botones.
 */
export const COLCHON = 'pb-20 md:pb-0';

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

export function BarraDeSecciones<T extends string>({
  destinos, activa, onCambiar, etiqueta,
}: BarraDeSeccionesProps<T>) {
  return (
    <nav
      aria-label={etiqueta}
      data-barra-de-secciones={etiqueta}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex"
    >
      {destinos.map(({ id, texto, Icono }) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            onCambiar(id);
            // Al cambiar de columna se vuelve arriba: si no, aterrizás a mitad de la columna nueva,
            // a la altura a la que habías bajado en la anterior, que nunca es donde querías estar.
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-current={activa === id ? 'page' : undefined}
          className={`flex-1 ${BOTON_ALTO} flex flex-col items-center justify-center gap-0.5 font-black uppercase tracking-widest text-3xs transition-colors ${
            activa === id
              ? 'text-gold-400 border-t-2 border-gold-400 -mt-px bg-gold-950/25'
              : 'text-slate-500'
          }`}
        >
          <Icono size={17} />
          {texto}
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex"
    >
      {atajos.map(({ ancla, texto, Icono }) => (
        <button
          key={ancla}
          type="button"
          onClick={() => {
            document.getElementById(ancla)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={`flex-1 ${BOTON_ALTO} flex flex-col items-center justify-center gap-0.5 font-black uppercase tracking-widest text-3xs text-slate-400 transition-colors active:text-gold-400`}
        >
          <Icono size={17} />
          {texto}
        </button>
      ))}
    </nav>
  );
}
