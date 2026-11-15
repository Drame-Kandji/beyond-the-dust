import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMedia';
import { useT } from '../../i18n/useT';

/** Right-side glass panel on desktop, draggable bottom sheet on mobile. */
export function ResponsivePanel({ open, onClose, title, eyebrow, children, footer, labelledBy }: { open: boolean; onClose: () => void; title: ReactNode; eyebrow?: ReactNode; children: ReactNode; footer?: ReactNode; labelledBy: string }) {
  const mobile = useIsMobile();
  const { t } = useT();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const header = (
    <div className={`surface-divider flex items-start gap-3 border-b ${mobile ? 'px-5 pt-1 pb-3.5' : 'px-6 pt-5 pb-4'}`}>
      <div className="min-w-0 flex-1">
        {eyebrow && <div className="eyebrow mb-1.5 text-ink-300">{eyebrow}</div>}
        <h2 id={labelledBy} className={`font-display leading-[1.15] font-semibold text-ink-100 ${mobile ? 'text-[1.3rem]' : 'text-[1.5rem]'}`}>
          {title}
        </h2>
      </div>
      <button className="btn btn-icon -mt-1 -mr-1.5 shrink-0 border-white/12 bg-white/[0.06] text-ink-200 hover:text-ink-100" onClick={onClose} aria-label={t('close')}>
        <X size={20} />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {open &&
        (mobile ? (
          <motion.section
            key="sheet"
            role="dialog"
            aria-labelledby={labelledBy}
            className="surface surface-solid fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-[28px] border-b-0"
            style={{ height: expanded ? '86dvh' : '56dvh', paddingBottom: 'var(--sab)', transition: 'height .3s ease' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.15, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110) onClose();
              else if (info.offset.y < -50) setExpanded(true);
              else if (info.offset.y > 40) setExpanded(false);
            }}
          >
            <button className="w-full shrink-0 cursor-grab pt-2.5 pb-2" onClick={() => setExpanded((e) => !e)} aria-label={t('resizePanel')} aria-expanded={expanded}>
              <div className="sheet-handle" />
            </button>
            {header}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-5" onPointerDownCapture={(e) => e.stopPropagation()}>
              {children}
            </div>
            {footer && <div className="surface-divider shrink-0 border-t bg-black/25 px-4 py-2.5">{footer}</div>}
          </motion.section>
        ) : (
          <motion.section
            key="side"
            role="dialog"
            aria-labelledby={labelledBy}
            className="surface fixed top-20 right-4 bottom-24 z-40 flex w-[min(460px,40vw)] min-w-[360px] flex-col overflow-hidden rounded-[26px]"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {header}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-6 pt-5 pb-6">{children}</div>
            {footer && <div className="surface-divider shrink-0 border-t bg-black/25 px-5 py-3">{footer}</div>}
          </motion.section>
        ))}
    </AnimatePresence>
  );
}
