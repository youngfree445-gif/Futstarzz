import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, AlertTriangle, TrendingDown, Radio, HeartPulse, Coins, CalendarDays, Info, X } from 'lucide-react';
import { interpretarAviso, type TonoDeAviso } from '../avisoTono';

// Reemplazo no bloqueante de alert() con el mismo estilo que AchievementToast: aparece arriba a la
// derecha, se queda visible un rato y se retira sola. App.tsx mantiene una cola (noticeQueue) para
// que varios avisos seguidos no se pisen -- se van mostrando de a uno.
//
// EL ÍCONO Y EL COLOR SALEN DEL AVISO, no de un emoji metido en el texto. Los 172 avisos del juego
// arrancaban con uno -- "⚠ Sanción", "🏆 CAMPEÓN", "📉 Tu valor cayó" -- y el toast los mostraba
// tal cual: emoji como marcador, repetido en todos lados, haciendo el trabajo de un ícono y un
// color. Ahora interpretarAviso (src/avisoTono.ts) traduce ese emoji a un tono, y acá se dibuja con
// un ícono de verdad. El texto llega limpio.
interface NoticeToastProps {
  message: string;
  onDone: () => void;
}

const VISIBLE_MS = 5200;

// Cada tono con su ícono y su color. Plano, sin degradado: el degradado en la barra de cada aviso
// era otro de los gestos que hacían ver la interfaz generada.
const ESTILO: Record<TonoDeAviso, { icono: typeof Info; barra: string; texto: string }> = {
  titulo:  { icono: Trophy,       barra: 'bg-gold-500',      texto: 'text-slate-950' },
  exito:   { icono: CheckCircle2, barra: 'bg-emerald-600',   texto: 'text-white' },
  alerta:  { icono: AlertTriangle,barra: 'bg-amber-500',     texto: 'text-slate-950' },
  malo:    { icono: TrendingDown, barra: 'bg-burgundy-600',  texto: 'text-white' },
  prensa:  { icono: Radio,        barra: 'bg-slate-700',     texto: 'text-white' },
  medico:  { icono: HeartPulse,   barra: 'bg-burgundy-500',  texto: 'text-white' },
  mercado: { icono: Coins,        barra: 'bg-gold-600',      texto: 'text-slate-950' },
  agenda:  { icono: CalendarDays, barra: 'bg-slate-700',     texto: 'text-white' },
  info:    { icono: Info,         barra: 'bg-slate-800',     texto: 'text-white' },
};

export default function NoticeToast({ message, onDone }: NoticeToastProps) {
  const [leaving, setLeaving] = useState(false);
  const { tono, titulo, texto } = interpretarAviso(message);
  const { icono: Icono, barra, texto: colorTexto } = ESTILO[tono];

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
      <div className="animate-achievement-in bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-950/60 overflow-hidden pointer-events-auto">
        <div className={`px-3 py-1.5 ${barra} flex items-center justify-between gap-1.5`}>
          <div className={`flex items-center gap-1.5 ${colorTexto}`}>
            <Icono size={12} />
            <span className="text-3xs font-black uppercase tracking-widest">{titulo}</span>
          </div>
          <button
            type="button"
            onClick={() => { setLeaving(true); setTimeout(onDone, 350); }}
            className={`${colorTexto} opacity-70 hover:opacity-100 leading-none px-1`}
            aria-label="Cerrar aviso"
          >
            <X size={12} />
          </button>
        </div>
        <div className="p-3.5">
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{texto}</p>
        </div>
      </div>
    </div>
  );
}
