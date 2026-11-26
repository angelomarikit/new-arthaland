const PRODUCTION_ORIGIN = 'https://arthaland-xi.vercel.app'

export function getSiteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (typeof window !== 'undefined') return window.location.origin
  return PRODUCTION_ORIGIN
}

export function absoluteSiteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const origin = getSiteOrigin()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${origin}${normalized}`
}