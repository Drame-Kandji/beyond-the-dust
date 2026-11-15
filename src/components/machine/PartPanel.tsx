import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, CloudSun, Mail } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { ResponsivePanel } from '../ui/ResponsivePanel';
import { PartIcon } from '../ui/Icon';
import { FactValue } from '../ui/FactValue';
import { ListenButton } from './ListenButton';
import { stopNarration } from '../../hooks/narrator';

export function PartPanel({ vehicle }: { vehicle: Vehicle }) {
  const { t, l } = useT();
  const panel = useAppStore((s) => s.panel);
  const selected = useAppStore((s) => s.selectedPart);
  const touring = useAppStore((s) => s.touring);
  const [tab, setTab] = useState<'simple' | 'deeper'>('simple');
  const idx = vehicle.parts.findIndex((p) => p.id === selected);
  const part = vehicle.parts[idx];
  useEffect(() => {
    setTab('simple');
  }, [selected]);
  const close = () => {
    stopNarration();
    useAppStore.getState().set({ touring: false });
    useAppStore.getState().selectPart(null);
  };
  const open = panel === 'part' && !!part;

  return (
    <ResponsivePanel
      open={open}
      onClose={close}
      labelledBy="part-title"
      eyebrow={
        part && (
          <span className="flex items-center gap-2">
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold tracking-normal text-[#1a1206]">{idx + 1}</span>
            <span className="truncate">{l(vehicle.name)}</span>
            <span className="text-ink-500">·</span>
            <span className="text-ink-200">{idx + 1}/{vehicle.parts.length}</span>
          </span>
        )
      }
      title={
        part && (
          <span className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-400/30 bg-amber-400/10">
              <PartIcon name={part.icon} size={20} className="text-amber-400" />
            </span>
            <span className="min-w-0">{l(part.name)}</span>
          </span>
        )
      }
      footer={
        part && (
          <div className="flex items-center justify-between gap-2">
            <button className="btn" onClick={() => useAppStore.getState().stepPart(-1)} aria-label={t('prev')}>
              <ChevronLeft size={18} /> <span className="hidden sm:inline">{t('prev')}</span>
            </button>
            <ListenButton id={`part-${vehicle.id}-${part.id}`} text={l(tab === 'simple' ? part.simple : part.deeper)} src={tab === 'simple' ? `audio/parts/${vehicle.id}_${part.id}_${useAppStore.getState().lang}.mp3` : undefined} />
            <button className="btn" onClick={() => useAppStore.getState().stepPart(1)} aria-label={t('next')}>
              <span className="hidden sm:inline">{t('next')}</span> <ChevronRight size={18} />
            </button>
          </div>
        )
      }
    >
      {part && (
        <div>
          {touring && <div className="chip mb-4 border-amber-400/50 text-amber-300">▶ {t('tour')}</div>}
          <div className="mb-5 flex rounded-full border border-white/10 bg-black/30 p-1" role="tablist">
            {(['simple', 'deeper'] as const).map((k) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[42px] flex-1 rounded-full text-[0.9375rem] font-semibold transition ${tab === k ? 'bg-amber-400 text-[#1a1206] shadow-[0_6px_18px_-8px_rgba(255,181,71,0.8)]' : 'text-ink-200 hover:bg-white/[0.06] hover:text-ink-100'}`}>
                {k === 'simple' ? `🧒 ${t('simple')}` : `🔭 ${t('deeper')}`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${part.id}-${tab}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} role="tabpanel">
              {tab === 'simple' ? (
                <p className="font-display border-l-2 border-amber-400/70 pl-4 text-[1.15rem] leading-[1.6] text-ink-100 sm:text-[1.22rem]">“{l(part.simple)}”</p>
              ) : (
                <div className="space-y-4">
                  <p className="reading text-ink-100">{l(part.deeper)}</p>
                  <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-4">
                    <div className="eyebrow mb-1.5 text-amber-300">{t('whyItMattered')}</div>
                    <p className="reading">{l(part.whyItMattered)}</p>
                  </div>
                  {part.numbers && part.numbers.length > 0 && (
                    <div>
                      <div className="section-label mt-2 mb-3">{t('realNumbers')}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {part.numbers.map((f) => (
                          <FactValue key={f.value} fact={f} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {part.event === 'storm' && (
            <button className="btn btn-primary mt-5 w-full" onClick={() => useAppStore.getState().set({ storm: true, panel: null, selectedPart: null })}>
              <CloudSun size={18} /> {t('relive')}
            </button>
          )}
          {part.event === 'plaque' && (
            <button className="btn btn-primary mt-5 w-full" onClick={() => useAppStore.getState().set({ plaqueOpen: true })}>
              <Mail size={18} /> {t('openPlaque')}
            </button>
          )}

          {part.funFact && (
            <div className="mt-6 rounded-2xl border border-signal-300/25 bg-signal-300/[0.06] p-4">
              <div className="eyebrow mb-1.5 text-signal-300">✨ {t('funFact')}</div>
              <p className="reading">{l(part.funFact)}</p>
            </div>
          )}

          {part.worksWith && part.worksWith.length > 0 && (
            <div className="mt-6">
              <div className="section-label mb-3">{t('worksWith')}</div>
              <div className="flex flex-wrap gap-2">
                {part.worksWith.map((id) => {
                  const p = vehicle.parts.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <button key={id} className="btn py-1 text-[0.9375rem] text-ink-100" onClick={() => useAppStore.getState().selectPart(id)}>
                      <PartIcon name={p.icon} size={16} className="text-amber-400" /> {l(p.name)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {part.verify && <p className="mt-5 text-[0.8125rem] text-ink-300"><span className="verify-dot" /> {t('toVerify')}</p>}
        </div>
      )}
    </ResponsivePanel>
  );
}
