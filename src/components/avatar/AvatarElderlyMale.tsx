/** SVG de avatar: Idoso Masculino */
import type { AvatarSvgProps } from './types.ts';

export function AvatarElderlyMale({ skinColor, hairColor, shirtColor, className = '' }: AvatarSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ── Camada: Corpo ── */}
      <g className="layer-clothing">
        <rect x="20" y="62" width="60" height="38" rx="10" fill={shirtColor} />
        <rect x="28" y="60" width="44" height="10" rx="4" fill={shirtColor} />
        {/* Gravata */}
        <path d="M48 60 L46 72 L50 76 L54 72 L52 60Z" fill="#444" opacity="0.6" />
      </g>
      {/* ── Camada: Pescoço ── */}
      <g className="layer-neck">
        <rect x="42" y="52" width="16" height="14" rx="4" fill={skinColor} />
      </g>
      {/* ── Camada: Cabeça ── */}
      <g className="layer-head">
        <ellipse cx="50" cy="38" rx="22" ry="23" fill={skinColor} />
        {/* rugas na testa */}
        <path d="M34 30 Q42 28 50 29 Q58 28 66 30" stroke={skinColor} strokeWidth="1.5" fill="none" opacity="0.15"
          filter="url(#wrinkle)" />
        <path d="M36 34 Q43 32 50 33 Q57 32 64 34" stroke="#a0806a" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M38 38 Q43 36.5 50 37 Q57 36.5 62 38" stroke="#a0806a" strokeWidth="0.7" fill="none" opacity="0.25" />
      </g>
      {/* ── Camada: Cabelo Branco / Pouco ── */}
      <g className="layer-hair">
        <path d="M28 26 Q35 15 50 14 Q65 15 72 26 Q65 22 50 22 Q35 22 28 26Z" fill={hairColor} />
        <ellipse cx="30" cy="30" rx="6" ry="8" fill={hairColor} opacity="0.7" />
        <ellipse cx="70" cy="30" rx="6" ry="8" fill={hairColor} opacity="0.7" />
      </g>
      {/* ── Camada: Bigode ── */}
      <g className="layer-mustache">
        <path d="M43 49 Q47 52 50 50 Q53 52 57 49" fill={hairColor} opacity="0.7" />
      </g>
      {/* ── Camada: Olhos ── */}
      <g className="layer-eyes">
        <ellipse cx="41" cy="38" rx="3.5" ry="3.8" fill="#2a2a2a" />
        <ellipse cx="59" cy="38" rx="3.5" ry="3.8" fill="#2a2a2a" />
        <circle cx="42.2" cy="36.8" r="1.1" fill="white" />
        <circle cx="60.2" cy="36.8" r="1.1" fill="white" />
        {/* sobrancelhas espessas */}
        <rect x="36" y="32" width="10" height="2.5" rx="1.2" fill={hairColor} opacity="0.9" />
        <rect x="54" y="32" width="10" height="2.5" rx="1.2" fill={hairColor} opacity="0.9" />
      </g>
      {/* ── Camada: Nariz ── */}
      <g className="layer-nose">
        <ellipse cx="50" cy="45" rx="3" ry="2" fill="none" stroke="#a0806a" strokeWidth="1.2" opacity="0.4" />
      </g>
      {/* ── Camada: Boca ── */}
      <g className="layer-mouth">
        <path d="M43 54 Q50 58 57 54" stroke="#666" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
