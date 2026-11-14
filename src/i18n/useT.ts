import { useCallback } from 'react';
import type { L10n } from '../data/types';
import { useAppStore } from '../store/useAppStore';
import { STRINGS, type StringKey } from './strings';

/** `t('key')` for UI strings, `l(obj)` for bilingual content objects. */
export function useT() {
  const lang = useAppStore((s) => s.lang);
  const t = useCallback((k: StringKey) => STRINGS[lang][k], [lang]);
  const l = useCallback((o: L10n) => o[lang], [lang]);
  return { t, l, lang };
}
