import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { scrollState } from '../../utils/scrollState'

/**
 * Hides an environment when the camera is far away along the timeline.
 * Cheap culling that keeps draw calls low in a long, continuous world.
 */
export function Zone({ from, to, margin = 1.6, children }: { from: number; to: number; margin?: number; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame(() => {
    if (!ref.current) return
    const s = scrollState.current
    ref.current.visible = s > from - margin && s < to + margin
  })
  return <group ref={ref}>{children}</group>
}
