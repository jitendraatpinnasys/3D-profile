import { profile } from '../../data/profile'
import { SectionLabel } from '../../components/ui/SectionLabel'

/** Initials shown until a real photo is configured in profile.ts. */
function PhotoPlaceholder() {
  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .join('')
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(80%_70%_at_50%_30%,#3a3f5c_0%,#16171f_60%,#0c0c11_100%)]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255 / .06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <span className="display display-3d relative text-[7rem]" aria-hidden="true">
        {initials}
      </span>
    </div>
  )
}

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative flex min-h-[100svh] items-center px-5 py-28 sm:px-10 lg:px-16">
      <div id="kf-about" data-nav-target className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* tilted profile card */}
        <div className="pe relative mx-auto w-full max-w-[22rem]" data-reveal>
          <div className="absolute -inset-10 -z-10 rotate-12 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(200_210_255/0.35),transparent)] blur-2xl" aria-hidden="true" />
          <figure className="glass relative aspect-[4/5] -rotate-[5deg] overflow-hidden rounded-[2rem] p-2.5 transition-transform duration-700 hover:rotate-0">
            <div className="h-full w-full overflow-hidden rounded-[1.6rem]">
              {profile.photo ? (
                <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover object-[50%_30%]" />
              ) : (
                <PhotoPlaceholder />
              )}
            </div>
            <figcaption className="glass-strong absolute inset-x-5 bottom-5 flex items-center justify-between rounded-xl px-4 py-3">
              <span className="mono-label flex items-center gap-2.5 text-fg">
                <span className="status-dot" aria-hidden="true" /> {profile.status}
              </span>
              <span className="font-mono text-[0.65rem] text-dim">{new Date().getFullYear()}</span>
            </figcaption>
          </figure>
        </div>

        {/* profile text */}
        <div className="pe">
          <SectionLabel>System Profile</SectionLabel>
          <h2 id="about-title" className="mt-5 text-[clamp(2.4rem,5.5vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em]" data-reveal>
            Hello, I'm
            <br />
            <span className="display-3d-dim">{profile.name}</span>
          </h2>
          <div className="mt-6 max-w-xl space-y-3 text-[0.97rem] leading-relaxed text-muted" data-reveal>
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" data-reveal>
            {profile.infoCards.map((c) => (
              <li key={c.title} className="glass rounded-2xl px-4 py-3.5 transition-colors hover:border-white/20">
                <p className="text-[1.05rem] font-extrabold tracking-tight">{c.title}</p>
                <p className="mono-label mt-1 !text-[0.6rem] text-dim">{c.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
