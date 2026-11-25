import { useMemo, useState } from 'react'
import type { UnitType } from '../../domain/development/types'
import { UNIT_TAB_LABEL, UNIT_TAB_ORDER } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { ReadableBodyText } from '../ui/ReadableBodyText'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'
import { PropertyImageCarousel } from './PropertyImageCarousel'

type PropertyUnitLayoutsSectionProps = {
  units: UnitType[]
}

export function PropertyUnitLayoutsSection({ units }: PropertyUnitLayoutsSectionProps) {
  const visibleUnits = useMemo(
    () =>
      units
        .filter(
          (u) =>
            u.publicationStatus !== 'draft' &&
            ((u.floorPlanImages?.length ?? 0) > 0 ||
              (u.unitRenderImages?.length ?? 0) > 0),
        )
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [units],
  )

  const tabGroups = useMemo(() => {
    const present = new Set(
      visibleUnits.map((u) => u.tabGroup ?? 'custom').filter(Boolean),
    )
    return UNIT_TAB_ORDER.filter((t) => present.has(t))
  }, [visibleUnits])

  const [activeTab, setActiveTab] = useState(tabGroups[0] ?? 'custom')

  const filtered = useMemo(
    () =>
      visibleUnits
        .filter((u) => (u.tabGroup ?? 'custom') === activeTab)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [visibleUnits, activeTab],
  )

  if (visibleUnits.length === 0) {
    return (
      <section className="py-16 md:py-20" id="layouts">
        <Container className="section-x max-w-3xl">
          <Eyebrow>Residences</Eyebrow>
          <h2 className="text-heading-3 mt-4">Unit layouts</h2>
          <p className="mt-4 text-title-muted">
            Floor plans appear here after unit types are set to <strong>Published</strong> in admin
            (Properties → Units) and a floor plan image is uploaded.
          </p>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24" id="layouts">
      <Container className="section-x max-w-[min(100%,1440px)]">
        <FadeInWhenVisible className="overflow-visible">
          <Eyebrow>Residences</Eyebrow>
          <h2 className="text-heading-3 mt-4">Unit layouts & floor plans</h2>
          {tabGroups.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tabGroups.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    activeTab === tab
                      ? 'border-ink bg-ink text-surface'
                      : 'border-border text-title-muted'
                  }`}
                >
                  {UNIT_TAB_LABEL[tab]}
                </button>
              ))}
            </div>
          )}
          <div className="mt-10 flex flex-col gap-12">
            {filtered.map((unit) => {
              const renders = unit.unitRenderImages ?? []
              const plans = unit.floorPlanImages ?? []
              const hasRenders = renders.length > 0
              const hasPlans = plans.length > 0

              return (
                <article
                  key={unit.id}
                  className="overflow-visible border border-border bg-surface-soft p-6 md:p-8"
                >
                  <h3 className="text-lg font-medium">{unit.name}</h3>
                  {unit.description ? (
                    <ReadableBodyText className="mt-2 text-sm">{unit.description}</ReadableBodyText>
                  ) : null}
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {unit.bedrooms && (
                      <>
                        <dt className="text-title-muted">Bedrooms</dt>
                        <dd>{unit.bedrooms}</dd>
                      </>
                    )}
                    {unit.bathrooms && (
                      <>
                        <dt className="text-title-muted">Bathrooms</dt>
                        <dd>{unit.bathrooms}</dd>
                      </>
                    )}
                    {(unit.areaMin || unit.areaMax) && (
                      <>
                        <dt className="text-title-muted">Area (sqm)</dt>
                        <dd>
                          {[unit.areaMin, unit.areaMax].filter(Boolean).join(' – ')}
                        </dd>
                      </>
                    )}
                    {unit.priceNote && (
                      <>
                        <dt className="text-title-muted">Pricing note</dt>
                        <dd>{unit.priceNote}</dd>
                      </>
                    )}
                  </dl>
                  {unit.features && unit.features.length > 0 && (
                    <ul className="mt-4 list-disc pl-5 text-sm text-title-muted">
                      {unit.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}

                  {hasRenders ? (
                    <div className="mt-6">
                      <p className="mb-2 text-xs uppercase tracking-[0.12em] text-title-muted">
                        Unit renderings
                      </p>
                      <PropertyImageCarousel
                        key={`${unit.id}-renders`}
                        images={renders}
                        label={`${unit.name} unit renderings`}
                        getImageAlt={(index) => `Unit render — ${unit.name} (${index + 1})`}
                        variant="layout"
                      />
                    </div>
                  ) : null}

                  {hasPlans ? (
                    <div className="mt-6">
                      <p className="mb-2 text-xs uppercase tracking-[0.12em] text-title-muted">
                        Floor plans
                      </p>
                      <PropertyImageCarousel
                        key={`${unit.id}-plans`}
                        images={plans}
                        label={`${unit.name} floor plans`}
                        getImageAlt={(index) => `Floor plan — ${unit.name} (${index + 1})`}
                        variant="layout"
                      />
                    </div>
                  ) : null}

                  {unit.brochureUrl ? (
                    <a
                      href={unit.brochureUrl}
                      className="mt-6 inline-block text-sm underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download brochure
                    </a>
                  ) : null}
                </article>
              )
            })}
          </div>
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}