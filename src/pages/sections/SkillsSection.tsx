import { MousePointerClick } from 'lucide-react'
import { skillCategories, skills } from '../../data/skills'
import type { Skill } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { SectionHeading, SectionLabel } from '../../components/ui/SectionLabel'

function TechPill({ skill }: { skill: Skill }) {
  const select = useAppStore((s) => s.select)
  const setHovered = useAppStore((s) => s.setHovered)
  const active = useAppStore((s) => s.hovered === skill.id)
  return (
    <button
      type="button"
      className="tech-pill text-fg/85"
      data-active={active}
      onMouseEnter={() => setHovered(skill.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(skill.id)}
      onBlur={() => setHovered(null)}
      onClick={() => select({ type: 'skill', id: skill.id })}
    >
      {skill.name}
    </button>
  )
}

function MarqueeRow({ items, reverse = false, dur }: { items: Skill[]; reverse?: boolean; dur: string }) {
  return (
    <div className="marquee pe overflow-hidden py-2">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ ['--dur' as string]: dur }}>
        {[...items, ...items].map((s, i) => (
          <span key={`${s.id}-${i}`} aria-hidden={i >= items.length} className="contents">
            {i >= items.length ? (
              <span className="tech-pill text-fg/70">{s.name}</span>
            ) : (
              <TechPill skill={s} />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SkillsSection({ world }: { world: boolean }) {
  const half = Math.ceil(skills.length / 2)
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-10">
        <div className="pe">
          <SectionLabel>Technical Stack</SectionLabel>
          <SectionHeading>
            <span id="skills-title">Technologies I Work With</span>
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted" data-reveal>
            Full-stack expertise across AI &amp; LLM engineering, modern web development, backend systems, databases and cloud infrastructure.
          </p>
        </div>
      </div>
      <div className="mt-12 space-y-2" data-reveal>
        <MarqueeRow items={skills.slice(0, half)} dur="60s" />
        <MarqueeRow items={skills.slice(half)} reverse dur="54s" />
      </div>

      {/* The lab: a window into the 3D technology laboratory */}
      {world && (
        <div id="kf-skills" data-nav-target className="relative mt-10 h-[100svh]">
          <div className="absolute inset-x-5 top-24 flex justify-between sm:inset-x-10 lg:inset-x-16">
            <p className="mono-label text-fg/70">// Technology Lab</p>
            <p className="mono-label hidden text-dim sm:block">{skills.length} technologies · {skillCategories.length} stations</p>
          </div>
          <p className="glass mono-label pe absolute bottom-10 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 !text-[0.62rem] text-fg/80">
            <MousePointerClick size={13} aria-hidden="true" /> Hover a technology to illuminate · click to open details
          </p>
        </div>
      )}

      {/* Accessible category index (and the main view when 3D is off) */}
      <div id={world ? undefined : 'kf-skills'} data-nav-target={world ? undefined : true} className="mx-auto mt-10 grid max-w-6xl gap-4 px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-5 lg:px-16">
        {skillCategories.map((c, i) => (
          <div key={c.id} className="glass pe rounded-2xl p-5" data-reveal>
            <p className="mono-label !text-[0.6rem]" style={{ color: c.color }}>
              0{i + 1} //
            </p>
            <h3 className="mt-2 text-base font-extrabold leading-tight tracking-tight">{c.title}</h3>
            <p className="mt-1 text-xs text-dim">{c.description}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {skills
                .filter((s) => s.category === c.id)
                .map((s) => (
                  <li key={s.id}>
                    <SmallSkill skill={s} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function SmallSkill({ skill }: { skill: Skill }) {
  const select = useAppStore((s) => s.select)
  const setHovered = useAppStore((s) => s.setHovered)
  return (
    <button
      type="button"
      onClick={() => select({ type: 'skill', id: skill.id })}
      onMouseEnter={() => setHovered(skill.id)}
      onMouseLeave={() => setHovered(null)}
      className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[0.68rem] text-fg/80 transition-colors hover:border-violet/60 hover:text-fg"
    >
      {skill.name}
    </button>
  )
}
