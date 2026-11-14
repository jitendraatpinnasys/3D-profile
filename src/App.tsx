import { lazy, Suspense, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { detectQuality } from './utils/device'
import { setAmbient } from './utils/audio'
import { useScrollTimeline } from './hooks/useScrollTimeline'
import { useRevealAnimations } from './animations/reveal'
import { Home } from './pages/Home'
import { Navbar } from './components/navigation/Navbar'
import { WorldRail } from './components/navigation/WorldRail'
import { Loader } from './components/overlays/Loader'
import { DetailPanel } from './components/overlays/DetailPanel'
import { Toast } from './components/overlays/Toast'

// The 3D world is code-split and loaded lazily so content is available immediately.
const World = lazy(() => import('./scenes/World'))

export default function App() {
  const quality = useAppStore((s) => s.quality)
  const setQuality = useAppStore((s) => s.setQuality)
  const worldEnabled = useAppStore((s) => s.worldEnabled)
  const soundOn = useAppStore((s) => s.soundOn)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    setQuality(detectQuality())
    let last = window.innerWidth
    const onResize = () => {
      // only re-evaluate when crossing the phone breakpoint
      const w = window.innerWidth
      if ((w < 768) !== (last < 768)) setQuality(detectQuality())
      last = w
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [setQuality])

  useEffect(() => setAmbient(soundOn), [soundOn])

  const canRender3D = quality !== 'none'
  const show3D = canRender3D && worldEnabled

  useScrollTimeline()
  useRevealAnimations([show3D])

  return (
    <div className={show3D ? 'has-world' : 'no-world'}>
      {show3D ? (
        <Suspense fallback={<div className="world-fallback" />}>
          <World quality={quality as 'high' | 'medium'} />
        </Suspense>
      ) : (
        <div className="world-fallback" aria-hidden="true" />
      )}
      <Navbar />
      <WorldRail canRender3D={canRender3D} />
      <Home world={show3D} />
      <DetailPanel />
      <Toast />
      <Loader with3D={show3D} />
    </div>
  )
}
