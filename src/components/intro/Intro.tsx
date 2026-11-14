import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';
import { Starfield } from '../ui/Starfield';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { LanguageSwitch } from '../layout/Settings';
import { playAmbient } from '../../hooks/ambient';

export function Intro() {
  const { t } = useT();
  const setScreen = useAppStore((s) => s.setScreen);
  const reduce = useAppStore((s) => s.reduceMotion);
  const d = (s: number) => (reduce ? 0 : s);
  const go = () => {
    if (!useAppStore.getState().muted) playAmbient('hub');
    setScreen('hub');
  };

  return (
    <main className="relative flex h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Starfield density={1.2} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(193,68,14,0.28),transparent_60%),radial-gradient(ellipse_at_80%_-10%,rgba(61,78,158,0.35),transparent_55%)]" />
      <div className="absolute top-[calc(var(--sat)+16px)] right-4 z-10">
        <LanguageSwitch />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(0.3), duration: d(1) }} className="font-display text-lg text-ink-300 sm:text-2xl">
          {t('introLine1')}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(1.3), duration: d(1) }} className="font-display text-lg text-ink-100 italic sm:text-2xl">
          {t('introLine2')}
        </motion.p>

        <motion.h1
          // Transform-only reveal (no letter-spacing tween): keeps the centred column from reflowing (CLS).
          initial={{ opacity: 0, scale: 1.18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: d(2.3), duration: d(1.6), ease: 'easeOut' }}
          className="font-display mt-10 text-[clamp(2.6rem,11vw,7rem)] leading-[0.95] font-semibold tracking-[0.08em] text-ink-100 drop-shadow-[0_0_40px_rgba(255,181,71,0.25)]"
        >
          BEYOND
          <br />
          THE DUST
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(3.4), duration: d(0.8) }} className="eyebrow mt-5 text-amber-300">
          {t('subtitle')}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(3.7), duration: d(0.8) }} className="mt-3 max-w-md text-ink-300">
          {t('slogan')}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(4), duration: d(0.6) }} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button className="btn btn-primary px-7 text-base" onClick={go} autoFocus>
            <Rocket size={18} aria-hidden /> {t('begin')}
          </button>
          <button className="btn glass px-6" onClick={go}>
            {t('explore')}
          </button>
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: d(4.4) }} className="font-display absolute bottom-[calc(var(--sab)+20px)] z-10 px-6 text-sm text-ink-500 italic">
        {t('heroNarrative')}
      </motion.p>
      <button className="btn btn-ghost absolute top-[calc(var(--sat)+16px)] left-3 z-10 text-sm text-ink-500" onClick={go}>
        {t('skip')}
      </button>
    </main>
  );
}
