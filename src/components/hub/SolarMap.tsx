import { motion } from 'motion/react';
import type { DestinationId } from '../../data/types';
import { useT } from '../../i18n/useT';
import { DESTINATIONS } from '../../data';
import { useMedia } from '../../hooks/useMedia';

const SUN = { x: 150, y: 330 };
const EARTH = { x: 150 + Math.cos(-0.5) * 170, y: 330 + Math.sin(-0.5) * 170 };
const MARS = { x: 150 + Math.cos(0.32) * 270, y: 330 + Math.sin(0.32) * 270 };
const DEEP = { x: 735, y: 95 };

/** Stylised, interactive Solar System map (not to scale). */
export function SolarMap({ selected, onSelect }: { selected: DestinationId; onSelect: (d: DestinationId) => void }) {
  const { l, t } = useT();
  // Below lg the 800×600 map renders at ~0.4–0.6×: enlarge labels and hit areas so they stay legible and ≥ 44 px.
  const k = useMedia('(max-width: 1023px)') ? 1.5 : 1;
  const markers: { id: DestinationId; x: number; y: number; color: string; r: number }[] = [
    { id: 'moon', x: EARTH.x + 26, y: EARTH.y - 16, color: '#C9CCD3', r: 6 },
    { id: 'mars', x: MARS.x, y: MARS.y, color: '#E07A3F', r: 11 },
    { id: 'deep-space', x: DEEP.x, y: DEEP.y, color: '#7FE7F2', r: 6 },
  ];
  const name = (id: DestinationId) => l(DESTINATIONS.find((d) => d.id === id)!.name);

  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" role="group" aria-label={t('mapLabel')}>
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.35" stopColor="#ffc46b" />
          <stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mars" cx="35%" cy="35%" r="65%">
          <stop offset="0" stopColor="#f0a070" />
          <stop offset="1" stopColor="#a13a12" />
        </radialGradient>
        <radialGradient id="earth" cx="35%" cy="35%" r="65%">
          <stop offset="0" stopColor="#8ec5ff" />
          <stop offset="1" stopColor="#1d4fa3" />
        </radialGradient>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0" stopColor="#7FE7F2" stopOpacity="0.05" />
          <stop offset="1" stopColor="#7FE7F2" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* orbits */}
      {[170, 270, 440, 620].map((r, i) => (
        <circle key={r} cx={SUN.x} cy={SUN.y} r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray={i > 1 ? '2 6' : undefined} />
      ))}
      {/* asteroid belt */}
      <circle cx={SUN.x} cy={SUN.y} r={345} fill="none" stroke="rgba(255,220,180,0.13)" strokeWidth={14} strokeDasharray="1 5" />
      {/* Jupiter, far */}
      <circle cx={SUN.x + Math.cos(-0.62) * 440} cy={SUN.y + Math.sin(-0.62) * 440} r={14} fill="#c9a27a" opacity={0.55} />

      {/* Pioneer 10 trajectory */}
      <motion.path
        d={`M ${SUN.x + 60} ${SUN.y - 30} C 330 250, 520 170, ${DEEP.x} ${DEEP.y}`}
        fill="none"
        stroke="url(#trail)"
        strokeWidth={2}
        strokeDasharray="6 6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
      />

      {/* Sun */}
      <circle cx={SUN.x} cy={SUN.y} r={70} fill="url(#sun)" />
      <circle cx={SUN.x} cy={SUN.y} r={18} fill="#fff1cc" />

      {/* Earth + Moon */}
      <circle cx={EARTH.x} cy={EARTH.y} r={12} fill="url(#earth)" />
      <circle cx={EARTH.x} cy={EARTH.y} r={26} fill="none" stroke="rgba(255,255,255,0.12)" />
      <text x={EARTH.x - 14} y={EARTH.y + 32} fill="#A9B2C8" fontSize={13 * k} fontFamily="DM Sans">
        {t('earth')}
      </text>
      {/* Mars */}
      <circle cx={MARS.x} cy={MARS.y} r={11} fill="url(#mars)" />

      {markers.map((m) => {
        const active = selected === m.id;
        return (
          <g
            key={m.id}
            role="button"
            tabIndex={0}
            aria-label={name(m.id)}
            aria-pressed={active}
            onClick={() => onSelect(m.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(m.id))}
            className="map-marker cursor-pointer"
          >
            <circle cx={m.x} cy={m.y} r={k > 1 ? 58 : 34} fill="transparent" />
            <circle className="map-focus" cx={m.x} cy={m.y} r={m.r + 24} fill="none" stroke="#FFB547" strokeWidth={3} />
            <circle cx={m.x} cy={m.y} r={m.r + 10} fill="none" stroke={m.color} strokeOpacity={active ? 0.9 : 0.35} strokeWidth={2}>
              <animate attributeName="r" values={`${m.r + 6};${m.r + 22};${m.r + 6}`} dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values={`${active ? 0.9 : 0.4};0;${active ? 0.9 : 0.4}`} dur="2.6s" repeatCount="indefinite" />
            </circle>
            {m.id === 'moon' && <circle cx={m.x} cy={m.y} r={m.r} fill="#C9CCD3" />}
            {m.id === 'deep-space' && <path d={`M ${m.x - 8} ${m.y + 6} L ${m.x + 8} ${m.y - 6} M ${m.x + 8} ${m.y - 6} l -8 0 M ${m.x + 8} ${m.y - 6} l 0 8`} stroke="#7FE7F2" strokeWidth={2.5} fill="none" />}
            <text
              x={m.x + (m.id === 'deep-space' ? -14 : 22 * k)}
              y={m.y + (m.id === 'deep-space' ? 36 : 5 * k)}
              textAnchor={m.id === 'deep-space' ? 'end' : 'start'}
              fill={active ? '#FFB547' : '#EEF1F8'}
              fontSize={(active ? 20 : 17) * k}
              fontWeight={700}
              fontFamily="DM Sans"
              letterSpacing="0.12em"
              style={{ textTransform: 'uppercase' }}
            >
              {name(m.id)}
            </text>
          </g>
        );
      })}
      {/* Outside the marker group so the button's visible text matches its accessible name. */}
      <text x={DEEP.x - 14} y={DEEP.y + 36 + 20 * k} textAnchor="end" fill="#8089A5" fontSize={12 * k} fontFamily="JetBrains Mono" pointerEvents="none" aria-hidden>
        Pioneer 10 → Aldebaran
      </text>
      <text x={20} y={588} fill="#8089A5" fontSize={12 * k} fontFamily="JetBrains Mono" aria-hidden>
        {t('notToScale')}
      </text>
    </svg>
  );
}
