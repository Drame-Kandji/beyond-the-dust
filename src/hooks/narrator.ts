/**
 * Single global narrator: plays an mp3 if it exists, otherwise falls back to the browser's
 * speechSynthesis. Exposes the current sentence for synchronised captions.
 */
import { create } from 'zustand';
import type { Lang } from '../data/types';

interface NarratorState {
  id: string | null;
  playing: boolean;
  paused: boolean;
  progress: number; // 0..1
  sentences: string[];
  index: number;
}

export const useNarrator = create<NarratorState>(() => ({
  id: null,
  playing: false,
  paused: false,
  progress: 0,
  sentences: [],
  index: -1,
}));

let audio: HTMLAudioElement | null = null;
let ttsQueue: SpeechSynthesisUtterance[] = [];
let ttsTimer: number | undefined;
let token = 0;

const split = (text: string) => text.match(/[^.!?…]+[.!?…]+["”»]?\s*|[^.!?…]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];

export function stopNarration() {
  token++;
  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
  ttsQueue = [];
  window.clearInterval(ttsTimer);
  useNarrator.setState({ id: null, playing: false, paused: false, progress: 0, index: -1, sentences: [] });
}

function pickVoice(lang: Lang) {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const wanted = lang === 'fr' ? 'fr' : 'en';
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(wanted) && /natural|google|premium|enhanced/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(wanted)) ??
    null
  );
}

function captionsOnly(id: string, sentences: string[], my: number) {
  let i = 0;
  window.speechSynthesis?.cancel();
  useNarrator.setState({ id, playing: true, paused: false, sentences, index: 0, progress: 0 });
  window.clearInterval(ttsTimer);
  ttsTimer = window.setInterval(() => {
    if (my !== token || useNarrator.getState().paused) return;
    i++;
    if (i >= sentences.length) return stopNarration();
    useNarrator.setState({ index: i, progress: i / sentences.length });
  }, 3200);
}

function speak(id: string, sentences: string[], lang: Lang, my: number) {
  const synth = window.speechSynthesis;
  if (synth) {
    // Some devices have speechSynthesis but no voice: fall back to captions if nothing starts.
    window.setTimeout(() => {
      if (my === token && useNarrator.getState().playing && !started) captionsOnly(id, sentences, my);
    }, 1800);
  }
  let started = false;
  if (!synth) {
    // No audio at all: still show captions, advancing by reading time.
    let i = 0;
    useNarrator.setState({ id, playing: true, paused: false, sentences, index: 0, progress: 0 });
    ttsTimer = window.setInterval(() => {
      if (my !== token) return;
      i++;
      if (i >= sentences.length) return stopNarration();
      useNarrator.setState({ index: i, progress: i / sentences.length });
    }, 3200);
    return;
  }
  synth.cancel();
  const voice = pickVoice(lang);
  ttsQueue = sentences.map((s, i) => {
    const u = new SpeechSynthesisUtterance(s);
    u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.pitch = 1;
    u.onstart = () => {
      started = true;
      if (my === token) useNarrator.setState({ index: i, progress: i / sentences.length });
    };
    u.onend = () => {
      if (my !== token) return;
      if (i === sentences.length - 1) stopNarration();
    };
    return u;
  });
  useNarrator.setState({ id, playing: true, paused: false, sentences, index: 0, progress: 0 });
  ttsQueue.forEach((u) => synth.speak(u));
}

export function playNarration(id: string, text: string, lang: Lang, src?: string) {
  stopNarration();
  const my = token;
  const sentences = split(text);
  if (!src) return speak(id, sentences, lang, my);

  const a = new Audio();
  audio = a;
  a.preload = 'auto';
  let started = false;
  a.onloadedmetadata = () => {
    if (my !== token) return;
    started = true;
    useNarrator.setState({ id, playing: true, paused: false, sentences, index: 0, progress: 0 });
    a.play().catch(() => speak(id, sentences, lang, my));
  };
  a.ontimeupdate = () => {
    if (my !== token || !a.duration) return;
    const p = a.currentTime / a.duration;
    // Approximate caption sync by character count.
    const total = sentences.join(' ').length;
    let acc = 0;
    let idx = 0;
    for (let i = 0; i < sentences.length; i++) {
      acc += sentences[i].length + 1;
      if (acc / total >= p) {
        idx = i;
        break;
      }
    }
    useNarrator.setState({ progress: p, index: idx });
  };
  a.onended = () => my === token && stopNarration();
  a.onerror = () => {
    if (my !== token) return;
    audio = null;
    if (!started) speak(id, sentences, lang, my);
  };
  a.src = src;
}

export function togglePause() {
  const s = useNarrator.getState();
  if (!s.playing) return;
  if (audio) {
    if (audio.paused) audio.play();
    else audio.pause();
  } else if (window.speechSynthesis) {
    if (s.paused) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
  }
  useNarrator.setState({ paused: !s.paused });
}

export function seekNarration(p: number) {
  if (audio && audio.duration) audio.currentTime = p * audio.duration;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopNarration();
  });
}
