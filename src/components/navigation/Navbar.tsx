import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { profile } from '../../data/profile'
import { useAppStore } from '../../store/useAppStore'
import { scrollToSection } from '../../utils/navigate'
import { LinkedInButton, ResumeButton } from '../ui/Actions'

export function Navbar() {
  const active = useAppStore((s) => s.activeSection)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <>
      <a href="#about" className="sr-only z-[100] rounded bg-fg px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/55 backdrop-blur-xl">
        <nav aria-label="Primary" className="flex h-16 items-center justify-between px-5 sm:px-10 lg:px-16">
          <button type="button" onClick={() => go('home')} className="text-[1.15rem] font-extrabold tracking-tight" aria-label={`${profile.name} — back to start`}>
            {profile.firstName}
            <span className="text-violet">.</span>
          </button>

          <ul className="hidden items-center gap-7 lg:flex">
            {navigation.map((n, i) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => go(n.id)}
                  aria-current={active === i ? 'true' : undefined}
                  className={`relative text-[0.8rem] font-semibold transition-colors ${active === i ? 'text-fg' : 'text-fg/55 hover:text-fg'}`}
                >
                  {n.label}
                  {active === i && <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet" />}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go('contact')} className="btn btn-dark !px-4 !py-2 !text-xs">
              Hire Me
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-line lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
              <Menu size={17} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 px-6 pb-10 pt-5 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold">
                {profile.firstName}
                <span className="text-violet">.</span>
              </span>
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-line" onClick={() => setOpen(false)} aria-label="Close menu" autoFocus>
                <X size={18} />
              </button>
            </div>
            <ul className="mt-10 flex-1 space-y-1">
              {navigation.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <button type="button" onClick={() => go(n.id)} className="flex w-full items-baseline gap-4 py-2 text-left">
                    <span className="font-mono text-xs text-dim">0{i + 1}</span>
                    <span className={`text-4xl font-extrabold tracking-tight ${active === i ? 'text-fg' : 'text-fg/50'}`}>{n.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <ResumeButton />
              <LinkedInButton variant="light" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
