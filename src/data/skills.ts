import type { Skill, SkillCategory } from '../types'

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai',
    title: 'AI & LLM Engineering',
    short: 'AI / LLM',
    description: 'Generative AI systems, agents and LLM-powered workflows.',
    color: '#8b7bff',
  },
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    short: 'Frontend',
    description: 'Responsive, component-driven user interfaces.',
    color: '#4da3ff',
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    short: 'Backend',
    description: 'APIs, services and business logic.',
    color: '#38bdf8',
  },
  {
    id: 'database',
    title: 'Databases',
    short: 'Data',
    description: 'Relational and NoSQL data modelling.',
    color: '#a78bfa',
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    short: 'Cloud',
    description: 'Shipping, hosting and operating applications.',
    color: '#7dd3fc',
  },
]

const s = (id: string, name: string, category: Skill['category'], description: string): Skill => ({
  id,
  name,
  category,
  description,
})

export const skills: Skill[] = [
  // AI & LLM
  s('genai', 'Generative AI', 'ai', 'Designing applications that generate, transform and reason over content using foundation models.'),
  s('agents', 'AI Agents', 'ai', 'Building agents that plan, call tools and act on structured data.'),
  s('agentic', 'Agentic Workflows', 'ai', 'Orchestrating multi-step, tool-using AI pipelines with validation and human review.'),
  s('llm', 'LLM Integration', 'ai', 'Integrating LLM APIs into production applications with structured outputs.'),
  s('chatbots', 'AI Chatbots', 'ai', 'Conversational assistants and automated chatbots integrated into products.'),
  s('prompt', 'Prompt Engineering', 'ai', 'Crafting reliable prompts, schemas and evaluation loops for LLM behaviour.'),
  s('rag', 'RAG', 'ai', 'Retrieval-augmented generation for grounded, document-aware answers.'),
  s('langchain', 'LangChain', 'ai', 'Composing LLM chains, tools and retrievers.'),
  s('langgraph', 'LangGraph', 'ai', 'Stateful, graph-based agent orchestration.'),
  // Frontend
  s('react', 'React.js', 'frontend', 'Component-based UIs for production web applications.'),
  s('next', 'Next.js', 'frontend', 'Full-stack React framework with routing and server rendering.'),
  s('js', 'JavaScript', 'frontend', 'The language of the web, across frontend and Node.js backends.'),
  s('ts', 'TypeScript', 'frontend', 'Typed JavaScript for maintainable, scalable codebases.'),
  s('html', 'HTML5', 'frontend', 'Semantic, accessible markup.'),
  s('css', 'CSS3', 'frontend', 'Layouts, motion and responsive styling.'),
  s('tailwind', 'Tailwind CSS', 'frontend', 'Utility-first styling for fast, consistent design systems.'),
  // Backend
  s('python', 'Python', 'backend', 'Backend services, data processing and AI engineering.'),
  s('fastapi', 'FastAPI', 'backend', 'High-performance Python APIs with typed schemas.'),
  s('node', 'Node.js', 'backend', 'JavaScript runtime for backend services and APIs.'),
  s('nest', 'NestJS', 'backend', 'Structured, modular Node.js server framework.'),
  s('php', 'PHP', 'backend', 'Server-side web application development.'),
  s('rest', 'RESTful APIs', 'backend', 'Designing clean HTTP APIs and business logic.'),
  // Databases
  s('postgres', 'PostgreSQL', 'database', 'Relational database design, querying and optimization.'),
  s('mysql', 'MySQL', 'database', 'Relational data storage for web applications.'),
  s('mongo', 'MongoDB', 'database', 'Document-oriented NoSQL data modelling.'),
  s('sqlalchemy', 'SQLAlchemy', 'database', 'Python ORM and SQL toolkit.'),
  // Cloud & DevOps
  s('aws', 'AWS', 'cloud', 'Cloud infrastructure for hosting and scaling applications.'),
  s('docker', 'Docker', 'cloud', 'Containerized, reproducible application environments.'),
  s('git', 'Git', 'cloud', 'Version control and collaborative workflows.'),
  s('nginx', 'Nginx', 'cloud', 'Web server and reverse proxy configuration.'),
  s('cicd', 'CI/CD', 'cloud', 'Automated build, test and deployment pipelines.'),
]

export const categoryById = Object.fromEntries(skillCategories.map((c) => [c.id, c])) as Record<
  SkillCategory['id'],
  SkillCategory
>

export const skillById = Object.fromEntries(skills.map((sk) => [sk.id, sk])) as Record<string, Skill>
