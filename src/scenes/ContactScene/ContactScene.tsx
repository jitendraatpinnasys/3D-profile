import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CONTACT_POS } from '../worldLayout'
import { MOTION } from '../common/helpers'

/** Communication portal — swirling gateway, segmented ring and signal waves. */
export function ContactScene() {
  const portalMat = useRef<THREE.ShaderMaterial>(null)
  const seg = useRef<THREE.InstancedMesh>(null)
  const waves = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)

  const SEGMENTS = 72
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime * MOTION
    if (portalMat.current) portalMat.current.uniforms.uTime.value = t
    if (ring.current) ring.current.rotation.z = t * 0.1
    if (seg.current) {
      for (let i = 0; i < SEGMENTS; i++) {
        const a = (i / SEGMENTS) * Math.PI * 2 - t * 0.15
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.5)
        dummy.position.set(Math.cos(a) * 3.85, Math.sin(a) * 3.85, 0)
        dummy.rotation.set(0, 0, a)
        dummy.scale.set(0.05, 0.22 + pulse * 0.25, 0.05)
        dummy.updateMatrix()
        seg.current.setMatrixAt(i, dummy.matrix)
      }
      seg.current.instanceMatrix.needsUpdate = true
    }
    if (waves.current)
      waves.current.children.forEach((w, i) => {
        const k = (t * 0.25 + i / 3) % 1
        w.scale.setScalar(1 + k * 5)
        ;((w as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.5
      })
    void dt
  })

  return (
    <group position={CONTACT_POS}>
      <pointLight position={[0, 1, 3]} intensity={22} distance={14} color="#8b7bff" />
      <pointLight position={[0, -1, 4]} intensity={12} distance={12} color="#4da3ff" />
      <group position={[0, 1.6, -0.5]}>
        <mesh>
          <circleGeometry args={[3.3, 96]} />
          <shaderMaterial
            ref={portalMat}
            transparent
            depthWrite={false}
            uniforms={{ uTime: { value: 0 } }}
            vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
            fragmentShader={/* glsl */ `
              varying vec2 vUv; uniform float uTime;
              void main(){
                vec2 p = vUv - 0.5;
                float r = length(p) * 2.0;
                float a = atan(p.y, p.x);
                float swirl = sin(a * 6.0 + r * 14.0 - uTime * 1.6) * 0.5 + 0.5;
                float swirl2 = sin(a * 3.0 - r * 9.0 + uTime * 0.9) * 0.5 + 0.5;
                vec3 c1 = vec3(0.30, 0.64, 1.0);
                vec3 c2 = vec3(0.55, 0.48, 1.0);
                vec3 col = mix(c1, c2, swirl2) * (0.35 + swirl * 0.65);
                float core = smoothstep(0.55, 0.0, r);
                col += vec3(0.85, 0.88, 1.0) * core * 0.55;
                float alpha = smoothstep(1.0, 0.7, r) * (0.45 + swirl * 0.35) + core * 0.4;
                gl_FragColor = vec4(col, alpha * 0.85);
              }`}
          />
        </mesh>
        <mesh ref={ring}>
          <torusGeometry args={[3.4, 0.07, 16, 160]} />
          <meshStandardMaterial color="#dfe6ff" emissive="#8b7bff" emissiveIntensity={1.6} metalness={0.6} roughness={0.2} toneMapped={false} />
        </mesh>
        <instancedMesh ref={seg} args={[undefined, undefined, SEGMENTS]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#4da3ff" toneMapped={false} />
        </instancedMesh>
      </group>
      {/* central communication station */}
      <mesh position={[0, -1.6, 1.8]}>
        <cylinderGeometry args={[0.9, 1.1, 0.8, 48]} />
        <meshStandardMaterial color="#0f1018" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -1.19, 1.8]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.8, 48]} />
        <meshBasicMaterial color="#8b7bff" toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <group ref={waves} position={[0, -1.96, 1.8]} rotation-x={-Math.PI / 2}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <ringGeometry args={[0.9, 0.95, 64]} />
            <meshBasicMaterial color="#4da3ff" transparent toneMapped={false} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
