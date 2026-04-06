/** SVG de avatar: Jovem Masculino */
import type { AvatarSvgProps } from './types.ts';

export function AvatarYoungMale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo ── */}
      <g className="layer-clothing">
        <rect x="24" y="63" width="52" height="37" rx="10" fill={shirtColor} />
        <rect x="31" y="60" width="38" height="10" rx="4" fill={shirtColor} />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="43" y="52" width="14" height="13" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="37" rx="21" ry="23" fill={skinColor} />
      </g>
      {/* ── Camada: Cabelo ── */}
      <g className="layer-hair">
        <ellipse cx="50" cy="20" rx="21" ry="10" fill={hairColor} />
        <path d="M29 22 Q28 30 30 36" stroke={hairColor} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M71 22 Q72 30 70 36" stroke={hairColor} strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* franja */}
        <path d="M32 22 Q40 15 50 16 Q60 15 68 22 Q60 20 50 20 Q40 20 32 22Z" fill={hairColor} />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="41" cy="37" rx="3.2" ry="3.8" fill="#1a1a1a" />
        <ellipse cx="59" cy="37" rx="3.2" ry="3.8" fill="#1a1a1a" />
        <circle cx="42" cy="35.8" r="1.1" fill="white" />
        <circle cx="60" cy="35.8" r="1.1" fill="white" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <path d="M48 44 Q50 46 52 44" stroke={hairColor} strokeWidth="1" fill="none" opacity="0.4" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M43 52 Q50 57 57 52" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
