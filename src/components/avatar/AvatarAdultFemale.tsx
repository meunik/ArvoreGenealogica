/** SVG de avatar: Adulto Feminino */
import type { AvatarSvgProps } from './types.ts';

export function AvatarAdultFemale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo / Roupa ── */}
      <g className="layer-clothing">
        <path d="M22 100 Q22 65 50 62 Q78 65 78 100Z" fill={shirtColor} />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="42" y="52" width="16" height="14" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça / Pele ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="38" rx="22" ry="24" fill={skinColor} />
      </g>
      {/* ── Camada: Cabelo Longo ── */}
      <g className="layer-hair">
        <ellipse cx="50" cy="20" rx="22" ry="10" fill={hairColor} />
        <rect x="27" y="20" width="8" height="36" rx="4" fill={hairColor} />
        <rect x="65" y="20" width="8" height="36" rx="4" fill={hairColor} />
        <ellipse cx="50" cy="16" rx="18" ry="8" fill={hairColor} />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="41" cy="38" rx="3.5" ry="4" fill="#1a1a1a" />
        <ellipse cx="59" cy="38" rx="3.5" ry="4" fill="#1a1a1a" />
        <circle cx="42.2" cy="36.5" r="1.2" fill="white" />
        <circle cx="60.2" cy="36.5" r="1.2" fill="white" />
        {/* cílios */}
        <path d="M37 34 L36 31 M41 33 L41 30 M45 34 L46 31" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M55 34 L54 31 M59 33 L59 30 M63 34 L64 31" stroke="#1a1a1a" strokeWidth="1" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <ellipse cx="50" cy="45" rx="2" ry="1.2" fill="none" stroke={hairColor} strokeWidth="1" opacity="0.4" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M44 53 Q50 59 56 53" stroke="#c05070" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
