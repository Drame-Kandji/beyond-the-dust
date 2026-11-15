/**
 * Full-screen AR viewer built on <model-viewer> (lazy chunk).
 * - Android Chrome: WebXR "immersive-ar" (ARCore), falls back to Google Scene Viewer.
 * - iPhone / iPad Safari: AR Quick Look; model-viewer converts the glTF to USDZ on the fly.
 * - Desktop: rotatable 3D preview + a QR code that opens this machine's AR view on a phone.
 * Model: public/models/<id>.glb (team model) when it exists, else public/models/ar/<id>.glb
 * (exported from the procedural model by `npm run ar-models`). 1 unit = 1 m.
 */
import { useEffect, useRef, useState } from 'react';
import { Ruler, Smartphone, View, X } from 'lucide-react';
import type { Vehicle } from '../../data/types';
import { useT } from '../../i18n/useT';
import { useAppStore } from '../../store/useAppStore';

interface ModelViewerElement extends HTMLElement {
  loaded: boolean;
  canActivateAR: boolean;
  activateAR(): Promise<void>;
  getDimensions(): { x: number; y: number; z: number };
}
type SizeMode = 'real' | 'table';

const BASE = new URL(import.meta.env.BASE_URL, window.location.href).href;
const TABLE_MAX = 0.6; // "Table size": longest side ≈ 60 cm

/** Same check as VehicleModel: a real glTF binary (dev servers may answer index.html for missing files). */
async function glbExists(url: string) {
  try {
    const r = await fetch(url, { headers: { Range: 'bytes=0-3' } });
    if (!r.ok) return false;
    const buf = new Uint8Array(await r.arrayBuffer()).slice(0, 4);
    return String.fromCharCode(...buf) === 'glTF';
  } catch {
    return false;
  }
}

let mvPromise: Promise<void> | null = null;
function loadModelViewer() {
  mvPromise ??= import('@google/model-viewer/dist/model-viewer.min.js').then(() => {
    const MV = customElements.get('model-viewer') as unknown as { dracoDecoderLocation: string } | undefined;
    if (MV) MV.dracoDecoderLocation = `${BASE}draco/`; // self-hosted decoder (works offline)
  });
  return mvPromise;
}

function arLink(id: string, lang: string) {
  const u = new URL(window.location.href);
  u.searchParams.set('ar', '1');
  u.searchParams.set('lang', lang);
  u.hash = `#/machine/${id}`;
  return u.href;
}

