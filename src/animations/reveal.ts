import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/device'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-triggered reveals for every [data-reveal] element, plus a scrubbed
 * parallax on the giant CONTACT word. Disabled for reduced-motion users.
 */
export function useRevealAnimations(deps: unknown[] = []) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0, filter: 'blur(6px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
          },
        )
      })
      gsap.fromTo(
        '.contact-giant',
        { xPercent: -8, letterSpacing: '0.04em' },
        { xPercent: 4, letterSpacing: '-0.05em', ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'center center', scrub: true } },
      )
    })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
