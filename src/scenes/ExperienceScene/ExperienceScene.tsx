import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { experience } from '../../data/experience'
import type { Experience } from '../../types'
import { CORRIDOR, EXP_AISLE_X, WORLD, keyframes, sideFor } from '../worldLayout'
import { useAppStore } from '../../store/useAppStore'
import { MOTION, useTextTexture } from '../common/helpers'

const CX = EXP_AISLE_X
const HW = CORRIDOR.halfWidth

const pulseVertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`
const pulseFragment = `varying vec2 vUv; uniform float uTime;
  void main(){ float p = smoothstep(0.8,1.0,fract(vUv.y*3.0 - uTime*0.6));
    gl_FragColor = vec4(mix(vec3(0.3,0.6,1.0), vec3(0.6,0.5,1.0), vUv.y) * (0.8 + p*2.0), 0.45 + p*0.55); }`

/** Career corridor: arches, animated timeline branches and one station per company. */
export function ExperienceScene() {
  const zStart = CORRIDOR.startZ
  const zEnd = CORRIDOR.endZ

  const arches = useMemo(() => {
    const out: number[] = []
    for (let z = zStart; z >= zEnd; z -= 4) out.push(z)
    return out
  }, [zStart, zEnd])

  const archMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#13151f', metalness: 0.8, roughness: 0.35 }), arches.length * 3)
    const d = new THREE.Object3D()
    arches.forEach((z, i) => {
      const parts: [number, number, number, number, number, number][] = [
        [CX - HW, 0.7, z, 0.12, 5.4, 0.12],
        [CX + HW, 0.7, z, 0.12, 5.4, 0.12],
        [CX, 3.4, z, HW * 2 + 0.12, 0.12, 0.12],
      ]
      parts.forEach((p, j) => {
        d.position.set(p[0], p[1], p[2])
        d.scale.set(p[3], p[4], p[5])
        d.updateMatrix()
        m.setMatrixAt(i * 3 + j, d.matrix)
      })
    })
    return m
  }, [arches])

  const edgeMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#4da3ff', toneMapped: false, transparent: true, opacity: 0.6 }), arches.length * 2)
    const d = new THREE.Object3D()
    arches.forEach((z, i) => {
      ;[-1, 1].forEach((s, j) => {
        d.position.set(CX + s * (HW - 0.07), 0.7, z + 0.07)
        d.scale.set(0.015, 5.2, 0.015)
        d.updateMatrix()
        m.setMatrixAt(i * 2 + j, d.matrix)
      })
    })
    return m
  }, [arches])

  const pulse = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, dt) => {
    pulse.uTime.value += dt * MOTION
  })

  return (
    <group>
      <primitive object={archMesh} />
      <primitive object={edgeMesh} />
      {/* timeline branches: the aisle pathway connects to every station */}
      {WORLD.experience.map((p, i) => (
        <mesh key={i} position={[(CX + p.x) / 2, -1.965, p.z + 0.6]} rotation-x={-Math.PI / 2} rotation-z={sideFor(i) * (Math.PI / 2)}>
          <planeGeometry args={[0.06, Math.abs(p.x - CX)]} />
          <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={pulse} vertexShader={pulseVertex} fragmentShader={pulseFragment} />
        </mesh>
      ))}
      {experience.map((e, i) => (
        <Station key={e.id} exp={e} index={i} position={WORLD.experience[i]} />
      ))}
      {/* "next chapter" marker at the end of the corridor */}
      <mesh position={[CX, -1.95, zEnd + 1]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.5, 0.56, 48]} />
        <meshBasicMaterial color="#8b7bff" toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function Station({ exp, index, position }: { exp: Experience; index: number; position: THREE.Vector3 }) {
  const kfIndex = keyframes.findIndex((k) => k.id === `exp-${exp.id}`)
  const active = useAppStore((s) => s.activeKeyframe === kfIndex)
  const select = useAppStore((s) => s.select)
  const [hover, setHover] = useState(false)
  useCursor(hover)
  const ring = useRef<THREE.Mesh>(null)
  const slab = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const edge = useRef<THREE.MeshBasicMaterial>(null)
  const color = exp.current ? '#8b7bff' : '#4da3ff'

  const tex = useTextTexture(
    [
      { text: `// STATION 0${index + 1}${exp.current ? '  ·  CURRENT' : ''}`, size: 24, font: 'mono', color, weight: 700, letterSpacing: 3 },
      { text: exp.period.toUpperCase(), size: 22, font: 'mono', color: '#a1a1aa', gap: 26, letterSpacing: 1 },
      { text: exp.role, size: 54, weight: 850, gap: 18, letterSpacing: -1 },
      { text: exp.company, size: 32, weight: 600, color: '#c7d2fe', gap: 18 },
      ...(exp.location ? [{ text: exp.location, size: 22, font: 'mono' as const, color: '#71717a', gap: 8 }] : []),
      { text: exp.summary, size: 26, weight: 450, color: '#d4d4d8', gap: 34 },
      { text: 'CLICK TO OPEN DOSSIER →', size: 20, font: 'mono', color, gap: 46, letterSpacing: 3 },
    ],
    { width: 640, height: 900, padding: 46, background: 'rgba(14,16,26,0.9)', border: 'rgba(255,255,255,0.12)', radius: 30 },
    `station-${exp.id}`,
  )

  useFrame((state, dt) => {
    const on = active || hover ? 1 : 0
    const k = 1 - Math.exp(-dt * 4)
    const t = state.clock.elapsedTime * MOTION
    if (ring.current) {
      ring.current.rotation.z += dt * (0.3 + on * 1.4) * MOTION
      ring.current.position.y = 2.75 + Math.sin(t) * 0.06
    }
    if (light.current) light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, 4 + on * 16, k)
    if (edge.current) edge.current.opacity = THREE.MathUtils.lerp(edge.current.opacity, 0.25 + on * 0.75, k)
    if (slab.current) slab.current.scale.setScalar(THREE.MathUtils.lerp(slab.current.scale.x, 1 + (hover ? 0.03 : 0), k))
  })

  return (
    <group position={position}>
      {/* timeline node on the aisle */}
      <mesh position={[CX - position.x, -1.94, 0.6]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* turned slightly toward the aisle */}
      <group rotation-y={-sideFor(index) * 0.32}>
      <pointLight ref={light} position={[0, 1, 2.2]} distance={9} color={color} intensity={4} />
      {/* base pad */}
      <mesh position={[0, -1.9, 0]}>
        <cylinderGeometry args={[1.7, 1.8, 0.16, 48]} />
        <meshStandardMaterial color="#0f1018" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -1.81, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.55, 1.62, 64]} />
        <meshBasicMaterial ref={edge} color={color} toneMapped={false} transparent opacity={0.25} />
      </mesh>
      <group
        ref={slab}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          select({ type: 'experience', id: exp.id })
        }}
      >
        <RoundedBox args={[2.3, 3.25, 0.16]} radius={0.08} smoothness={4} position={[0, 0.25, 0]}>
          <meshPhysicalMaterial color="#0d0f18" metalness={0.6} roughness={0.2} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0.25, 0.085]}>
          <planeGeometry args={[2.2, 3.1]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={ring} position={[0, 2.75, 0]}>
        <torusGeometry args={[0.36, 0.02, 8, 64, Math.PI * 1.6]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      </group>
    </group>
  )
}
