import { HeroSection } from './sections/HeroSection'
import { AboutSection } from './sections/AboutSection'
import { SkillsSection } from './sections/SkillsSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { ContactSection } from './sections/ContactSection'

/** Who I am → What I know → Where I've worked → What I build → What I've achieved → How to connect. */
export function Home({ world }: { world: boolean }) {
  return (
    <main className="content-layer">
      <HeroSection world={world} />
      <AboutSection />
      <SkillsSection world={world} />
      <ExperienceSection />
      <ProjectsSection />
      <CertificationsSection />
      <ContactSection />
    </main>
  )
}
