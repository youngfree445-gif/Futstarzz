import { useState } from 'react';
import { Club, PlayerProfile } from '../types';
import { armarReporteDeBug, type PartidoEnCurso } from '../reporteDeBug';

// EL BOTÓN DE REPORTAR BUG, en un solo lugar.
//
// Vive acá y no suelto en cada pantalla porque va en DOS: el Dashboard y la pantalla del partido.
// Dos copias del mismo panel es exactamente lo que este proyecto viene arreglando -- y acá tendría
// la agravante de que las dos serían casi iguales, que es cuando la que se olvida de actualizar
// pasa más desapercibida.
//
// El del PARTIDO hizo falta por un motivo concreto, y es del jugador: "a veces te reporto un bug
// después de que haya sucedido". El reporte es una foto del paso actual, así que apenas el partido
// termina el estado avanza y lo que había que fotografiar ya no está. Adentro del partido, además,
// se puede contar lo que se ve EN la pantalla -- el torneo, la ronda, el rival, la localía, el
// global --, que es justo el conjunto de datos que más veces salió mal.

interface Props {
  perfil: PlayerProfile;
  clubes: readonly Club[];
  /** Lo que la pantalla del partido está mostrando ahora mismo. Sólo cuando se está jugando. */
  partido?: PartidoEnCurso;
  /** Cómo se dibuja el botón: la barra lateral del Dashboard o la esquina del partido. */
  variante?: 'menu' | 'compacto';
}

export default function ReportarBug({ perfil, clubes, partido, variante = 'menu' }: Props) {
  const [reporte, setReporte] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const abrir = () => {
    setCopiado(false);
    setReporte(armarReporteDeBug(perfil, clubes, { partidoEnCurso: partido }));
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        title="Reportar un bug"
        className={variante === 'menu'
          ? 'btn-fx-subtle w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-gold-400 text-2xs font-mono transition-colors text-left cursor-pointer'
          : 'btn-fx-subtle px-2 py-1 rounded-xl text-slate-500 hover:text-gold-400 text-2xs font-mono transition-colors cursor-pointer border border-slate-800'}
      >
        🐞{variante === 'menu' ? ' Reportar un bug' : ''}
      </button>

      {reporte !== null && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-slate-950/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Reporte de bug"
        >
          <div className="w-full max-w-2xl bg-slate-900 border border-gold-500/30 rounded-2xl p-5 space-y-3">
            <h2 className="text-lg font-black uppercase tracking-tight text-gold-400">Reporte de bug</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esto es una foto de tu partida en este momento{partido ? ', con lo que se está viendo en el partido' : ''}.
              Copialo y pegalo junto con <strong>qué esperabas que pasara</strong>.
            </p>
            {/* El texto se muestra ADEMÁS de copiarse: el portapapeles falla sin contexto seguro
                (http en el celular, WebView de Capacitor) y ahí el botón no haría nada sin decirlo.
                Con el texto a la vista siempre se puede seleccionar a mano. */}
            <pre className="text-3xs bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-auto max-h-[45vh] whitespace-pre-wrap text-slate-400 select-text">
              {reporte}
            </pre>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(reporte)
                    .then(() => setCopiado(true))
                    .catch(() => setCopiado(false));
                }}
                className="btn-fx px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 text-sm font-black uppercase tracking-wide"
              >
                {copiado ? '✓ Copiado' : 'Copiar'}
              </button>
              <button
                type="button"
                onClick={() => { setReporte(null); setCopiado(false); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
