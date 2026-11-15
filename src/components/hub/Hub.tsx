import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Lock, Stamp, Box, Map } from 'lucide-react';
import { Starfield } from '../ui/Starfield';
import { SolarMap } from './SolarMap';
import { SolarMap3D } from './SolarMap3D';
import { VehicleArt } from '../ui/VehicleArt';
import { DESTINATIONS, VEHICLE_LIST, comingSoonFor, vehiclesFor } from '../../data';
import type { DestinationId, Vehicle } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { LanguageSwitch, SettingsMenu, SoundToggle } from '../layout/Settings';
import { Footer } from '../layout/Footer';
import { ping } from '../../hooks/ambient';
import { useState, useEffect, Suspense } from 'react';

const ACCENT: Record<DestinationId, string> = { moon: '#C9CCD3', mars: '#E07A3F', 'deep-space': '#7FE7F2' };

function VehicleCard({ v }: { v: Vehicle }) {
  const { l, t } = useT();
  const open = useAppStore((s) => s.openVehicle);
  const stamped = useAppStore((s) => s.passport.includes(v.id));
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        ping(660);
        open(v.id);
      }}
      onMouseEnter={() => import('../../three/SceneRoot')}
      className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4 text-left transition hover:border-amber-400/60 focus-visible:border-amber-400"
      data-testid={`vehicle-${v.id}`}
    >
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60" style={{ background: ACCENT[v.destination] }} />
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-24 shrink-0 place-items-center rounded-2xl bg-black/30" style={{ color: ACCENT[v.destination] }}>
          <VehicleArt id={v.id} className="h-16 w-20" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="eyebrow" style={{ color: ACCENT[v.destination] }}>
            {l(v.status)}
          </div>
          <div className="font-display mt-0.5 text-xl leading-tight">{l(v.name)}</div>
          <div className="mt-1 line-clamp-2 text-sm text-ink-300 italic">“{l(v.hook)}”</div>
        </div>
        {stamped && <Stamp size={18} className="absolute top-3 right-3 text-amber-400" aria-hidden />}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="min-w-0 text-xs text-ink-500">{l(v.location)}</span>
        <span className="btn btn-primary shrink-0 px-4 py-1.5 text-sm">
          {t('teleport')} <ArrowRight size={16} />
        </span>
      </div>
    </motion.button>
  );
}

function Passport() {
  const { t, l } = useT();
  const passport = useAppStore((s) => s.passport);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="eyebrow">{t('passport')}</span>
      <div className="flex gap-2">
        {VEHICLE_LIST.map((v) => {
          const ok = passport.includes(v.id);
          return (
            <span key={v.id} role="img" aria-label={l(v.name)} title={l(v.name)} className={`grid h-9 w-9 place-items-center rounded-lg border ${ok ? 'border-amber-400 bg-amber-400/15 text-amber-300' : 'border-white/10 text-ink-500'}`}>
              <VehicleArt id={v.id} className="h-6 w-7" />
            </span>
          );
        })}
      </div>
      <span className="mono ml-auto text-sm text-ink-300">
        {passport.length}/{VEHICLE_LIST.length}
      </span>
    </div>
  );
}

