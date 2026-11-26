/**
 * Writes public/robots.txt and public/sitemap.xml before production build.
 * Uses Supabase REST when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://arthaland-xi.vercel.app').replace(
  /\/$/,
  '',
)

const SOLD_OUT_SLUGS = new Set(['lucima', 'cebu-exchange', 'arya-residences'])

const STATIC_PATHS = [
  '/',
  '/about',
  '/properties',
  '/featured-units',
  '/certifications',
  '/services',
  '/team',
  '/contact',
  '/faq',
  '/privacy',
]

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function urlEntry(loc, lastmod) {
  const lines = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`]
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`)
  lines.push('  </url>')
  return lines.join('\n')
}

async function fetchSupabase(table, query) {
  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!base || !key) return []

  const res = await fetch(`${base.replace(/\/$/, '')}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })
  if (!res.ok) {
    console.warn(`[sitemap] ${table} fetch failed: ${res.status}`)
    return []
  }
  return res.json()
}

async function main() {
  await mkdir(publicDir, { recursive: true })

  const today = new Date().toISOString().slice(0, 10)
  const urls = []

  for (const path of STATIC_PATHS) {
    const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
    urls.push(urlEntry(loc, today))
  }

  const developments = await fetchSupabase(
    'developments',
    'select=slug,updated_at&publication_status=in.(published,coming_soon)&order=display_order.asc',
  )
  for (const row of developments) {
    if (!row?.slug || SOLD_OUT_SLUGS.has(row.slug)) continue
    const lastmod = row.updated_at ? String(row.updated_at).slice(0, 10) : today
    urls.push(urlEntry(`${SITE_URL}/properties/${row.slug}`, lastmod))
  }

  const featured = await fetchSupabase(
    'featured_units',
    'select=slug,updated_at&published=eq.true&status=neq.sold&order=display_order.asc',
  )
  for (const row of featured) {
    if (!row?.slug) continue
    const lastmod = row.updated_at ? String(row.updated_at).slice(0, 10) : today
    urls.push(urlEntry(`${SITE_URL}/featured-units/${row.slug}`, lastmod))
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`

  const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`

  await writeFile(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
  await writeFile(join(publicDir, 'robots.txt'), robots, 'utf8')

  console.log(
    `[sitemap] Wrote ${urls.length} URLs → public/sitemap.xml (${developments.length} properties, ${featured.length} featured units)`,
  )
}

main().catch((err) => {
  console.error('[sitemap] failed:', err)
  process.exit(1)
})