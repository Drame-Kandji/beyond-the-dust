import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';

type Zone = 'hydrogen' | 'pulsars' | 'humans' | 'system';
const t2 = (en: string, fr: string) => ({ en, fr });
const INFO: Record<Zone, { title: { en: string; fr: string }; text: { en: string; fr: string } }> = {
  hydrogen: {
    title: t2('A hydrogen atom', 'Un atome d’hydrogène'),
    text: t2(
      'Hydrogen is the most common element in the universe. Its tiny "flip" is used as a ruler for time and size that any scientist, anywhere, could understand.',
      'L’hydrogène est l’élément le plus courant de l’univers. Son minuscule « basculement » sert de règle pour le temps et les tailles, compréhensible par n’importe quel scientifique.',
    ),
  },
  pulsars: {
    title: t2('A map made of 14 pulsars', 'Une carte faite de 14 pulsars'),
    text: t2(
      'Pulsars are dead stars that blink like lighthouses, each with its own rhythm. Lines show the direction and blinking code of 14 pulsars, so the Sun’s position can be found.',
      'Les pulsars sont des étoiles mortes qui clignotent comme des phares, chacune à son rythme. Les lignes donnent la direction et le code de 14 pulsars, pour retrouver la position du Soleil.',
    ),
  },
  humans: {
    title: t2('Two humans', 'Deux humains'),
    text: t2(
      'A man and a woman are drawn in front of an outline of the spacecraft, which shows how tall humans are. The man raises his hand in greeting.',
      'Un homme et une femme sont dessinés devant la silhouette de la sonde, ce qui montre la taille des humains. L’homme lève la main pour saluer.',
    ),
  },
  system: {
    title: t2('Our Solar System', 'Notre Système solaire'),
    text: t2('The Sun and its planets in a row. A line leaves the third planet, Earth, and swings past Jupiter: it is Pioneer’s own journey.', 'Le Soleil et ses planètes alignés. Une ligne part de la troisième planète, la Terre, et passe par Jupiter : c’est le voyage de Pioneer.'),
  },
};

/** Simplified, original line drawing inspired by the Pioneer plaque (not a reproduction). */
export function PlaqueModal() {
  const { t, l } = useT();
  const open = useAppStore((s) => s.plaqueOpen);
  const [zone, setZone] = useState<Zone>('pulsars');
  const close = () => useAppStore.getState().set({ plaqueOpen: false });
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const pulsarAngles = [0, 22, 47, 71, 98, 126, 151, 175, 199, 224, 252, 279, 305, 333];
  const lens = [150, 95, 120, 70, 135, 85, 160, 110, 60, 140, 100, 125, 80, 115];
  const zoneProps = (z: Zone) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': l(INFO[z].title),
    onClick: () => setZone(z),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setZone(z);
      }
    },
    className: 'cursor-pointer',
    stroke: zone === z ? '#FFF1CC' : '#E9C27A',
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} role="dialog" aria-modal="true" aria-labelledby="plaque-title">
          <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass w-full max-w-3xl rounded-3xl p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start">
              <div className="flex-1">
                <div className="eyebrow">Pioneer 10 · 1972</div>
                <h2 id="plaque-title" className="font-display text-2xl">
                  {t('plaqueTitle')}
                </h2>
                <p className="text-sm text-ink-300">{t('plaqueHint')}</p>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={close} aria-label={t('close')}>
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#b8862f] via-[#d8ab55] to-[#9c6d22] p-1 shadow-[0_20px_60px_-20px_rgba(212,166,74,0.6)]">
              <svg viewBox="0 0 600 400" className="w-full rounded-xl bg-[#2a1d0b]" fill="none" strokeWidth={2} strokeLinecap="round">
                {/* hydrogen */}
                <g {...zoneProps('hydrogen')}>
                  <rect x={20} y={20} width={130} height={60} fill="transparent" stroke="none" />
                  <circle cx={55} cy={48} r={14} />
                  <circle cx={55} cy={48} r={2} fill="#E9C27A" />
                  <circle cx={115} cy={48} r={14} />
                  <circle cx={115} cy={48} r={2} fill="#E9C27A" />
                  <path d="M69 48 H101 M85 40 v16" />
                </g>
                {/* pulsar map */}
                <g {...zoneProps('pulsars')}>
                  <circle cx={170} cy={200} r={160} fill="transparent" stroke="none" />
                  {pulsarAngles.map((a, i) => {
                    const r = (a * Math.PI) / 180;
                    const x = 170 + Math.cos(r) * lens[i];
                    const y = 200 + Math.sin(r) * lens[i] * 0.85;
                    return (
                      <g key={a}>
                        <line x1={170} y1={200} x2={x} y2={y} />
                        {Array.from({ length: 3 + (i % 4) }, (_, k) => {
                          const f = 0.55 + k * 0.08;
                          const px = 170 + (x - 170) * f;
                          const py = 200 + (y - 200) * f;
                          return <line key={k} x1={px - Math.sin(r) * 4} y1={py + Math.cos(r) * 4} x2={px + Math.sin(r) * 4} y2={py - Math.cos(r) * 4} />;
                        })}
                      </g>
                    );
                  })}
                  <line x1={170} y1={200} x2={330} y2={200} strokeDasharray="4 6" />
                </g>
                {/* humans in front of the spacecraft outline */}
                <g {...zoneProps('humans')}>
                  <rect x={380} y={40} width={200} height={290} fill="transparent" stroke="none" />
                  <path d="M560 130 Q600 70 560 30 Q520 70 560 130 Z" opacity={0.5} />
                  <path d="M560 130 V300" opacity={0.5} />
                  {/* man */}
                  <circle cx={440} cy={92} r={14} />
                  <path d="M440 106 V200 M440 200 L425 300 M440 200 L455 300 M412 130 Q440 118 468 130 L470 200 M412 130 L410 200 M468 130 L492 92" />
                  {/* woman */}
                  <circle cx={505} cy={110} r={13} />
                  <path d="M505 123 V210 M505 210 L494 300 M505 210 L516 300 M482 145 Q505 134 528 145 L530 210 M482 145 L480 205" />
                </g>
                {/* solar system */}
                <g {...zoneProps('system')}>
                  <rect x={20} y={340} width={560} height={50} fill="transparent" stroke="none" />
                  <circle cx={50} cy={365} r={14} />
                  {[90, 125, 165, 205, 270, 340, 405, 465, 520].map((x, i) => (
                    <circle key={x} cx={x} cy={365} r={[3, 4, 4.5, 3.5, 10, 9, 6.5, 6.5, 2.5][i]} fill={i === 2 ? '#FFF1CC' : 'none'} />
                  ))}
                  <path d="M165 365 Q200 330 270 352 Q330 372 420 330 L580 300" strokeDasharray="3 5" />
                  <path d="M572 296 l10 4 l-8 7" />
                </g>
              </svg>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={zone} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4" aria-live="polite">
                <div className="font-display text-lg text-amber-300">{l(INFO[zone].title)}</div>
                <p className="mt-1 leading-relaxed">{l(INFO[zone].text)}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(INFO) as Zone[]).map((z) => (
                <button key={z} className="btn py-1 text-sm" aria-pressed={zone === z} onClick={() => setZone(z)}>
                  {l(INFO[z].title)}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
