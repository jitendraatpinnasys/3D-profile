import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HologramPortrait } from './HologramPortrait'
import { WORLD } from '../worldLayout'
import { scrollState } from '../../utils/scrollState'
import { makeGlowTexture } from '../../utils/textTexture'
import { MOTION, useTextTexture } from '../common/helpers'
import { profile } from '../../data/profile'
import { useAppStore } from '../../store/useAppStore'

const SLIDE_COLORS = ['#8b7bff', '#4da3ff', '#38bdf8'].map((c) => new THREE.Color(c))

const CODE_FRAGMENTS = [
  'graph = StateGraph(AgentState)',
  'async def extract(doc: UploadFile):',
  'const res = await fetch("/api/v1")',
  'SELECT * FROM documents WHERE ...',
  'agent.invoke({"messages": msgs})',
  'export default function App() {',
  '@app.post("/process")',
  'docker compose up -d',
  'schema.model_validate(output)',
  'retriever.get_relevant_docs(q)',
]

export function HeroScene() {
  const rings = useRef<THREE.Group>(null)
  const band = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  const color = useRef(new THREE.Color('#8b7bff')).current

  const glow = useMemo(() => makeGlowTexture('rgba(200,210,255,0.9)', 'rgba(200,210,255,0)'), [])

  const bandText = `${profile.name.toUpperCase()}  ·  AI ENGINEER  ·  FULL-STACK DEVELOPER  ·  GENERATIVE AI  ·  `
  const bandTex = useTextTexture(
    [{ text: bandText + bandText, size: 46, weight: 700, font: 'mono', color: '#dfe6ff', letterSpacing: 6 }],
    { width: 4096, height: 80, padding: 12 },
    'hero-band',
  )
  useMemo(() => {
    bandTex.wrapS = THREE.RepeatWrapping
  }, [bandTex])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime * MOTION
    const h = scrollState.hero
    const slide = useAppStore.getState().heroSlide
    color.lerp(SLIDE_COLORS[slide], 1 - Math.exp(-dt * 2.5))

    if (rings.current) {
      rings.current.children.forEach((r, i) => {
        r.rotation.z = t * (0.15 + i * 0.08) * (i % 2 ? -1 : 1)
        r.rotation.x = 0.25 * (i - 1) * (0.6 + h * 0.8)
      })
    }
    if (band.current) band.current.rotation.y = -t * 0.12 - h * 2
    if (light.current) light.current.color.copy(color)
  })

  return (
    <group position={WORLD.home}>
      {/* studio backdrop light — the "portrait light" of the world */}
      <mesh position={[0, 0.6, -7]} renderOrder={-1}>
        <planeGeometry args={[26, 18]} />
        <meshBasicMaterial map={glow} transparent opacity={0.16} depthWrite={false} fog={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.5, 3]} intensity={18} distance={14} />
      <pointLight position={[-4, 3, -2]} intensity={10} distance={14} color="#4da3ff" />
      <pointLight position={[4, -1, -1]} intensity={10} distance={14} color="#8b7bff" />

      {/* portrait centrepiece */}
      <HologramPortrait src={profile.heroPhoto} tint={color} />

      {/* halo rings behind the portrait */}
      <group ref={rings} position={[0, 0.9, -1.4]}>
        {[2.3, 2.75, 3.25].map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.008 + i * 0.002, 8, 160]} />
            <meshBasicMaterial color={i === 1 ? '#8b7bff' : '#4da3ff'} transparent opacity={0.5 - i * 0.12} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* name band orbiting at chest height — passes in front of and behind the portrait */}
      <mesh ref={band} position={[0, -1.45, 0]}>
        <cylinderGeometry args={[2.55, 2.55, 0.12, 128, 1, true]} />
        <meshBasicMaterial map={bandTex} transparent side={THREE.DoubleSide} depthWrite={false} opacity={0.75} />
      </mesh>
      {/* floor halo */}
      <mesh position={[0, -1.97, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.1, 2.16, 96]} />
        <meshBasicMaterial color="#8b7bff" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <group position={[0, 0.4, -3.2]}>
        <NeuralNetwork />
      </group>
      <CodeFragments />
    </group>
  )
}

