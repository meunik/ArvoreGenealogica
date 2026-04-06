/** SVG de avatar: Criança Feminina */
import type { AvatarSvgProps } from './types.ts';

export function AvatarChildFemale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo ── */}
      <g className="layer-clothing">
        <path d="M26 100 Q26 68 50 65 Q74 68 74 100Z" fill={shirtColor} />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="43" y="54" width="14" height="12" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="36" rx="24" ry="25" fill={skinColor} />
      </g>
      {/* ── Camada: Cabelo com trancinhas/laço ── */}
      <g className="layer-hair">
        <ellipse cx="50" cy="17" rx="24" ry="10" fill={hairColor} />
        <rect x="25" y="20" width="8" height="28" rx="4" fill={hairColor} />
        <rect x="67" y="20" width="8" height="28" rx="4" fill={hairColor} />
        <ellipse cx="50" cy="12" rx="18" ry="8" fill={hairColor} />
        {/* laço */}
        <ellipse cx="28" cy="22" rx="5" ry="4" fill="#e91e8c" opacity="0.8" />
        <ellipse cx="72" cy="22" rx="5" ry="4" fill="#e91e8c" opacity="0.8" />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="40" cy="37" rx="4.5" ry="5" fill="#1a1a1a" />
        <ellipse cx="60" cy="37" rx="4.5" ry="5" fill="#1a1a1a" />
        <circle cx="41.5" cy="35" r="1.5" fill="white" />
        <circle cx="61.5" cy="35" r="1.5" fill="white" />
        <path d="M36 33 L35 30 M40 32 L40 29 M44 33 L45 30" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M56 33 L55 30 M60 32 L60 29 M64 33 L65 30" stroke="#1a1a1a" strokeWidth="1" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <circle cx="50" cy="46" r="1.5" fill={skinColor} stroke={hairColor} strokeWidth="0.8" opacity="0.4" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M42 52 Q50 60 58 52" stroke="#c05070" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      {/* ── Camada: bochechas ── */}
      <g className="layer-cheeks">
        <ellipse cx="34" cy="46" rx="5" ry="3" fill="#ffaaaa" opacity="0.4" />
        <ellipse cx="66" cy="46" rx="5" ry="3" fill="#ffaaaa" opacity="0.4" />
      </g>
    </svg>
  );
}
