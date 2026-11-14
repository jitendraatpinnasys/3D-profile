import type { Project } from '../types'

/**
 * Initial portfolio entries. Add more objects to this array — the DOM cards and
 * the 3D showroom both render from it (extra entries use the 'generic' installation).
 * Leave `links` empty unless a real public URL exists.
 */
export const projects: Project[] = [
  {
    id: 'doc-ai',
    index: '01',
    name: 'AI-Powered Document Processing Platform',
    category: 'AI Agents · LLM',
    overview:
      'A document-processing application that uses AI agents and LLM workflows to extract structured information, validate extracted data, and support intelligent document analysis.',
    problem:
      'Information inside PDFs and scanned documents is slow and error-prone to extract and verify by hand.',
    solution:
      'An agent-driven pipeline that extracts text (PDF + OCR), maps it to structured JSON, validates it against schemas, and lets users ask questions about processed documents.',
    architecture: [
      'React frontend for uploads, review and history',
      'FastAPI service orchestrating the processing pipeline',
      'LangGraph agents calling LLM APIs for extraction & Q&A',
      'PostgreSQL for documents, results and processing history',
    ],
    features: [
      'Document uploads',
      'PDF and OCR extraction',
      'Structured JSON extraction',
      'Schema-based validation',
      'AI agent execution',
      'Processing history',
      'Intelligent question-answering',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'LangGraph', 'LLM APIs', 'React'],
    images: [],
    links: {},
    installation: 'documents',
  },
  {
    id: 'property-saas',
    index: '02',
    name: 'AI-Powered Property Management SaaS',
    category: 'SaaS · Applied AI',
    overview: 'An AI-enhanced property management platform.',
    problem:
      'Property teams handle leases, maintenance requests and property data spread across unstructured documents and messages.',
    solution:
      'LLM-assisted extraction and classification that turns leases and requests into structured data, with human review before updates are applied.',
    architecture: [
      'React frontend for property teams',
      'FastAPI backend with LLM API integrations',
      'PostgreSQL for structured property data',
      'Docker-based services',
    ],
    features: [
      'Lease agreement extraction',
      'Maintenance request classification',
      'Intelligent property data querying',
      'Structured data processing',
      'Human-reviewed updates',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'React', 'LLM APIs'],
    images: [],
    links: {},
    installation: 'property',
  },
  {
    id: 'shopify',
    index: '03',
    name: 'E-commerce Website Development',
    category: 'Shopify · Storefront',
    overview: 'A modern Shopify-based e-commerce experience.',
    problem: 'A store needed a custom, responsive storefront beyond a stock theme.',
    solution:
      'Custom Shopify storefront development with Liquid templates, structured catalog navigation and third-party integrations.',
    architecture: [
      'Shopify platform & admin',
      'Custom Liquid theme templates',
      'JavaScript for interactive storefront behaviour',
      'Third-party app / API integrations',
    ],
    features: [
      'Custom storefront development',
      'Product catalog management',
      'Category navigation',
      'Product data integration',
      'Responsive UI',
      'Third-party integrations',
    ],
    stack: ['Shopify', 'Liquid', 'JavaScript', 'HTML', 'CSS'],
    images: [],
    links: {},
    installation: 'commerce',
  },
]
