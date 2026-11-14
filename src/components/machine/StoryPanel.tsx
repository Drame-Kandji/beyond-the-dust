import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { ResponsivePanel } from '../ui/ResponsivePanel';
import { FactValue } from '../ui/FactValue';
import { ListenButton } from './ListenButton';
import { SOURCES } from '../../data/sources';

const KIND_COLOR = { launch: '#7FE7F2', feat: '#FFB547', trouble: '#E07A3F', end: '#A9B2C8', today: '#EEF1F8' };

export function Timeline({ vehicle }: { vehicle: Vehicle }) {
  const { l, lang } = useT();
  const fmt = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  return (
    <ol className="relative ml-2 border-l border-white/15 pl-5">
      {vehicle.keyDates.map((d) => (
        <li key={d.date + d.label.en} className="relative pb-4 last:pb-0">
          <span className="absolute top-1.5 -left-[27px] h-3 w-3 rounded-full ring-4 ring-space-950" style={{ background: KIND_COLOR[d.kind] }} />
          <div className="mono text-xs text-ink-500">
            {d.kind === 'today' ? (lang === 'fr' ? 'Aujourd’hui' : 'Today') : fmt(d.date)}
            {d.verify && <span className="verify-dot" />}
          </div>
          <div className="text-[0.95rem] leading-snug">{l(d.label)}</div>
        </li>
      ))}
    </ol>
  );
}

export function StoryPanel({ vehicle }: { vehicle: Vehicle }) {
  const { t, l, lang } = useT();
  const open = useAppStore((s) => s.panel === 'story');
  const [i, setI] = useState(0);
  const ch = vehicle.chapters[i];

  useEffect(() => {
    if (open) setI(0);
  }, [open, vehicle]);

  // Chapter scene actions
  useEffect(() => {
    if (!open) return;
    const s = useAppStore.getState();
    s.set({ spin: ch.sceneAction === 'spin' });
    if (ch.sceneAction === 'storm') s.set({ storm: true });
    if (ch.sceneAction === 'focus-part' && ch.focusPart) {
      const p = vehicle.parts.find((x) => x.id === ch.focusPart);
      if (p) s.set({ camera: { position: p.camera.position, target: p.camera.target, nonce: Date.now() } });
    }
    return () => useAppStore.getState().set({ spin: false });
  }, [i, open, ch, vehicle]);

  return (
    <ResponsivePanel
      open={open}
      onClose={() => useAppStore.getState().setPanel(null)}
      labelledBy="story-title"
      eyebrow={`${t('story')} · ${l(vehicle.name)}`}
      title={l(vehicle.hook)}
      footer={
        <div className="flex items-center justify-between gap-2">
          <button className="btn" disabled={i === 0} onClick={() => setI((x) => Math.max(0, x - 1))} aria-label={t('prev')}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5" aria-label={`${t('chapter')} ${i + 1} ${t('ofN')} ${vehicle.chapters.length}`}>
            {vehicle.chapters.map((c, k) => (
              <button key={c.id} onClick={() => setI(k)} aria-label={l(c.title)} className={`h-2.5 rounded-full transition-all ${k === i ? 'w-6 bg-amber-400' : 'w-2.5 bg-white/25'}`} />
            ))}
          </div>
          <button className="btn" disabled={i === vehicle.chapters.length - 1} onClick={() => setI((x) => Math.min(vehicle.chapters.length - 1, x + 1))} aria-label={t('next')}>
            <ChevronRight size={18} />
          </button>
        </div>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <span className="text-sm text-ink-300">🎧</span>
        <ListenButton id={`story-${vehicle.id}`} text={l(vehicle.audio.transcript)} src={vehicle.audio.story[lang]} label={t('hearStory')} primary />
      </div>

      <AnimatePresence mode="wait">
        <motion.article key={ch.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
          <div className="eyebrow text-amber-300">
            {t('chapter')} {i + 1} · {l(ch.title)}
          </div>
          <h3 className="font-display mt-2 text-[1.6rem] leading-tight">{l(ch.lead)}</h3>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-100">{l(ch.body)}</p>
          {ch.sceneAction === 'plaque' && (
            <button className="btn btn-primary mt-4" onClick={() => useAppStore.getState().set({ plaqueOpen: true })}>
              ✉️ {t('openPlaque')}
            </button>
          )}
          {ch.sceneAction === 'spin' && <p className="mono mt-3 text-xs text-amber-300">⟳ {t('spinWheels')}</p>}
        </motion.article>
      </AnimatePresence>

      <div className="eyebrow mt-7 mb-2">{t('keyStats')}</div>
      <div className="grid grid-cols-2 gap-2">
        {vehicle.stats.map((f) => (
          <FactValue key={f.value + f.label.en} fact={f} big />
        ))}
      </div>

      <div className="eyebrow mt-7 mb-3">{t('timeline')}</div>
      <Timeline vehicle={vehicle} />

      {vehicle.twin && (
        <div className="mt-7 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4">
          <div className="eyebrow mb-1">{t('twin')}</div>
          <div className="font-display text-lg">{l(vehicle.twin.name)}</div>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-300">{l(vehicle.twin.summary)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {vehicle.twin.facts.map((f) => (
              <FactValue key={f.value} fact={f} />
            ))}
          </div>
        </div>
      )}

      <div className="eyebrow mt-7 mb-2">{t('sources')}</div>
      <ul className="space-y-1.5 text-sm">
        {vehicle.sources.map((id) => {
          const s = SOURCES[id];
          return (
            <li key={id}>
              <a className="inline-flex items-center gap-1.5 text-ink-300 underline decoration-white/20 hover:text-ink-100" href={s.url} target="_blank" rel="noreferrer">
                <ExternalLink size={13} /> {s.publisher} — {s.title}
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink-500">
        <span className="verify-dot" /> {t('toVerify')}
      </p>
    </ResponsivePanel>
  );
}
