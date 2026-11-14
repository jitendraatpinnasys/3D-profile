import { Award, ArrowRight, Sparkles } from 'lucide-react'
import { achievements, certifications } from '../../data/certifications'
import { useAppStore } from '../../store/useAppStore'
import { SectionHeading, SectionLabel } from '../../components/ui/SectionLabel'

export function CertificationsSection() {
  const select = useAppStore((s) => s.select)
  return (
    <section id="certifications" aria-labelledby="cert-title" className="relative flex min-h-[100svh] items-center px-5 py-28 sm:px-10 lg:px-16">
      <div id="kf-cert" data-nav-target className="pe w-full max-w-[32rem]">
        <SectionLabel>Achievement Gallery</SectionLabel>
        <SectionHeading>
          <span id="cert-title">Certifications &amp; Achievements</span>
        </SectionHeading>

        <ul className="mt-8 space-y-3">
          {certifications.map((c) => (
            <li key={c.id} data-reveal>
              <button
                type="button"
                onClick={() => select({ type: 'certification', id: c.id })}
                className="glass group flex w-full items-start gap-4 rounded-2xl border-gold/30 p-5 text-left transition-colors hover:border-gold/70"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
                  <Award size={20} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="mono-label !text-[0.58rem] text-gold">// Certification</span>
                  <span className="mt-1 block text-lg font-extrabold leading-tight tracking-tight">{c.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    Issued by {c.issuer}
                    {c.date && ` · ${c.date}`}
                  </span>
                </span>
                <ArrowRight size={16} className="mt-1 text-dim transition-transform group-hover:translate-x-1 group-hover:text-fg" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <ul className="mt-4 space-y-2.5" data-reveal>
          {achievements.map((a, i) => (
            <li key={a.id} className="glass flex items-start gap-4 rounded-2xl px-5 py-4">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-violet">
                <Sparkles size={15} aria-hidden="true" />
              </span>
              <span>
                <span className="mono-label !text-[0.56rem] text-dim">Achievement 0{i + 1}</span>
                <span className="mt-0.5 block text-sm font-bold">{a.title}</span>
                <span className="block text-[0.82rem] text-muted">{a.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
