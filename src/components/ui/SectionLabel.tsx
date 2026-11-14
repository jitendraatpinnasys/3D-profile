import type { ReactNode } from 'react'

/** The "// SYSTEM PROFILE" style chip used above every section heading. */
export function SectionLabel({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
  return (
    <span className="chip mono-label text-muted" data-reveal>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-fg/80" aria-hidden="true" />}
      // {children}
    </span>
  )
}

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-5 text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-balance ${className}`} data-reveal>
      {children}
    </h2>
  )
}
