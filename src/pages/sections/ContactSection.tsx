import { useState, type FormEvent } from 'react'
import { ArrowUp, Mail, MapPin, Send } from 'lucide-react'
import { profile } from '../../data/profile'
import { useAppStore } from '../../store/useAppStore'
import { scrollToSection } from '../../utils/navigate'
import { LinkedInButton, ResumeButton } from '../../components/ui/Actions'
import { LinkedInIcon } from '../../components/ui/Icons'
import { SectionLabel } from '../../components/ui/SectionLabel'

/**
 * Contact form with NO backend: it composes an email in the visitor's own mail
 * app (mailto:). A real submission endpoint would need a future backend / email
 * service integration. Shown only when an email is configured in profile.ts.
 */
function DispatchForm() {
  const [form, setForm] = useState({ first: '', last: '', email: '', message: '' })
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.first} ${form.last}`.trim())
    const body = encodeURIComponent(`${form.message}\n\n— ${form.first} ${form.last}\n${form.email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }
  const field =
    'w-full border-b border-line bg-transparent py-3 text-sm text-fg placeholder:text-dim focus:border-violet focus:outline-none transition-colors'
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-5">
        <label className="block">
          <span className="sr-only">First name</span>
          <input required className={field} placeholder="First Name" value={form.first} onChange={set('first')} autoComplete="given-name" />
        </label>
        <label className="block">
          <span className="sr-only">Last name</span>
          <input className={field} placeholder="Last Name" value={form.last} onChange={set('last')} autoComplete="family-name" />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Your email</span>
        <input required type="email" className={field} placeholder="Your Email" value={form.email} onChange={set('email')} autoComplete="email" />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea required rows={3} className={`${field} resize-none`} placeholder="What are we building?" value={form.message} onChange={set('message')} />
      </label>
      <button type="submit" className="btn btn-light mt-2">
        <Send size={14} aria-hidden="true" /> Compose message
      </button>
      <p className="font-mono text-[0.62rem] leading-relaxed text-dim">
        Opens your email app with the message pre-filled. Nothing is sent to a server — direct submission needs a future email integration.
      </p>
    </form>
  )
}

export function ContactSection() {
  const showToast = useAppStore((s) => s.showToast)
  const getInTouch = () => {
    if (profile.email) window.location.href = `mailto:${profile.email}`
    else window.open(profile.linkedin, '_blank', 'noopener,noreferrer')
  }
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pt-24">
      <p className="contact-giant display select-none text-center text-[clamp(5rem,21vw,20rem)] text-white/[0.07]" aria-hidden="true">
        Contact
      </p>

      <div id="kf-contact" data-nav-target className="mx-auto -mt-[6vw] grid min-h-[80svh] max-w-7xl items-center gap-10 px-5 pb-20 sm:px-10 lg:grid-cols-[1fr_minmax(0,0.6fr)_1fr] lg:px-16">
        <div className="pe">
          <SectionLabel>Comms Portal</SectionLabel>
          <h2 id="contact-title" className="mt-5 text-[clamp(2.1rem,4vw,3.4rem)] font-extrabold leading-[0.98] tracking-[-0.035em]" data-reveal>
            Let's Build Something <span className="display-3d-dim">Intelligent</span> Together.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted" data-reveal>
            I am interested in connecting with professionals, engineering teams, founders, and organizations working on AI, Generative AI, and modern
            software engineering.
          </p>
          <div className="mt-7 flex flex-wrap gap-3" data-reveal>
            <LinkedInButton variant="light" />
            <ResumeButton />
            <button type="button" className="btn btn-dark" onClick={getInTouch}>
              <Mail size={15} aria-hidden="true" /> Get in Touch
            </button>
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />

        <div className="glass pe rounded-3xl p-7" data-reveal>
          <p className="mono-label flex items-center gap-2 text-dim">
            <span className="status-dot" aria-hidden="true" /> // Live dispatch
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
              <dt className="mono-label !text-[0.6rem] text-dim">LinkedIn</dt>
              <dd>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-fg hover:text-violet">
                  <LinkedInIcon size={14} /> jitendra-saini
                </a>
              </dd>
            </div>
            {profile.email && (
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <dt className="mono-label !text-[0.6rem] text-dim">Email</dt>
                <dd>
                  <button
                    type="button"
                    className="text-fg hover:text-violet"
                    onClick={() => {
                      void navigator.clipboard?.writeText(profile.email)
                      showToast('Email address copied to clipboard.')
                    }}
                  >
                    {profile.email}
                  </button>
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 pb-1">
              <dt className="mono-label !text-[0.6rem] text-dim">Location</dt>
              <dd className="inline-flex items-center gap-1.5 text-fg">
                <MapPin size={13} aria-hidden="true" /> {profile.location}
              </dd>
            </div>
          </dl>
          <div className="mt-6">
            {profile.email ? (
              <DispatchForm />
            ) : (
              <p className="text-sm leading-relaxed text-muted">The fastest way to reach me is a LinkedIn message. I'm happy to talk about AI, LLM applications and full-stack work.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="pe relative border-t border-line bg-ink/80 px-5 pb-8 pt-12 backdrop-blur-md sm:px-10 lg:px-16">
      <div className="grid gap-8 font-mono text-[0.72rem] sm:grid-cols-3">
        <div>
          <p className="font-bold text-fg">// Focus Areas</p>
          <p className="mt-2 text-muted">AI &amp; LLM Application Engineering</p>
          <p className="text-muted">Full-Stack Web Engineering</p>
        </div>
        <div className="sm:text-center">
          <p className="font-bold text-fg">// Status</p>
          <p className="mt-2 text-live">{profile.status}</p>
          <button type="button" onClick={() => scrollToSection('projects')} className="mt-1 text-muted underline underline-offset-4 hover:text-fg">
            View Work
          </button>
        </div>
        <div className="sm:text-right">
          <p className="font-bold text-fg">// Region</p>
          <p className="mt-2 text-muted">{profile.location}</p>
          <p className="text-muted">{year}</p>
        </div>
      </div>

      <p className="my-10 select-none text-center font-mono text-[clamp(3rem,13vw,11rem)] font-extrabold leading-none tracking-[-0.06em] text-fg/90" aria-hidden="true">
        {profile.firstName.toUpperCase()}
      </p>

      <div className="flex flex-col gap-4 font-mono text-[0.68rem] text-dim sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-bold text-fg underline underline-offset-4">Contact Transmission</p>
          <p className="mt-2">
            © {year} {profile.name} | Built with React, Three.js &amp; Tailwind
          </p>
        </div>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4 hover:text-violet">
          {profile.email || 'linkedin.com/in/jitendra-saini-243971255'}
        </a>
        <button type="button" onClick={() => scrollToSection('home')} className="inline-flex items-center gap-1 text-fg hover:text-violet">
          Back to Top <ArrowUp size={12} aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
