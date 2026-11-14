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
    <div className="flex items-start gap-3 px-5 pt-3 pb-3">
      <div className="min-w-0 flex-1">
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h2 id={labelledBy} className="font-display text-[1.45rem] leading-tight text-ink-100">
          {title}
        </h2>
      </div>
      <button className="btn btn-icon btn-ghost -mr-2 shrink-0" onClick={onClose} aria-label={t('close')}>
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
            className="glass fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl"
            style={{ height: expanded ? '86dvh' : '52dvh', paddingBottom: 'var(--sab)', transition: 'height .3s ease' }}
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
            <button className="w-full cursor-grab py-2.5" onClick={() => setExpanded((e) => !e)} aria-label={t('resizePanel')} aria-expanded={expanded}>
              <div className="sheet-handle" />
            </button>
            {header}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4" onPointerDownCapture={(e) => e.stopPropagation()}>
              {children}
            </div>
            {footer && <div className="border-t border-white/10 px-4 py-2.5">{footer}</div>}
          </motion.section>
        ) : (
          <motion.section
            key="side"
            role="dialog"
            aria-labelledby={labelledBy}
            className="glass fixed top-20 right-4 bottom-24 z-40 flex w-[min(440px,40vw)] flex-col rounded-3xl"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {header}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
            {footer && <div className="border-t border-white/10 px-4 py-3">{footer}</div>}
          </motion.section>
        ))}
    </AnimatePresence>
  );
}
