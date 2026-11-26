import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { PUBLIC_STATIC_ROUTES } from '../../config/seoRoutes'
import { siteConfig } from '../../config/site'
import { absoluteSiteUrl } from '../../lib/seo/siteOrigin'
import { setJsonLdScript, setLinkRel, setMetaContent, setRobots } from '../../lib/seo/metaTags'
import { usePageSeoOverride } from './PageSeo'

const DEFAULT_TITLE = siteConfig.seo.title
const DEFAULT_DESC = siteConfig.seo.description
const DEFAULT_OG = siteConfig.seo.ogImage

/** Updates title, canonical, OG/Twitter, robots, and JSON-LD on route changes (SPA). */
export function DocumentHead() {
  const { pathname } = useLocation()
  const override = usePageSeoOverride()

  const staticMeta = useMemo(
    () => PUBLIC_STATIC_ROUTES.find((r) => r.path === pathname),
    [pathname],
  )

  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin')
    const isNotFound = pathname === '/404'

    const title = override?.title ?? staticMeta?.title ?? DEFAULT_TITLE
    const description = override?.description ?? staticMeta?.description ?? DEFAULT_DESC
    const ogImage = absoluteSiteUrl(override?.ogImage ?? DEFAULT_OG)
    const canonical = absoluteSiteUrl(pathname)

    document.title = title
    setMetaContent('name', 'description', description)

    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined
    if (verification?.trim()) {
      setMetaContent('name', 'google-site-verification', verification.trim())
    }

    if (override?.noIndex || isAdmin || isNotFound) {
      setRobots('noindex, nofollow')
    } else {
      setRobots('index, follow, max-image-preview:large')
    }

    setLinkRel('canonical', canonical)

    setMetaContent('property', 'og:type', 'website')
    setMetaContent('property', 'og:site_name', siteConfig.brand.name)
    setMetaContent('property', 'og:title', title)
    setMetaContent('property', 'og:description', description)
    setMetaContent('property', 'og:image', ogImage)
    setMetaContent('property', 'og:image:alt', siteConfig.seo.ogImageAlt)
    setMetaContent('property', 'og:url', canonical)
    setMetaContent('property', 'og:locale', 'en_PH')

    setMetaContent('name', 'twitter:card', 'summary_large_image')
    setMetaContent('name', 'twitter:title', title)
    setMetaContent('name', 'twitter:description', description)
    setMetaContent('name', 'twitter:image', ogImage)

    if (pathname === '/') {
      const origin = absoluteSiteUrl('/')
      setJsonLdScript('arthaland-jsonld', {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${origin}#organization`,
            name: siteConfig.brand.name,
            url: origin,
            logo: absoluteSiteUrl(siteConfig.brand.logoLockupSrc),
            sameAs: [siteConfig.social.facebook],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'sales',
              email: siteConfig.contact.salesEmail,
              telephone: siteConfig.contact.salesPhones[0]?.tel,
              areaServed: 'PH',
              availableLanguage: ['en'],
            },
          },
          {
            '@type': 'WebSite',
            '@id': `${origin}#website`,
            url: origin,
            name: siteConfig.brand.name,
            publisher: { '@id': `${origin}#organization` },
            inLanguage: 'en-PH',
          },
        ],
      })
    } else {
      setJsonLdScript('arthaland-jsonld', null)
    }
  }, [pathname, staticMeta, override])

  return null
}