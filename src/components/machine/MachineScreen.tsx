import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, BookOpen, Boxes, Expand, HelpCircle, ListOrdered, MessageCircle, Play, Radio, RotateCcw, ScanLine, Square } from 'lucide-react';
import { VEHICLES } from '../../data';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { Starfield } from '../ui/Starfield';
import { PartIcon } from '../ui/Icon';
import { VehicleArt } from '../ui/VehicleArt';
import { SettingsMenu, SoundToggle, LanguageSwitch } from '../layout/Settings';
import { VRButton } from '../../three/xr/VRButton';
import { PartPanel } from './PartPanel';
import { StoryPanel } from './StoryPanel';
import { QuizPanel } from './QuizPanel';
import { SignalPanel } from './SignalPanel';
import { AskPanel } from './AskPanel';
import { Captions } from './ListenButton';
import { StormOverlay } from '../events/StormOverlay';
import { PlaqueModal } from '../events/PlaqueModal';
import { hasWebGL, useIsMobile } from '../../hooks/useMedia';
import { playNarration, stopNarration, useNarrator } from '../../hooks/narrator';
import { playAmbient } from '../../hooks/ambient';

const SceneRoot = lazy(() => import('../../three/SceneRoot'));
const ACCENT = { moon: '#C9CCD3', mars: '#E07A3F', 'deep-space': '#7FE7F2' } as const;

