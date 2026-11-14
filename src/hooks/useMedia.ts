import { useEffect, useState } from 'react';

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const useIsMobile = () => useMedia('(max-width: 767px)');

let webgl: boolean | null = null;
export function hasWebGL() {
  if (webgl !== null) return webgl;
  if (new URLSearchParams(window.location.search).has('no3d')) return (webgl = false);
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  return webgl;
}
