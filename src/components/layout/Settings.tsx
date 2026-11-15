import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings2, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { setAmbientMuted } from '../../hooks/ambient';

export function LanguageSwitch() {
  const lang = useAppStore((s) => s.lang);
  const setSetting = useAppStore((s) => s.setSetting);
  const { t } = useT();
  return (
    <div className="glass flex rounded-full p-1" role="group" aria-label={t('languageLabel')}>
      {(['en', 'fr'] as const).map((l) => (
        <button
          key={l}
          className={`min-h-[44px] min-w-[44px] rounded-full px-2.5 text-xs font-bold tracking-wider uppercase transition ${lang === l ? 'bg-amber-400 text-[#1a1206]' : 'text-ink-300 hover:text-ink-100'}`}
          aria-pressed={lang === l}
          onClick={() => setSetting('lang', l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function SoundToggle() {
  const muted = useAppStore((s) => s.muted);
  const setSetting = useAppStore((s) => s.setSetting);
  const { t } = useT();
  return (
    <button
      className="btn btn-icon glass"
      aria-label={t('sound')}
      aria-pressed={!muted}
      onClick={() => {
        setSetting('muted', !muted);
        setAmbientMuted(!muted);
      }}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const s = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ref.current?.querySelector('[aria-expanded="true"]')) {
        setOpen(false);
        ref.current.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  const Row = ({ label, k }: { label: string; k: 'reduceMotion' | 'largeText' | 'showNumbers' }) => (
    <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <input type="checkbox" className="h-5 w-5 accent-amber-400" checked={s[k]} onChange={(e) => s.setSetting(k, e.target.checked)} />
    </label>
  );
  return (
    <div
      className="relative"
      ref={ref}
      onBlur={(e) => {
        // Close when keyboard focus leaves the menu.
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button className="btn btn-icon glass" aria-label={t('settings')} aria-expanded={open} aria-controls="settings-menu" onClick={() => setOpen((o) => !o)}>
        <Settings2 size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            id="settings-menu"
            className="glass absolute top-12 right-0 z-50 w-64 max-w-[calc(100vw-2rem)] rounded-2xl p-4"
          >
            <div className="eyebrow mb-2">{t('settings')}</div>
            <Row label={t('reduceMotion')} k="reduceMotion" />
            <Row label={t('largeText')} k="largeText" />
            <Row label={t('numbers')} k="showNumbers" />
            <div className="my-2 h-px bg-white/10" />
            <button className="block min-h-[44px] w-full text-left text-sm text-ink-300 hover:text-ink-100" onClick={() => (setOpen(false), s.setScreen('teachers'))}>
              {t('teachers')}
            </button>
            <button className="block min-h-[44px] w-full text-left text-sm text-ink-300 hover:text-ink-100" onClick={() => (setOpen(false), s.setScreen('sources'))}>
              {t('sourcesCredits')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
