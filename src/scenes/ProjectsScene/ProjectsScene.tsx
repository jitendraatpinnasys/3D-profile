import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../../data/projects'
import type { Project } from '../../types'
import { WORLD, keyframes, sideFor } from '../worldLayout'
import { useAppStore } from '../../store/useAppStore'
import { MOTION, useTextTexture } from '../common/helpers'
import { CommerceInstallation, DocumentsInstallation, GenericInstallation, PropertyInstallation } from './Installations'

const INSTALLATIONS = {
  documents: DocumentsInstallation,
  property: PropertyInstallation,
  commerce: CommerceInstallation,
  generic: GenericInstallation,
}

/** Innovation Showroom — each project is an interactive installation on a lit pedestal. */
export function ProjectsScene() {
  return (
    <group>
      {projects.map((p, i) => (
        <Exhibit key={p.id} project={p} index={i} position={WORLD.projects[i]} />
      ))}
    </group>
  )
}

function Exhibit({ project, index, position }: { project: Project; index: number; position: THREE.Vector3 }) {
  const kfIndex = keyframes.findIndex((k) => k.id === `proj-${project.id}`)
  const active = useAppStore((s) => s.activeKeyframe === kfIndex)
  const select = useAppStore((s) => s.select)
  const [hover, setHover] = useState(false)
  useCursor(hover)
  const group = useRef<THREE.Group>(null)
  const spot = useRef<THREE.SpotLight>(null)
  const cone = useRef<THREE.MeshBasicMaterial>(null)
  const target = useRef<THREE.Object3D>(null)
  useEffect(() => {
    if (spot.current && target.current) spot.current.target = target.current
  }, [])
  const Installation = INSTALLATIONS[project.installation] ?? GenericInstallation
  const side = sideFor(index)

  const plaque = useTextTexture(
    [
      { text: `// PROJECT ${project.index}`, size: 22, font: 'mono', color: '#8b9dff', weight: 700, letterSpacing: 3 },
      { text: project.name, size: 34, weight: 800, gap: 10 },
      { text: project.category.toUpperCase(), size: 18, font: 'mono', color: '#a1a1aa', gap: 10, letterSpacing: 2 },
    ],
    { width: 720, height: 190, padding: 28, background: 'rgba(14,16,26,0.88)', border: 'rgba(255,255,255,0.14)', radius: 22 },
    `plaque-${project.id}`,
  )

  useFrame((state, dt) => {
    const on = active || hover ? 1 : 0
    const k = 1 - Math.exp(-dt * 4)
    if (group.current) {
      group.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * MOTION * 0.7 + index) * 0.07
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 1 + (hover ? 0.05 : 0), k))
    }
    if (spot.current) spot.current.intensity = THREE.MathUtils.lerp(spot.current.intensity, 30 + on * 60, k)
    if (cone.current) cone.current.opacity = THREE.MathUtils.lerp(cone.current.opacity, 0.03 + on * 0.06, k)
  })

  return (
    <group position={position} rotation-y={-side * 0.35}>
      <object3D ref={target} position={[0, -1.4, 0]} />
      <spotLight ref={spot} position={[0, 5.5, 1.2]} angle={0.5} penumbra={0.8} distance={12} color="#dfe6ff" />
      <pointLight position={[0, 0.6, 2]} intensity={6} distance={6} color={index % 2 ? '#8b7bff' : '#4da3ff'} />
      {/* light cone */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[2.0, 6.5, 40, 1, true]} />
        <meshBasicMaterial ref={cone} color="#c7d2ff" transparent opacity={0.04} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* pedestal */}
      <mesh position={[0, -1.72, 0]}>
        <cylinderGeometry args={[1.7, 1.85, 0.56, 64]} />
        <meshStandardMaterial color="#0e0f17" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0, -1.43, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.58, 1.66, 96]} />
        <meshBasicMaterial color={index % 2 ? '#8b7bff' : '#4da3ff'} toneMapped={false} />
      </mesh>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          select({ type: 'project', id: project.id })
        }}
      >
        {/* invisible hit volume for easy clicking */}
        <mesh visible={false}>
          <boxGeometry args={[3.4, 2.8, 2.4]} />
        </mesh>
        <Installation active={active || hover} />
      </group>
      {/* plaque, angled toward the camera side */}
      <mesh position={[side * -0.2, -1.05, 2.05]} rotation-x={-0.35}>
        <planeGeometry args={[2.6, 0.686]} />
        <meshBasicMaterial map={plaque} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}
