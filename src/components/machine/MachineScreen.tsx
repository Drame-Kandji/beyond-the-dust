import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, BookOpen, ScrollText, Boxes, ChevronDown, Expand, HelpCircle, ListOrdered, MessageCircle, Play, Radio, RotateCcw, ScanLine, Square } from 'lucide-react';
import { VEHICLES } from '../../data';
import type { Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { Starfield } from '../ui/Starfield';
import { PartIcon } from '../ui/Icon';
import { VehicleArt } from '../ui/VehicleArt';
import { SettingsMenu, SoundToggle, LanguageSwitch } from '../layout/Settings';
import { VRButton } from '../../three/xr/VRButton';
import { ARButton, ARViewer } from '../ar/ARButton';
import { PartPanel } from './PartPanel';
import { BiographyIntro } from './BiographyIntro';
import { StoryPanel } from './StoryPanel';
import { QuizPanel } from './QuizPanel';
import { SignalPanel } from './SignalPanel';
import { AskPanel } from './AskPanel';
import { Captions } from './ListenButton';
import { StormOverlay } from '../events/StormOverlay';
import { PlaqueModal } from '../events/PlaqueModal';
import { hasWebGL, useIsMobile } from '../../hooks/useMedia';
import { stopNarration } from '../../hooks/narrator';
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
    <nav className={`surface fixed top-20 left-4 z-20 hidden w-[288px] flex-col overflow-hidden rounded-[24px] lg:flex ${open ? 'max-h-[calc(100dvh-196px)]' : ''}`} aria-label={t('parts')}>
      <button className={`flex min-h-[56px] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] ${open ? 'surface-divider border-b' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
          <ListOrdered size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1rem] leading-tight font-semibold text-ink-100">{t('parts')}</span>
          <span className="block truncate text-[0.8125rem] leading-snug text-ink-300">{l(vehicle.name)}</span>
        </span>
        <span className="mono rounded-full border border-white/12 bg-white/[0.05] px-2 py-0.5 text-xs font-semibold text-ink-200">{vehicle.parts.length}</span>
        <ChevronDown size={18} aria-hidden className={`shrink-0 text-ink-300 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <>
          <ol className="scroll-thin scroll-fade min-h-0 flex-1 space-y-0.5 overflow-y-auto py-2 pr-2 pl-4">
            {vehicle.parts.map((p, i) => (
              <li key={p.id}>
                <button onClick={() => useAppStore.getState().selectPart(p.id)} aria-current={selected === p.id} className="part-row">
                  <span className="part-num">{i + 1}</span>
                  <PartIcon name={p.icon} size={17} className={`shrink-0 ${selected === p.id ? 'text-amber-300' : 'text-ink-300'}`} />
                  <span className="line-clamp-2 min-w-0 flex-1 text-[0.9375rem] leading-snug font-medium">{l(p.name)}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="surface-divider border-t px-4 py-3 text-[0.8125rem] leading-snug text-ink-300">{t('partsHint')}</p>
        </>
      )}
    </nav>
  );
}

function MobilePartsStrip({ vehicle }: { vehicle: Vehicle }) {
  const { l } = useT();
  const selected = useAppStore((s) => s.selectedPart);
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
      {vehicle.parts.map((p, i) => {
        const on = selected === p.id;
        return (
          <button key={p.id} onClick={() => useAppStore.getState().selectPart(p.id)} aria-current={on} className={`flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border py-1 pr-3.5 pl-1.5 text-[0.875rem] font-semibold shadow-[0_8px_24px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors ${on ? 'border-amber-400 bg-[rgba(46,34,14,0.94)] text-amber-300' : 'border-white/12 bg-[rgba(11,16,33,0.88)] text-ink-200'}`}>
            <span className={`mono grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${on ? 'bg-amber-400 text-[#1a1206]' : 'border border-amber-400/55 text-amber-400'}`}>{i + 1}</span>
            {l(p.name)}
          </button>
        );
      })}
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

export function MachineScreen() {
  const { t, l } = useT();
  const id = useAppStore((s) => s.vehicleId);
  const vehicle = id ? VEHICLES[id] : null;
  const panel = useAppStore((s) => s.panel);
  const exploded = useAppStore((s) => s.exploded);
  const xray = useAppStore((s) => s.xray);
  const touring = useAppStore((s) => s.touring);
  const bioOpen = useAppStore((s) => s.bio);
  const mobile = useIsMobile();
  const [webgl] = useState(hasWebGL);
  // The guided tour IS the story: "Guided tour" anywhere opens the unified visit.
  useEffect(() => {
    if (!touring) return;
    useAppStore.getState().set({ touring: false, panel: null, bio: true, bioStep: 0, bioAuto: true });
  }, [touring]);

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
  const openPanel = (p: 'bio' | 'story' | 'quiz' | 'signal' | 'ask') => {
    if (p === 'bio') {
      s().set({ touring: false, selectedPart: null, panel: null, bio: true, bioStep: 0, bioAuto: true });
      return;
    }
    s().set({ touring: false, selectedPart: null });
    s().setPanel(panel === p ? null : p);
  };
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const actions = [
    { k: 'bio' as const, icon: ScrollText, label: t('tour') },
    { k: 'story' as const, icon: BookOpen, label: t('story') },
    { k: 'signal' as const, icon: Radio, label: t('signal') },
    { k: 'quiz' as const, icon: HelpCircle, label: t('quiz') },
    { k: 'ask' as const, icon: MessageCircle, label: t('ask') },
  ];
  const tools = [
    { k: 'reset', icon: RotateCcw, label: t('reset'), on: false, fn: () => (s().set({ selectedPart: null, panel: panel === 'part' ? null : panel }), s().resetCamera()) },
    { k: 'exploded', icon: Boxes, label: t('exploded'), on: exploded, fn: () => (s().toggle('exploded'), s().resetCamera()) },
    { k: 'xray', icon: ScanLine, label: t('xray'), on: xray, fn: () => s().toggle('xray') },
    {
      k: 'tour',
      icon: bioOpen ? Square : Play,
      label: bioOpen ? t('stopTour') : t('tour'),
      on: bioOpen,
      fn: () => (bioOpen ? (stopNarration(), s().set({ bio: false, bioAuto: false }), s().focusPart(null)) : openPanel('bio')),
    },
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
        <div className="pointer-events-auto min-w-0 flex-1">
          <div className="inline-flex max-w-full flex-col rounded-2xl bg-[rgba(8,12,26,0.6)] px-3 py-1 backdrop-blur-md">
            <div className="font-display truncate text-lg leading-tight font-semibold text-ink-100 sm:text-xl">{l(vehicle.name)}</div>
            <div className="truncate text-[0.8125rem] font-medium" style={{ color: ACCENT[vehicle.destination] }}>
              {l(vehicle.location)}
            </div>
          </div>
        </div>
        <div className="pointer-events-auto hidden items-center gap-2 md:flex">
          {actions.map((a) => (
            <button key={a.k} className="btn glass" aria-pressed={a.k === 'bio' ? bioOpen : panel === a.k} aria-label={a.label} onClick={() => openPanel(a.k)} data-testid={`action-${a.k}`}>
              <a.icon size={17} /> <span className="hidden xl:inline">{a.label}</span>
            </button>
          ))}
          <LanguageSwitch />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <VRButton />
          {!mobile && <ARButton labelClass="hidden lg:inline" />}
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
          {webgl && <p className="mt-2 text-center text-xs text-ink-300 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('dragHint')}</p>}
        </div>
      )}

      {mobile && (
        <div className="fixed inset-x-0 bottom-0 z-20 pb-[calc(var(--sab)+8px)]">
          {webgl && <MobilePartsStrip vehicle={vehicle} />}
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-3">
            <ARButton className="btn glass shrink-0 px-3.5 text-sm" />
            {actions.map((a) => (
              <button key={a.k} className="btn glass shrink-0 px-3.5 text-sm" aria-pressed={a.k === 'bio' ? bioOpen : panel === a.k} onClick={() => openPanel(a.k)}>
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

      {!bioOpen && <Captions />}
      <BiographyIntro vehicle={vehicle} />
      <PartPanel vehicle={vehicle} />
      <StoryPanel vehicle={vehicle} />
      <QuizPanel vehicle={vehicle} />
      <SignalPanel vehicle={vehicle} />
      <AskPanel vehicle={vehicle} />
      <StormOverlay />
      <PlaqueModal />
      <ARViewer vehicle={vehicle} />
      <Teleport vehicle={vehicle} />
    </main>
  );
}
