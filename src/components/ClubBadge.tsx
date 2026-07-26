import React, { useState } from 'react';
import { Club } from '../types';

const CONNECTOR_WORDS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y']);

function getInitials(name: string): string {
  const words = name.replace(/[().]/g, '').split(/\s+/).filter(Boolean);
  const significant = words.filter(w => !CONNECTOR_WORDS.has(w.toLowerCase()));
  const pool = significant.length > 0 ? significant : words;
  return pool.slice(0, 3).map(w => w[0]?.toUpperCase() ?? '').join('') || '?';
}

interface ClubBadgeProps {
  club: Club;
  size?: number; // px, siempre cuadrado
  /** Si es false, el fallback no aplica el color propio del club (para usarlo dentro de un
   * contenedor que YA tiene ese fondo de color) y muestra el emoji/pelota original en vez de
   * iniciales. */
  colorFallback?: boolean;
  className?: string;
}

// Escudo real (hotlink a Wikimedia Commons / footylogos.com, o archivo local en public/badges/
// para los pocos casos donde el hotlink tenía protección anti-bot -- ver club.badgeImageUrl)
// con fallback automático si no hay imagen para ese club o si la carga falla (onError) -- nunca
// deja un ícono roto.
export default function ClubBadge({ club, size = 32, colorFallback = true, className = '' }: ClubBadgeProps) {
  const [failed, setFailed] = useState(false);
  const px = `${size}px`;

  if (club.badgeImageUrl && !failed) {
    const src = /^https?:\/\//.test(club.badgeImageUrl) ? club.badgeImageUrl : `${import.meta.env.BASE_URL}${club.badgeImageUrl}`;
    return (
      <img
        src={src}
        alt={club.name}
        style={{
          width: px,
          height: px,
          // El drop-shadow con blur casi nulo actúa como un contorno oscuro que disimula el
          // halo/fleco blanco que traen algunos PNG de origen al recortarse contra fondo oscuro;
          // el segundo drop-shadow es la sombra "flotante" para dar profundidad.
          filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.6)) drop-shadow(0 3px 5px rgba(0,0,0,0.45))',
        }}
        className={`object-contain shrink-0 ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      style={{ width: px, height: px, fontSize: Math.max(9, size * 0.32) }}
      className={`shrink-0 flex items-center justify-center font-black rounded-md leading-none ${colorFallback ? club.badgeColor : ''} ${className}`}
    >
      {colorFallback ? getInitials(club.name) : (club.badgeLogoUrl || '⚽')}
    </div>
  );
}
