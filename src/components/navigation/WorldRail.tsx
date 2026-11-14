import { useEffect, useRef } from 'react'
import { Box, Home, Square, Volume2, VolumeX } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { useAppStore } from '../../store/useAppStore'
import { scrollToSection } from '../../utils/navigate'

/**
 * 3D navigation: a vertical progress rail with one jump-point per environment,
 * the current world name, and world controls (sound, 3D on/off, return to start).
 */
export function WorldRail({ canRender3D }: { canRender3D: boolean }) {
  const active = useAppStore((s) => s.activeSection)
  const soundOn = useAppStore((s) => s.soundOn)
  const toggleSound = useAppStore((s) => s.toggleSound)
  const worldEnabled = useAppStore((s) => s.worldEnabled)
  const toggleWorld = useAppStore((s) => s.toggleWorld)
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (fill.current) fill.current.style.transform = `scaleY(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* progress + jump points */}
      <nav aria-label="World navigation" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <div className="relative flex flex-col items-center gap-4 py-2">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" aria-hidden="true">
            <div ref={fill} className="h-full w-full origin-top bg-gradient-to-b from-blue to-violet" style={{ transform: 'scaleY(0)' }} />
          </div>
          {navigation.map((n, i) => (
            <button key={n.id} type="button" onClick={() => scrollToSection(n.id)} className="group relative grid h-4 w-4 place-items-center" aria-label={`Go to ${n.world} (${n.label})`} aria-current={active === i ? 'true' : undefined}>
              <span className={`block rounded-full transition-all duration-300 ${active === i ? 'h-2.5 w-2.5 bg-fg shadow-[0_0_12px_rgba(255,255,255,0.7)]' : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white/80'}`} />
              <span className="glass-strong mono-label pointer-events-none absolute right-6 whitespace-nowrap rounded-lg px-2.5 py-1.5 !text-[0.58rem] text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                0{i + 1} · {n.world}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* world name HUD */}
      <div
        className={`mono-label pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-2.5 text-fg/70 transition-opacity duration-500 sm:left-10 md:flex lg:left-16 ${active === 0 || active === navigation.length - 1 ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_10px_#8b7bff]" />
        0{active + 1} / 0{navigation.length} — {navigation[active]?.world}
      </div>

      {/* controls */}
      <div className="fixed bottom-4 right-3 z-40 flex flex-col gap-2" role="group" aria-label="World controls">
        <button type="button" onClick={toggleSound} className="glass grid h-9 w-9 place-items-center rounded-full text-fg/80 hover:text-fg" aria-pressed={soundOn} aria-label={soundOn ? 'Mute ambient sound' : 'Play ambient sound'} title={soundOn ? 'Sound on' : 'Sound off'}>
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        {canRender3D && (
          <button type="button" onClick={toggleWorld} className="glass grid h-9 w-9 place-items-center rounded-full text-fg/80 hover:text-fg" aria-pressed={worldEnabled} aria-label={worldEnabled ? 'Switch to 2D view' : 'Switch to 3D world'} title={worldEnabled ? '3D world on' : '3D world off'}>
            {worldEnabled ? <Box size={15} /> : <Square size={15} />}
          </button>
        )}
        <button type="button" onClick={() => scrollToSection('home')} className="glass grid h-9 w-9 place-items-center rounded-full text-fg/80 hover:text-fg" aria-label="Return to the starting environment" title="Back to start">
          <Home size={15} />
        </button>
      </div>
    </>
  )
}
