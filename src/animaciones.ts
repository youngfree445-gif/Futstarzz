// Las animaciones que CSS no puede hacer solo, porque dependen de un valor que vive en JS.
//
// El resto de la capa de animación es CSS puro y vive en index.css. Acá sólo está lo que necesita
// saber de dónde a dónde va un número.

import { useEffect, useRef, useState } from 'react';

/**
 * UN NÚMERO QUE CUENTA HASTA SU VALOR NUEVO, en vez de saltar.
 *
 * Un capital que pasa de 300.000 a 432.120 en un frame se lee como un error de renderizado: el ojo
 * no registra que ganaste, registra que la pantalla parpadeó. Contando en 600ms se lee como lo que
 * es -- una ganancia -- sin agregar ni un elemento nuevo a la interfaz.
 *
 * Devuelve el valor a mostrar. El primer render NO anima: al abrir la pantalla los números ya están
 * donde van, y verlos contar desde cero cada vez que entrás sería un truco de demo, no información.
 *
 * Respeta prefers-reduced-motion: quien pidió menos movimiento ve el número final directo.
 */
export function useNumeroQueCuenta(valor: number, duracionMs = 600): number {
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);
  const primeraVez = useRef(true);

  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      anterior.current = valor;
      setMostrado(valor);
      return;
    }
    const desde = anterior.current;
    anterior.current = valor;
    if (desde === valor) return;

    const quietito = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (quietito || duracionMs <= 0) { setMostrado(valor); return; }

    const arranque = performance.now();
    let vivo = true;
    // La misma curva que toda la capa de animación: cubic-bezier(0.16, 1, 0.3, 1) aproximada.
    // Arranca rápido y frena al final, que es como se lee un contador de verdad.
    const suavizar = (t: number) => 1 - Math.pow(1 - t, 3);

    const paso = (ahora: number) => {
      if (!vivo) return;
      const t = Math.min(1, (ahora - arranque) / duracionMs);
      setMostrado(Math.round(desde + (valor - desde) * suavizar(t)));
      if (t < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
    return () => { vivo = false; };
  }, [valor, duracionMs]);

  return mostrado;
}

/**
 * Una clase de animación que se prende sola cuando el valor cambia y se apaga al terminar.
 *
 * Sirve para los gestos de una sola pasada -- el marcador que salta con el gol, la fila de la tabla
 * que se marca al cambiar de puesto -- donde la animación tiene que volver a dispararse la próxima
 * vez que el valor cambie. Sin apagarla, CSS no la vuelve a correr: una animación que ya terminó
 * no se reinicia sola porque el elemento siga en pantalla.
 */
export function useClaseAlCambiar(valor: unknown, clase: string, duracionMs = 700): string {
  const [activa, setActiva] = useState(false);
  const anterior = useRef(valor);
  const primeraVez = useRef(true);

  useEffect(() => {
    if (primeraVez.current) { primeraVez.current = false; anterior.current = valor; return; }
    if (anterior.current === valor) return;
    anterior.current = valor;
    setActiva(true);
    const t = setTimeout(() => setActiva(false), duracionMs);
    return () => clearTimeout(t);
  }, [valor, duracionMs]);

  return activa ? clase : '';
}
