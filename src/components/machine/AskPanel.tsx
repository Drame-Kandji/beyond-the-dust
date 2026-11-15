import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { ResponsivePanel } from '../ui/ResponsivePanel';
import { VehicleArt } from '../ui/VehicleArt';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * Kid-safe "Ask me" chat. Works fully offline: answers only from validated data
 * (FAQ + part texts). It never invents: unknown questions get a list of what it does know.
 */
export function AskPanel({ vehicle }: { vehicle: Vehicle }) {
  const { t, l } = useT();
  const open = useAppStore((s) => s.panel === 'ask');
  const [msgs, setMsgs] = useState<{ who: 'me' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const lastQ = useRef<HTMLDivElement>(null);
  const lastA = useRef<HTMLParagraphElement>(null);
  const reduce = useAppStore((s) => s.reduceMotion);

  useEffect(() => {
    if (open) setMsgs([{ who: 'bot', text: l(vehicle.intro) }]);
  }, [open, vehicle, l]);
  // After a question: scroll so the question and its answer are at the top, and move focus to the answer.
  useEffect(() => {
    if (msgs.length < 2) return;
    const id = window.requestAnimationFrame(() => {
      lastQ.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      lastA.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [msgs, reduce]);

  const answer = (q: string) => {
    const n = norm(q);
    const faq = vehicle.faq.find((f) => f.keywords.some((k) => n.includes(norm(k))));
    if (faq) return l(faq.a);
    const part = vehicle.parts.find((p) => n.includes(norm(p.id.replace('-', ' '))) || n.includes(norm(l(p.name)).split(' ')[0]) || p.meshNames.some((m) => n.includes(norm(m))));
    if (part) return l(part.simple);
    return `${t('askUnknown')} ${vehicle.faq.map((f) => `“${l(f.q)}”`).join(' · ')}`;
  };
  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { who: 'me', text: q }, { who: 'bot', text: answer(q) }]);
    setInput('');
  };

  return (
    <ResponsivePanel open={open} onClose={() => useAppStore.getState().setPanel(null)} labelledBy="ask-title" eyebrow={l(vehicle.name)} title={t('ask')}>
      <div className="space-y-3" aria-live="polite">
        {msgs.map((m, i) => {
          const isLastQ = m.who === 'me' && i === msgs.length - 2;
          const isLastA = m.who === 'bot' && i === msgs.length - 1 && i > 0;
          return (
          <div key={i} ref={isLastQ ? lastQ : undefined} className={`flex scroll-mt-4 gap-2 ${m.who === 'me' ? 'justify-end' : ''}`}>
            {m.who === 'bot' && (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-amber-300">
                <VehicleArt id={vehicle.id} className="h-6 w-7" />
              </span>
            )}
            <p
              ref={isLastA ? lastA : undefined}
              tabIndex={isLastA ? -1 : undefined}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[1rem] leading-relaxed outline-none ${m.who === 'me' ? 'rounded-br-md bg-amber-400 font-medium text-[#1a1206]' : `rounded-tl-md border bg-white/[0.06] text-ink-100 ${isLastA ? 'answer-new border-amber-400/50' : 'border-white/10'}`}`}
            >
              {m.text}
            </p>
          </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {vehicle.faq.map((f) => (
          <button key={f.q.en} className="btn h-auto py-2 text-left text-[0.875rem] whitespace-normal text-ink-100" onClick={() => ask(l(f.q))}>
            {l(f.q)}
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('askPlaceholder')} aria-label={t('askPlaceholder')} className="min-h-[48px] min-w-0 flex-1 rounded-full border border-white/15 bg-black/30 px-4 text-[1rem] text-ink-100 placeholder:text-ink-300 focus:border-amber-400" />
        <button className="btn btn-primary btn-icon" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </ResponsivePanel>
  );
}
