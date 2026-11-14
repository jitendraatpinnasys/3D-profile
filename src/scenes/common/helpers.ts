import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { makeTextTexture, type TextLine, type TextTextureOptions } from '../../utils/textTexture'
import { prefersReducedMotion } from '../../utils/device'

/** 0 when the user prefers reduced motion — multiply ambient animation by this. */
export const MOTION = prefersReducedMotion() ? 0 : 1

export function useTextTexture(lines: TextLine[], opts: TextTextureOptions, key: string) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tex = useMemo(() => makeTextTexture(lines, opts), [key])
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

export const damp = THREE.MathUtils.damp
