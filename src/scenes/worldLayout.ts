import * as THREE from 'three'
import type { SectionId } from '../types'
import { experience } from '../data/experience'
import { projects } from '../data/projects'
import { sideFor, timeline } from './timeline'

/**
 * WORLD LAYOUT — one continuous space. Environments sit along a winding path
 * heading into -Z. The camera travels between keyframes; each keyframe is bound
 * to a DOM anchor element (see timeline.ts) so content and camera stay in sync.
 *
 * The career corridor and the project showroom are aisles: stations alternate
 * left/right of a central lane and the camera stays in the lane, turning to face
 * each station — it never flies through an exhibit.
 */

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

export const EXPERIENCE_SPACING = 16
export const PROJECT_SPACING = 16
export const EXP_AISLE_X = -6
export const PROJ_AISLE_X = 6
const EXP_OFFSET = 2.4
const PROJ_OFFSET = 3.8

const expStartZ = -80
const projStartZ = expStartZ - experience.length * EXPERIENCE_SPACING - 14

export const WORLD = {
  home: v(0, 0, 0),
  about: v(-7, 0, -24),
  lab: v(0, 0, -52),
  experience: experience.map((_, i) => v(EXP_AISLE_X + sideFor(i) * EXP_OFFSET, 0, expStartZ - i * EXPERIENCE_SPACING)),
  projects: projects.map((_, i) => v(PROJ_AISLE_X + sideFor(i) * PROJ_OFFSET, 0, projStartZ - i * PROJECT_SPACING)),
}
const lastProjectZ = WORLD.projects[WORLD.projects.length - 1]?.z ?? -150
export const CERT_POS = v(0, 0.3, lastProjectZ - 26)
export const CONTACT_POS = v(0, 0, CERT_POS.z - 26)

export { sideFor } from './timeline'

export interface Keyframe {
  id: string
  section: SectionId
  anchor: string
  pos: THREE.Vector3
  look: THREE.Vector3
}

/**
 * Frame an object so it sits on one side of the screen (side +1 → right).
 * camShift moves the camera, lookShift moves the aim point; using different
 * values gives an angled, cinematic view instead of a flat front-on shot.
 */
function framed(obj: THREE.Vector3, side: number, dist: number, h: number, camShift: number, lookShift = camShift) {
  return {
    pos: v(obj.x - side * camShift, obj.y + h, obj.z + dist),
    look: v(obj.x - side * lookShift, obj.y + 0.15, obj.z),
  }
}

const positions: Record<string, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  home: { pos: v(0, 0.15, 9), look: v(0, 0.1, 0) },
  // deck framed on the left so it glows behind the DOM photo card, away from the text
  about: framed(WORLD.about, -1, 9, 1.0, 3.4),
  skills: { pos: v(WORLD.lab.x, 2.6, WORLD.lab.z + 12.5), look: v(WORLD.lab.x, 0.35, WORLD.lab.z) },
  cert: framed(CERT_POS, 1, 7.4, 0.5, 2.3),
  contact: { pos: v(0, 0.5, CONTACT_POS.z + 11), look: v(0, 0.6, CONTACT_POS.z) },
}
experience.forEach((e, i) => {
  positions[`exp-${e.id}`] = framed(WORLD.experience[i], sideFor(i), 6.4, 0.7, EXP_OFFSET - 0.35, 1.5)
})
projects.forEach((p, i) => {
  positions[`proj-${p.id}`] = framed(WORLD.projects[i], sideFor(i), 7.4, 1.1, PROJ_OFFSET - 0.5, 1.9)
})

export const keyframes: Keyframe[] = timeline.map((t) => ({ ...t, ...positions[t.id] }))

/**
 * Crane lift (world units) applied mid-way through each segment so the camera
 * arcs over environments instead of clipping through them.
 */
export const segmentLift: number[] = keyframes.slice(0, -1).map((k, i) => {
  const next = keyframes[i + 1].id
  if (k.id === 'home') return 2.2 // rise through the neural network
  if (k.id === 'skills') return 4.6 // crane over the technology towers
  if (k.id === 'about') return 1.6
  if (k.id.startsWith('exp-') && next.startsWith('proj-')) return 2.4
  if (k.id.startsWith('proj-') && next === 'cert') return 1.6
  return 0.6
})

/** Smooth spline the camera rides on. */
export const cameraCurve = new THREE.CatmullRomCurve3(
  keyframes.map((k) => k.pos.clone()),
  false,
  'catmullrom',
  0.35,
)

const expEndZ = (WORLD.experience[WORLD.experience.length - 1]?.z ?? -96) - 1
export const CORRIDOR = { startZ: expStartZ + 12, endZ: expEndZ, halfWidth: 4.6 }

/** Glowing pathway on the floor connecting all environments (runs down each aisle). */
export const pathwayCurve = new THREE.CatmullRomCurve3(
  [
    v(0, -1.98, 4),
    v(0, -1.98, -7),
    v(-1.8, -1.98, WORLD.about.z + 4),
    v(-1.5, -1.98, WORLD.about.z - 6),
    v(0, -1.98, WORLD.lab.z + 10),
    v(-8.4, -1.98, WORLD.lab.z + 3),
    v(-9.6, -1.98, WORLD.lab.z - 5),
    v(EXP_AISLE_X, -1.98, CORRIDOR.startZ + 2),
    v(EXP_AISLE_X, -1.98, CORRIDOR.endZ),
    v(PROJ_AISLE_X, -1.98, projStartZ + 8),
    v(PROJ_AISLE_X, -1.98, lastProjectZ - 4),
    v(0, -1.98, CERT_POS.z + 4),
    v(0, -1.98, CONTACT_POS.z + 4),
  ],
  false,
  'catmullrom',
  0.5,
)
