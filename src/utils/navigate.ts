import { prefersReducedMotion } from './device'

/** Scroll so an element's centre sits in the viewport centre (or its top for tall blocks). */
export function scrollToElement(el: HTMLElement | null) {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  const top = window.scrollY + rect.top
  const target = rect.height > vh ? top : top - (vh - rect.height) / 2
  window.scrollTo({ top: Math.max(0, target), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToSection(id: string) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    return
  }
  const section = document.getElementById(id)
  const anchor = section?.querySelector<HTMLElement>('[data-nav-target]') ?? section
  scrollToElement(anchor ?? null)
}
