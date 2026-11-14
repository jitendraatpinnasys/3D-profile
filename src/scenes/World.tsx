import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { WorldEnvironment } from './common/WorldEnvironment'
import { Zone } from './common/Zone'
import { keyframes } from './worldLayout'
import { HeroScene } from './HeroScene/HeroScene'
import { AboutScene } from './AboutScene/AboutScene'
import { SkillsScene } from './SkillsScene/SkillsScene'
import { ExperienceScene } from './ExperienceScene/ExperienceScene'
import { ProjectsScene } from './ProjectsScene/ProjectsScene'
import { CertificationScene } from './CertificationScene/CertificationScene'
import { ContactScene } from './ContactScene/ContactScene'
import { useAppStore } from '../store/useAppStore'

const idx = (id: string) => keyframes.findIndex((k) => k.id === id)
const first = (prefix: string) => keyframes.findIndex((k) => k.id.startsWith(prefix))
const last = (prefix: string) => keyframes.map((k) => k.id.startsWith(prefix)).lastIndexOf(true)

function Ready() {
  const setSceneReady = useAppStore((s) => s.setSceneReady)
  useEffect(() => {
    // wait two frames so shaders are compiled before revealing
    const id = requestAnimationFrame(() => requestAnimationFrame(setSceneReady))
    return () => cancelAnimationFrame(id)
  }, [setSceneReady])
  return null
}

/** The single, continuous 3D world rendered behind the page content. */
export default function World({ quality }: { quality: 'high' | 'medium' }) {
  const select = useAppStore((s) => s.select)
  return (
    <Canvas
      className="world-canvas"
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: 45, near: 0.1, far: 90, position: [0, 7, 34] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      onPointerMissed={() => select(null)}
      aria-hidden="true"
    >
      <PerformanceMonitor />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <WorldEnvironment quality={quality} />
        <CameraRig />
        <Zone from={0} to={idx('about')}>
          <HeroScene />
        </Zone>
        <Zone from={idx('about')} to={idx('skills')}>
          <AboutScene />
        </Zone>
        <Zone from={idx('skills')} to={idx('skills')} margin={1.8}>
          <SkillsScene />
        </Zone>
        <Zone from={first('exp-')} to={last('exp-')}>
          <ExperienceScene />
        </Zone>
        <Zone from={first('proj-')} to={last('proj-')}>
          <ProjectsScene />
        </Zone>
        <Zone from={idx('cert')} to={idx('cert')}>
          <CertificationScene />
        </Zone>
        <Zone from={idx('contact')} to={idx('contact')} margin={2}>
          <ContactScene />
        </Zone>
        {quality === 'high' && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.82} luminanceSmoothing={0.2} />
            <Vignette offset={0.28} darkness={0.72} />
          </EffectComposer>
        )}
        <Ready />
      </Suspense>
    </Canvas>
  )
}
