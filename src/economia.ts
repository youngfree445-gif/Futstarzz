// LA FACTURA DEL MES: lo que cuesta ser vos.
//
// Un futbolista no sólo cobra. Paga la casa, la mantiene, mantiene a los suyos, come, y a fin de año
// le llega el impuesto. Este módulo pone ese lado del balance, que hasta ahora no existía: el campo
// `fixedExpensesWeekly` estaba en el perfil y se restaba del ingreso, pero nadie lo llenaba nunca.
//
// POR QUÉ HACE FALTA, medido en una carrera completa desde el Junior: después de la temporada 4 el
// dinero deja de importar. El capital crece de 1M a 4,3M sin nada que comprar -- los patrocinios en
// su tope de 6 y la tienda agotada -- y entran ~250k por temporada que no tienen destino.
//
// LOS GASTOS ESCALAN, no son fijos. Es la única forma de que muerdan en las dos puntas: un número
// fijo que se sienta en la temporada 20 (~200k al año) es invisible contra los $505.000 que un
// jugador cobra el día 1 firmando patrocinios, y uno que duela el día 1 arruinaría al que no los
// firma. Suben con lo que ganás y con la vida que te compraste.

export interface SituacionFinanciera {
  /** Lo que entró este mes: sueldo, primas, dividendos. La base del impuesto. */
  ingresosDelMes: number;
  /** Lo que costaron las cosas de la tienda que ya son tuyas. Casa, autos, lo que sea. */
  valorDeLoComprado: number;
  /** Tu fama, de 0 a 100. Cuanto más conocido, más caro vivir como se espera de vos. */
  fama: number;
  /** Cuántos meses lleva la carrera. Los primeros son más baratos: todavía no sos nadie. */
  mesesDeCarrera: number;
}

export interface Factura {
  vivienda: number;
  familia: number;
  impuestos: number;
  total: number;
}

/** El impuesto sobre lo que ganaste en el mes. Progresivo, como en la vida. */
export function impuestoSobre(ingresos: number): number {
  if (ingresos <= 0) return 0;
  // Tres tramos: lo primero casi no paga, lo último paga fuerte. Los cortes están puestos sobre lo
  // que de verdad gana un jugador en el juego -- ~250k por temporada de 56 fechas, o sea ~20k al mes
  // al principio y hasta 60k cuando ya firmó todo.
  const tramos: [number, number][] = [[15000, 0.05], [40000, 0.18], [Infinity, 0.32]];
  let restante = ingresos, pagado = 0, desde = 0;
  for (const [hasta, tasa] of tramos) {
    const enEsteTramo = Math.min(restante, hasta - desde);
    if (enEsteTramo <= 0) break;
    pagado += enEsteTramo * tasa;
    restante -= enEsteTramo;
    desde = hasta;
  }
  return Math.round(pagado);
}

/**
 * La factura del mes, desglosada.
 *
 * `vivienda` es el 1,5% mensual de lo que te compraste: la mansión no se paga una vez, se mantiene.
 * Es lo que convierte la tienda en una decisión con consecuencia en vez de un gasto y listo.
 *
 * `familia` crece con la fama, porque la vida que se espera de vos crece con ella, y arranca en un
 * piso bajo para que el jugador de la primera temporada -- que todavía no cobra casi nada -- no se
 * funda antes de empezar.
 */
export function facturaDelMes(s: SituacionFinanciera): Factura {
  // 0,6% mensual, o sea un 7% al año de lo que valen tus cosas: impuesto, servicios y mantenimiento.
  // Estaba en 1,5% mensual -- 18% anual --, que es carisimo: como las compras se acumulan, a la
  // temporada 24 el jugador pagaba 30k por mes solo de mantenimiento y terminaba la carrera en cero.
  const vivienda = Math.round(s.valorDeLoComprado * 0.006);
  const base = 1200 + Math.round(Math.max(0, s.fama) * 90);
  // Los primeros seis meses a mitad de precio: todavía vivís como antes de ser profesional.
  const familia = Math.round(base * (s.mesesDeCarrera < 6 ? 0.5 : 1));
  const impuestos = impuestoSobre(s.ingresosDelMes);
  return { vivienda, familia, impuestos, total: vivienda + familia + impuestos };
}

/** El texto que ve el jugador cuando le llega. */
export function textoDeLaFactura(f: Factura): string {
  return `Vivienda y mantenimiento $${f.vivienda.toLocaleString()} · Familia y gastos $${f.familia.toLocaleString()}`
    + ` · Impuestos $${f.impuestos.toLocaleString()}. Total $${f.total.toLocaleString()}.`;
}

/** Cuántas fechas dura un contrato comercial: una temporada, que en el juego son ~56 fechas. */
export const FECHAS_DE_UN_CONTRATO = 56;

/**
 * Las cuotas de los contratos firmados: cuánto entra esta fecha y qué queda pendiente.
 *
 * CADA CUOTA SE AGOTA. El primer intento sumaba la cuota mirando los patrocinios comprados, sin
 * fecha de fin: un contrato firmado en la temporada 2 seguía pagando las veinticuatro siguientes, y
 * los patrocinios pasaban a rendir veintiséis veces su valor. Medido: el capital seguía creciendo
 * igual que antes de toda la reforma.
 */
export function cobrarCuotas(
  pendientes: readonly { id?: string; cuota: number; restantes: number }[],
): { entra: number; quedan: { id?: string; cuota: number; restantes: number }[]; vencidos: string[] } {
  let entra = 0;
  const quedan: { id?: string; cuota: number; restantes: number }[] = [];
  const vencidos: string[] = [];
  for (const p of pendientes) {
    if (p.restantes <= 0) continue;
    entra += p.cuota;
    if (p.restantes > 1) quedan.push({ id: p.id, cuota: p.cuota, restantes: p.restantes - 1 });
    // EL CONTRATO QUE TERMINA LIBERA SU CUPO, y por eso hay que saber cual era.
    //
    // Sin esto, un patrocinio pagaba una temporada y despues seguia ocupando uno de los seis lugares
    // para siempre sin dar un peso: a partir de la sexta temporada el jugador tenia la agenda llena
    // de contratos muertos y no podia firmar nada nuevo. Medido en una carrera completa: el capital
    // llegaba a 922k en la temporada 11 y de ahi se desplomaba a CERO, con el jugador quebrado las
    // ultimas ocho temporadas.
    else if (p.id) vencidos.push(p.id);
  }
  return { entra: Math.round(entra), quedan, vencidos };
}
