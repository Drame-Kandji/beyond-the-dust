import type { Fact } from '../../data/types';
import { SOURCES } from '../../data/sources';
import { useT } from '../../i18n/useT';

/** A sourced number. Values still being double-checked show a small amber dot. */
export function FactValue({ fact, big = false }: { fact: Fact; big?: boolean }) {
  const { l, t } = useT();
  const src = SOURCES[fact.sourceId];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className={`mono font-semibold text-amber-300 ${big ? 'text-2xl' : 'text-lg'}`}>
        {fact.value}
        {fact.verify && <span className="verify-dot" role="img" title={t('toVerify')} aria-label={t('toVerify')} />}
      </div>
      <div className="mt-0.5 text-sm leading-snug text-ink-300">{l(fact.label)}</div>
      {src && (
        <a href={src.url} target="_blank" rel="noreferrer" className="mt-0.5 block truncate py-1.5 text-xs text-ink-500 underline decoration-white/20 hover:text-ink-300">
          {t('source')}: {src.publisher}
        </a>
      )}
    </div>
  );
}
