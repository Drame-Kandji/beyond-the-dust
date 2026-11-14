import { NON_ENDORSEMENT } from '../../data/sources';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';

export function Footer({ className = '' }: { className?: string }) {
  const { t } = useT();
  const setScreen = useAppStore((s) => s.setScreen);
  return (
    <footer className={`text-xs leading-relaxed text-ink-500 ${className}`}>
      <p>{NON_ENDORSEMENT}</p>
      <p className="mt-1">{t('aiNote')}</p>
      <div className="mt-1 flex flex-wrap gap-x-5">
        <button className="min-h-[44px] underline hover:text-ink-300" onClick={() => setScreen('sources')}>
          {t('sourcesCredits')}
        </button>
        <button className="min-h-[44px] underline hover:text-ink-300" onClick={() => setScreen('teachers')}>
          {t('teachers')}
        </button>
      </div>
    </footer>
  );
}
