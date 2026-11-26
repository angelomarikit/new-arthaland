import { useMemo } from 'react'
import type { Development } from '../../domain/development/types'
import { useSetPageSeo } from './PageSeo'

export function PropertyPageSeo({ development }: { development: Development }) {
  const seo = useMemo(
    () => ({
      title: development.seo?.title ?? `${development.name} — ARTHALAND`,
      description:
        development.seo?.description ??
        (development.shortDescription || development.fullDescription.slice(0, 160)),
      ogImage:
        development.seo?.ogImage ??
        (development.coverImage || development.heroImage || development.cardImage),
    }),
    [development],
  )
  useSetPageSeo(seo)
  return null
}