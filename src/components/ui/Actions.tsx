import { ArrowUpRight, Download } from 'lucide-react'
import { profile } from '../../data/profile'
import { useAppStore } from '../../store/useAppStore'
import { LinkedInIcon } from './Icons'

type Variant = 'light' | 'dark'

export function ResumeButton({ variant = 'dark', label = 'Download Resume' }: { variant?: Variant; label?: string }) {
  const showToast = useAppStore((s) => s.showToast)
  if (profile.resume.available) {
    return (
      <a className={`btn btn-${variant}`} href={profile.resume.path} download>
        <Download size={15} aria-hidden="true" /> {label}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      onClick={() => {
        if (import.meta.env.DEV) console.info('[portfolio] Add public/resume/Jitendra-Saini-Resume.pdf and set resume.available = true in src/data/profile.ts')
        showToast('The resume download is coming soon. Connect on LinkedIn in the meantime.')
      }}
    >
      <Download size={15} aria-hidden="true" /> {label}
    </button>
  )
}

export function LinkedInButton({ variant = 'dark', label = 'Connect on LinkedIn' }: { variant?: Variant; label?: string }) {
  return (
    <a className={`btn btn-${variant}`} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
      <LinkedInIcon size={15} /> {label}
      <ArrowUpRight size={14} aria-hidden="true" className="opacity-60" />
    </a>
  )
}
