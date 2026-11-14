import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { achievements, certifications } from '../../data/certifications'
import { CERT_POS } from '../worldLayout'
import { useAppStore } from '../../store/useAppStore'
import { MOTION, useTextTexture } from '../common/helpers'

/** Achievement gallery — a floating certificate panel and achievement medallions. */
export function CertificationScene() {
  const cert = certifications[0]
  const select = useAppStore((s) => s.select)
  const [hover, setHover] = useState(false)
  useCursor(hover)
  const panel = useRef<THREE.Group>(null)
  const frame = useRef<THREE.MeshBasicMaterial>(null)
  const [image, setImage] = useState<THREE.Texture | null>(null)

  // Load the real certificate image only when one has been supplied locally.
  useEffect(() => {
    if (!cert?.image) return
    const t = new THREE.TextureLoader().load(cert.image, (tx) => {
      tx.colorSpace = THREE.SRGBColorSpace
      setImage(tx)
    })
    return () => t.dispose()
  }, [cert?.image])

  const tex = useTextTexture(
    cert
      ? [
          { text: '// CERTIFICATION', size: 24, font: 'mono', color: '#e7d3a1', weight: 700, letterSpacing: 4 },
          { text: cert.name, size: 62, weight: 850, gap: 40, letterSpacing: -1 },
          { text: `Issued by ${cert.issuer}${cert.date ? ' · ' + cert.date : ''}`, size: 30, weight: 500, color: '#c7c7d1', gap: 22 },
          { text: cert.image ? 'CLICK TO VIEW CERTIFICATE →' : 'CLICK FOR DETAILS →', size: 22, font: 'mono', color: '#8b9dff', gap: 70, letterSpacing: 3 },
        ]
      : [],
    { width: 1000, height: 680, padding: 64, background: 'rgba(14,15,24,0.92)', border: 'rgba(231,211,161,0.45)', radius: 34 },
    'cert-panel',
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime * MOTION
    if (panel.current) {
      panel.current.position.y = 0.45 + Math.sin(t * 0.6) * 0.08
      panel.current.rotation.y = Math.sin(t * 0.25) * 0.08
      panel.current.scale.setScalar(THREE.MathUtils.lerp(panel.current.scale.x, hover ? 1.04 : 1, 1 - Math.exp(-dt * 8)))
    }
    if (frame.current) frame.current.opacity = 0.35 + 0.25 * Math.sin(t * 1.4) + (hover ? 0.3 : 0)
  })

  if (!cert) return null

  return (
    <group position={CERT_POS}>
      <pointLight position={[0, 2, 3]} intensity={16} distance={11} color="#f1e3bf" />
      <pointLight position={[-3, 0, 1]} intensity={8} distance={9} color="#8b7bff" />
      <group
        ref={panel}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          select({ type: 'certification', id: cert.id })
        }}
      >
        <RoundedBox args={[3.5, 2.42, 0.08]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial color="#0d0e16" metalness={0.5} roughness={0.25} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.4, 2.31]} />
          <meshBasicMaterial map={image ?? tex} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.06]} scale={[1.06, 1.09, 1]}>
          <planeGeometry args={[3.5, 2.42]} />
          <meshBasicMaterial ref={frame} color="#e7d3a1" transparent opacity={0.4} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      {achievements.map((a, i) => (
        <Medallion key={a.id} title={a.title} index={i} />
      ))}
      <mesh position={[0, -1.96, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.6, 2.66, 96]} />
        <meshBasicMaterial color="#e7d3a1" transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Medallion({ title, index }: { title: string; index: number }) {
  const ref = useRef<THREE.Group>(null)
  const tex = useTextTexture(
    [
      { text: `ACHIEVEMENT 0${index + 1}`, size: 18, font: 'mono', color: '#8b9dff', weight: 700, letterSpacing: 2 },
      { text: title, size: 30, weight: 750, gap: 10 },
    ],
    { width: 420, height: 150, padding: 22, background: 'rgba(16,18,28,0.82)', border: 'rgba(255,255,255,0.14)', radius: 20 },
    `medal-${title}`,
  )
  const x = [-3.6, 3.6, 0][index] ?? (index - 1) * 2
  const y = [-0.6, -0.6, -1.35][index] ?? -1
  const z = [0.6, 0.6, 1.6][index] ?? 1
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime * MOTION
    ref.current.position.y = y + Math.sin(t * 0.7 + index * 2) * 0.08
    ref.current.children[0].rotation.y = t * 0.6
  })
  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh position={[0, 0.55, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#e7d3a1" emissive="#e7d3a1" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh>
        <planeGeometry args={[1.7, 0.61]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}
