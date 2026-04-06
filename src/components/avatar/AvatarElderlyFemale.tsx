/** SVG de avatar: Idosa Feminina */
import type { AvatarSvgProps } from './types.ts';

export function AvatarElderlyFemale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo ── */}
      <g className="layer-clothing">
        <path d="M20 100 Q20 66 50 62 Q80 66 80 100Z" fill={shirtColor} />
        {/* colar de pérolas */}
        <circle cx="44" cy="66" r="2.5" fill="#e8e8e8" opacity="0.9" />
        <circle cx="50" cy="65" r="2.5" fill="#e8e8e8" opacity="0.9" />
        <circle cx="56" cy="66" r="2.5" fill="#e8e8e8" opacity="0.9" />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="42" y="52" width="16" height="14" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="38" rx="22" ry="23" fill={skinColor} />
        {/* rugas */}
        <path d="M36 34 Q43 32 50 33 Q57 32 64 34" stroke="#a0806a" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M38 38 Q43 36.5 50 37 Q57 36.5 62 38" stroke="#a0806a" strokeWidth="0.7" fill="none" opacity="0.25" />
      </g>
      {/* ── Camada: Cabelo branco curto/penteado ── */}
      <g className="layer-hair">
        <ellipse cx="50" cy="19" rx="22" ry="9" fill={hairColor} />
        <ellipse cx="50" cy="14" rx="16" ry="6" fill={hairColor} />
        <rect x="27" y="24" width="6" height="18" rx="3" fill={hairColor} opacity="0.8" />
        <rect x="67" y="24" width="6" height="18" rx="3" fill={hairColor} opacity="0.8" />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="41" cy="37" rx="3.5" ry="3.8" fill="#2a2a2a" />
        <ellipse cx="59" cy="37" rx="3.5" ry="3.8" fill="#2a2a2a" />
        <circle cx="42.2" cy="35.5" r="1.1" fill="white" />
        <circle cx="60.2" cy="35.5" r="1.1" fill="white" />
        {/* olhos com pés de galinha */}
        <path d="M36 34 Q39 32 42 34" stroke="#a0806a" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M58 34 Q61 32 64 34" stroke="#a0806a" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M35 35 L33 33 M35 36 L32 35 M35 37 L33 38" stroke="#a0806a" strokeWidth="0.5" opacity="0.3" />
        <path d="M65 35 L67 33 M65 36 L68 35 M65 37 L67 38" stroke="#a0806a" strokeWidth="0.5" opacity="0.3" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <ellipse cx="50" cy="45" rx="2" ry="1.5" fill="none" stroke="#a0806a" strokeWidth="1" opacity="0.4" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M44 53 Q50 58 56 53" stroke="#c05070" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
