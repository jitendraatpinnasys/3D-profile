import { useEffect } from 'react'
import { timeline as keyframes } from '../scenes/timeline'
import { navigation } from '../data/navigation'
import { scrollState } from '../utils/scrollState'
import { useAppStore } from '../store/useAppStore'

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Maps the page scroll position onto the camera keyframe timeline.
 * Each keyframe is "reached" when its DOM anchor is centred in the viewport;
 * between anchors the camera travels, with a short dwell at each station.
 */
export function useScrollTimeline() {
  useEffect(() => {
    let anchors: number[] = []
    let heroTop = 0
    let heroSpan = 1
    const sectionIndex = keyframes.map((k) => navigation.findIndex((n) => n.id === k.section))

    const measure = () => {
      const vh = window.innerHeight
      const maxScroll = document.documentElement.scrollHeight - vh
      const hero = document.getElementById('home')
      if (hero) {
        heroTop = hero.offsetTop
        heroSpan = Math.max(1, hero.offsetHeight - vh)
      }
      let prev = -Infinity
      anchors = keyframes.map((k, i) => {
        const el = document.getElementById(k.anchor)
        let a = 0
        if (el) {
          const r = el.getBoundingClientRect()
          const top = r.top + window.scrollY
          a = i === 0 ? heroTop + heroSpan : top + r.height / 2 - vh / 2
        }
        a = Math.min(Math.max(a, 0), maxScroll)
        a = Math.max(a, prev + 1)
        prev = a
        return a
      })
      update()
    }

    const update = () => {
      const y = window.scrollY
      scrollState.hero = Math.min(1, Math.max(0, (y - heroTop) / heroSpan))
      useAppStore.getState().setHeroSlide(Math.min(2, Math.floor(scrollState.hero * 3)))

      let s = 0
      if (anchors.length) {
        if (y <= anchors[0]) s = 0
        else if (y >= anchors[anchors.length - 1]) s = anchors.length - 1
        else {
          for (let i = 0; i < anchors.length - 1; i++) {
            if (y < anchors[i + 1]) {
              const f = (y - anchors[i]) / (anchors[i + 1] - anchors[i])
              s = i + smoothstep(0.1, 0.9, f)
              break
            }
          }
        }
      }
      scrollState.target = s
      const kf = Math.round(s)
      // the hero owns the top of the page until its scrub is complete
      const section = y < heroTop + heroSpan * 0.98 ? 0 : Math.max(0, sectionIndex[kf])
      useAppStore.getState().setActive(section, kf)
    }

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    measure()

    const onPointer = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])
}
