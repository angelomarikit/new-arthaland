import { useMemo } from 'react'
import type { FeaturedUnit } from '../../domain/featuredUnit/types'
import { useSetPageSeo } from './PageSeo'

export function FeaturedUnitPageSeo({ unit }: { unit: FeaturedUnit }) {
  const seo = useMemo(
    () => ({
      title: `${unit.title} — Featured Unit — ARTHALAND`,
      description:
        unit.description.trim().slice(0, 160) ||
        `${unit.unitLabel} at ${unit.developmentName} in ${unit.location}. ${unit.priceLabel}.`,
      ogImage: unit.heroImage || unit.gallery[0],
    }),
    [unit],
  )
  useSetPageSeo(seo)
  return null
}