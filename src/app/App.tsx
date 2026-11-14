import { Suspense, lazy, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, type Screen } from '../store/useAppStore';
import { Intro } from '../components/intro/Intro';
import { Hub } from '../components/hub/Hub';
const MachineScreen = lazy(() => import('../components/machine/MachineScreen').then((m) => ({ default: m.MachineScreen })));
const TeachersPage = lazy(() => import('../components/pages/Pages').then((m) => ({ default: m.TeachersPage })));
const SourcesPage = lazy(() => import('../components/pages/Pages').then((m) => ({ default: m.SourcesPage })));
import { DemoDirector } from './DemoDirector';
import { ErrorBoundary } from './ErrorBoundary';
import { VEHICLES } from '../data';
import type { VehicleId } from '../data/types';
import { setAmbientMuted } from '../hooks/ambient';
import { stopNarration } from '../hooks/narrator';

/** Hash routing (static-hosting friendly): #/hub, #/machine/opportunity, #/teachers, #/sources */
function useHashSync() {
  const screen = useAppStore((s) => s.screen);
  const vehicleId = useAppStore((s) => s.vehicleId);

  useEffect(() => {
    const apply = () => {
      const [, a, b] = window.location.hash.split('/');
      const s = useAppStore.getState();
      if (a === 'machine' && b && b in VEHICLES) {
        if (s.vehicleId !== b) s.openVehicle(b as VehicleId);
      } else if (a === 'hub' || a === 'teachers' || a === 'sources') {
        if (s.screen !== a) s.set({ screen: a as Screen, vehicleId: null, panel: null, selectedPart: null });
      }
    };
    if (!useAppStore.getState().demo) apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  useEffect(() => {
    if (useAppStore.getState().demo) return;
    const h = screen === 'machine' && vehicleId ? `#/machine/${vehicleId}` : screen === 'intro' ? '' : `#/${screen}`;
    if (window.location.hash !== h) history.replaceState(null, '', h || window.location.pathname + window.location.search);
  }, [screen, vehicleId]);
}

export function App() {
  const screen = useAppStore((s) => s.screen);
  const lang = useAppStore((s) => s.lang);
  const reduceMotion = useAppStore((s) => s.reduceMotion);
  const largeText = useAppStore((s) => s.largeText);
  const muted = useAppStore((s) => s.muted);
  useHashSync();

  useEffect(() => {
    document.documentElement.lang = lang;
    stopNarration();
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    document.documentElement.classList.toggle('large-text', largeText);
  }, [reduceMotion, largeText]);
  useEffect(() => {
    setAmbientMuted(muted);
  }, [muted]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <>
      <ErrorBoundary key={screen}>
      <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Suspense fallback={<div className="min-h-dvh bg-space-950" />}>
        {screen === 'intro' && <Intro />}
        {screen === 'hub' && <Hub />}
        {screen === 'machine' && <MachineScreen />}
        {screen === 'teachers' && <TeachersPage />}
        {screen === 'sources' && <SourcesPage />}
        </Suspense>
      </motion.div>
      </ErrorBoundary>
      <DemoDirector />
    </>
  );
}
