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
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setMsgs([{ who: 'bot', text: l(vehicle.intro) }]);
  }, [open, vehicle, l]);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

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
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.who === 'me' ? 'justify-end' : ''}`}>
            {m.who === 'bot' && (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-amber-300">
                <VehicleArt id={vehicle.id} className="h-6 w-7" />
              </span>
            )}
            <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.98rem] leading-relaxed ${m.who === 'me' ? 'bg-amber-400 text-[#1a1206]' : 'border border-white/10 bg-white/[0.05]'}`}>{m.text}</p>
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {vehicle.faq.map((f) => (
          <button key={f.q.en} className="btn py-1 text-sm" onClick={() => ask(l(f.q))}>
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
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('askPlaceholder')} aria-label={t('askPlaceholder')} className="min-h-[44px] flex-1 rounded-full border border-white/15 bg-white/[0.04] px-4 text-ink-100 placeholder:text-ink-500 focus:border-amber-400" />
        <button className="btn btn-primary btn-icon" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </ResponsivePanel>
  );
}