export default function AROverlay({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const { t, l, lang } = useT();
  const reduceMotion = useAppStore((s) => s.reduceMotion);
  const dialog = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const mvRef = useRef<ModelViewerElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [canAR, setCanAR] = useState<boolean | null>(null);
  const [arFailed, setArFailed] = useState(false);
  const [size, setSize] = useState<SizeMode>('real');
  const [dims, setDims] = useState<{ x: number; y: number; z: number } | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [phone] = useState(() => window.matchMedia('(pointer: coarse)').matches);
  const link = arLink(vehicle.id, lang);

  // Keyboard: Escape closes, Tab stays inside the dialog. Focus the close button on open.
  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab' && dialog.current) {
        const f = [...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  // Create <model-viewer> imperatively (custom element with boolean attributes).
  useEffect(() => {
    let alive = true;
    let el: ModelViewerElement | null = null;
    (async () => {
      const team = `${BASE}${vehicle.model.glb}`;
      const [hasTeam] = await Promise.all([glbExists(team), loadModelViewer()]);
      if (!alive || !holder.current) return;
      const src = hasTeam ? team : `${BASE}models/ar/${vehicle.id}.glb`;
      el = document.createElement('model-viewer') as ModelViewerElement;
      const attrs: Record<string, string> = {
        src,
        alt: l(vehicle.name),
        ar: '',
        'ar-modes': 'webxr scene-viewer quick-look',
        'ar-scale': 'auto',
        'ar-placement': 'floor',
        'ar-usdz-max-texture-size': '1024',
        'xr-environment': '',
        'camera-controls': '',
        'touch-action': 'pan-y',
        'camera-orbit': '-35deg 72deg auto',
        'environment-image': 'neutral',
        exposure: '1.05',
        'shadow-intensity': '1',
        'shadow-softness': '0.8',
        loading: 'eager',
        'data-testid': 'ar-model-viewer',
      };
      if (!reduceMotion) attrs['auto-rotate'] = '';
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      el.style.cssText = 'width:100%;height:100%;background:transparent;--poster-color:transparent;';
      // Hide model-viewer's default AR button: our own big button calls activateAR().
      const slot = document.createElement('span');
      slot.slot = 'ar-button';
      slot.hidden = true;
      el.appendChild(slot);
      el.addEventListener('load', () => {
        if (!alive || !el) return;
        const d = el.getDimensions();
        setDims({ x: d.x, y: d.y, z: d.z });
        setStatus('ready');
        // canActivateAR is resolved asynchronously (WebXR support check).
        window.setTimeout(() => alive && el && setCanAR(!!el.canActivateAR), 50);
      });
      el.addEventListener('error', () => alive && setStatus('error'));
      el.addEventListener('ar-status', (e) => {
        if ((e as CustomEvent<{ status: string }>).detail.status === 'failed') setArFailed(true);
      });
      holder.current.appendChild(el);
      mvRef.current = el;
    })().catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
      el?.remove();
      mvRef.current = null;
    };
    // Rebuild only when the machine changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle]);

  useEffect(() => {
    const el = mvRef.current;
    if (el) el.toggleAttribute('auto-rotate', !reduceMotion);
  }, [reduceMotion]);

  // Real size / table size (the scale is kept in WebXR and in the USDZ made for Quick Look).
  const longest = dims ? Math.max(dims.x, dims.y, dims.z) : 0;
  const tableScale = longest > TABLE_MAX ? TABLE_MAX / longest : 1;
  useEffect(() => {
    const s = size === 'table' ? tableScale : 1;
    mvRef.current?.setAttribute('scale', `${s} ${s} ${s}`);
  }, [size, tableScale, status]);

  // QR code for desktops / devices without AR.
  const showQr = !phone || canAR === false;
  useEffect(() => {
    if (!showQr) return;
    let alive = true;
    import('qrcode')
      .then((m) => m.toDataURL(link, { margin: 1, width: 240, errorCorrectionLevel: 'M', color: { dark: '#0b0d12', light: '#ffffff' } }))
      .then((u) => alive && setQr(u))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [showQr, link]);

  const startAR = () => {
    const el = mvRef.current;
    if (!el) return;
    el.activateAR().catch(() => setArFailed(true));
  };

  const fmt = (v: number) => (v >= 1 ? v.toFixed(1) : v.toFixed(2)).replace('.', lang === 'fr' ? ',' : '.');
  const noAR = canAR === false || arFailed;

  return (
    <div ref={dialog} className="fixed inset-0 z-[70] flex flex-col bg-space-950" role="dialog" aria-modal="true" aria-labelledby="ar-title" data-testid="ar-overlay">
      <div className="flex items-center gap-3 px-3 pt-[calc(var(--sat)+12px)] pb-2 sm:px-4">
        <View size={20} className="shrink-0 text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="ar-title" className="font-display truncate text-lg font-semibold">
            {t('arTitle')} · {l(vehicle.name)}
          </h2>
          {dims && (
            <p className="mono truncate text-xs text-ink-500">
              {t('arDims')} : {fmt(dims.x)} × {fmt(dims.z)} × {fmt(dims.y)} m
            </p>
          )}
        </div>
        <button ref={closeBtn} type="button" className="btn glass btn-icon" aria-label={t('arClose')} onClick={onClose} data-testid="ar-close">
          <X size={20} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-[240px] flex-1">
          <div ref={holder} className="absolute inset-0" />
          {status !== 'ready' && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-ink-300" aria-live="polite">
              {status === 'error' ? t('arLoadError') : `${t('arLoading')}`}
            </div>
          )}
        </div>

        <div className="glass mx-3 mb-[calc(var(--sab)+12px)] flex flex-col gap-3 rounded-3xl p-4 sm:mx-4 lg:my-4 lg:w-[340px] lg:self-start">
          <div role="group" aria-label={t('arSizeLabel')} className="flex gap-2">
            {(['real', 'table'] as const).map((m) => (
              <button key={m} type="button" className="btn glass flex-1 px-3 text-sm" aria-pressed={size === m} onClick={() => setSize(m)} disabled={status !== 'ready'}>
                <Ruler size={16} aria-hidden /> {m === 'real' ? t('arRealSize') : t('arTableSize')}
              </button>
            ))}
          </div>

          {canAR && !arFailed && (
            <>
              <p className="text-sm text-ink-100">{t('arHowTo')}</p>
              <button type="button" className="btn btn-primary min-h-[52px] text-base" onClick={startAR} data-testid="ar-start">
                <Smartphone size={18} aria-hidden /> {t('arStart')}
              </button>
              <p className="text-xs text-ink-500">{t('arHowToGestures')}</p>
            </>
          )}

          {noAR && phone && <p className="text-sm text-ink-300">{t('arUnavailable')}</p>}
          {status === 'ready' && !canAR && <p className="text-xs text-ink-500">{t('arPreviewHint')}</p>}

          {showQr && !canAR && (
            <div className="flex items-center gap-4" data-testid="ar-qr">
              <div className="grid h-[132px] w-[132px] shrink-0 place-items-center rounded-2xl bg-white p-1.5">
                {qr ? <img src={qr} alt={t('arScanTitle')} width={120} height={120} className="h-[120px] w-[120px]" /> : null}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-amber-300">{t('arScanTitle')}</p>
                <p className="mt-1 text-sm text-ink-300">{t('arScanText')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
