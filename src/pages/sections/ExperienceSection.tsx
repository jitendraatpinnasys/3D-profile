import { ArrowRight, MapPin } from 'lucide-react'
import { experience } from '../../data/experience'
import { sideFor } from '../../scenes/timeline'
import { useAppStore } from '../../store/useAppStore'
import { SectionHeading, SectionLabel } from '../../components/ui/SectionLabel'

export function ExperienceSection() {
  const select = useAppStore((s) => s.select)
  return (
    <section id="experience" aria-labelledby="exp-title" className="relative pt-28">
      <div className="pe mx-auto max-w-4xl px-5 text-center sm:px-10" data-nav-target>
        <SectionLabel>Career Journey</SectionLabel>
        <SectionHeading>
          <span id="exp-title">Where I Have Worked</span>
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted" data-reveal>
          Travel the corridor — each station is a chapter of my professional journey.
        </p>
      </div>

      <ol className="relative">
        {experience.map((e, i) => {
          const side = sideFor(i)
          return (
            <li
              key={e.id}
              id={`kf-exp-${e.id}`}
              className={`flex min-h-[100svh] items-center px-5 py-16 sm:px-10 lg:px-16 ${side === 1 ? 'lg:justify-start' : 'lg:justify-end'}`}
            >
              <article className="glass pe w-full max-w-[30rem] rounded-3xl p-7" data-reveal>
                <header className="flex items-center justify-between gap-3">
                  <p className="mono-label text-dim">// Station 0{i + 1}</p>
                  {e.current ? (
                    <span className="chip mono-label !text-[0.58rem] text-fg">
                      <span className="status-dot" aria-hidden="true" /> Current
                    </span>
                  ) : (
                    <span className="chip mono-label !text-[0.58rem] text-muted">Previous</span>
                  )}
                </header>
                <h3 className="mt-5 text-[1.75rem] font-extrabold leading-[1.05] tracking-tight">{e.role}</h3>
                <p className="mt-2 text-[1.02rem] font-semibold text-[#c7d2fe]">{e.company}</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] uppercase tracking-wider text-dim">
                  <span>{e.period}</span>
                  {e.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} aria-hidden="true" /> {e.location}
                    </span>
                  )}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted">
                  {e.responsibilities.slice(0, 4).map((r) => (
                    <li key={r} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {e.technologies.map((t) => (
                    <li key={t} className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[0.66rem] text-fg/80">
                      {t}
                    </li>
                  ))}
                </ul>
                <button type="button" className="mono-label mt-6 inline-flex items-center gap-2 text-fg hover:text-violet" onClick={() => select({ type: 'experience', id: e.id })}>
                  Open full dossier <ArrowRight size={13} aria-hidden="true" />
                </button>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
