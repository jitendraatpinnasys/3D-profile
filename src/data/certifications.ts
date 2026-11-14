import type { Achievement, Certification } from '../types'

export const certifications: Certification[] = [
  {
    id: 'claude-dev-foundation',
    name: 'Claude Certified Developer – Foundation',
    issuer: 'Anthropic',
    // PLACEHOLDER — add the issue date when available
    date: '',
    // PLACEHOLDER — add public/certificates/<file>.jpg and set e.g. '/certificates/claude-certified-developer.jpg'
    image: null,
  },
]

export const achievements: Achievement[] = [
  {
    id: 'cypher',
    title: 'CYPHER 2026 AI Summit',
    detail: 'Represented Pinnasys at CYPHER 2026 AI Summit, Bengaluru.',
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Software Development',
    detail: 'Professional experience in Full-Stack Software Development.',
  },
  {
    id: 'agentic',
    title: 'AI Applications & Agentic Workflows',
    detail: 'Experience building AI-powered applications and agentic workflows.',
  },
]
