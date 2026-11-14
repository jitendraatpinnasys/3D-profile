/**
 * Mutable, render-free scroll state shared between the DOM and the 3D world.
 * Written by the scroll hooks, read every frame by the camera rig.
 * Kept outside React/Zustand on purpose so scrolling never triggers re-renders.
 */
export const scrollState = {
  /** continuous keyframe index (0 … keyframes-1) the camera should be at */
  target: 0,
  /** 0..1 progress through the sticky hero scrub */
  hero: 0,
  /** -1..1 normalised pointer position */
  pointer: { x: 0, y: 0 },
  /** 0..1 intro fly-in progress after entering */
  intro: 0,
  /** damped keyframe index the camera is actually at (written by the camera rig) */
  current: 0,
}
