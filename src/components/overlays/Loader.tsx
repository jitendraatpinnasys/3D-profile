import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { profile } from '../../data/profile'
import { useAppStore } from '../../store/useAppStore'
import { scrollState } from '../../utils/scrollState'
import { prefersReducedMotion } from '../../utils/device'

const BOOT = ['Loading profile data', 'Building the world', 'Compiling shaders', 'Calibrating camera path']

/** Loading screen. The first interaction ("Enter") starts the immersive experience. */
export function Loader({ with3D }: { with3D: boolean }) {
  const entered = useAppStore((s) => s.entered)
  const sceneReady = useAppStore((s) => s.sceneReady)
  const enter = useAppStore((s) => s.enter)
  const [progress, setProgress] = useState(0)
  const [fontsReady, setFontsReady] = useState(false)
  const ready = fontsReady && (!with3D || sceneReady)

  useEffect(() => {
    void document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (ready ? Math.min(100, p + 12) : Math.min(88, p + Math.max(0.6, (88 - p) * 0.06))))
    }, 60)
    return () => window.clearInterval(id)
  }, [ready])

  useEffect(() => {
    document.body.classList.toggle('locked', !entered)
  }, [entered])

  const done = progress >= 100

  const start = () => {
    enter()
    if (prefersReducedMotion()) scrollState.intro = 1
    else gsap.to(scrollState, { intro: 1, duration: 2.8, ease: 'power2.inOut' })
  }

  // keyboard: Enter / Space starts once loaded
  useEffect(() => {
    if (!done || entered) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        start()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, entered])

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Loading"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,rgb(139_123_255/0.16),transparent_70%)]" aria-hidden="true" />
          <p className="mono-label text-dim">// Initializing</p>
          <h1 className="display mt-5 text-center text-[clamp(2.6rem,9vw,6.5rem)]">
            <span className="display-3d">{profile.firstName}</span>
            <span className="display-3d-dim">.space</span>
          </h1>
          <p className="mono-label mt-5 text-fg/70">Beyond code, into intelligence</p>

          <div className="mt-14 w-full max-w-sm">
            <div className="flex justify-between font-mono text-[0.65rem] text-dim">
              <span>{done ? 'World ready' : BOOT[Math.min(BOOT.length - 1, Math.floor((progress / 100) * BOOT.length))]}…</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-px w-full bg-white/10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-gradient-to-r from-blue to-violet transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-10 h-12">
            {done && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={start}
                className="btn btn-light"
                autoFocus
              >
                Enter the World <ArrowRight size={15} aria-hidden="true" />
              </motion.button>
            )}
          </div>
          <p className="absolute bottom-8 font-mono text-[0.62rem] text-dim">
            {profile.name} · {profile.titles[0]} &amp; {profile.titles[1]}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
