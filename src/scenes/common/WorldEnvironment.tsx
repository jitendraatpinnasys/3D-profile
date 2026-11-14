import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Grid, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { CONTACT_POS, pathwayCurve } from '../worldLayout'
import { MOTION } from './helpers'

export const BG = '#08080b'

/** Fog, floor, reflections and global light. */
export function WorldEnvironment({ quality }: { quality: 'high' | 'medium' }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 10, quality === 'high' ? 46 : 38]} />
      <ambientLight intensity={0.22} />
      <hemisphereLight args={['#8fa8ff', '#0b0b12', 0.35]} />
      <directionalLight position={[6, 12, 8]} intensity={0.5} color="#dfe6ff" />

      {/* Local-only environment map built from light panels (no HDR downloads). */}
      <Environment resolution={quality === 'high' ? 256 : 128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 5, -6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#4da3ff" position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#8b7bff" position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={1} color="#ffffff" position={[0, 2, 6]} scale={3} />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position={[0, -2.01, -100]} receiveShadow>
        <planeGeometry args={[120, 340]} />
        <meshStandardMaterial color="#0a0a0e" roughness={0.55} metalness={0.6} />
      </mesh>
      <Grid
        position={[0, -1.995, 0]}
        args={[10, 10]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1d2333"
        sectionSize={6}
        sectionThickness={1}
        sectionColor="#2a3554"
        fadeDistance={34}
        fadeStrength={1.6}
        infiniteGrid
        followCamera
      />
      <Pathway />
      <Particles count={quality === 'high' ? 2600 : 1100} />
    </>
  )
}

/** Glowing path on the floor connecting every environment, with travelling pulses. */
function Pathway() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geom = useMemo(() => new THREE.TubeGeometry(pathwayCurve, 900, 0.03, 6, false), [])
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt * MOTION
  })
  return (
    <mesh geometry={geom}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          void main(){
            float pulse = smoothstep(0.92, 1.0, fract(vUv.x * 26.0 - uTime * 0.35));
            vec3 a = vec3(0.30, 0.64, 1.0);
            vec3 b = vec3(0.55, 0.48, 1.0);
            vec3 col = mix(a, b, 0.5 + 0.5 * sin(vUv.x * 18.0));
            gl_FragColor = vec4(col * (0.55 + pulse * 2.2), 0.28 + pulse * 0.7);
          }
        `}
      />
    </mesh>
  )
}

/** Drifting dust / data particles along the whole world. */
function Particles({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const zMin = CONTACT_POS.z - 20
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44
      pos[i * 3 + 1] = -1.8 + Math.random() * 12
      pos[i * 3 + 2] = 14 + Math.random() * (zMin - 14)
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt * MOTION
  })
  return (
    <points geometry={geom}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uPixel: { value: Math.min(window.devicePixelRatio, 2) } }}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform float uPixel;
          varying float vAlpha;
          varying float vSeed;
          void main(){
            vec3 p = position;
            p.y += sin(uTime * 0.25 + aSeed * 40.0) * 0.35;
            p.x += cos(uTime * 0.18 + aSeed * 23.0) * 0.25;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float size = (0.6 + aSeed * 1.8) * uPixel;
            gl_PointSize = size * (14.0 / -mv.z);
            float fade = smoothstep(42.0, 6.0, -mv.z);
            vAlpha = fade * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 60.0)));
            vSeed = aSeed;
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          varying float vSeed;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            vec3 col = mix(vec3(0.55,0.75,1.0), vec3(0.72,0.62,1.0), vSeed);
            gl_FragColor = vec4(col, a * vAlpha * 0.8);
          }
        `}
      />
    </points>
  )
}
