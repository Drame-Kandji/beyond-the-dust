import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';

/**
 * "Last day — June 2018": the dust storm darkens the 3D sky while the solar energy gauge drops.
 * Energy values are illustrative of the trend (not telemetry); the dates are real.
 */
export function StormOverlay() {
  const { t, lang } = useT();
  const storm = useAppStore((s) => s.storm);
  const demo = useAppStore((s) => s.demo);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!storm) {
      setP(0);
      return;
    }
    const start = performance.now();
    const dur = demo ? 4200 : 9000;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      setP(k);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [storm, demo]);

  const day = Math.min(10, 1 + Math.floor(p * 10));
  const date = new Date(Date.UTC(2018, 5, day)).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const energy = Math.max(0, 1 - p * 1.05);

  return (
    <AnimatePresence>
      {storm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass fixed top-[calc(var(--sat)+76px)] left-1/2 z-30 w-[min(560px,calc(100vw-24px))] -translate-x-1/2 rounded-3xl p-4" role="status">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="eyebrow text-mars">{t('stormTitle')}</div>
              <div className="mono mt-1 text-2xl text-ink-100 tabular-nums">{date}</div>
            </div>
            <button className="btn btn-icon btn-ghost -mt-1 -mr-1" aria-label={t('close')} onClick={() => useAppStore.getState().set({ storm: false })}>
              <X size={18} />
            </button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-ink-300">
              <span>☀️ {t('stormEnergy')}</span>
              <span className="mono">{Math.round(energy * 100)}%</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${energy * 100}%`, background: `linear-gradient(90deg,#c1440e,#ffb547)` }} />
            </div>
          </div>
          <AnimatePresence>
            {p >= 1 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <p className="font-display mt-3 text-[1.1rem] leading-snug">{t('stormEnd')}</p>
                <p className="mt-2 text-xs text-ink-500 italic">{t('stormMyth')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
