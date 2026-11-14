import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react'
import { profile } from '../../data/profile'
import { useAppStore } from '../../store/useAppStore'
import { scrollToSection } from '../../utils/navigate'
import { LinkedInButton, ResumeButton } from '../../components/ui/Actions'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * ENTER THE WORLD — a sticky hero whose headline is scrubbed by scroll
 * while the camera orbits the identity core behind it.
 */
export function HeroSection({ world }: { world: boolean }) {
  const slideIndex = useAppStore((s) => s.heroSlide)
  const slide = profile.heroSlides[slideIndex]

  return (
    <section id="home" aria-label="Introduction" className="relative h-[320vh]">
      <div id="kf-home" className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-28 sm:px-10 lg:px-16">
        {/* 2D fallback portrait (the 3D world renders it as a hologram instead) */}
        {!world && (
          <img
            src={profile.heroPhoto}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 mx-auto h-[78%] w-full max-w-3xl object-cover object-[50%_20%] opacity-45 [mask-image:radial-gradient(55%_60%_at_50%_45%,#000_35%,transparent_75%)]"
          />
        )}
        <div className="flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* left: identity + scrubbed headline */}
          <div className="pe max-w-[46rem]">
            <p className="mono-label text-fg/90">
              Hi, I'm <span className="border-b-2 border-fg pb-0.5">{profile.name}</span>
            </p>
            <h1 className="sr-only">
              {profile.name} — {profile.titles.join(', ')}
            </h1>
            <div className="relative mt-5 h-[clamp(7.5rem,17vw,13.5rem)] w-[min(90vw,56rem)]" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease }}
                  className="display absolute inset-0 text-[clamp(3.4rem,8.4vw,7.6rem)]"
                >
                  <span className="display-3d block w-fit pr-2">{slide.title[0]}</span>
                  <span className="display-3d-dim block w-fit pr-2">{slide.title[1]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted">{profile.tagline}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-dim">
              <span>
                <span className="text-fg">{profile.experienceYears}</span> Years of engineering
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} aria-hidden="true" /> {profile.locationShort}
              </span>
            </p>
          </div>

          {/* right: scrubbed kicker */}
          <div className="pe max-w-xs lg:text-right" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="mono-label text-fg/80">// {slide.kicker}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{slide.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="pe flex items-center gap-5">
            <button type="button" onClick={() => scrollToSection('about')} className="mono-label inline-flex items-center gap-2 text-fg/80 hover:text-fg">
              <ArrowDown size={13} className="animate-bounce" aria-hidden="true" /> Scroll to scrub timeline
            </button>
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              {profile.heroSlides.map((_, i) => (
                <span key={i} className={`h-[3px] rounded-full transition-all duration-500 ${i === slideIndex ? 'w-8 bg-fg' : 'w-3 bg-fg/25'}`} />
              ))}
            </div>
          </div>
          <div className="pe flex flex-col items-start gap-3 sm:items-end sm:pr-10">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-light" onClick={() => scrollToSection('about')}>
                Explore My World <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button type="button" className="btn btn-dark" onClick={() => scrollToSection('projects')}>
                View My Projects
              </button>
            </div>
            <div className="flex flex-wrap gap-3 [&_.btn]:px-4 [&_.btn]:py-2 [&_.btn]:text-xs">
              <ResumeButton />
              <LinkedInButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
