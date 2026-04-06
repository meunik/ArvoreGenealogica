/** SVG de avatar: Adulto Masculino */
import type { AvatarSvgProps } from './types.ts';

export function AvatarAdultMale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo / Roupa ── */}
      <g className="layer-clothing">
        <rect x="22" y="62" width="56" height="38" rx="10" fill={shirtColor} />
        <rect x="30" y="60" width="40" height="10" rx="4" fill={shirtColor} />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="42" y="52" width="16" height="14" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça / Pele ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="38" rx="22" ry="24" fill={skinColor} />
      </g>
      {/* ── Camada: Cabelo ── */}
      <g className="layer-hair">
        <ellipse cx="50" cy="22" rx="22" ry="11" fill={hairColor} />
        <rect x="28" y="22" width="44" height="8" rx="2" fill={hairColor} />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="41" cy="38" rx="3.5" ry="4" fill="#1a1a1a" />
        <ellipse cx="59" cy="38" rx="3.5" ry="4" fill="#1a1a1a" />
        <circle cx="42.2" cy="36.5" r="1.2" fill="white" />
        <circle cx="60.2" cy="36.5" r="1.2" fill="white" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <ellipse cx="50" cy="45" rx="2.5" ry="1.5" fill="none" stroke={hairColor} strokeWidth="1.2" opacity="0.5" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M43 53 Q50 58 57 53" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