export function Hub() {
  const { t, l } = useT();
  const destination = useAppStore((s) => s.destination);
  const setDestination = useAppStore((s) => s.setDestination);
  const dest = DESTINATIONS.find((d) => d.id === destination)!;
  const [is3DMode, setIs3DMode] = useState(true); // Mode 3D activé par défaut
  const [is3DReady, setIs3DReady] = useState(false); // État de chargement 3D
  
  // Charger le mode 3D au montage du composant
  useEffect(() => {
    // Petit délai pour s'assurer que le composant est monté
    const timer = setTimeout(() => {
      setIs3DReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const select = (d: DestinationId) => {
    ping(520);
    setDestination(d);
  };
  
  const toggle3DMode = () => {
    ping(440);
    setIs3DMode(!is3DMode);
  };
  /** Radio-group keyboard pattern: arrows move the choice, only the checked radio is in the Tab order. */
  const onRadioKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = DESTINATIONS[(i + step + DESTINATIONS.length) % DESTINATIONS.length];
    select(next.id);
    (e.currentTarget.parentElement?.children[DESTINATIONS.indexOf(next)] as HTMLElement | undefined)?.focus();
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden lg:h-dvh lg:overflow-hidden">
      <div className="fixed inset-0">
        <Starfield density={0.8} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(27,37,80,0.6),transparent_65%)]" />
      </div>

      <header className="relative z-20 flex items-center gap-2 px-4 pt-[calc(var(--sat)+14px)] pb-2 lg:px-8">
        <button className="font-display min-h-[44px] text-left text-base leading-tight font-semibold tracking-[0.1em] uppercase sm:text-lg sm:tracking-[0.12em]" onClick={() => useAppStore.getState().setScreen('intro')}>
          Beyond <span className="text-amber-400">the</span> Dust
        </button>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggle3DMode}
            className="flex h-[44px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-white transition hover:border-amber-400/50 hover:bg-amber-400/10"
            title={is3DMode ? 'Passer en mode 2D' : 'Passer en mode 3D'}
          >
            {is3DMode ? <Box size={18} className="text-amber-400" /> : <Map size={18} />}
            <span className="hidden sm:inline">{is3DMode ? '3D' : '2D'}</span>
          </button>
          <LanguageSwitch />
          <SoundToggle />
          <SettingsMenu />
        </div>
      </header>

      <div className="relative z-10 flex flex-col lg:h-[calc(100dvh-64px)] lg:flex-row-reverse">
        {/* Map — right on desktop, top on mobile */}
        <section className="relative h-[40dvh] min-h-[260px] lg:h-auto lg:flex-[1.25]" aria-label={t('mapLabel')}>
          <AnimatePresence mode="wait">
            {is3DMode && is3DReady ? (
              <motion.div
                key="3d"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                <Suspense fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                      <div className="mb-3 inline-block h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
                      <div className="text-sm text-ink-300">Chargement de l'espace 3D...</div>
                    </div>
                  </div>
                }>
                  <SolarMap3D selected={destination} onSelect={select} />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="2d"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                <SolarMap selected={destination} onSelect={select} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Choice panel */}
        <section className="relative -mt-6 rounded-t-3xl border-t border-white/10 bg-space-950/70 px-4 pt-5 pb-8 backdrop-blur-md lg:mt-0 lg:w-[460px] lg:overflow-y-auto lg:rounded-none lg:border-t-0 lg:border-r lg:bg-transparent lg:px-8 lg:pt-6 lg:backdrop-blur-0 scroll-thin">
          <div className="eyebrow mb-3">{t('step1')}</div>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t('step1')}>
            {DESTINATIONS.map((d, i) => {
              const active = d.id === destination;
              const n = vehiclesFor(d.id).length;
              return (
                <button
                  key={d.id}
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(d.id)}
                  onKeyDown={(e) => onRadioKey(e, i)}
                  className={`min-h-[64px] rounded-2xl border px-2 py-2.5 text-center transition ${active ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                >
                  <div className="text-[0.95rem] font-bold tracking-wider uppercase" style={{ color: active ? '#FFB547' : ACCENT[d.id] }}>
                    {l(d.name)}
                  </div>
                  <div className="mono text-xs text-ink-500">
                    {n} {n > 1 ? t('machinesPlural') : t('machines')}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={destination} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <p className="font-display mt-5 text-[1.35rem] leading-snug">{l(dest.tagline)}</p>
              <p className="mt-2 text-sm text-ink-300">
                <span aria-hidden>💡 </span>
                {l(dest.fact)}
              </p>

              <div className="eyebrow mt-6 mb-3">{t('step2')}</div>
              <div className="flex flex-col gap-3">
                {vehiclesFor(destination).map((v) => (
                  <VehicleCard key={v.id} v={v} />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                {comingSoonFor(destination).map((c) => (
                  <div key={c.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-2.5 text-ink-500">
                    <Lock size={14} className="shrink-0" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-ink-300">{c.name}</div>
                      <div className="text-xs leading-snug">{l(c.line)}</div>
                    </div>
                    <span className="chip shrink-0">{t('comingSoon')}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-500 italic">{t('soonNote')}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <Passport />
          </div>
          <Footer className="mt-6" />
        </section>
      </div>
    </main>
  );
}
