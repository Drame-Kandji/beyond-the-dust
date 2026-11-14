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
            <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-[0.7rem] font-bold text-[#1a1206]">{idx + 1}</span>
            {l(vehicle.name)} · {idx + 1}/{vehicle.parts.length}
          </span>
        )
      }
      title={
        part && (
          <span className="flex items-center gap-2.5">
            <PartIcon name={part.icon} size={24} className="text-amber-400" />
            {l(part.name)}
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
          {touring && <div className="chip mb-3 border-amber-400/50 text-amber-300">▶ {t('tour')}</div>}
          <div className="mb-4 flex rounded-full border border-white/10 bg-white/[0.03] p-1" role="tablist">
            {(['simple', 'deeper'] as const).map((k) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[40px] flex-1 rounded-full text-sm font-semibold transition ${tab === k ? 'bg-amber-400 text-[#1a1206]' : 'text-ink-300'}`}>
                {k === 'simple' ? `🧒 ${t('simple')}` : `🔭 ${t('deeper')}`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${part.id}-${tab}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} role="tabpanel">
              {tab === 'simple' ? (
                <p className="font-display text-[1.28rem] leading-relaxed text-ink-100">“{l(part.simple)}”</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-[1.02rem] leading-relaxed text-ink-100">{l(part.deeper)}</p>
                  <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
                    <div className="eyebrow mb-1 text-amber-300">{t('whyItMattered')}</div>
                    <p className="text-[0.98rem] leading-relaxed">{l(part.whyItMattered)}</p>
                  </div>
                  {part.numbers && part.numbers.length > 0 && (
                    <div>
                      <div className="eyebrow mb-2">{t('realNumbers')}</div>
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
            <div className="mt-5 rounded-2xl border border-signal-300/20 bg-signal-300/[0.05] p-4">
              <div className="eyebrow mb-1 text-signal-300">✨ {t('funFact')}</div>
              <p className="text-[0.98rem] leading-relaxed">{l(part.funFact)}</p>
            </div>
          )}

          {part.worksWith && part.worksWith.length > 0 && (
            <div className="mt-5">
              <div className="eyebrow mb-2">{t('worksWith')}</div>
              <div className="flex flex-wrap gap-2">
                {part.worksWith.map((id) => {
                  const p = vehicle.parts.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <button key={id} className="btn py-1 text-sm" onClick={() => useAppStore.getState().selectPart(id)}>
                      <PartIcon name={p.icon} size={16} className="text-amber-400" /> {l(p.name)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {part.verify && <p className="mt-4 text-xs text-ink-500"><span className="verify-dot" /> {t('toVerify')}</p>}
        </div>
      )}
    </ResponsivePanel>
  );
}
