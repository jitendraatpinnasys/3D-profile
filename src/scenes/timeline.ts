import type { SectionId } from '../types'
import { experience } from '../data/experience'
import { projects } from '../data/projects'

/**
 * Camera timeline metadata — deliberately free of three.js so the DOM layer can
 * use it without pulling the 3D engine into the initial bundle.
 * Each stop is bound to a DOM anchor element: when that element is centred in
 * the viewport, the camera arrives at the matching 3D station.
 */
export interface TimelineStop {
  id: string
  section: SectionId
  anchor: string
}

export const timeline: TimelineStop[] = [
  { id: 'home', section: 'home', anchor: 'kf-home' },
  { id: 'about', section: 'about', anchor: 'kf-about' },
  { id: 'skills', section: 'skills', anchor: 'kf-skills' },
  ...experience.map((e) => ({ id: `exp-${e.id}`, section: 'experience' as SectionId, anchor: `kf-exp-${e.id}` })),
  ...projects.map((p) => ({ id: `proj-${p.id}`, section: 'projects' as SectionId, anchor: `kf-proj-${p.id}` })),
  { id: 'cert', section: 'certifications', anchor: 'kf-cert' },
  { id: 'contact', section: 'contact', anchor: 'kf-contact' },
]

/** +1 → 3D object shown on the right of the screen, DOM card on the left. */
export const sideFor = (i: number): 1 | -1 => (i % 2 === 0 ? 1 : -1)
