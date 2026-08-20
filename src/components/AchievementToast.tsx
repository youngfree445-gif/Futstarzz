import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { Trophy } from 'lucide-react';

// Notificación flotante tipo Xbox/PlayStation: aparece arriba a la derecha cuando se desbloquea un
// logro (ver checkAndUnlockAchievements en App.tsx), se queda unos segundos y se retira sola. Si
// hay una cola de logros (varios desbloqueados a la vez), App.tsx la va vaciando de a uno.
interface AchievementToastProps {
  achievement: Achievement;
  onDone: () => void;
}

const VISIBLE_MS = 4200;

export default function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setLeaving(false);
    const leaveTimer = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const doneTimer = setTimeout(onDone, VISIBLE_MS + 350);
    return () => { clearTimeout(leaveTimer); clearTimeout(doneTimer); };
  }, [achievement.id]);

  return (
    <div
      className="fixed top-4 right-4 z-[100] w-full max-w-xs pointer-events-none"
      style={{
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 1, 1)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateY(-16px) scale(0.97)' : 'translateY(0) scale(1)',
      }}
    >
      <div className="animate-achievement-in bg-slate-900 border border-gold-500/50 rounded-2xl shadow-2xl shadow-gold-950/40 overflow-hidden">
        <div className="px-3 py-1.5 bg-gold-600 flex items-center gap-1.5">
          <Trophy size={12} className="text-slate-950" />
          <span className="text-3xs font-black uppercase tracking-widest text-slate-950">
            Logro Desbloqueado
          </span>
        </div>
        <div className="p-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-gold-500/30 flex items-center justify-center text-2xl shrink-0">
            {achievement.icon}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-white leading-tight truncate">{achievement.name}</h4>
            <p className="text-2xs text-slate-400 leading-snug mt-0.5">{achievement.description}</p>
            <span className="text-2xs text-gold-400 font-bold font-mono block mt-1">
              +${achievement.reward.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
