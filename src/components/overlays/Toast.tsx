import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

export function Toast() {
  const toast = useAppStore((s) => s.toast)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-strong max-w-md rounded-full px-5 py-3 text-center text-[0.82rem] text-fg"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
