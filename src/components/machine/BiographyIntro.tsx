/**
 * The guided visit, in one piece: the machine first tells its life (who, launch, mission,
 * result, science, humanity) while the whole machine is shown; then it presents each of its
 * parts one by one (camera + highlight); it ends with why we should not forget it.
 * The card is NOT modal: the 3D stays free to turn, zoom and touch during the whole visit.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight, BadgeCheck, Building2, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Flame, FlaskConical, Headphones,
  HeartHandshake, MapPin, Move3d, Pause, Play, Rocket, Target, UserRound, X,
} from 'lucide-react';
import type { Part, Vehicle } from '../../data/types';
import { BIO_ORDER, BIO_RESULT, BIO_TITLES, BIOGRAPHY, type BioSlideId } from '../../data/biography';
import { markBioSeen, useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { VehicleArt } from '../ui/VehicleArt';
import { PartIcon } from '../ui/Icon';
import { playNarration, stopNarration, togglePause, useNarrator } from '../../hooks/narrator';

const ICONS: Record<BioSlideId, typeof Rocket> = {
  who: UserRound,
  birth: Rocket,
  mission: Target,
  result: BadgeCheck,
  science: FlaskConical,
  humanity: HeartHandshake,
  remember: Flame,
};
const ACCENT = { moon: '#cfd6e6', mars: '#ff8a5b', 'deep-space': '#7fe7f2' } as const;

type Step = { kind: 'bio'; slide: BioSlideId } | { kind: 'part'; part: Part; n: number };

export function BiographyIntro({ vehicle }: { vehicle: Vehicle }) {
  const { t, l, lang } = useT();
  const open = useAppStore((s) => s.bio && !s.teleporting);
  const idx = useAppStore((s) => s.bioStep);
  const auto = useAppStore((s) => s.bioAuto);
  const panel = useAppStore((s) => s.panel);
  const selected = useAppStore((s) => s.selectedPart);
  const reduce = useAppStore((s) => s.reduceMotion);
  const narr = useNarrator();
  const [small, setSmall] = useState(false);
  const bio = BIOGRAPHY[vehicle.id];

  // Life story first, then every part, then "why you should not forget me".
  const steps = useMemo<Step[]>(() => {
    const story = BIO_ORDER.filter((s) => s !== 'remember').map((slide) => ({ kind: 'bio' as const, slide }));
    const parts = vehicle.parts.map((part, n) => ({ kind: 'part' as const, part, n }));
    return [...story, ...parts, { kind: 'bio', slide: 'remember' }];
  }, [vehicle]);
  const step = steps[Math.min(idx, steps.length - 1)];
  const last = idx >= steps.length - 1;
  const storyCount = BIO_ORDER.length - 1;

  const setStep = (i: number) => useAppStore.getState().set({ bioStep: Math.max(0, Math.min(steps.length - 1, i)) });
  const setAuto = (a: boolean) => useAppStore.getState().set({ bioAuto: a });

  const narrId = step.kind === 'bio' ? `bio-${vehicle.id}-${step.slide}` : `tour-${vehicle.id}-${step.part.id}`;
  const text = step.kind === 'bio' ? l(bio.slides[step.slide]) : l(step.part.simple);
  const src = step.kind === 'bio' ? `audio/bio/${vehicle.id}_${step.slide}_${lang}.mp3` : `audio/parts/${vehicle.id}_${step.part.id}_${lang}.mp3`;
  // Life-story chapters show the whole machine (no part highlighted); parts are shown only in the parts section.
  const focusId = step.kind === 'part' ? step.part.id : null;

  const close = useCallback(() => {
    stopNarration();
    markBioSeen(vehicle.id);
    useAppStore.getState().set({ bio: false, bioAuto: false });
    useAppStore.getState().focusPart(null);
  }, [vehicle.id]);

  // Camera + highlight follow the story.
  const userPick = useRef(false);
  useEffect(() => {
    if (!open || panel !== null) return;
    useAppStore.getState().focusPart(focusId);
  }, [open, focusId, idx, panel]);

  // Narration of the current step.
  const started = useRef(false);
  useEffect(() => {
    if (!open || !auto) return;
    started.current = false;
    playNarration(narrId, text, lang, src);
  }, [open, auto, narrId, text, lang, src]);
  useEffect(() => {
    if (!open || auto) return;
    const cur = useNarrator.getState().id ?? '';
    if (cur.startsWith('bio-') || cur.startsWith('tour-')) stopNarration();
  }, [open, auto, idx]);

  // When the voice ends, go on to the next step.
  useEffect(() => {
    if (!open || !auto) return;
    if (narr.id === narrId && narr.playing) started.current = true;
    if (started.current && !narr.playing && narr.id === null) {
      started.current = false;
      if (last) setAuto(false);
      else {
        const h = window.setTimeout(() => setStep(useAppStore.getState().bioStep + 1), 800);
        return () => window.clearTimeout(h);
      }
    }
  }, [narr.id, narr.playing, narrId, auto, last, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // A part touched in 3D (or in the parts list) during the visit: jump to that part in the visit.
  useEffect(() => {
    if (!open || panel !== 'part' || !selected) return;
    if (userPick.current) return; // "Learn more" opened the panel on purpose
    const i = steps.findIndex((s) => s.kind === 'part' && s.part.id === selected);
    useAppStore.getState().set({ panel: null });
    if (i >= 0) setStep(i);
  }, [open, panel, selected, steps]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (panel === null) userPick.current = false;
  }, [panel]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input,textarea')) return;
      if (e.key === 'ArrowRight') setStep(useAppStore.getState().bioStep + 1);
      else if (e.key === 'ArrowLeft') setStep(useAppStore.getState().bioStep - 1);
      else if (e.key === 'Escape' && !useAppStore.getState().panel) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]); // eslint-disable-line react-hooks/exhaustive-deps

  const listen = () => {
    if (auto && narr.id === narrId) return togglePause();
    setAuto(true);
  };
  const more = () => {
    if (step.kind !== 'part') return;
    setAuto(false);
    stopNarration();
    userPick.current = true;
    useAppStore.getState().selectPart(step.part.id);
  };

  const accent = ACCENT[vehicle.destination];
  const date = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(bio.launch.date));
  const playingHere = auto && narr.id === narrId && narr.playing && !narr.paused;
  const section =
    step.kind === 'part'
      ? `${t('bioPartsLabel')} · ${step.n + 1} / ${vehicle.parts.length}`
      : step.slide === 'remember'
        ? `${t('bioStoryLabel')} · ${storyCount + 1} / ${storyCount + 1}`
        : `${t('bioStoryLabel')} · ${BIO_ORDER.indexOf(step.slide) + 1} / ${storyCount + 1}`;
  const Icon = step.kind === 'bio' ? ICONS[step.slide] : null;
  const visible = open && panel === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key="journey"
          aria-label={`${t('tour')}: ${l(vehicle.name)}`}
          aria-live="polite"
          className="pointer-events-none fixed inset-x-2 bottom-[calc(var(--sab)+8px)] z-40 flex justify-center md:inset-x-auto md:top-[84px] md:right-4 md:bottom-auto md:block md:w-[440px]"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 16 }}
          transition={{ duration: reduce ? 0 : 0.4 }}
        >
          <div className="surface-solid pointer-events-auto flex w-full max-w-[560px] min-w-0 flex-col overflow-hidden rounded-[26px] md:max-h-[calc(100dvh-200px)]">
            {/* header */}
            <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
              <div className="grid h-11 w-12 shrink-0 place-items-center rounded-2xl bg-black/40" style={{ color: accent }}>
                <VehicleArt id={vehicle.id} className="h-7 w-10" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-[1.05rem] leading-tight font-semibold text-ink-100">{l(vehicle.name)}</p>
                <p className="mono truncate text-[0.72rem] tracking-[0.14em] text-amber-300 uppercase">{section}</p>
              </div>
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-ink-300 hover:text-ink-100 md:hidden" onClick={() => setSmall((v) => !v)} aria-label={small ? t('bioExpand') : t('bioCollapse')}>
                {small ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-ink-300 hover:text-ink-100" onClick={close} aria-label={t('close')}>
                <X size={18} />
              </button>
            </div>
            {/* progress: story part, then parts, then the end */}
            <div className="mt-3 flex items-center gap-1 px-4 sm:px-5" aria-hidden>
              {steps.map((s, i) => (
                <button
                  key={i}
                  tabIndex={-1}
                  onClick={() => setStep(i)}
                  className="h-1.5 rounded-full transition-colors"
                  style={{
                    flex: s.kind === 'part' ? 0.6 : 1.4,
                    background: i <= idx ? (s.kind === 'part' ? '#7fe7f2' : '#ffb547') : 'rgba(255,255,255,0.14)',
                    opacity: i < idx ? 0.7 : 1,
                  }}
                />
              ))}
            </div>

            {/* content */}
            {!small && (
              <div className="scroll-thin max-h-[38dvh] min-h-0 overflow-y-auto px-4 pt-4 pb-2 sm:px-5 md:max-h-none md:flex-1">
                <motion.div key={idx} initial={{ opacity: 0, x: reduce ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduce ? 0 : 0.3 }}>
                  <h2 className="font-display flex items-start gap-2.5 text-[1.45rem] leading-tight font-semibold text-ink-100 sm:text-[1.65rem]">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                      {Icon ? <Icon size={18} aria-hidden /> : step.kind === 'part' ? <PartIcon name={step.part.icon} /> : null}
                    </span>
                    <span>{step.kind === 'bio' ? l(BIO_TITLES[step.slide]) : l(step.part.name)}</span>
                  </h2>

                  {step.kind === 'bio' && step.slide === 'birth' && (
                    <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {[
                        { i: CalendarDays, k: t('bioLaunched'), v: date },
                        { i: Rocket, k: t('bioRocket'), v: l(bio.launch.rocket) },
                        { i: MapPin, k: t('bioFrom'), v: l(bio.launch.site) },
                        { i: Building2, k: t('bioBy'), v: l(bio.launch.madeBy) },
                      ].map(({ i: I, k, v }) => (
                        <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
                          <dt className="flex items-center gap-1.5 text-[0.72rem] tracking-wide text-ink-300 uppercase">
                            <I size={13} aria-hidden className="text-amber-300" /> {k}
                          </dt>
                          <dd className="mt-1 leading-snug font-semibold text-ink-100">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {step.kind === 'bio' && step.slide === 'result' && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3.5 py-1.5 text-sm font-semibold text-emerald-200">
                      <BadgeCheck size={16} aria-hidden /> {l(BIO_RESULT[bio.result])}
                    </p>
                  )}

                  <p className={`reading mt-3.5 text-[1.0625rem] ${step.kind === 'part' ? 'border-l-2 border-amber-400/60 pl-3.5' : ''}`}>{text}</p>

                  {step.kind === 'part' && step.part.funFact && (
                    <p className="mt-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-3 text-[0.95rem] leading-relaxed text-ink-200">✨ {l(step.part.funFact)}</p>
                  )}
                  {step.kind === 'bio' && step.slide === 'remember' && (
                    <figure className="bio-epitaph mt-4 rounded-2xl p-4">
                      <blockquote className="font-display text-[1.1rem] leading-snug text-amber-100 italic">“{l(bio.epitaph)}”</blockquote>
                      {bio.epitaphSource && <figcaption className="mt-2 text-[0.8125rem] text-ink-300">{l(bio.epitaphSource)}</figcaption>}
                    </figure>
                  )}
                  <p className="mt-3 flex items-center gap-1.5 text-[0.8125rem] text-ink-300">
                    <Move3d size={14} aria-hidden /> {t('bioHint')}
                  </p>
                </motion.div>
              </div>
            )}

            {/* controls */}
            <div className="mt-2 border-t border-white/10 bg-black/25 px-3 py-3 sm:px-4">
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost min-h-[44px] shrink-0 px-2.5 text-ink-200 disabled:opacity-40" onClick={() => setStep(idx - 1)} disabled={idx === 0} aria-label={t('bioPrev')}>
                  <ChevronLeft size={18} />
                </button>
                <button className="btn min-h-[44px] min-w-0 flex-1 justify-center px-3" onClick={listen} aria-pressed={auto}>
                  {playingHere ? <Pause size={17} /> : auto ? <Play size={17} /> : <Headphones size={17} />}
                  <span className="truncate">{playingHere ? t('bioPause') : auto ? t('bioResume') : t('bioListenShort')}</span>
                </button>
                {step.kind === 'part' && (
                  <button className="btn min-h-[44px] shrink-0 px-3" onClick={more}>
                    {t('bioMore')}
                  </button>
                )}
                {last ? (
                  <button className="btn btn-primary min-h-[44px] shrink-0 px-4" onClick={close}>
                    {t('bioFinish')} <ArrowRight size={17} />
                  </button>
                ) : (
                  <button className="btn btn-primary min-h-[44px] shrink-0 px-4" onClick={() => setStep(idx + 1)} aria-label={t('bioNext')}>
                    <span className="hidden sm:inline">{t('bioNext')}</span> <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
