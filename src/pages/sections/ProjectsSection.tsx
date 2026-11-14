import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { projects } from '../../data/projects'
import { sideFor } from '../../scenes/timeline'
import { useAppStore } from '../../store/useAppStore'
import { SectionHeading, SectionLabel } from '../../components/ui/SectionLabel'

export function ProjectsSection() {
  const select = useAppStore((s) => s.select)
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative pt-28">
      <div className="pe mx-auto max-w-4xl px-5 text-center sm:px-10" data-nav-target>
        <SectionLabel>Innovation Showroom</SectionLabel>
        <SectionHeading>
          <span id="projects-title">AI &amp; Software Innovations</span>
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted" data-reveal>
          Each installation is a project. Step closer, interact, and open the case study.
        </p>
      </div>

      {projects.map((p, i) => {
        const side = sideFor(i)
        return (
          <div
            key={p.id}
            id={`kf-proj-${p.id}`}
            className={`flex min-h-[100svh] items-center px-5 py-16 sm:px-10 lg:px-16 ${side === 1 ? 'lg:justify-start' : 'lg:justify-end'}`}
          >
            <article className="glass pe w-full max-w-[31rem] rounded-3xl p-7" data-reveal>
              <header className="flex items-center justify-between gap-3">
                <p className="mono-label text-dim">// Project {p.index}</p>
                <span className="chip mono-label !text-[0.58rem] text-fg/85">{p.category}</span>
              </header>
              <h3 className="mt-5 text-[1.75rem] font-extrabold leading-[1.05] tracking-tight">{p.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.overview}</p>
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.8rem] text-fg/80">
                {p.features.slice(0, 6).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <ul className="flex flex-wrap gap-1.5" aria-label="Technology stack">
                  {p.stack.map((t) => (
                    <li key={t} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 font-mono text-[0.64rem] text-fg/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <button type="button" className="mono-label inline-flex items-center gap-2 text-fg hover:text-violet" onClick={() => select({ type: 'project', id: p.id })}>
                  View case study <ArrowRight size={13} aria-hidden="true" />
                </button>
                {p.links.github && (
                  <a className="mono-label inline-flex items-center gap-1 text-muted hover:text-fg" href={p.links.github} target="_blank" rel="noopener noreferrer">
                    Code <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                )}
                {p.links.live && (
                  <a className="mono-label inline-flex items-center gap-1 text-muted hover:text-fg" href={p.links.live} target="_blank" rel="noopener noreferrer">
                    Live <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          </div>
        )
      })}
    </section>
  )
}
