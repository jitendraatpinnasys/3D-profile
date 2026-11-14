import { useMemo, useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { categoryById, skillCategories, skills } from '../../data/skills'
import type { Skill, SkillCategory } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { MOTION, useTextTexture } from '../common/helpers'
import { TILE_GAP, TILE_H, TILE_W, towers } from './layout'
import { WORLD } from '../worldLayout'

/** Technology Lab — one illuminated tower per category, one interactive tile per technology. */
export function SkillsScene() {
  return (
    <group>
      <pointLight position={[WORLD.lab.x, 4, WORLD.lab.z + 4]} intensity={20} distance={18} color="#c7d2ff" />
      {/* lab floor ring */}
      <mesh position={[WORLD.lab.x, -1.97, WORLD.lab.z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[8.6, 8.66, 128]} />
        <meshBasicMaterial color="#4da3ff" transparent opacity={0.45} toneMapped={false} />
      </mesh>
      {towers.map((t) => {
        const cat = skillCategories[t.categoryIndex]
        return (
          <group key={cat.id} position={t.position} rotation-y={t.rotationY}>
            <Tower category={cat} index={t.categoryIndex} items={skills.filter((s) => s.category === cat.id)} />
          </group>
        )
      })}
    </group>
  )
}

function Tower({ category, index, items }: { category: SkillCategory; index: number; items: Skill[] }) {
  const beam = useRef<THREE.Mesh>(null)
  const labelTex = useTextTexture(
    [
      { text: `0${index + 1} //`, size: 22, font: 'mono', color: category.color, weight: 700, letterSpacing: 2 },
      { text: category.title.toUpperCase(), size: 26, font: 'mono', weight: 700, gap: 4, letterSpacing: 1 },
    ],
    { width: 560, height: 110, padding: 18, align: 'center' },
    `tower-${category.id}`,
  )
  const top = -1.05 + (items.length - 1) * TILE_GAP
  useFrame((s) => {
    if (beam.current) (beam.current.material as THREE.ShaderMaterial).uniforms.uTime.value = s.clock.elapsedTime * MOTION + index
  })
  return (
    <group>
      {/* hex platform */}
      <mesh position={[0, -1.88, 0]}>
        <cylinderGeometry args={[1.45, 1.55, 0.18, 6]} />
        <meshStandardMaterial color="#0f1018" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -1.78, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.3, 1.36, 6]} />
        <meshBasicMaterial color={category.color} toneMapped={false} />
      </mesh>
      {/* light beam */}
      <mesh ref={beam} position={[0, (top - 1.8) / 2 + 0.9, -0.2]}>
        <cylinderGeometry args={[0.7, 1.35, top + 3.6, 24, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: new THREE.Color(category.color) }, uTime: { value: 0 } }}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`varying vec2 vUv; uniform vec3 uColor; uniform float uTime;
            void main(){ float a = pow(1.0 - vUv.y, 2.2) * (0.16 + 0.04 * sin(uTime * 1.2)); gl_FragColor = vec4(uColor, a); }`}
        />
      </mesh>
      <pointLight position={[0, top / 2, 1]} intensity={4} distance={5} color={category.color} />
      <mesh position={[0, -1.45, 0.9]}>
        <planeGeometry args={[2.6, 0.51]} />
        <meshBasicMaterial map={labelTex} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {items.map((s, i) => (
        <SkillTile key={s.id} skill={s} y={-1.05 + i * TILE_GAP} color={category.color} />
      ))}
    </group>
  )
}

const ICON_GEOMS: Record<string, THREE.BufferGeometry> = {
  ai: new THREE.IcosahedronGeometry(0.1, 0),
  frontend: new THREE.BoxGeometry(0.15, 0.15, 0.15),
  backend: new THREE.OctahedronGeometry(0.11, 0),
  database: new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16),
  cloud: new THREE.TorusGeometry(0.07, 0.03, 8, 20),
}

function SkillTile({ skill, y, color }: { skill: Skill; y: number; color: string }) {
  const ref = useRef<THREE.Group>(null)
  const icon = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.MeshBasicMaterial>(null)
  const [hover, setHover] = useState(false)
  const storeHovered = useAppStore((s) => s.hovered === skill.id)
  const selected = useAppStore((s) => s.selected?.type === 'skill' && s.selected.id === skill.id)
  const select = useAppStore((s) => s.select)
  const setHovered = useAppStore((s) => s.setHovered)
  const lit = hover || storeHovered || selected
  useCursor(hover)

  const tex = useTextTexture(
    [{ text: skill.name, size: 30, weight: 650 }],
    { width: 520, height: 80, padding: 22, background: 'rgba(20,22,34,0.86)', border: 'rgba(255,255,255,0.14)', radius: 18 },
    `skill-${skill.id}`,
  )
  const seed = useMemo(() => Math.random() * 10, [])
  const c = useMemo(() => new THREE.Color(color), [color])

  useFrame((state, dt) => {
    if (!ref.current) return
    const k = 1 - Math.exp(-dt * 10)
    const target = lit ? 1 : 0
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, target * 0.35, k)
    const sc = THREE.MathUtils.lerp(ref.current.scale.x, 1 + target * 0.07, k)
    ref.current.scale.setScalar(sc)
    ref.current.position.y = y + Math.sin(state.clock.elapsedTime * MOTION * 0.8 + seed) * 0.02
    if (icon.current) {
      icon.current.rotation.y += dt * (lit ? 3 : 0.6) * MOTION
      icon.current.rotation.x += dt * 0.3 * MOTION
    }
    if (glow.current) glow.current.opacity = THREE.MathUtils.lerp(glow.current.opacity, lit ? 0.55 : 0, k)
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHover(true)
    setHovered(skill.id)
  }
  const out = () => {
    setHover(false)
    setHovered(null)
  }

  return (
    <group ref={ref} position={[0, y, 0]}>
      <mesh position={[0, 0, -0.02]} scale={[1.08, 1.5, 1]}>
        <planeGeometry args={[TILE_W, TILE_H]} />
        <meshBasicMaterial ref={glow} color={c} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation()
          select({ type: 'skill', id: skill.id })
        }}
      >
        <planeGeometry args={[TILE_W, TILE_H]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
      <mesh ref={icon} position={[TILE_W / 2 - 0.25, 0, 0.12]} geometry={ICON_GEOMS[skill.category]}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={lit ? 2.4 : 0.7} metalness={0.3} roughness={0.3} toneMapped={false} />
      </mesh>
      {hover && (
        <Html position={[TILE_W / 2 + 0.15, 0, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[40, 30]}>
          <div className="skill-tip">
            <span className="mono-label" style={{ color }}>
              {categoryById[skill.category].title}
            </span>
            <strong>{skill.name}</strong>
            <p>{skill.description}</p>
            <em>Click for details</em>
          </div>
        </Html>
      )}
    </group>
  )
}
