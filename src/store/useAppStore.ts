import { create } from 'zustand';
import type { DestinationId, Lang, Vec3, VehicleId } from '../data/types';
import { VEHICLES } from '../data';

export type Screen = 'intro' | 'hub' | 'machine' | 'teachers' | 'sources';
export type Panel = 'part' | 'story' | 'quiz' | 'signal' | 'ask' | null;

interface Settings {
  lang: Lang;
  reduceMotion: boolean;
  largeText: boolean;
  muted: boolean;
}

interface CameraRequest {
  position: Vec3;
  target: Vec3;
  nonce: number;
}

interface AppState extends Settings {
  screen: Screen;
  destination: DestinationId;
  vehicleId: VehicleId | null;
  teleporting: boolean;
  panel: Panel;
  selectedPart: string | null;
  exploded: boolean;
  xray: boolean;
  touring: boolean;
  storm: boolean;
  spin: boolean;
  plaqueOpen: boolean;
  passport: VehicleId[];
  camera: CameraRequest | null;
  demo: boolean;
  /** The machine's life story, told before the parts (see BiographyIntro). */
  bio: boolean;
  /** Current step of the unified tour (life story + parts) and whether it narrates by itself. */
  bioStep: number;
  bioAuto: boolean;
  /** Move the camera to a part and highlight it, without opening the part panel. */
  focusPart: (id: string | null) => void;

  setScreen: (s: Screen) => void;
  setDestination: (d: DestinationId) => void;
  openVehicle: (id: VehicleId) => void;
  finishTeleport: () => void;
  leave: () => void;
  setPanel: (p: Panel) => void;
  selectPart: (id: string | null) => void;
  stepPart: (dir: 1 | -1) => void;
  toggle: (k: 'exploded' | 'xray' | 'touring' | 'storm' | 'spin' | 'plaqueOpen') => void;
  set: (p: Partial<AppState>) => void;
  resetCamera: () => void;
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  stamp: (id: VehicleId) => void;
}

const KEY = 'btd-settings-v1';

function load(): Partial<Settings & { passport: VehicleId[] }> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function save(s: AppState) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ lang: s.lang, reduceMotion: s.reduceMotion, largeText: s.largeText, muted: s.muted, passport: s.passport }),
    );
  } catch {
    /* storage unavailable: ignore */
  }
}

const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const saved = load();
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const urlLang = params.get('lang');

function hasUserActivation() {
  try {
    return (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? false;
  } catch {
    return false;
  }
}

/** The life story opens once per vehicle and browser session. */
export function bioSeen(id: VehicleId) {
  try {
    return sessionStorage.getItem(`btd-bio-${id}`) === '1';
  } catch {
    return false;
  }
}
export function markBioSeen(id: VehicleId) {
  try {
    sessionStorage.setItem(`btd-bio-${id}`, '1');
  } catch {
    /* storage unavailable: ignore */
  }
}

let nonce = 0;
const cam = (position: Vec3, target: Vec3): CameraRequest => ({ position, target, nonce: ++nonce });

export const useAppStore = create<AppState>((set, get) => ({
  lang: (urlLang === 'fr' || urlLang === 'en' ? urlLang : saved.lang) ?? 'en',
  reduceMotion: saved.reduceMotion ?? !!prefersReduced,
  largeText: saved.largeText ?? false,
  muted: saved.muted ?? false,
  passport: saved.passport ?? [],
  screen: 'intro',
  destination: 'mars',
  vehicleId: null,
  teleporting: false,
  panel: null,
  selectedPart: null,
  exploded: false,
  xray: false,
  touring: false,
  storm: false,
  spin: false,
  plaqueOpen: false,
  camera: null,
  demo: params.has('demo'),
  bio: false,
  bioStep: 0,
  bioAuto: false,

  setScreen: (screen) => set({ screen }),
  setDestination: (destination) => set({ destination }),
  openVehicle: (id) =>
    set({
      vehicleId: id,
      destination: VEHICLES[id].destination,
      screen: 'machine',
      teleporting: true,
      panel: null,
      selectedPart: null,
      exploded: false,
      xray: false,
      touring: false,
      storm: false,
      spin: false,
      plaqueOpen: false,
      camera: null,
      bio: !get().demo && !bioSeen(id),
      bioStep: 0,
      bioAuto: !get().demo && !bioSeen(id) && hasUserActivation(),
    }),
  finishTeleport: () => set({ teleporting: false }),
  leave: () =>
    set({ screen: 'hub', vehicleId: null, bio: false, panel: null, selectedPart: null, touring: false, storm: false, spin: false, plaqueOpen: false, exploded: false, xray: false }),
  setPanel: (panel) => set({ panel, touring: panel === 'part' ? get().touring : false }),
  focusPart: (id) => {
    const v = get().vehicleId ? VEHICLES[get().vehicleId!] : null;
    if (!v) return;
    const p = id ? v.parts.find((x) => x.id === id) : null;
    const c = p ? p.camera : v.model.defaultCamera;
    set({ selectedPart: p ? p.id : null, camera: get().exploded ? null : cam(c.position, c.target) });
  },
  selectPart: (id) => {
    const v = get().vehicleId ? VEHICLES[get().vehicleId!] : null;
    if (!v) return;
    if (!id) {
      set({ selectedPart: null, panel: get().panel === 'part' ? null : get().panel, camera: cam(v.model.defaultCamera.position, v.model.defaultCamera.target) });
      return;
    }
    const p = v.parts.find((x) => x.id === id);
    if (!p) return;
    set({ selectedPart: id, panel: 'part', camera: get().exploded ? null : cam(p.camera.position, p.camera.target) });
  },
  stepPart: (dir) => {
    const v = get().vehicleId ? VEHICLES[get().vehicleId!] : null;
    if (!v) return;
    const i = v.parts.findIndex((p) => p.id === get().selectedPart);
    const n = v.parts.length;
    const next = v.parts[(i + dir + n) % n] ?? v.parts[0];
    get().selectPart(next.id);
  },
  toggle: (k) => set({ [k]: !get()[k] } as Partial<AppState>),
  set: (p) => set(p),
  resetCamera: () => {
    const v = get().vehicleId ? VEHICLES[get().vehicleId!] : null;
    if (v) set({ camera: cam(v.model.defaultCamera.position, v.model.defaultCamera.target) });
  },
  setSetting: (k, v) => {
    set({ [k]: v } as Partial<AppState>);
    save(get());
  },
  stamp: (id) => {
    if (!get().passport.includes(id)) {
      set({ passport: [...get().passport, id] });
      save(get());
    }
  },
}));
