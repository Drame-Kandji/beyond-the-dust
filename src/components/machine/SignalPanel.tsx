import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Send } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { ResponsivePanel } from '../ui/ResponsivePanel';
import { VehicleArt } from '../ui/VehicleArt';
import { beep } from '../../hooks/ambient';

function fmtDuration(s: number) {
  if (s < 60) return `${s.toFixed(1)} s`;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min ${String(sec).padStart(2, '0')} s`;
}

/** "Send a signal": a light-speed message travelling to the machine, then silence. */
export function SignalPanel({ vehicle }: { vehicle: Vehicle }) {
  const { t, l } = useT();
  const open = useAppStore((s) => s.panel === 'signal');
  const demo = useAppStore((s) => s.demo);
  const tm = vehicle.telemetry;
  const [phase, setPhase] = useState<'idle' | 'sending' | 'arrived' | 'silence'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef(0);
  const real = tm.delaySeconds <= 5; // Moon: real time. Others: sped up to ~4 s.
  const animSeconds = real ? tm.delaySeconds : demo ? 2.6 : 4.2;

  useEffect(() => {
    if (!open) {
      cancelAnimationFrame(raf.current);
      setPhase('idle');
      setElapsed(0);
    }
  }, [open]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useEffect(() => {
    if (open && demo) send();
  }, [open, demo]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = () => {
    beep();
    setPhase('sending');
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1000 / animSeconds);
      setElapsed(p * tm.delaySeconds);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setPhase('arrived');
        window.setTimeout(() => setPhase('silence'), 1400);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };
  const progress = tm.delaySeconds ? elapsed / tm.delaySeconds : 0;

  return (
    <ResponsivePanel open={open} onClose={() => useAppStore.getState().setPanel(null)} labelledBy="signal-title" eyebrow={`${t('telemetry')} · ${l(vehicle.name)}`} title={t('signal')}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-5">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,#8ec5ff,#1d4fa3)] shadow-[0_0_30px_rgba(80,150,255,0.5)]" />
            <div className="mt-1.5 text-[0.8125rem] font-medium text-ink-200">{t('fromEarth')}</div>
          </div>
          <div className="relative mx-3 h-12 flex-1">
            <div className="absolute top-1/2 right-0 left-0 border-t border-dashed border-signal-300/30" />
            {phase !== 'idle' && (
              <motion.div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-signal-300 shadow-[0_0_18px_#7FE7F2]" style={{ left: `calc(${Math.min(1, progress) * 100}% - 6px)` }} />
            )}
            {phase === 'sending' && (
              <div className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent to-signal-300" style={{ width: `${progress * 100}%` }} />
            )}
          </div>
          <div className="text-center" style={{ color: vehicle.destination === 'mars' ? '#E07A3F' : vehicle.destination === 'moon' ? '#C9CCD3' : '#7FE7F2' }}>
            <VehicleArt id={vehicle.id} className={`mx-auto h-12 w-16 ${phase === 'arrived' ? 'animate-pulse' : ''}`} />
            <div className="mt-1.5 text-[0.8125rem] font-medium text-ink-200">{l(vehicle.name)}</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="mono text-3xl font-semibold text-signal-300 tabular-nums">{fmtDuration(phase === 'idle' ? 0 : elapsed)}</div>
          <div className="mono mt-1.5 text-xs tracking-[0.14em] text-ink-300 uppercase">{l(tm.delayLabel)}</div>
        </div>
      </div>

      <div className="mt-4 min-h-[88px]" aria-live="polite">
        {phase === 'idle' && (
          <button className="btn btn-primary w-full" onClick={send}>
            <Send size={18} /> {t('sendHello')}
          </button>
        )}
        {phase === 'sending' && <p className="text-center text-ink-200">{t('sending')}</p>}
        {phase === 'arrived' && (
          <p className="text-center text-ink-200">
            {t('arrived')} {t('waiting')}
          </p>
        )}
        {phase === 'silence' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-display text-[1.15rem] leading-relaxed">{l(tm.replyText)}</p>
            <button className="btn mt-3" onClick={() => setPhase('idle')}>
              <Radio size={16} /> {t('signal')}
            </button>
          </motion.div>
        )}
      </div>

      <div className="section-label mt-6 mb-3">{t('telemetry')}</div>
      <dl className="divide-y divide-white/[0.08] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-[0.9375rem]">
        {[
          [t('band'), l(tm.band)],
          ...(tm.power ? [[t('power'), `${tm.power.value} — ${l(tm.power.label)}`]] : []),
          [t('delay'), l(tm.delay)],
          [t('lastContact'), l(tm.lastContact)],
          [t('path'), l(tm.link)],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
            <dt className="mono pt-0.5 text-xs leading-snug tracking-wide text-ink-300 uppercase">{k}</dt>
            <dd className="leading-snug text-ink-100">
              {v}
              {k === t('power') && tm.power?.verify && <span className="verify-dot" />}
            </dd>
          </div>
        ))}
      </dl>
    </ResponsivePanel>
  );
}
