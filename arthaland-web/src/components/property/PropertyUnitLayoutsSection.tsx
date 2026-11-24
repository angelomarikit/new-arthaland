import { useMemo, useState } from 'react'
import { ZoomIn } from 'lucide-react'
import type { UnitType } from '../../domain/development/types'
import { UNIT_TAB_LABEL, UNIT_TAB_ORDER } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { ReadableBodyText } from '../ui/ReadableBodyText'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

type PropertyUnitLayoutsSectionProps = {
  units: UnitType[]
}

/** Full plan visible inside preview; wide enough that room labels stay legible. */
const layoutPreviewImgClass =
  'mx-auto block h-auto w-full max-h-[min(38rem,58svh)] max-w-[min(100%,56rem)] object-contain md:max-h-[min(42rem,62svh)]'
const layoutPreviewFrameClass =
  'flex w-full items-center justify-center bg-surface px-4 py-5 sm:px-6'

type LayoutImagePreviewCardProps = {
  src: string
  alt: string
  onZoom: () => void
}

function LayoutImagePreviewCard({ src, alt, onZoom }: LayoutImagePreviewCardProps) {
  return (
    <figure className="overflow-hidden border border-border bg-surface">
      <button
        type="button"
        className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        onClick={onZoom}
        aria-label={`Zoom — ${alt}`}
      >
        <div className={layoutPreviewFrameClass}>
          <img src={src} alt={alt} className={layoutPreviewImgClass} loading="lazy" />
        </div>
      </button>
      <div className="border-t border-border bg-surface-soft">
        <button
          type="button"
          onClick={onZoom}
          className="flex w-full items-center justify-center gap-2.5 px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink sm:py-4 sm:text-base"
        >
          <ZoomIn className="size-5 shrink-0" aria-hidden />
          Zoom to view details
        </button>
      </div>
    </figure>
  )
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
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)

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
            {filtered.map((unit) => (
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
                {(unit.unitRenderImages?.length ?? 0) > 0 ||
                (unit.floorPlanImages?.length ?? 0) > 0 ? (
                  <div className="mt-8 space-y-8 overflow-visible">
                    {unit.unitRenderImages?.map((src) => (
                      <LayoutImagePreviewCard
                        key={`render-${src}`}
                        src={src}
                        alt={`Unit render — ${unit.name}`}
                        onZoom={() => setZoomSrc(src)}
                      />
                    ))}
                    {unit.floorPlanImages.map((src) => (
                      <LayoutImagePreviewCard
                        key={src}
                        src={src}
                        alt={`Floor plan — ${unit.name}`}
                        onZoom={() => setZoomSrc(src)}
                      />
                    ))}
                  </div>
                ) : null}
                {unit.brochureUrl && (
                  <a
                    href={unit.brochureUrl}
                    className="mt-4 inline-block text-sm underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download brochure
                  </a>
                )}
              </article>
            ))}
          </div>
        </FadeInWhenVisible>
      </Container>

      {zoomSrc && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink/92"
          role="dialog"
          aria-modal="true"
          aria-label="Floor plan zoom"
        >
          <button
            type="button"
            className="flex min-h-0 flex-1 cursor-zoom-out items-center justify-center p-4 pb-2 md:p-8"
            onClick={() => setZoomSrc(null)}
            aria-label="Close zoom view"
          >
            <img
              src={zoomSrc}
              alt=""
              className="h-auto max-h-[78vh] w-auto max-w-full object-contain md:max-h-[82vh]"
            />
          </button>
          <div className="shrink-0 border-t border-surface/15 bg-ink px-4 py-3 text-center sm:py-4">
            <p className="text-sm text-surface/90 sm:text-base">Tap anywhere to close</p>
          </div>
        </div>
      )}
    </section>
  )
}
