// Exportar e importar una partida como archivo.
//
// El motivo es concreto: una carrera puede durar 32 temporadas y vive SÓLO en el localStorage del
// navegador. Un "borrar datos de navegación", un cambio de teléfono o de computadora, y no queda
// nada. Sin un archivo que el jugador pueda guardar por su cuenta, ese trabajo no tiene respaldo
// posible -- y es el tipo de pérdida que hace abandonar el juego.
//
// El archivo lleva las DOS claves de la ranura (el perfil y la tienda), porque una partida sin sus
// objetos comprados vuelve incompleta.

import { PlayerProfile, ShopItem } from './types';

// Sube sólo si el formato deja de ser compatible hacia atrás. La importación acepta cualquier
// versión menor o igual: un archivo viejo tiene que poder entrar en una versión nueva del juego.
const FORMATO_VERSION = 1;

const claveSave = (slotId: string) => `futbol_star_save_${slotId}`;
const claveShop = (slotId: string) => `futbol_star_shop_${slotId}`;

export interface ArchivoPartida {
  formato: 'futstarzz-partida';
  version: number;
  exportadoEl: string;
  /** Sólo informativo, para que el archivo se entienda sin abrirlo entero. */
  resumen: { nombre: string; club: string; temporada: number };
  perfil: PlayerProfile;
  tienda: ShopItem[];
}

/** Convierte el nombre en algo que cualquier sistema de archivos acepte. */
function nombreDeArchivo(perfil: PlayerProfile): string {
  // ̀-ͯ son las tildes que NFD separa de su letra: se quitan para que el nombre del
  // archivo no dependa de cómo cada sistema maneje los acentos.
  const base = `futstarzz-${perfil.name}-T${perfil.seasonHistory?.length ?? 1}`;
  return `${base.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-')}.json`;
}

/**
 * Descarga la ranura como archivo .json.
 * @returns el nombre del archivo generado, o null si la ranura estaba vacía.
 */
export function exportarPartida(slotId: string, clubName: string): string | null {
  const crudo = localStorage.getItem(claveSave(slotId));
  if (!crudo) return null;

  let perfil: PlayerProfile;
  try {
    perfil = JSON.parse(crudo) as PlayerProfile;
  } catch {
    return null;
  }

  let tienda: ShopItem[] = [];
  const crudoTienda = localStorage.getItem(claveShop(slotId));
  if (crudoTienda) {
    try { tienda = JSON.parse(crudoTienda) as ShopItem[]; } catch { tienda = []; }
  }

  const archivo: ArchivoPartida = {
    formato: 'futstarzz-partida',
    version: FORMATO_VERSION,
    exportadoEl: new Date().toISOString(),
    resumen: { nombre: perfil.name, club: clubName, temporada: perfil.seasonHistory?.length ?? 1 },
    perfil,
    tienda,
  };

  const blob = new Blob([JSON.stringify(archivo, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreDeArchivo(perfil);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Sin esto el blob queda retenido en memoria mientras viva la pestaña.
  URL.revokeObjectURL(url);

  return a.download;
}

/**
 * Valida que el objeto sea una partida de verdad antes de dejarla entrar.
 *
 * Se chequea el perfil campo por campo y no sólo el `formato`: un archivo editado a mano o de otra
 * versión puede traer el rótulo correcto y adentro basura, y escribirla en el localStorage rompe la
 * partida en el próximo arranque, cuando ya es tarde para entender por qué.
 */
function esArchivoValido(dato: unknown): dato is ArchivoPartida {
  if (typeof dato !== 'object' || dato === null) return false;
  const a = dato as Partial<ArchivoPartida>;
  if (a.formato !== 'futstarzz-partida') return false;
  if (typeof a.version !== 'number' || a.version > FORMATO_VERSION) return false;

  const p = a.perfil as Partial<PlayerProfile> | undefined;
  if (!p || typeof p !== 'object') return false;
  return typeof p.name === 'string'
    && typeof p.currentClubId === 'string'
    && typeof p.currentWeek === 'number'
    && typeof p.attributes === 'object' && p.attributes !== null
    && Array.isArray(p.seasonHistory);
}

// Una sola forma con campos opcionales, y no una unión discriminada por `ok`: el tsconfig del
// proyecto compila sin `strict`, y sin strictNullChecks el estrechamiento por `if (!res.ok)` no
// llega a distinguir las dos ramas. Quien la consuma chequea `ok` y usa `error` o `perfil`.
export interface ResultadoImportacion {
  ok: boolean;
  /** Presente sólo cuando ok es false. Ya viene redactado para mostrárselo al jugador. */
  error?: string;
  perfil?: PlayerProfile;
  resumen?: ArchivoPartida['resumen'];
}

/** Lee el archivo elegido y, si es válido, lo escribe en la ranura. No pisa nada si falla. */
export async function importarPartida(file: File, slotId: string): Promise<ResultadoImportacion> {
  let texto: string;
  try {
    texto = await file.text();
  } catch {
    return { ok: false, error: 'No se pudo leer el archivo.' };
  }

  let dato: unknown;
  try {
    dato = JSON.parse(texto);
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' };
  }

  if (!esArchivoValido(dato)) {
    return {
      ok: false,
      error: 'El archivo no es una partida de Fut Starzz, o fue generado por una versión más nueva del juego.',
    };
  }

  // Recién acá se toca el almacenamiento: si algo falló arriba, la ranura queda como estaba.
  localStorage.setItem(claveSave(slotId), JSON.stringify(dato.perfil));
  localStorage.setItem(claveShop(slotId), JSON.stringify(dato.tienda ?? []));

  return { ok: true, perfil: dato.perfil, resumen: dato.resumen };
}
