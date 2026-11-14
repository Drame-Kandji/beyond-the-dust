/**
 * "See it in your room": phone-camera augmented reality (no headset).
 * This file stays tiny (it lives in the MachineScreen chunk); the overlay, model-viewer
 * and the QR code generator are lazy-loaded only when the user opens it.
 */
import { Suspense, lazy, useEffect } from 'react';
import { create } from 'zustand';
import { View } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useT } from '../../i18n/useT';

const loadOverlay = () => import('./AROverlay');
const AROverlay = lazy(loadOverlay);

const useAR = create<{ open: boolean; opener: HTMLElement | null }>(() => ({ open: false, opener: null }));
// QR-code links carry `?ar=1`: open the overlay once, directly (kept until closed, React StrictMode-safe).
let deepLink = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('ar');

function closeAR() {
  deepLink = false;
  const { opener } = useAR.getState();
  useAR.setState({ open: false, opener: null });
  // Return focus to the button that opened the overlay.
  window.setTimeout(() => opener?.isConnected && opener.focus(), 0);
}

export function ARButton({ className = 'btn glass', labelClass = '' }: { className?: string; labelClass?: string }) {
  const { t } = useT();
  const label = t('arButton');
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-haspopup="dialog"
      data-testid="ar-open"
      onPointerEnter={() => void loadOverlay()}
      onFocus={() => void loadOverlay()}
      onClick={(e) => useAR.setState({ open: true, opener: e.currentTarget })}
    >
      <View size={17} aria-hidden /> <span className={labelClass}>{label}</span>
    </button>
  );
}

/** Renders the overlay when open. Also opens it directly for links like `?ar=1#/machine/curiosity` (QR code). */
export function ARViewer({ vehicle }: { vehicle: Vehicle }) {
  const open = useAR((s) => s.open);
  useEffect(() => {
    if (!deepLink) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has('ar')) {
      url.searchParams.delete('ar');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    }
    useAR.setState({ open: true, opener: null });
  }, []);
  useEffect(() => () => useAR.setState({ open: false, opener: null }), [vehicle]);
  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <AROverlay vehicle={vehicle} onClose={closeAR} />
    </Suspense>
  );
}
