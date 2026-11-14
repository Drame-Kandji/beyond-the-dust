import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/useT';

/**
 * `?demo=1` — scripted, click-free 30-second sequence for the video recording.
 * Press R to replay.
 */
export function DemoDirector() {
  const demo = useAppStore((s) => s.demo);
  const { t, l } = useT();
  const [caption, setCaption] = useState<string | null>(null);
  const [end, setEnd] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!demo) return;
    document.documentElement.classList.add('demo-mode');
    const onKey = (e: KeyboardEvent) => e.key.toLowerCase() === 'r' && setRun((r) => r + 1);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [demo]);

  useEffect(() => {
    if (!demo) return;
    const s = useAppStore.getState;
    setEnd(false);
    setCaption(null);
    s().set({ screen: 'intro', vehicleId: null, panel: null, storm: false, exploded: false, selectedPart: null });
    const steps: [number, () => void][] = [
      [5000, () => s().set({ screen: 'hub', destination: 'moon' })],
      [6300, () => s().setDestination('mars')],
      [7600, () => s().openVehicle('opportunity')],
      [11400, () => s().selectPart('robotic-arm')],
      [14600, () => (s().set({ panel: null, selectedPart: null }), s().resetCamera())],
      [15200, () => (setCaption(l({ en: 'Built for 90 days. It worked for more than 5,000.', fr: 'Conçu pour 90 jours. Il en a travaillé plus de 5 000.' })), s().set({ storm: true }))],
      [20000, () => (setCaption(null), s().set({ storm: false }), s().openVehicle('pioneer10'))],
      [21700, () => s().finishTeleport()],
      [22300, () => s().setPanel('signal')],
      [25200, () => (s().setPanel(null), s().openVehicle('lrv'))],
      [26400, () => s().finishTeleport()],
      [26900, () => s().set({ exploded: true })],
      [28200, () => setEnd(true)],
    ];
    const ids = steps.map(([ms, fn]) => window.setTimeout(fn, ms));
    return () => ids.forEach(clearTimeout);
  }, [demo, run, l]);

  if (!demo) return null;
  return (
    <>
      <AnimatePresence>
        {caption && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-x-0 bottom-[22%] z-[60] text-center">
            <p className="font-display mx-auto max-w-3xl px-6 text-[clamp(1.8rem,5vw,3.6rem)] leading-tight text-ink-100 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">{caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {end && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[70] grid place-items-center bg-space-950/90 text-center backdrop-blur">
            <div>
              <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none font-semibold tracking-[0.06em]">BEYOND THE DUST</h1>
              <p className="eyebrow mt-4 text-amber-300">{t('slogan')}</p>
              <p className="font-display mt-6 text-2xl text-ink-300">{t('demoEnd')}</p>
              <p className="mono mt-6 text-sm text-ink-500">{window.location.host}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
