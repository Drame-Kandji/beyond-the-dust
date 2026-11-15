import { Pause, Play, Square, Volume2 } from 'lucide-react';
import { playNarration, stopNarration, togglePause, useNarrator } from '../../hooks/narrator';
import { useT } from '../../i18n/useT';

export function ListenButton({ id, text, src, label, primary = false }: { id: string; text: string; src?: string; label?: string; primary?: boolean }) {
  const { t, lang } = useT();
  const active = useNarrator((s) => s.id === id && s.playing);
  const paused = useNarrator((s) => s.paused);
  if (!active)
    return (
      <button className={`btn ${primary ? 'btn-primary' : ''}`} onClick={() => playNarration(id, text, lang, src)}>
        <Volume2 size={18} aria-hidden /> {label ?? t('listen')}
      </button>
    );
  return (
    <div className="flex gap-2">
      <button className="btn" onClick={togglePause}>
        {paused ? <Play size={18} /> : <Pause size={18} />} {paused ? t('resume') : t('pause')}
      </button>
      <button className="btn btn-icon" aria-label={t('stop')} onClick={stopNarration}>
        <Square size={16} />
      </button>
    </div>
  );
}

/** Synchronised caption for the narration that is currently playing. */
export function Captions() {
  const { sentences, index, playing, progress } = useNarrator();
  if (!playing || index < 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--sab)+92px)] z-30 flex justify-center px-4 md:bottom-28" aria-live="polite">
      <div className="surface max-w-2xl rounded-2xl px-5 py-3 text-center">
        <p className="font-display text-base leading-snug text-ink-100 sm:text-lg">{sentences[index]}</p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-amber-400 transition-[width] duration-300" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
