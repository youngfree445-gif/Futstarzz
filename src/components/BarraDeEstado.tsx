// LA TIRA DE ESTADO DEL ENCABEZADO: energía, capital y las cinco barras de cómo te ven.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ SALIÓ A UN ARCHIVO PROPIO
// ---------------------------------------------------------------------------------------------
//
// Eran SIETE copias del mismo bloque de veinte líneas dentro de Dashboard.tsx, idénticas salvo el
// ícono, el rótulo, el color y el valor. Ciento cuarenta líneas para mostrar siete números.
//
// Eso no es sólo repetición: es la razón por la que la tira nunca mejoró. Cualquier cambio de forma
// -- el ancho, el alto, cómo se agrupan, qué pasa cuando no entran -- había que hacerlo siete veces
// y con acertar seis alcanzaba para que quedara desparejo. Con un solo medidor, la tira entera se
// rediseña cambiando quince líneas.
//
// ---------------------------------------------------------------------------------------------
// EL PROBLEMA QUE SE ARREGLA: EN ESCRITORIO SE VEÍA AMONTONADA
// ---------------------------------------------------------------------------------------------
//
// Reportado con captura. En una pantalla ancha las siete pastillas se envolvían en dos filas
// desparejas -- cuatro arriba, tres abajo -- apretadas contra el borde derecho, con medio ancho de
// ventana vacío en el medio. No se leía como una barra de estado: se leía como algo que no entró.
//
// Dos causas, y las dos venían de la misma raíz:
//
//   1. CADA PASTILLA ERA MÁS ANCHA DE LO NECESARIO. El rótulo y el valor iban en una fila con
//      `justify-between` y un `min-w-[64px]`, así que "DT 93/100" ocupaba lo mismo que
//      "Hinchada 100/100". Siete veces ese desperdicio no entra en una fila.
//   2. ENVOLVÍA CON `justify-end`. Cuando una fila envuelta se alinea a la derecha, la última fila
//      queda corta y desalineada: es la forma más rápida de que algo parezca roto.
//
// El primer intento fue apretar las pastillas -- el rótulo arriba del número en vez de al lado, así
// cada una mide lo que mide su contenido y no lo que mide el rótulo más largo del conjunto -- y
// dejarlas sin envolver. NO ALCANZÓ, y falló peor: dejó de envolver y la última quedó CORTADA
// contra el borde. Reportado con captura otra vez, y encima el código viejo tenía escrita esa misma
// advertencia, que es lo que hace que valga la pena dejar esto anotado.
//
// LO QUE FALTABA ERA MÁS SIMPLE: la fecha y las siete métricas no entran en la misma fila, y punto.
// Compartiendo fila sólo hay dos finales, y los dos son el error reportado -- envolver desparejo o
// cortar. Ahora la tira tiene SU PROPIA FILA, también en escritorio, y ahí entra con aire de sobra.
//
// Y las pastillas CRECEN para repartirse esa fila, con un tope. Uniformes y llenando el ancho se
// leen como un tablero; pegadas a un costado con el resto vacío se leen como que algo no entró, que
// es de donde salió este arreglo.
//
// ---------------------------------------------------------------------------------------------
// Y ESTÁN AGRUPADAS, QUE ES LO QUE SACA LO DE "AMONTONADO"
// ---------------------------------------------------------------------------------------------
//
// Siete cajas iguales en fila son una pared aunque entren. Pero no son siete cosas del mismo tipo:
//
//   LO QUE GASTÁS      energía y capital -- se consumen y se recuperan
//   CÓMO TE VEN        DT, plantel, hinchada -- lo que el fútbol piensa de vos
//   CÓMO ESTÁS         entorno y mente -- lo que el fútbol te va costando
//
// Un espacio más grande entre grupos y una línea finita alcanzan para que el ojo lea tres bloques
// en vez de siete cajas. No hace falta ningún rótulo: el agrupamiento se ve.
//
// En MÓVIL nada de esto aplica -- ahí la tira se desliza en horizontal y los separadores sólo
// gastarían ancho.

import React from 'react';

export interface MetricaDeEstado {
  clave: string;
  rotulo: string;
  /** El texto completo, para el `title`. Sólo cuando el rótulo corto no alcanza. */
  nombreLargo?: string;
  Icono: React.ComponentType<{ size?: number; className?: string }>;
  /** Color del ícono y de la barra, como clases de Tailwind ya resueltas. */
  colorIcono: string;
  colorBarra: string;
  /** 0 a 100. Si es null, la métrica no tiene barra (el capital, que no tiene techo). */
  valor: number | null;
  /** Lo que se muestra: "93/100", "$496.390". */
  texto: string;
  /** Separa este grupo del anterior con más aire y una línea. */
  abreGrupo?: boolean;
}

/** Una pastilla. El rótulo ARRIBA del número: así mide lo que mide, no lo que mide el más largo. */
function Medidor({ m }: { m: MetricaDeEstado }) {
  return (
    <div
      title={m.nombreLargo}
      data-medidor={m.clave}
      // En escritorio cada pastilla CRECE para repartirse la fila (`md:flex-1`), con un tope para
      // que con pocas metricas no queden tres cajas gigantes. Uniformes y llenando el ancho se leen
      // como un tablero; pegadas a un costado con el resto vacio se leen como que algo no entro.
      className={`shrink-0 md:flex-1 md:max-w-[200px] flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 ${
        m.abreGrupo ? 'md:ml-3' : ''
      }`}
    >
      <m.Icono size={14} className={m.colorIcono} />
      <div className="min-w-0">
        <span className="block text-4xs text-slate-500 font-bold uppercase tracking-widest leading-none">
          {m.rotulo}
        </span>
        <span className="block text-xs text-white font-black leading-tight tabular-nums">
          {m.texto}
        </span>
        {m.valor != null && (
          <div className="w-full min-w-[52px] bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div
              className={`${m.colorBarra} h-full rounded-full transition-[width] duration-500 ease-out`}
              style={{ width: `${Math.max(0, Math.min(100, m.valor))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function BarraDeEstado({ metricas }: { metricas: readonly MetricaDeEstado[] }) {
  return (
    <div
      data-barra-de-estado
      // En MÓVIL se desliza en horizontal (por eso el shrink-0 de cada pastilla): con siete métricas
      // en una grilla, el encabezado se comía media pantalla.
      // En ESCRITORIO NO ENVUELVE. Antes envolvía a dos filas desparejas contra el borde derecho, que
      // es lo que se veía amontonado. Entran las siete en una fila porque cada pastilla ahora mide lo
      // que mide su contenido.
      className="flex md:flex-nowrap overflow-x-auto md:overflow-x-visible items-stretch gap-2 text-xs font-mono w-full -mx-1 px-1 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {metricas.map(m => <Medidor key={m.clave} m={m} />)}
    </div>
  );
}
