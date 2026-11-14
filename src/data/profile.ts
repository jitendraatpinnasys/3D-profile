import type { Profile } from '../types'

/**
 * Single source of truth for personal details.
 * Fields marked PLACEHOLDER are intentionally empty — fill them in when ready.
 */
export const profile: Profile = {
  name: 'Jitendra Saini',
  firstName: 'Jitendra',
  titles: ['AI Engineer', 'Full-Stack Developer', 'Generative AI & LLM Application Engineer'],
  tagline: 'Building Intelligent Applications. Engineering Scalable Solutions.',
  experienceYears: '4.5+',
  location: 'Jaipur, Rajasthan, India',
  locationShort: 'Jaipur, India',
  linkedin: 'https://www.linkedin.com/in/jitendra-saini-243971255/',
  // PLACEHOLDER — add your email address here to show it across the site.
  email: '',
  // PLACEHOLDER — add public/resume/Jitendra-Saini-Resume.pdf, then set available: true
  resume: { path: '/resume/Jitendra-Saini-Resume.pdf', available: false },
  photo: '/images/jitendra.png',
  heroPhoto: '/images/jitendra.png',
  status: 'Open to opportunities',
  summary: [
    'I am a Software Engineer specializing in Full-Stack Development and AI Engineering.',
    'I build scalable applications, backend systems, AI-powered workflows, and intelligent software solutions.',
    'My engineering experience includes working with modern JavaScript frameworks, Python backend technologies, relational and NoSQL databases, cloud infrastructure, and Generative AI systems.',
    'I enjoy exploring emerging AI technologies and developing practical solutions that solve real-world business problems.',
  ],
  heroSlides: [
    {
      title: ['AI', 'ENGINEER'],
      kicker: 'Beyond code, into intelligence',
      text: 'Building production-ready AI & LLM applications and agentic workflows.',
    },
    {
      title: ['FULL-STACK', 'DEVELOPER'],
      kicker: 'Frontend to backend',
      text: 'Scalable web applications with React, Next.js, Python, FastAPI & Node.js.',
    },
    {
      title: ['SCALABLE', 'SYSTEMS'],
      kicker: 'Robust backend architecture',
      text: 'RESTful APIs, database engineering and cloud-ready application architectures.',
    },
  ],
  infoCards: [
    { title: '4.5+ Years', label: 'Experience' },
    { title: 'AI & LLM', label: 'Application Dev' },
    { title: 'Full-Stack', label: 'Engineering' },
    { title: 'Backend', label: 'Architecture' },
    { title: 'Database', label: 'Engineering' },
    { title: 'Production', label: 'Applications' },
  ],
}
