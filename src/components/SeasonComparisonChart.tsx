import React from 'react';
import { SeasonHistory } from '../types';
import { TrendingUp } from 'lucide-react';

interface SeasonComparisonChartProps {
  seasonHistory: SeasonHistory[];
}

// Series que se pueden graficar, cada una leyendo un snapshot opcional de SeasonHistory (ver
// freezeSeasonLeadersIfNewSeason en App.tsx). Las temporadas guardadas antes de esta feature no
// tienen snapshot -- el punto simplemente se salta, no se inventa un valor.
const SERIES: { key: string; label: string; color: string; read: (s: SeasonHistory) => number | undefined }[] = [
  { key: 'ritmo', label: 'Ritmo', color: '#eab308', read: s => s.attributesSnapshot?.ritmo },
  { key: 'regate', label: 'Regate', color: '#f59e0b', read: s => s.attributesSnapshot?.regate },
  { key: 'tiro', label: 'Tiro', color: '#dc2626', read: s => s.attributesSnapshot?.tiro },
  { key: 'defensa', label: 'Defensa', color: '#0ea5e9', read: s => s.attributesSnapshot?.defensa },
  { key: 'pase', label: 'Pase', color: '#22c55e', read: s => s.attributesSnapshot?.pase },
  { key: 'fisico', label: 'Físico', color: '#a855f7', read: s => s.attributesSnapshot?.fisico },
  { key: 'prestige', label: 'Relación DT', color: '#facc15', read: s => s.prestigeSnapshot },
  { key: 'prestigeCompaneros', label: 'Compañeros', color: '#38bdf8', read: s => s.prestigeCompanerosSnapshot },
  { key: 'fans', label: 'Hinchada', color: '#fb7185', read: s => s.fansSnapshot },
];

const CHART_WIDTH = 520;
const CHART_HEIGHT = 120;
const PADDING_X = 10;
const PADDING_Y = 12;

function Sparkline({ points, color, max }: { points: { x: number; y: number | undefined }[]; color: string; max: number }) {
  const usable = points.filter((p): p is { x: number; y: number } => p.y !== undefined);
  if (usable.length === 0) {
    return <p className="text-3xs text-slate-600 font-mono uppercase py-6 text-center">Sin datos suficientes todavía</p>;
  }

  const toSvgX = (x: number) => PADDING_X + (x / Math.max(1, points.length - 1)) * (CHART_WIDTH - PADDING_X * 2);
  const toSvgY = (y: number) => CHART_HEIGHT - PADDING_Y - (y / max) * (CHART_HEIGHT - PADDING_Y * 2);

  const path = usable.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-auto" role="img">
      {/* Grilla horizontal tenue, de referencia -- no son datos. */}
      {[0.25, 0.5, 0.75].map(frac => (
        <line
          key={frac}
          x1={PADDING_X}
          x2={CHART_WIDTH - PADDING_X}
          y1={CHART_HEIGHT - PADDING_Y - frac * (CHART_HEIGHT - PADDING_Y * 2)}
          y2={CHART_HEIGHT - PADDING_Y - frac * (CHART_HEIGHT - PADDING_Y * 2)}
          stroke="#1e293b"
          strokeWidth={1}
        />
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {usable.map((p, i) => (
        <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={i === usable.length - 1 ? 4 : 2.5} fill={color} />
      ))}
    </svg>
  );
}

export default function SeasonComparisonChart({ seasonHistory }: SeasonComparisonChartProps) {
  // Una temporada por seasonNum (puede haber varias entradas si cambiaste de club en el mismo año
  // -- nos quedamos con la última entrada de cada año, que es la que quedó "congelada" al cierre).
  const porAnio = new Map<number, SeasonHistory>();
  seasonHistory.forEach(s => porAnio.set(s.seasonNum, s));
  const temporadas = [...porAnio.values()].sort((a, b) => a.seasonNum - b.seasonNum);

  const tieneAlgunSnapshot = temporadas.some(s => s.attributesSnapshot || s.prestigeSnapshot !== undefined || s.fansSnapshot !== undefined);

  if (temporadas.length < 2 || !tieneAlgunSnapshot) {
    return (
      <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 text-center">
        {/* Sin uppercase: es una oración entera, no una etiqueta. En mayúsculas sostenidas se lee
            mucho peor, que es justo lo contrario de lo que necesita un texto explicativo. */}
        <p className="text-2xs text-slate-400 font-mono leading-relaxed">
          El comparador de temporadas se completa a medida que cerrás años de carrera. Todavía no hay
          suficientes temporadas cerradas con datos para graficar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-2xs uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5 border-b border-slate-800 pb-2">
        <TrendingUp size={14} className="text-burgundy-400" /> Evolución por temporada
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {SERIES.map(serie => {
          const points = temporadas.map((s, i) => ({ x: i, y: serie.read(s) }));
          const max = serie.key === 'prestige' || serie.key === 'prestigeCompaneros' || serie.key === 'fans' ? 100 : 99;
          return (
            <div key={serie.key} className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-3xs font-bold uppercase text-slate-400">{serie.label}</span>
                <span className="text-3xs font-mono text-slate-600">
                  {temporadas[0].seasonNum} → {temporadas[temporadas.length - 1].seasonNum}
                </span>
              </div>
              <Sparkline points={points} color={serie.color} max={max} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
