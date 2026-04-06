/** SVG de avatar: Jovem Feminino */
import type { AvatarSvgProps } from './types.ts';

export function AvatarYoungFemale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo ── */}
      <g className="layer-clothing">
        <path d="M24 100 Q24 66 50 63 Q76 66 76 100Z" fill={shirtColor} />
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
        <ellipse cx="50" cy="19" rx="21" ry="9" fill={hairColor} />
        <rect x="28" y="22" width="7" height="30" rx="3.5" fill={hairColor} />
        <rect x="65" y="22" width="7" height="30" rx="3.5" fill={hairColor} />
        <ellipse cx="50" cy="15" rx="16" ry="7" fill={hairColor} />
        {/* rabo de cavalo ou tiara */}
        <ellipse cx="72" cy="28" rx="4" ry="6" fill={hairColor} />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="41" cy="37" rx="3.2" ry="3.8" fill="#1a1a1a" />
        <ellipse cx="59" cy="37" rx="3.2" ry="3.8" fill="#1a1a1a" />
        <circle cx="42" cy="35.8" r="1.1" fill="white" />
        <circle cx="60" cy="35.8" r="1.1" fill="white" />
        <path d="M37.5 33.5 L36.5 31 M41 32.5 L41 30 M44.5 33.5 L45.5 31" stroke="#1a1a1a" strokeWidth="0.9" />
        <path d="M55.5 33.5 L54.5 31 M59 32.5 L59 30 M62.5 33.5 L63.5 31" stroke="#1a1a1a" strokeWidth="0.9" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <path d="M48 44 Q50 46 52 44" stroke={hairColor} strokeWidth="1" fill="none" opacity="0.4" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M44 52 Q50 58 56 52" stroke="#c05070" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
