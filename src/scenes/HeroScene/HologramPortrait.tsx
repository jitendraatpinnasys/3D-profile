import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../../utils/scrollState'
import { MOTION } from '../common/helpers'

/** Horizontal crop of the source photo (keeps the subject, drops the room edges). */
const CROP: [number, number] = [0.19, 0.81]
const HEIGHT = 4.9

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCrop;
  uniform float uTime;
  uniform float uReveal;
  uniform float uGhost;
  uniform float uOpacity;
  uniform vec3 uTint;
  varying vec2 vUv;

  void main() {
    vec2 uv = vec2(mix(uCrop.x, uCrop.y, vUv.x), vUv.y);

    // scan-line reveal sweeping upward, with a small glitch near the scan edge
    float scanY = uReveal * 1.15 - 0.05;
    float nearEdge = smoothstep(0.08, 0.0, abs(vUv.y - scanY));
    uv.x += nearEdge * 0.012 * sin(vUv.y * 180.0 + uTime * 30.0);
    vec4 tex = texture2D(uMap, uv);

    // studio-light vignette: subject stays bright, the room fades into the dark world
    float fx = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    float fy = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
    float r = length((vUv - vec2(0.5, 0.6)) * vec2(1.15, 0.85));
    float focus = smoothstep(0.78, 0.3, r);
    vec3 col = tex.rgb * mix(0.5, 1.0, focus);
    // cool rim grade toward the edges
    col = mix(col, col * uTint * 1.5, (1.0 - focus) * 0.4);

    float alpha = fx * fy * mix(0.55, 1.0, focus);
    float shown = step(vUv.y, scanY);
    vec3 edgeGlow = uTint * nearEdge * 1.6;

    if (uGhost > 0.5) {
      // depth layer: luminance-only hologram slice with scanlines
      float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
      float lines = 0.55 + 0.45 * sin(vUv.y * 420.0 - uTime * 2.0);
      gl_FragColor = vec4(uTint * lum * lines * 1.3, alpha * focus * shown * uOpacity);
    } else {
      float lines = 0.97 + 0.03 * sin(vUv.y * 700.0 + uTime * 3.0);
      gl_FragColor = vec4(col * lines * 0.92 + edgeGlow, (alpha * shown + nearEdge * 0.6 * fx) * uOpacity);
    }
    #include <colorspace_fragment>
  }
`

function useLayerMaterial(map: THREE.Texture, ghost: boolean, opacity: number) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: !ghost,
        toneMapped: false,
        blending: ghost ? THREE.AdditiveBlending : THREE.NormalBlending,
        uniforms: {
          uMap: { value: map },
          uCrop: { value: new THREE.Vector2(...CROP) },
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uGhost: { value: ghost ? 1 : 0 },
          uOpacity: { value: opacity },
          uTint: { value: new THREE.Color('#8b7bff') },
        },
      }),
    [map, ghost, opacity],
  )
}

/**
 * The hero centrepiece: a photo portrait rendered as a 3D hologram.
 * It scans in during the intro, turns as the hero timeline is scrubbed,
 * follows the pointer slightly, and has hologram depth slices behind it
 * that create parallax as the camera orbits.
 */
export function HologramPortrait({ src, tint }: { src: string; tint: THREE.Color }) {
  const map = useTexture(src, (t) => {
    const tex = Array.isArray(t) ? t[0] : t
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
  })
  const img = map.image as { width: number; height: number }
  const aspect = ((CROP[1] - CROP[0]) * img.width) / img.height
  const width = HEIGHT * aspect

  const main = useLayerMaterial(map, false, 1)
  const ghostA = useLayerMaterial(map, true, 0.22)
  const ghostB = useLayerMaterial(map, true, 0.12)
  const group = useRef<THREE.Group>(null)
  const turn = useRef({ y: 0, x: 0 })

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime * MOTION
    const reveal = Math.min(1, Math.max(0, (scrollState.intro - 0.15) / 0.75))
    for (const m of [main, ghostA, ghostB]) {
      m.uniforms.uTime.value = t
      m.uniforms.uReveal.value = reveal
      m.uniforms.uTint.value.copy(tint)
    }
    if (group.current) {
      // turn with the scrub (about 60% of the camera orbit) so the 3D depth stays visible
      const targetY = (scrollState.hero - 0.5) * 0.7 + scrollState.pointer.x * 0.12 * MOTION
      const targetX = scrollState.pointer.y * 0.05 * MOTION
      const k = 1 - Math.exp(-dt * 3)
      turn.current.y += (targetY - turn.current.y) * k
      turn.current.x += (targetX - turn.current.x) * k
      group.current.rotation.set(turn.current.x, turn.current.y, 0)
      group.current.position.y = 0.3 + Math.sin(t * 0.6) * 0.05
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0, -0.55]} material={ghostB} scale={1.04}>
        <planeGeometry args={[width, HEIGHT]} />
      </mesh>
      <mesh position={[0, 0, -0.28]} material={ghostA} scale={1.02}>
        <planeGeometry args={[width, HEIGHT]} />
      </mesh>
      <mesh material={main}>
        <planeGeometry args={[width, HEIGHT]} />
      </mesh>
    </group>
  )
}
