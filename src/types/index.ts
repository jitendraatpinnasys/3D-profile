export type SectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'certifications'
  | 'contact'

export interface Profile {
  name: string
  firstName: string
  titles: string[]
  tagline: string
  experienceYears: string
  location: string
  locationShort: string
  linkedin: string
  /** Leave empty until you want it published. Never invented. */
  email: string
  /** Path inside /public. Set `available` once the PDF is added. */
  resume: { path: string; available: boolean }
  /** Path inside /public, or null to show the placeholder monogram. */
  photo: string | null
  /** Path inside /public — the portrait rendered as a hologram in the 3D hero. */
  heroPhoto: string
  status: string
  summary: string[]
  heroSlides: { title: [string, string]; kicker: string; text: string }[]
  infoCards: { title: string; label: string }[]
}

export type SkillCategoryId = 'ai' | 'frontend' | 'backend' | 'database' | 'cloud'

export interface Skill {
  id: string
  name: string
  category: SkillCategoryId
  description: string
}

export interface SkillCategory {
  id: SkillCategoryId
  title: string
  short: string
  description: string
  /** hex colour used for the 3D station light */
  color: string
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  location?: string
  current: boolean
  summary: string
  responsibilities: string[]
  technologies: string[]
}

export interface Project {
  id: string
  index: string
  name: string
  category: string
  overview: string
  problem: string
  solution: string
  architecture: string[]
  features: string[]
  stack: string[]
  /** paths inside /public (screenshots) */
  images: string[]
  /** leave empty unless a real URL exists */
  links: { github?: string; live?: string }
  /** which 3D installation to render in the showroom */
  installation: 'documents' | 'property' | 'commerce' | 'generic'
}

export interface Certification {
  id: string
  name: string
  issuer: string
  /** Leave empty if unknown. */
  date: string
  /** path inside /public or null until supplied */
  image: string | null
  credentialUrl?: string
}

export interface Achievement {
  id: string
  title: string
  detail: string
}

export interface NavItem {
  id: SectionId
  label: string
  /** name of the 3D environment shown in the HUD */
  world: string
}
