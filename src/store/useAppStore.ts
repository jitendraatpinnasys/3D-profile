import { create } from 'zustand'
import { detectQuality } from '../utils/device'

export type Selection =
  | { type: 'skill'; id: string }
  | { type: 'project'; id: string }
  | { type: 'experience'; id: string }
  | { type: 'certification'; id: string }

export type Quality = 'high' | 'medium' | 'none'

interface AppState {
  /** index into `navigation` of the section closest to the camera */
  activeSection: number
  /** index into world keyframes the camera is closest to */
  activeKeyframe: number
  heroSlide: number
  selected: Selection | null
  hovered: string | null
  entered: boolean
  sceneReady: boolean
  soundOn: boolean
  quality: Quality
  /** user preference to turn the 3D world off */
  worldEnabled: boolean
  toast: string | null
  setActive: (section: number, keyframe: number) => void
  setHeroSlide: (i: number) => void
  select: (s: Selection | null) => void
  setHovered: (id: string | null) => void
  enter: () => void
  setSceneReady: () => void
  toggleSound: () => void
  setQuality: (q: Quality) => void
  toggleWorld: () => void
  showToast: (msg: string) => void
}

let toastTimer: number | undefined

export const useAppStore = create<AppState>((set, get) => ({
  activeSection: 0,
  activeKeyframe: 0,
  heroSlide: 0,
  selected: null,
  hovered: null,
  entered: false,
  sceneReady: false,
  soundOn: false,
  quality: detectQuality(),
  worldEnabled: true,
  toast: null,
  setActive: (section, keyframe) => {
    const st = get()
    if (st.activeSection !== section || st.activeKeyframe !== keyframe)
      set({ activeSection: section, activeKeyframe: keyframe })
  },
  setHeroSlide: (i) => get().heroSlide !== i && set({ heroSlide: i }),
  select: (selected) => set({ selected }),
  setHovered: (hovered) => get().hovered !== hovered && set({ hovered }),
  enter: () => set({ entered: true }),
  setSceneReady: () => set({ sceneReady: true }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  setQuality: (quality) => set({ quality }),
  toggleWorld: () => set((s) => ({ worldEnabled: !s.worldEnabled })),
  showToast: (toast) => {
    window.clearTimeout(toastTimer)
    set({ toast })
    toastTimer = window.setTimeout(() => set({ toast: null }), 3200)
  },
}))
