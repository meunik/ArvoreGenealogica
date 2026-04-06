/** SVG de avatar: Criança Masculina */
import type { AvatarSvgProps } from './types.ts';

export function AvatarChildMale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo ── */}
      <g className="layer-clothing">
        <rect x="26" y="66" width="48" height="34" rx="10" fill={shirtColor} />
        <rect x="33" y="62" width="34" height="10" rx="5" fill={shirtColor} />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="43" y="54" width="14" height="12" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça (maior proporcionalmente para criança) ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="36" rx="24" ry="25" fill={skinColor} />
      </g>
      {/* ── Camada: Cabelo ── */}
      <g className="layer-hair">
        <ellipse cx="50" cy="18" rx="24" ry="11" fill={hairColor} />
        <rect x="26" y="18" width="48" height="10" rx="2" fill={hairColor} />
      </g>
      {/* ── Camada: Olhos grandes de criança ── */}
      <g className="layer-eyes">
        <ellipse cx="40" cy="37" rx="4.5" ry="5" fill="#1a1a1a" />
        <ellipse cx="60" cy="37" rx="4.5" ry="5" fill="#1a1a1a" />
        <circle cx="41.5" cy="35" r="1.5" fill="white" />
        <circle cx="61.5" cy="35" r="1.5" fill="white" />
      </g>
      {/* ── Camada: Nariz pequeno ── */}
      <g className="layer-nose">
        <circle cx="50" cy="46" r="1.5" fill={skinColor} stroke={hairColor} strokeWidth="0.8" opacity="0.4" />
      </g>
      {/* ── Camada: Boca sorridente ── */}
      <g className="layer-mouth">
        <path d="M42 52 Q50 60 58 52" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      {/* ── Camada: bochechas ── */}
      <g className="layer-cheeks">
        <ellipse cx="34" cy="46" rx="5" ry="3" fill="#ffaaaa" opacity="0.4" />
        <ellipse cx="66" cy="46" rx="5" ry="3" fill="#ffaaaa" opacity="0.4" />
      </g>
    </svg>
  );
}
