import type { Quality } from '../store/useAppStore'

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Desktop → full world, tablet → reduced world, phone / no WebGL → 2D fallback. */
export function detectQuality(): Quality {
  if (!hasWebGL()) return 'none'
  const w = window.innerWidth
  if (w < 768) return 'none'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 4
  if (w < 1100 || coarse || cores <= 4) return 'medium'
  return 'high'
}
