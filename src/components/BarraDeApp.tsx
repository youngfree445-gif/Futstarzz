// LA BARRA DE LA APP, abajo y sólo en celular.
//
// ---------------------------------------------------------------------------------------------
// QUÉ PROBLEMA RESUELVE
// ---------------------------------------------------------------------------------------------
//
// En el teléfono las once secciones vivían detrás de un botón "Menú" arriba de todo: para cambiar de
// pestaña había que subir hasta el encabezado, abrir la lista, elegir, y la lista se cerraba. Tres
// gestos y un viaje de ida y vuelta al borde superior de la pantalla, que es justo donde el pulgar
// no llega.
//
// Ahora las cuatro secciones a las que se entra todo el tiempo están a un toque, abajo, donde está
// el pulgar. Las otras siete siguen existiendo, detrás de MENÚ.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ CUATRO Y UN "MENÚ", Y NO ONCE
// ---------------------------------------------------------------------------------------------
//
// Once no entran: a 5 por fila cada botón queda en 20% del ancho y deja de ser un blanco de pulgar.
// La lista de pendientes de interfaz ya había anotado esta tensión -- "con once pestañas, una barra
// inferior entra con 4 o 5 accesos y necesita igual un 'más'" -- y la respuesta es aceptar el "más"
// en vez de pelearlo: cuatro directas y el resto en una hoja que sube desde abajo.
//
// ---------------------------------------------------------------------------------------------
// ES LA ÚNICA BARRA FIJA DEL JUEGO, Y ESO ES UNA REGLA
// ---------------------------------------------------------------------------------------------
//
// Antes había otra pegada abajo (la de secciones de Mi Carrera, y la de atajos de Copas y
// Traspasos). Dos barras fijas en el mismo borde se tapan entre sí, y la de abajo del todo gana por
// accidente según el orden del DOM.
//
// Así que ahora la jerarquía es explícita: **abajo y fija va la navegación de la APP; dentro del
// contenido, y en el flujo, va la navegación de la PESTAÑA** (ver BarraDeSecciones). Cada barra
// manda en un nivel y ninguna palabra se repite entre las dos.

import React, { useEffect } from 'react';
import { User, Sparkles, Dumbbell, Table, Menu, X } from 'lucide-react';

/** Alto de cada botón. Es lo que hace que se pueda tocar sin apuntar. */
export const BOTON_ALTO = 'h-14';

/**
 * El colchón que necesita el ÚLTIMO bloque de la pantalla para que no se lo coman los botones fijos.
 *
 * Va en la columna de la ficha, que desde que bajó al pie es lo último que hay en celular. Antes iba
 * en el panel de contenido -- y cuando la ficha pasó a ser lo último, la barra y los flotantes se
 * comieron "Guardar & Salir" y "Reiniciar Datos de Carrera".
 *
 * Son 28 y no 20 porque acá abajo hay DOS cosas encimadas: la barra (56px) y los botones de música y
 * sonido, que viven por arriba de ella.
 */
export const COLCHON_DE_LA_FICHA = 'pb-28 md:pb-3';

export interface SeccionDeLaApp<T extends string> {
  key: T;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}

/** Las cuatro que van directo en la barra. El resto vive en MENÚ. */
export const DIRECTAS = ['carrera', 'mi_club', 'entrenamiento', 'tablas'] as const;

/** Los rótulos cortos de la barra. "Plantilla de Club" no entra en un quinto de pantalla. */
const CORTO: Record<string, string> = {
  carrera: 'Carrera',
  mi_club: 'Club',
  entrenamiento: 'Entreno',
  tablas: 'Tablas',
};

const ICONO: Record<string, React.ComponentType<{ size?: number }>> = {
  carrera: User,
  mi_club: Sparkles,
  entrenamiento: Dumbbell,
  tablas: Table,
};

