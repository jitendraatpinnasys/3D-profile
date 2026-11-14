import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cameraCurve, CERT_POS, keyframes, segmentLift, WORLD } from './worldLayout'
import { scrollState } from '../utils/scrollState'
import { useAppStore, type Selection } from '../store/useAppStore'
import { projects } from '../data/projects'
import { experience } from '../data/experience'
import { skillWorldPosition } from './SkillsScene/layout'
import { prefersReducedMotion } from '../utils/device'

const REDUCED = prefersReducedMotion()
const INTRO_FROM = new THREE.Vector3(0, 7, 34)

function focusPoint(sel: Selection | null): THREE.Vector3 | null {
  if (!sel) return null
  switch (sel.type) {
    case 'skill':
      return skillWorldPosition[sel.id] ?? null
    case 'project': {
      const i = projects.findIndex((p) => p.id === sel.id)
      return i >= 0 ? WORLD.projects[i] : null
    }
    case 'experience': {
      const i = experience.findIndex((e) => e.id === sel.id)
      return i >= 0 ? WORLD.experience[i].clone().setY(0.4) : null
    }
    case 'certification':
      return CERT_POS
  }
}

/**
 * Drives the camera along the world spline from scroll progress, with
 * an orbit around the identity core during the hero scrub, a cinematic
 * intro fly-in, pointer parallax and focus on selected objects.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const state = useRef({ s: 0, focusW: 0, px: 0, py: 0 })
  const pos = useRef(new THREE.Vector3()).current
  const look = useRef(new THREE.Vector3()).current
  const tmp = useRef(new THREE.Vector3()).current
  const focus = useRef(new THREE.Vector3()).current
  const orbit = useRef(new THREE.Vector3()).current

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const st = state.current
    const N = keyframes.length

    st.s = REDUCED ? scrollState.target : THREE.MathUtils.damp(st.s, scrollState.target, 3, dt)
    scrollState.current = st.s

    cameraCurve.getPoint(Math.min(1, Math.max(0, st.s / (N - 1))), pos)
    const i = Math.min(N - 1, Math.floor(st.s))
    const f = st.s - i
    look.lerpVectors(keyframes[i].look, keyframes[Math.min(N - 1, i + 1)].look, f)

    // Crane arc between stations (keeps the camera above towers, arches, pedestals).
    const lift = Math.sin(f * Math.PI) * (segmentLift[i] ?? 0)
    pos.y += lift
    look.y += lift * 0.45

    // Hero: orbit + slow dolly around the core while the titles scrub.
    const heroW = 1 - Math.min(1, Math.max(0, st.s))
    if (heroW > 0) {
      const a = (scrollState.hero - 0.5) * 1.15
      const r = 9 - scrollState.hero * 1.1
      orbit.set(Math.sin(a) * r, 0.15 + scrollState.hero * 0.5, Math.cos(a) * r)
      pos.lerp(orbit, heroW)
    }

    // Focus on the selected object.
    const sel = useAppStore.getState().selected
    const fp = focusPoint(sel)
    const near = fp ? fp.distanceTo(keyframes[Math.round(st.s)].look) < 14 : false
    st.focusW = THREE.MathUtils.damp(st.focusW, fp && near ? 1 : 0, 3, dt)
    if (fp) focus.copy(fp)
    if (st.focusW > 0.001) {
      look.lerp(focus, 0.55 * st.focusW)
      tmp.copy(focus).add(new THREE.Vector3(0, 0.6, 5.2))
      pos.lerp(tmp, 0.35 * st.focusW)
    }

    // Pointer parallax.
    if (!REDUCED) {
      st.px = THREE.MathUtils.damp(st.px, scrollState.pointer.x, 2, dt)
      st.py = THREE.MathUtils.damp(st.py, scrollState.pointer.y, 2, dt)
      pos.x += st.px * 0.35
      pos.y -= st.py * 0.2
    }

    // Intro fly-in.
    const k = 1 - Math.pow(1 - scrollState.intro, 3)
    if (k < 1) pos.lerpVectors(INTRO_FROM, pos, k)

    camera.position.copy(pos)
    camera.lookAt(look)
  })
  return null
}
