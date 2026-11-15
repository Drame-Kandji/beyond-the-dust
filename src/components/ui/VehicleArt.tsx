import type { VehicleId } from '../../data/types';
import { Art_apollo11lm } from './art/apollo11lm';
import { Art_sojourner } from './art/sojourner';
import { Art_curiosity } from './art/curiosity';
import { Art_perseverance } from './art/perseverance';

/** Simple line-art silhouettes (original drawings, no NASA imagery). */
export function VehicleArt({ id, className = '' }: { id: VehicleId; className?: string }) {
  const stroke = 'currentColor';
  if (id === 'apollo11lm') return <Art_apollo11lm className={className} />;
  if (id === 'sojourner') return <Art_sojourner className={className} />;
  if (id === 'curiosity') return <Art_curiosity className={className} />;
  if (id === 'perseverance') return <Art_perseverance className={className} />;
  if (id === 'lrv')
    return (
      <svg viewBox="0 0 200 120" className={className} fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 72 H180" />
        <circle cx="45" cy="86" r="18" />
        <circle cx="155" cy="86" r="18" />
        <circle cx="45" cy="86" r="6" />
        <circle cx="155" cy="86" r="6" />
        <path d="M25 74 Q45 56 65 74 M135 74 Q155 56 175 74" />
        <path d="M80 72 V52 H104 M86 52 L80 34 M104 72 V58 M112 56 H128 V72" />
        <path d="M150 72 V40 M150 40 L170 22 M150 40 L130 24 M131 24 Q150 4 170 22" />
        <path d="M168 60 h12 v8 h-12z" />
        <path d="M22 60 h16 v12" />
      </svg>
    );
  if (id === 'opportunity')
    return (
      <svg viewBox="0 0 200 120" className={className} fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 54 H170 L180 50" />
        <path d="M50 54 V70 H140 V54" />
        <path d="M128 54 V18 M118 14 h22 v8 h-22z" />
        <path d="M70 54 V44 M62 44 h18" />
        <circle cx="45" cy="96" r="10" />
        <circle cx="95" cy="96" r="10" />
        <circle cx="145" cy="96" r="10" />
        <path d="M95 70 L70 86 L45 96 M70 86 L95 96 M95 70 L145 96" />
        <path d="M140 66 L162 74 L176 92 M172 92 h10" />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M50 60 Q100 -10 150 60" />
      <path d="M50 60 Q100 30 150 60" />
      <path d="M70 52 L100 18 L130 52" />
      <path d="M86 60 h28 v12 h-28z" />
      <path d="M86 72 L40 108 M114 72 L160 108" />
      <rect x="44" y="94" width="14" height="10" transform="rotate(-38 51 99)" />
      <rect x="142" y="94" width="14" height="10" transform="rotate(38 149 99)" />
      <path d="M100 18 V2" strokeDasharray="3 4" />
    </svg>
  );
}
