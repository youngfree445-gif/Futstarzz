import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

// Reemplazo no bloqueante de alert() con el mismo estilo que AchievementToast: aparece arriba a la
// derecha, se queda visible un rato y se retira sola. App.tsx mantiene una cola (noticeQueue) para
// que varios avisos seguidos no se pisen -- se van mostrando de a uno.
interface NoticeToastProps {
  message: string;
  onDone: () => void;
}

const VISIBLE_MS = 5200;

export default function NoticeToast({ message, onDone }: NoticeToastProps) {
  const [leaving, setLeaving] = useState(false);

  // El temporizador NO depende de `message`: dos avisos con el mismo texto no reiniciaban el
  // efecto y el toast quedaba colgado en pantalla. La identidad la da el `key` en App.tsx (un id
  // por aviso), que remonta el componente y hace correr esto de cero.
  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const doneTimer = setTimeout(onDone, VISIBLE_MS + 350);
    return () => { clearTimeout(leaveTimer); clearTimeout(doneTimer); };
  }, []);

  return (
    <div
      // pointer-events-none en el contenedor: es un bloque `fixed` de 384px arriba a la derecha,
      // justo encima de los botones x2/x4/Saltar del simulador, y aunque esté transparente seguía
      // comiéndose los clics. El panel de adentro lo vuelve a activar, así que el botón de cerrar
      // funciona igual.
      className="fixed top-4 right-4 z-[100] w-full max-w-sm pointer-events-none"
      style={{
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 1, 1)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateY(-16px) scale(0.97)' : 'translateY(0) scale(1)',
      }}
    >
      <div className="animate-achievement-in bg-slate-900 border border-gold-500/50 rounded-2xl shadow-2xl shadow-gold-950/40 overflow-hidden pointer-events-auto">
        <div className="px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-700 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <Info size={12} className="text-slate-950" />
            <span className="text-3xs font-black uppercase tracking-widest text-slate-950">
              Fut Starzz
            </span>
          </div>
          <button
            type="button"
            onClick={() => { setLeaving(true); setTimeout(onDone, 350); }}
            className="text-slate-950/70 hover:text-slate-950 text-3xs font-black leading-none px-1"
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
        <div className="p-3.5">
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{message}</p>
        </div>
      </div>
    </div>
  );
}
