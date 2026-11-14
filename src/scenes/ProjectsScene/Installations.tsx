import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { MOTION } from '../common/helpers'
import { mulberry } from '../HeroScene/HeroScene'

/** Abstract document page: title bar + text lines, drawn once. */
function useDocTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 340
    const g = c.getContext('2d')!
    g.fillStyle = '#e9ecf5'
    g.fillRect(0, 0, 256, 340)
    g.fillStyle = '#4d5bff'
    g.fillRect(22, 24, 120, 14)
    g.fillStyle = '#b8bfd6'
    for (let i = 0; i < 14; i++) g.fillRect(22, 60 + i * 18, 212 - ((i * 37) % 70), 7)
    g.strokeStyle = '#8b7bff'
    g.lineWidth = 3
    g.strokeRect(18, 186, 220, 60)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

/** Documents being scanned by a laser plane, extracted fields flowing into a data core. */
export function DocumentsInstallation({ active }: { active: boolean }) {
  const docs = useRef<THREE.Group>(null)
  const scan = useRef<THREE.Mesh>(null)
  const bits = useRef<THREE.InstancedMesh>(null)
  const tex = useDocTexture()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((s) => {
    const t = s.clock.elapsedTime * MOTION
    if (docs.current)
      docs.current.children.forEach((d, i) => {
        d.position.y = 0.4 + Math.sin(t * 0.8 + i) * 0.08
      })
    if (scan.current) scan.current.position.y = 0.4 + Math.sin(t * (active ? 1.6 : 0.8)) * 0.85
    if (bits.current) {
      for (let i = 0; i < 24; i++) {
        const k = (t * 0.35 + i / 24) % 1
        dummy.position.set(THREE.MathUtils.lerp(-0.2, 1.75, k), 0.4 + Math.sin(k * Math.PI) * 0.9 - k * 0.6, 0.25)
        dummy.scale.setScalar(0.05 * Math.sin(k * Math.PI) + 0.01)
        dummy.updateMatrix()
        bits.current.setMatrixAt(i, dummy.matrix)
      }
      bits.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group>
      <group ref={docs}>
        {[-0.9, -0.45, 0].map((x, i) => (
          <mesh key={i} position={[x - 0.3, 0.4, -i * 0.25]} rotation-y={0.35 - i * 0.12} rotation-z={0.06 - i * 0.04}>
            <planeGeometry args={[1.05, 1.4]} />
            <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.25} roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <mesh ref={scan} position={[-0.5, 0.4, 0.15]}>
        <boxGeometry args={[1.9, 0.02, 0.9]} />
        <meshBasicMaterial color="#4da3ff" toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <instancedMesh ref={bits} args={[undefined, undefined, 24]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#a5b4fc" toneMapped={false} />
      </instancedMesh>
      {/* structured data core */}
      <group position={[1.75, -0.2, 0.2]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -0.35 + i * 0.32, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.24, 40]} />
            <meshStandardMaterial color="#141829" emissive="#8b7bff" emissiveIntensity={active ? 0.6 : 0.25} metalness={0.7} roughness={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Low-poly property district with lit windows and a scanning ring. */
export function PropertyInstallation({ active }: { active: boolean }) {
  const ring = useRef<THREE.Mesh>(null)
  const windows = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 128
    const g = c.getContext('2d')!
    g.fillStyle = '#10131f'
    g.fillRect(0, 0, 64, 128)
    for (let y = 6; y < 128; y += 12)
      for (let x = 6; x < 64; x += 14) {
        g.fillStyle = Math.random() > 0.45 ? '#9db8ff' : '#1b2033'
        g.fillRect(x, y, 8, 6)
      }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    return t
  }, [])
  const blocks = useMemo(() => {
    const r = mulberry(3)
    const out: { x: number; z: number; h: number; w: number }[] = []
    for (let i = 0; i < 9; i++) {
      out.push({ x: ((i % 3) - 1) * 0.62 + (r() - 0.5) * 0.1, z: (Math.floor(i / 3) - 1) * 0.62, h: 0.5 + r() * 1.6, w: 0.42 + r() * 0.1 })
    }
    return out
  }, [])
  useFrame((s) => {
    const t = s.clock.elapsedTime * MOTION
    if (ring.current) {
      ring.current.position.y = -0.85 + ((t * 0.4) % 1) * 2.2
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - ((t * 0.4) % 1))
    }
  })
  return (
    <group rotation-y={-0.5}>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, -1.0 + b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshStandardMaterial map={windows} emissiveMap={windows} emissive="#ffffff" emissiveIntensity={active ? 0.9 : 0.5} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh ref={ring} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.2, 1.24, 64]} />
        <meshBasicMaterial color="#8b7bff" transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* AI marker */}
      <mesh position={[0, 1.55, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial color="#4da3ff" toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Rotating storefront carousel of product cards around a shopping bag. */
export function CommerceInstallation({ active }: { active: boolean }) {
  const carousel = useRef<THREE.Group>(null)
  const colors = ['#4da3ff', '#8b7bff', '#38bdf8', '#a78bfa', '#7dd3fc', '#c4b5fd']
  useFrame((_, dt) => {
    if (carousel.current) carousel.current.rotation.y += dt * (active ? 0.6 : 0.25) * MOTION
  })
  return (
    <group>
      <group ref={carousel}>
        {colors.map((c, i) => {
          const a = (i / colors.length) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * 1.35, 0.1, Math.sin(a) * 1.35]} rotation-y={-a + Math.PI / 2}>
              <RoundedBox args={[0.6, 0.8, 0.04]} radius={0.04}>
                <meshStandardMaterial color="#141726" metalness={0.5} roughness={0.3} />
              </RoundedBox>
              <mesh position={[0, 0.1, 0.03]}>
                <boxGeometry args={[0.36, 0.36, 0.02]} />
                <meshBasicMaterial color={c} toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.22, 0.03]}>
                <planeGeometry args={[0.4, 0.05]} />
                <meshBasicMaterial color="#d4d4d8" />
              </mesh>
            </group>
          )
        })}
      </group>
      {/* bag */}
      <group position={[0, -0.1, 0]}>
        <RoundedBox args={[0.8, 0.9, 0.42]} radius={0.05}>
          <meshPhysicalMaterial color="#e9ecf5" roughness={0.35} clearcoat={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.22, 0.03, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#8b7bff" emissive="#8b7bff" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

export function GenericInstallation({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * (active ? 0.8 : 0.3) * MOTION
  })
  return (
    <mesh ref={ref} position={[0, 0.2, 0]}>
      <torusKnotGeometry args={[0.7, 0.2, 160, 24]} />
      <meshPhysicalMaterial color="#141829" metalness={0.9} roughness={0.15} emissive="#4d5bff" emissiveIntensity={0.3} />
    </mesh>
  )
}
