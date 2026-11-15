import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, RotateCcw, Stamp, X } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { ResponsivePanel } from '../ui/ResponsivePanel';
import { VehicleArt } from '../ui/VehicleArt';
import { ping } from '../../hooks/ambient';

export function QuizPanel({ vehicle }: { vehicle: Vehicle }) {
  const { t, l } = useT();
  const open = useAppStore((s) => s.panel === 'quiz');
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = vehicle.quiz[qi];

  const reset = () => {
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };
  useEffect(() => {
    if (open) reset();
  }, [open, vehicle]);

  const choose = (i: number) => {
    if (picked !== null && picked === q.answer) return;
    setPicked(i);
    if (i === q.answer) {
      ping(1180);
      setScore((s) => s + 1);
    } else ping(300);
  };
  const next = () => {
    if (qi < vehicle.quiz.length - 1) {
      setQi(qi + 1);
      setPicked(null);
    } else {
      setDone(true);
      useAppStore.getState().stamp(vehicle.id);
    }
  };

  return (
    <ResponsivePanel open={open} onClose={() => useAppStore.getState().setPanel(null)} labelledBy="quiz-title" eyebrow={`${t('quiz')} · ${l(vehicle.name)}`} title={t('quizTitle')}>
      {!done ? (
        <div>
          <div className="mb-4 flex gap-1.5">
            {vehicle.quiz.map((_, k) => (
              <div key={k} className={`h-1.5 flex-1 rounded-full ${k < qi ? 'bg-amber-400' : k === qi ? 'bg-amber-400/60' : 'bg-white/20'}`} />
            ))}
          </div>
          <p className="font-display text-[1.3rem] leading-snug font-semibold text-ink-100">{l(q.q)}</p>
          <div className="mt-4 grid gap-2.5">
            {q.options.map((o, i) => {
              const isPicked = picked === i;
              const right = i === q.answer;
              const state = picked === null ? '' : isPicked && right ? 'border-emerald-400 bg-emerald-400/10' : isPicked ? 'border-rose-400 bg-rose-400/10' : '';
              return (
                <button key={i} onClick={() => choose(i)} className={`flex min-h-[54px] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-left text-[1rem] leading-snug text-ink-100 transition hover:border-white/30 hover:bg-white/[0.07] ${state}`}>
                  <span className="mono grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-400/45 text-[0.8125rem] font-bold text-amber-300">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{l(o)}</span>
                  {isPicked && (right ? <Check className="text-emerald-400" size={20} aria-label={t('correct')} /> : <X className="text-rose-400" size={20} aria-label={t('notQuite')} />)}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-white/12 bg-white/[0.05] p-4" aria-live="polite">
              <p className="font-semibold">{picked === q.answer ? `✅ ${t('correct')}` : `💭 ${t('notQuite')}`}</p>
              <p className="reading mt-1.5">{l(q.explain)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {picked !== q.answer && (
                  <button className="btn" onClick={() => setPicked(null)}>
                    <RotateCcw size={16} /> {t('tryAgain')}
                  </button>
                )}
                <button className="btn btn-primary" onClick={next}>
                  {qi < vehicle.quiz.length - 1 ? t('nextQuestion') : t('finish')}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center">
          <motion.div initial={{ scale: 2, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }} transition={{ type: 'spring', damping: 12 }} className="stamp mx-auto grid h-40 w-40 place-items-center text-amber-400">
            <div>
              <VehicleArt id={vehicle.id} className="mx-auto h-14 w-20" />
              <div className="mono mt-1 text-xs tracking-widest uppercase">Explorer</div>
              <div className="font-display text-sm">{l(vehicle.name)}</div>
            </div>
          </motion.div>
          <p className="font-display mt-6 text-xl">
            <Stamp className="mr-1 inline text-amber-400" size={20} /> {t('stampEarned')}
          </p>
          <p className="mono mt-1 text-ink-300">
            {score}/{vehicle.quiz.length}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button className="btn" onClick={reset}>
              <RotateCcw size={16} /> {t('exploreAgain')}
            </button>
            <button className="btn btn-primary" onClick={() => useAppStore.getState().leave()}>
              {t('backToMap')}
            </button>
          </div>
        </div>
      )}
    </ResponsivePanel>
  );
}