export function BarraDeApp<T extends string>({
  secciones, activa, onCambiar, abierta, onAbrir,
}: {
  /** Todas las secciones de la app, en su orden. De acá sale la hoja de MENÚ. */
  secciones: readonly SeccionDeLaApp<T>[];
  activa: T;
  onCambiar: (id: T) => void;
  /** Si la hoja de MENÚ está abierta. Vive afuera porque el encabezado también la puede cerrar. */
  abierta: boolean;
  onAbrir: (v: boolean) => void;
}) {
  // Con la hoja abierta, el fondo no se scrollea: si no, el dedo mueve la pantalla de atrás y la
  // hoja parece rota.
  useEffect(() => {
    if (!abierta) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previo; };
  }, [abierta]);

  // Escape cierra, como cualquier hoja.
  useEffect(() => {
    if (!abierta) return;
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') onAbrir(false); };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierta, onAbrir]);

  const disponibles = secciones.filter(s => (DIRECTAS as readonly string[]).includes(s.key));
  const enElMenu = secciones.filter(s => !(DIRECTAS as readonly string[]).includes(s.key));
  // Si la sección en la que estás vive en MENÚ, el botón MENÚ queda marcado: la barra nunca puede
  // mostrar cinco botones apagados mientras estás en algún lado.
  const estoyEnElMenu = !(DIRECTAS as readonly string[]).includes(activa);

  const ir = (id: T) => {
    onCambiar(id);
    onAbrir(false);
    // Se vuelve arriba: sin esto aterrizás a mitad de la sección nueva, a la altura a la que habías
    // bajado en la anterior, que nunca es donde querías estar.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {abierta && (
        <div className="md:hidden fixed inset-0 z-40" role="presentation">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => onAbrir(false)} />
          <div
            role="dialog"
            aria-label="Todas las secciones"
            data-hoja-de-menu="true"
            className="absolute bottom-14 left-0 right-0 max-h-[70vh] overflow-y-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between px-1.5 pb-2">
              <span className="text-3xs font-black uppercase tracking-[0.18em] text-slate-500">Todas las secciones</span>
              <button
                type="button"
                onClick={() => onAbrir(false)}
                aria-label="Cerrar el menú"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {enElMenu.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => ir(key)}
                  aria-current={activa === key ? 'page' : undefined}
                  className={`min-h-[52px] flex items-center gap-2.5 px-3 rounded-2xl text-2xs font-bold text-left transition-colors ${
                    activa === key
                      ? 'bg-gold-500 text-slate-950 font-black'
                      : 'bg-slate-950 border border-slate-800 text-slate-300'
                  }`}
                >
                  <Icon size={16} /> <span className="min-w-0 truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Secciones de la app"
        data-barra-de-app="true"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex"
      >
        {disponibles.map(({ key }) => {
          const Icono = ICONO[key] ?? User;
          const esta = activa === key && !abierta;
          return (
            <button
              key={key}
              type="button"
              onClick={() => ir(key)}
              aria-current={esta ? 'page' : undefined}
              data-destino-de-app={key}
              className={`flex-1 ${BOTON_ALTO} flex flex-col items-center justify-center gap-0.5 font-black uppercase tracking-widest text-4xs transition-colors ${
                esta ? 'text-gold-400 border-t-2 border-gold-400 -mt-px bg-gold-950/25' : 'text-slate-500'
              }`}
            >
              <Icono size={17} />
              {CORTO[key] ?? key}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onAbrir(!abierta)}
          aria-expanded={abierta}
          data-destino-de-app="menu"
          className={`flex-1 ${BOTON_ALTO} flex flex-col items-center justify-center gap-0.5 font-black uppercase tracking-widest text-4xs transition-colors ${
            abierta || estoyEnElMenu ? 'text-gold-400 border-t-2 border-gold-400 -mt-px bg-gold-950/25' : 'text-slate-500'
          }`}
        >
          {abierta ? <X size={17} /> : <Menu size={17} />}
          Menú
        </button>
      </nav>
    </>
  );
}
