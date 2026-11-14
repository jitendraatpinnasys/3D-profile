import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Award, ImageOff, X } from 'lucide-react'
import { useAppStore, type Selection } from '../../store/useAppStore'
import { categoryById, skillById, skills } from '../../data/skills'
import { projects } from '../../data/projects'
import { experience } from '../../data/experience'
import { achievements, certifications } from '../../data/certifications'

const norm = (s: string) => s.toLowerCase().replace(/\.js$/, '').replace(/[^a-z0-9]/g, '')

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <h4 className="mono-label text-dim">// {title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 font-mono text-[0.68rem] text-fg/85">
          {t}
        </li>
      ))}
    </ul>
  )
}

function Bullets({ items, color = 'bg-violet' }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2 text-sm text-muted">
      {items.map((r) => (
        <li key={r} className="flex gap-2.5">
          <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${color}`} aria-hidden="true" />
          {r}
        </li>
      ))}
    </ul>
  )
}

function SkillDetail({ id }: { id: string }) {
  const select = useAppStore((s) => s.select)
  const skill = skillById[id]
  if (!skill) return null
  const cat = categoryById[skill.category]
  const key = norm(skill.name)
  const inProjects = projects.filter((p) => p.stack.some((t) => norm(t) === key))
  const inRoles = experience.filter((e) => e.technologies.some((t) => norm(t) === key) || e.responsibilities.some((r) => r.toLowerCase().includes(skill.name.toLowerCase())))
  return (
    <>
      <p className="mono-label" style={{ color: cat.color }}>
        {cat.title}
      </p>
      <h3 className="mt-3 text-4xl font-extrabold tracking-tight">{skill.name}</h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{skill.description}</p>
      {(inRoles.length > 0 || inProjects.length > 0) && (
        <Block title="Where it shows up">
          <ul className="space-y-2 text-sm">
            {inRoles.map((e) => (
              <li key={e.id}>
                <button type="button" className="text-left text-fg hover:text-violet" onClick={() => select({ type: 'experience', id: e.id })}>
                  {e.role} · <span className="text-muted">{e.company}</span>
                </button>
              </li>
            ))}
            {inProjects.map((p) => (
              <li key={p.id}>
                <button type="button" className="text-left text-fg hover:text-violet" onClick={() => select({ type: 'project', id: p.id })}>
                  Project {p.index} · <span className="text-muted">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </Block>
      )}
      <Block title={`More in ${cat.short}`}>
        <ul className="flex flex-wrap gap-1.5">
          {skills
            .filter((s) => s.category === skill.category && s.id !== skill.id)
            .map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => select({ type: 'skill', id: s.id })} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 font-mono text-[0.68rem] text-fg/85 hover:border-violet/60">
                  {s.name}
                </button>
              </li>
            ))}
        </ul>
      </Block>
    </>
  )
}

function ProjectDetail({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id)
  if (!p) return null
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="mono-label text-dim">// Project {p.index}</p>
        <span className="chip mono-label !text-[0.58rem] text-fg/85">{p.category}</span>
      </div>
      <h3 className="mt-4 text-[2rem] font-extrabold leading-[1.05] tracking-tight">{p.name}</h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{p.overview}</p>
      <Block title="Problem">
        <p className="text-sm leading-relaxed text-muted">{p.problem}</p>
      </Block>
      <Block title="Solution">
        <p className="text-sm leading-relaxed text-muted">{p.solution}</p>
      </Block>
      <Block title="Architecture">
        <ol className="space-y-2">
          {p.architecture.map((a, i) => (
            <li key={a} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.03] px-3 py-2.5 text-sm text-fg/85">
              <span className="font-mono text-[0.65rem] text-violet">0{i + 1}</span>
              {a}
            </li>
          ))}
        </ol>
      </Block>
      <Block title="Key features">
        <Bullets items={p.features} color="bg-blue" />
      </Block>
      <Block title="Technology stack">
        <Tags items={p.stack} />
      </Block>
      <Block title="Screenshots">
        {p.images.length ? (
          <div className="grid grid-cols-2 gap-2">
            {p.images.map((src) => (
              <img key={src} src={src} alt={`${p.name} screenshot`} className="rounded-lg border border-line" loading="lazy" />
            ))}
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-xl border border-dashed border-line px-4 py-5 text-xs text-dim">
            <ImageOff size={15} aria-hidden="true" /> Screenshots and demos will be added soon.
          </p>
        )}
      </Block>
      {(p.links.github || p.links.live) && (
        <div className="mt-7 flex gap-3">
          {p.links.github && (
            <a className="btn btn-dark" href={p.links.github} target="_blank" rel="noopener noreferrer">
              Source <ArrowUpRight size={14} />
            </a>
          )}
          {p.links.live && (
            <a className="btn btn-light" href={p.links.live} target="_blank" rel="noopener noreferrer">
              Live demo <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      )}
    </>
  )
}

function ExperienceDetail({ id }: { id: string }) {
  const e = experience.find((x) => x.id === id)
  if (!e) return null
  const i = experience.indexOf(e)
  return (
    <>
      <p className="mono-label text-dim">
        // Station 0{i + 1} {e.current && <span className="ml-2 text-live">· Current</span>}
      </p>
      <h3 className="mt-4 text-[2rem] font-extrabold leading-[1.05] tracking-tight">{e.role}</h3>
      <p className="mt-2 text-lg font-semibold text-[#c7d2fe]">{e.company}</p>
      <p className="mt-2 font-mono text-xs uppercase tracking-wider text-dim">
        {e.period}
        {e.location && ` · ${e.location}`}
      </p>
      <Block title="Responsibilities">
        <Bullets items={e.responsibilities} />
      </Block>
      <Block title="Technologies">
        <Tags items={e.technologies} />
      </Block>
    </>
  )
}

function CertificationDetail({ id }: { id: string }) {
  const c = certifications.find((x) => x.id === id)
  if (!c) return null
  return (
    <>
      <p className="mono-label text-gold">// Certification</p>
      <h3 className="mt-4 text-[2rem] font-extrabold leading-[1.05] tracking-tight">{c.name}</h3>
      <p className="mt-2 text-muted">
        Issued by {c.issuer}
        {c.date && ` · ${c.date}`}
      </p>
      <Block title="Certificate">
        {c.image ? (
          <a href={c.image} target="_blank" rel="noopener noreferrer">
            <img src={c.image} alt={`${c.name} certificate`} className="rounded-xl border border-gold/30" />
          </a>
        ) : (
          <div className="flex aspect-[1.45] flex-col items-center justify-center gap-3 rounded-xl border border-gold/30 bg-gold/[0.04] p-6 text-center">
            <Award size={30} className="text-gold" aria-hidden="true" />
            <p className="text-sm font-bold">{c.name}</p>
            <p className="text-xs text-dim">The certificate image will be shown here once it is added.</p>
          </div>
        )}
        {c.credentialUrl && (
          <a className="btn btn-dark mt-4" href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
            Verify credential <ArrowUpRight size={14} />
          </a>
        )}
      </Block>
      <Block title="Achievements">
        <Bullets items={achievements.map((a) => a.detail)} color="bg-gold" />
      </Block>
    </>
  )
}

const TITLES: Record<Selection['type'], string> = {
  skill: 'Technology',
  project: 'Case study',
  experience: 'Experience dossier',
  certification: 'Certification',
}

export function DetailPanel() {
  const selected = useAppStore((s) => s.selected)
  const select = useAppStore((s) => s.select)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!selected) return
    if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && select(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, select])

  useEffect(() => {
    if (!selected && returnFocus.current) {
      returnFocus.current.focus?.({ preventScroll: true })
      returnFocus.current = null
    }
  }, [selected])

  return (
    <AnimatePresence>
      {selected && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[70] bg-black/30 md:bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => select(null)}
            aria-hidden="true"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={TITLES[selected.type]}
            className="glass-strong fixed inset-y-0 right-0 z-[80] flex w-full max-w-[30rem] flex-col border-l md:inset-y-3 md:right-3 md:rounded-3xl md:border"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-line px-7 py-4">
              <span className="mono-label text-fg/70">{TITLES[selected.type]}</span>
              <button ref={closeRef} type="button" onClick={() => select(null)} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-white/40" aria-label="Close details">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pb-10 pt-7" key={`${selected.type}-${selected.id}`}>
              {selected.type === 'skill' && <SkillDetail id={selected.id} />}
              {selected.type === 'project' && <ProjectDetail id={selected.id} />}
              {selected.type === 'experience' && <ExperienceDetail id={selected.id} />}
              {selected.type === 'certification' && <CertificationDetail id={selected.id} />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
