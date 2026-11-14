/**
 * Procedural ambient sound with Web Audio (no audio assets): filtered noise per place,
 * plus a small UI "ping". Never starts before a user gesture.
 */
import type { DestinationId } from '../data/types';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let current: { stop: () => void } | null = null;
let muted = false;

const userActivated = () => (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? true;

function ensure() {
  if (ctx) return ctx;
  if (!userActivated()) return null; // browsers block audio before a user gesture
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

function noiseBuffer(c: AudioContext) {
  const len = c.sampleRate * 3;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02; // brown-ish noise
    d[i] = last * 3.5;
  }
  return buf;
}

export function setAmbientMuted(m: boolean) {
  muted = m;
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.5, ctx.currentTime, 0.2);
}

export function playAmbient(place: DestinationId | 'hub' | null) {
  current?.stop();
  current = null;
  if (!place) return;
  const c = ensure();
  if (!c || !master) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  gain.gain.value = 0;
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  if (place === 'mars') {
    filter.type = 'bandpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.6;
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 260;
    lfoGain.connect(filter.frequency);
  } else if (place === 'deep-space') {
    filter.type = 'lowpass';
    filter.frequency.value = 160;
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 0.05;
    lfoGain.connect(gain.gain);
  } else {
    filter.type = 'lowpass';
    filter.frequency.value = place === 'hub' ? 240 : 110;
    lfo.frequency.value = 0.03;
    lfoGain.gain.value = 0.03;
    lfoGain.connect(gain.gain);
  }
  lfo.connect(lfoGain);
  src.connect(filter).connect(gain).connect(master);
  const level = place === 'mars' ? 0.22 : place === 'deep-space' ? 0.12 : 0.1;
  gain.gain.setTargetAtTime(level, c.currentTime, 1.2);
  src.start();
  lfo.start();
  current = {
    stop: () => {
      gain.gain.setTargetAtTime(0, c.currentTime, 0.4);
      window.setTimeout(() => {
        try {
          src.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
      }, 1500);
    },
  };
}

export function ping(freq = 880) {
  const c = ensure();
  if (!c || !master || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.12, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5);
  o.connect(g).connect(master);
  o.start();
  o.stop(c.currentTime + 0.55);
}

/** Radio "beep-beep" for the signal animation. */
export function beep() {
  ping(1320);
  window.setTimeout(() => ping(1320), 160);
}
