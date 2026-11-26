import { siteConfig } from './site'

export const PUBLIC_STATIC_ROUTES: { path: string; title: string; description: string }[] = [
  {
    path: '/',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  {
    path: '/about',
    title: 'About ARTHALAND — Sustainable Philippine Developments',
    description:
      'Learn how ARTHALAND designs exceptional residential and commercial spaces with sustainability and wellness at the core.',
  },
  {
    path: '/properties',
    title: 'Properties — ARTHALAND Portfolio',
    description:
      'Browse published ARTHALAND residential and commercial developments across the Philippines.',
  },
  {
    path: '/featured-units',
    title: 'Featured Units — ARTHALAND',
    description:
      'Explore select available units across ARTHALAND developments with pricing guidance and specifications.',
  },
  {
    path: '/certifications',
    title: 'Green Building Certifications — ARTHALAND',
    description:
      'How ARTHALAND aligns developments with recognized green building and wellness certification frameworks.',
  },
  {
    path: '/services',
    title: 'Services — ARTHALAND Sales Advisory',
    description:
      'Property consultation, development information, viewing coordination, and buying guidance from ARTHALAND.',
  },
  {
    path: '/team',
    title: 'Team — ARTHALAND',
    description: 'Meet the ARTHALAND sales and advisory team.',
  },
  {
    path: '/contact',
    title: 'Contact ARTHALAND',
    description:
      'Request information or schedule a consultation with the ARTHALAND sales team.',
  },
  {
    path: '/faq',
    title: 'FAQ — ARTHALAND',
    description: 'Frequently asked questions about ARTHALAND properties, viewings, and buying process.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — ARTHALAND',
    description: 'Privacy practices for the ARTHALAND sales team website.',
  },
]