/** Nodes on concentric shells connected by faint synapses, with pulsing nodes. */
function NeuralNetwork() {
  const ref = useRef<THREE.Group>(null)
  const pointsMat = useRef<THREE.ShaderMaterial>(null)
  const { pointGeom, lineGeom } = useMemo(() => {
    const nodes: THREE.Vector3[] = []
    const rand = mulberry(7)
    for (let i = 0; i < 90; i++) {
      const r = 3.4 + rand() * 2.2
      const th = rand() * Math.PI * 2
      const ph = Math.acos(2 * rand() - 1)
      nodes.push(new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.7, r * Math.sin(ph) * Math.sin(th)))
    }
    const lines: number[] = []
    nodes.forEach((a, i) => {
      let links = 0
      for (let j = i + 1; j < nodes.length && links < 3; j++) {
        if (a.distanceTo(nodes[j]) < 1.9) {
          lines.push(a.x, a.y, a.z, nodes[j].x, nodes[j].y, nodes[j].z)
          links++
        }
      }
    })
    const pg = new THREE.BufferGeometry().setFromPoints(nodes)
    pg.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(nodes.map(() => rand())), 1))
    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
    return { pointGeom: pg, lineGeom: lg }
  }, [])

  useFrame((state, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04 * MOTION
    if (pointsMat.current) pointsMat.current.uniforms.uTime.value = state.clock.elapsedTime * MOTION
  })

  return (
    <group ref={ref}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#5b7cff" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
      <points geometry={pointGeom}>
        <shaderMaterial
          ref={pointsMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={/* glsl */ `
            attribute float aSeed; uniform float uTime; varying float vP;
            void main(){
              vec4 mv = modelViewMatrix * vec4(position,1.0);
              gl_Position = projectionMatrix * mv;
              vP = pow(0.5 + 0.5 * sin(uTime * 1.6 + aSeed * 30.0), 6.0);
              gl_PointSize = (3.0 + vP * 6.0) * (10.0 / -mv.z);
            }`}
          fragmentShader={/* glsl */ `
            varying float vP;
            void main(){
              float d = length(gl_PointCoord - 0.5);
              float a = smoothstep(0.5, 0.0, d);
              gl_FragColor = vec4(mix(vec3(0.45,0.65,1.0), vec3(0.85,0.8,1.0), vP), a * (0.5 + vP));
            }`}
        />
      </points>
    </group>
  )
}

function CodeFragment({ text, position, seed }: { text: string; position: [number, number, number]; seed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const tex = useTextTexture(
    [{ text, size: 26, weight: 500, font: 'mono', color: '#b9c6ff' }],
    { width: 620, height: 56, padding: 14 },
    `code-${text}`,
  )
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * MOTION
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + seed * 9) * 0.18
    const m = ref.current.material as THREE.MeshBasicMaterial
    m.opacity = 0.22 + 0.25 * (0.5 + 0.5 * Math.sin(t * 0.5 + seed * 13))
  })
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[3.1, 0.28]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

function CodeFragments() {
  const placed = useMemo(() => {
    const rand = mulberry(11)
    return CODE_FRAGMENTS.map((text, i) => {
      const side = i % 2 ? 1 : -1
      return {
        text,
        seed: rand(),
        position: [side * (4.2 + rand() * 3.2), -1.2 + rand() * 4.2, -2.5 - rand() * 4] as [number, number, number],
      }
    })
  }, [])
  return (
    <>
      {placed.map((p) => (
        <CodeFragment key={p.text} {...p} />
      ))}
    </>
  )
}

/** Deterministic PRNG so the world layout is identical on every visit. */
export function mulberry(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
