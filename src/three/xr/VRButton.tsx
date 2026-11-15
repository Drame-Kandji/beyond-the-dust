import { useEffect, useState } from 'react';
import { useT } from '../../i18n/useT';

/**
 * "Live it in VR": DOM button, rendered only when immersive-vr is supported.
 * Imports nothing from three: the XR store is pulled in with a dynamic import
 * (already loaded by the lazy SceneRoot chunk by the time a user clicks).
 */
export function VRButton() {
  const { t } = useT();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    let alive = true;
    const xr = typeof navigator !== 'undefined' ? navigator.xr : undefined;
    xr?.isSessionSupported('immersive-vr')
      .then((ok) => {
        if (!alive || !ok) return;
        setSupported(true);
        void import('./xrStore'); // warm up so the click resolves instantly
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!supported) return null;
  return (
    <button
      type="button"
      className="btn glass"
      onClick={() => {
        void import('./xrStore')
          .then((m) => m.xrStore.enterVR())
          .catch((err) => console.warn('[xr] could not start VR session', err));
      }}
    >
      {t('enterVR')}
    </button>
  );
}
