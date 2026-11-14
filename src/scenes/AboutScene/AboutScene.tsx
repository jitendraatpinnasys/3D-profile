import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { WORLD } from '../worldLayout'
import { profile } from '../../data/profile'
import { MOTION, useTextTexture } from '../common/helpers'

/** Identity deck: holographic ID card, orbiting profile cards, data streams. */
export function AboutScene() {
  const orbit = useRef<THREE.Group>(null)
  const card = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)

  const idTex = useTextTexture(
    [
      { text: '// IDENTITY', size: 22, font: 'mono', color: '#8b9dff', weight: 600, letterSpacing: 3 },
      { text: profile.name.toUpperCase(), size: 64, weight: 850, gap: 26, letterSpacing: -1 },
      { text: profile.titles.slice(0, 2).join('  ·  '), size: 26, weight: 500, color: '#a1a1aa', gap: 8 },
      { text: `${profile.experienceYears} YEARS  ·  ${profile.locationShort.toUpperCase()}`, size: 22, font: 'mono', color: '#d4d4d8', gap: 40, letterSpacing: 2 },
      { text: '● ' + profile.status.toUpperCase(), size: 20, font: 'mono', color: '#34d399', gap: 16, letterSpacing: 2 },
    ],
    { width: 760, height: 440, padding: 44, background: 'rgba(16,18,28,0.82)', border: 'rgba(160,180,255,0.35)', radius: 34 },
    'about-id',
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime * MOTION
    if (orbit.current) orbit.current.rotation.y += dt * 0.12 * MOTION
    if (card.current) {
      card.current.position.y = 0.4 + Math.sin(t * 0.6) * 0.08
      card.current.rotation.y = -0.25 + Math.sin(t * 0.3) * 0.06
    }
    if (rings.current) rings.current.children.forEach((r, i) => (r.rotation.z = t * 0.1 * (i % 2 ? 1 : -1) * (i + 1)))
  })

  return (
    <group position={WORLD.about}>
      <pointLight position={[0, 2.5, 3]} intensity={14} distance={12} color="#8b7bff" />
      <pointLight position={[-3, 0, 2]} intensity={8} distance={10} color="#4da3ff" />

      {/* pedestal */}
      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[2.4, 2.6, 0.3, 64]} />
        <meshStandardMaterial color="#101119" metalness={0.8} roughness={0.3} />
      </mesh>
      <group ref={rings} position={[0, -1.68, 0]} rotation-x={-Math.PI / 2}>
        {[2.2, 1.7, 1.2].map((r, i) => (
          <mesh key={r}>
            <ringGeometry args={[r - 0.02, r, 96, 1, 0, Math.PI * (1.2 + i * 0.25)]} />
            <meshBasicMaterial color={i === 1 ? '#8b7bff' : '#4da3ff'} toneMapped={false} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      <group ref={card}>
        <RoundedBox args={[3.3, 1.95, 0.06]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial color="#0f1220" metalness={0.4} roughness={0.2} clearcoat={1} transparent opacity={0.92} />
        </RoundedBox>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[3.24, 1.875]} />
          <meshBasicMaterial map={idTex} transparent toneMapped={false} />
        </mesh>
      </group>

      <group ref={orbit} position={[0, 0.3, 0]}>
        {profile.infoCards.map((c, i) => (
          <InfoCard key={c.title} title={c.title} label={c.label} angle={(i / profile.infoCards.length) * Math.PI * 2} />
        ))}
      </group>
      <DataStreams />
    </group>
  )
}

function InfoCard({ title, label, angle }: { title: string; label: string; angle: number }) {
  const tex = useTextTexture(
    [
      { text: title, size: 40, weight: 800 },
      { text: label.toUpperCase(), size: 18, font: 'mono', color: '#9aa4c7', gap: 6, letterSpacing: 2 },
    ],
    { width: 360, height: 140, padding: 26, background: 'rgba(18,20,32,0.78)', border: 'rgba(255,255,255,0.16)', radius: 22 },
    `info-${title}`,
  )
  const r = 3.4
  return (
    <mesh position={[Math.cos(angle) * r, Math.sin(angle * 2) * 0.5, Math.sin(angle) * r]} rotation-y={-angle + Math.PI / 2}>
      <planeGeometry args={[1.5, 0.58]} />
      <meshBasicMaterial map={tex} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

/** Vertical streams of data particles rising around the deck. */
function DataStreams() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geom = useMemo(() => {
    const n = 260
    const pos = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const col = i % 13
      const a = (col / 13) * Math.PI * 2
      pos[i * 3] = Math.cos(a) * 4.6
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(a) * 4.6
      seed[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [])
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime * MOTION
  })
  return (
    <points geometry={geom}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          attribute float aSeed; uniform float uTime; varying float vA;
          void main(){
            vec3 p = position;
            float k = fract(aSeed + uTime * (0.05 + aSeed * 0.05));
            p.y = -1.8 + k * 6.0;
            vA = sin(k * 3.14159);
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 22.0 / -mv.z;
          }`}
        fragmentShader={/* glsl */ `
          varying float vA;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(0.5, 0.7, 1.0, smoothstep(0.5, 0.0, d) * vA * 0.9);
          }`}
      />
    </points>
  )
}