function Teleport({ vehicle }: { vehicle: Vehicle }) {
  const { l } = useT();
  const teleporting = useAppStore((s) => s.teleporting);
  const reduce = useAppStore((s) => s.reduceMotion);
  useEffect(() => {
    if (!teleporting) return;
    const id = window.setTimeout(() => useAppStore.getState().finishTeleport(), reduce ? 700 : 2600);
    return () => window.clearTimeout(id);
  }, [teleporting, reduce]);
  return (
    <AnimatePresence>
      {teleporting && (
        <motion.div className="warp fixed inset-0 z-50" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.4 }} transition={{ duration: 0.9, ease: 'easeIn' }} aria-live="assertive">
          {!reduce && <Starfield warp density={1.4} />}
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mx-auto mb-4 h-16 w-20" style={{ color: ACCENT[vehicle.destination] }}>
                <VehicleArt id={vehicle.id} className="h-full w-full" />
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="font-display text-2xl text-ink-100 sm:text-3xl">
                {l(vehicle.teleportText)}
              </motion.p>
              <p className="mono mt-3 text-xs tracking-widest text-signal-300 uppercase">{l(vehicle.loadingText)}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PartsList({ vehicle }: { vehicle: Vehicle }) {
  const { l, t } = useT();
  const selected = useAppStore((s) => s.selectedPart);
  const [open, setOpen] = useState(true);
  return (
    <nav className="glass fixed top-20 left-4 z-20 hidden max-h-[calc(100dvh-200px)] w-64 flex-col rounded-3xl lg:flex" aria-label={t('parts')}>
      <button className="flex min-h-[48px] items-center gap-2 px-4 py-3 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <ListOrdered size={18} className="text-amber-400" />
        <span className="eyebrow flex-1">{t('parts')}</span>
        <span className="mono text-xs text-ink-500">{vehicle.parts.length}</span>
      </button>
      {open && (
        <ol className="scroll-thin min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {vehicle.parts.map((p, i) => (
            <li key={p.id}>
              <button
                onClick={() => useAppStore.getState().selectPart(p.id)}
                aria-current={selected === p.id}
                className={`flex min-h-[42px] w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-sm transition ${selected === p.id ? 'bg-amber-400/15 text-amber-300' : 'text-ink-300 hover:bg-white/5 hover:text-ink-100'}`}
              >
                <span className={`mono grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold ${selected === p.id ? 'bg-amber-400 text-[#1a1206]' : 'border border-amber-400/50 text-amber-400'}`}>{i + 1}</span>
                <PartIcon name={p.icon} size={16} />
                <span className="truncate">{l(p.name)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      <p className="px-4 pb-3 text-[0.72rem] text-ink-500">{t('partsHint')}</p>
    </nav>
  );
}

function MobilePartsStrip({ vehicle }: { vehicle: Vehicle }) {
  const { l } = useT();
  const selected = useAppStore((s) => s.selectedPart);
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
      {vehicle.parts.map((p, i) => (
        <button key={p.id} onClick={() => useAppStore.getState().selectPart(p.id)} className={`glass flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${selected === p.id ? 'border-amber-400 text-amber-300' : 'text-ink-300'}`}>
          <span className="mono text-amber-400">{i + 1}</span> {l(p.name)}
        </button>
      ))}
    </div>
  );
}

function Fallback2D({ vehicle }: { vehicle: Vehicle }) {
  const { l, t } = useT();
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pt-24 pb-40">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-ink-300">{t('noWebgl')}</p>
        <div className="mx-auto mb-6 h-40 w-60" style={{ color: ACCENT[vehicle.destination] }}>
          <VehicleArt id={vehicle.id} className="h-full w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vehicle.parts.map((p, i) => (
            <button key={p.id} onClick={() => useAppStore.getState().selectPart(p.id)} className="glass flex min-h-[88px] flex-col items-start gap-2 rounded-2xl p-3 text-left">
              <span className="flex items-center gap-2 text-amber-400">
                <span className="mono text-sm">{i + 1}</span> <PartIcon name={p.icon} />
              </span>
              <span className="text-sm font-semibold">{l(p.name)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Greeting({ vehicle }: { vehicle: Vehicle }) {
  const { l, t, lang } = useT();
  const teleporting = useAppStore((s) => s.teleporting);
  const selected = useAppStore((s) => s.selectedPart);
  const panel = useAppStore((s) => s.panel);
  const demo = useAppStore((s) => s.demo);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    setDismissed(false);
  }, [vehicle]);
  useEffect(() => {
    if (selected || panel) setDismissed(true);
  }, [selected, panel]);
  const show = !teleporting && !dismissed && !demo;
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 0.8 }} className="glass fixed top-[calc(var(--sat)+76px)] left-1/2 z-20 w-[min(520px,calc(100vw-24px))] -translate-x-1/2 rounded-3xl p-4 lg:top-auto lg:bottom-28">
          <div className="flex gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-black/30" style={{ color: ACCENT[vehicle.destination] }}>
              <VehicleArt id={vehicle.id} className="h-8 w-10" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[1.05rem] leading-snug">“{l(vehicle.intro)}”</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn btn-primary min-h-[40px] py-1.5 text-sm" onClick={() => (setDismissed(true), playNarration(`story-${vehicle.id}`, l(vehicle.audio.transcript), lang, vehicle.audio.story[lang]))}>
                  🎧 {t('hearStory')}
                </button>
                <button className="btn min-h-[40px] py-1.5 text-sm" onClick={() => (setDismissed(true), useAppStore.getState().set({ touring: true }))}>
                  <Play size={15} /> {t('tour')}
                </button>
                <button className="btn btn-ghost min-h-[40px] py-1.5 text-sm text-ink-300" onClick={() => setDismissed(true)}>
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Guided tour: visit every part with the camera and voice. */
function useGuidedTour(vehicle: Vehicle | null) {
  const touring = useAppStore((s) => s.touring);
  const { l, lang } = useT();
  const step = useRef(0);
  useEffect(() => {
    if (!touring || !vehicle) return;
    step.current = 0;
    let timer = 0;
    let unsub: (() => void) | null = null;
    const go = () => {
      if (!useAppStore.getState().touring) return;
      const p = vehicle.parts[step.current];
      if (!p) {
        useAppStore.getState().set({ touring: false });
        return;
      }
      useAppStore.getState().selectPart(p.id);
      const started = Date.now();
      const text = `${l(p.name)}. ${l(p.simple)}`;
      let advanced = false;
      const advance = () => {
        if (advanced) return;
        advanced = true;
        unsub?.();
        unsub = null;
        window.clearTimeout(safety);
        step.current++;
        timer = window.setTimeout(go, 900);
      };
      playNarration(`tour-${p.id}`, l(p.simple), lang, `audio/parts/${vehicle.id}_${p.id}_${lang}.mp3`);
      // Safety net: never get stuck on a part if the voice does not finish.
      const safety = window.setTimeout(advance, 4000 + text.split(' ').length * 420);
      unsub?.();
      unsub = useNarrator.subscribe((s) => {
        if (!s.playing && Date.now() - started > 800) advance();
      });
    };
    timer = window.setTimeout(go, 300);
    return () => {
      window.clearTimeout(timer);
      unsub?.();
      stopNarration();
    };
  }, [touring, vehicle, l, lang]);
}

export function MachineScreen() {
  const { t, l } = useT();
  const id = useAppStore((s) => s.vehicleId);
  const vehicle = id ? VEHICLES[id] : null;
  const panel = useAppStore((s) => s.panel);
  const exploded = useAppStore((s) => s.exploded);
  const xray = useAppStore((s) => s.xray);
  const touring = useAppStore((s) => s.touring);
  const mobile = useIsMobile();
  const [webgl] = useState(hasWebGL);
  useGuidedTour(vehicle);

  useEffect(() => {
    if (!vehicle) return;
    if (!useAppStore.getState().muted) playAmbient(vehicle.destination);
    return () => {
      stopNarration();
      if (!useAppStore.getState().muted) playAmbient('hub');
    };
  }, [vehicle]);

  if (!vehicle) return null;
  const s = useAppStore.getState;
  const openPanel = (p: 'story' | 'quiz' | 'signal' | 'ask') => {
    s().set({ touring: false, selectedPart: null });
    s().setPanel(panel === p ? null : p);
  };
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const actions = [
    { k: 'story' as const, icon: BookOpen, label: t('story') },
    { k: 'signal' as const, icon: Radio, label: t('signal') },
    { k: 'quiz' as const, icon: HelpCircle, label: t('quiz') },
    { k: 'ask' as const, icon: MessageCircle, label: t('ask') },
  ];
  const tools = [
    { k: 'reset', icon: RotateCcw, label: t('reset'), on: false, fn: () => (s().set({ selectedPart: null, panel: panel === 'part' ? null : panel }), s().resetCamera()) },
    { k: 'exploded', icon: Boxes, label: t('exploded'), on: exploded, fn: () => (s().toggle('exploded'), s().resetCamera()) },
    { k: 'xray', icon: ScanLine, label: t('xray'), on: xray, fn: () => s().toggle('xray') },
    { k: 'tour', icon: touring ? Square : Play, label: touring ? t('stopTour') : t('tour'), on: touring, fn: () => s().set({ touring: !touring }) },
    { k: 'fs', icon: Expand, label: t('fullscreen'), on: false, fn: fullscreen },
  ];

  return (
    <main className="fixed inset-0 overflow-hidden bg-space-950" aria-label={l(vehicle.name)}>
      <div className="absolute inset-0">
        {webgl ? (
          <Suspense fallback={<div className="grid h-full place-items-center text-ink-500">{t('loading')}…</div>}>
            <SceneRoot vehicle={vehicle} />
          </Suspense>
        ) : (
          <Fallback2D vehicle={vehicle} />
        )}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.65)]" />
      </div>
      <p className="sr-only">
        {l(vehicle.name)} — {l(vehicle.location)}. {l(vehicle.intro)}
      </p>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center gap-2 px-3 pt-[calc(var(--sat)+12px)] sm:px-4">
        <button className="btn glass pointer-events-auto" onClick={() => s().leave()} data-testid="leave">
          <ArrowLeft size={18} /> {t('leave')}
        </button>
        <div className="pointer-events-auto min-w-0 flex-1 px-2">
          <div className="font-display truncate text-lg leading-tight font-semibold sm:text-xl">{l(vehicle.name)}</div>
          <div className="truncate text-xs" style={{ color: ACCENT[vehicle.destination] }}>
            {l(vehicle.location)}
          </div>
        </div>
        <div className="pointer-events-auto hidden items-center gap-2 md:flex">
          {actions.map((a) => (
            <button key={a.k} className="btn glass" aria-pressed={panel === a.k} aria-label={a.label} onClick={() => openPanel(a.k)} data-testid={`action-${a.k}`}>
              <a.icon size={17} /> <span className="hidden xl:inline">{a.label}</span>
            </button>
          ))}
          <LanguageSwitch />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <VRButton />
          <SoundToggle />
          <SettingsMenu />
        </div>
      </header>

      {webgl && <PartsList vehicle={vehicle} />}

      {!mobile && (
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="glass flex items-center gap-1 rounded-full p-1.5">
            {tools.filter((x) => webgl || x.k === 'tour' || x.k === 'fs').map((x) => (
              <button key={x.k} className="btn btn-ghost min-h-[42px] px-3.5 text-sm" aria-pressed={x.on} aria-label={x.label} onClick={x.fn} disabled={!webgl && x.k !== 'tour' && x.k !== 'fs'}>
                <x.icon size={17} /> <span className="hidden lg:inline">{x.label}</span>
              </button>
            ))}
          </div>
          {webgl && <p className="mt-2 text-center text-xs text-ink-500">{t('dragHint')}</p>}
        </div>
      )}

      {mobile && (
        <div className="fixed inset-x-0 bottom-0 z-20 pb-[calc(var(--sab)+8px)]">
          {webgl && <MobilePartsStrip vehicle={vehicle} />}
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-3">
            {actions.map((a) => (
              <button key={a.k} className="btn glass shrink-0 px-3.5 text-sm" aria-pressed={panel === a.k} onClick={() => openPanel(a.k)}>
                <a.icon size={17} /> {a.label}
              </button>
            ))}
            {tools.slice(0, 4).filter((x) => webgl || x.k === 'tour').map((x) => (
              <button key={x.k} className="btn glass shrink-0 px-3.5 text-sm" aria-pressed={x.on} onClick={x.fn}>
                <x.icon size={17} /> {x.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Greeting vehicle={vehicle} />
      <Captions />
      <PartPanel vehicle={vehicle} />
      <StoryPanel vehicle={vehicle} />
      <QuizPanel vehicle={vehicle} />
      <SignalPanel vehicle={vehicle} />
      <AskPanel vehicle={vehicle} />
      <StormOverlay />
      <PlaqueModal />
      <Teleport vehicle={vehicle} />
    </main>
  );
}
