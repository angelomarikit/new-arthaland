import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

function uniqueImages(urls: string[]) {
  return [...new Set(urls.filter(Boolean))]
}

export type PropertyImageCarouselProps = {
  images: string[]
  /** Accessible label for the carousel region */
  label: string
  getImageAlt: (index: number) => string
  variant?: 'gallery' | 'layout'
}

const layoutPreviewImgClass =
  'mx-auto block h-auto w-full max-w-full object-contain'

export function PropertyImageCarousel({
  images,
  label,
  getImageAlt,
  variant = 'gallery',
}: PropertyImageCarouselProps) {
  const slides = useMemo(() => uniqueImages(images), [images])
  const [slideIndex, setSlideIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  const openLightbox = useCallback(() => setLightboxOpen(true), [])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    setSlideIndex((i) => (i < slides.length ? i : 0))
  }, [slides.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft' && slides.length > 1) goPrev()
      if (e.key === 'ArrowRight' && slides.length > 1) goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen, closeLightbox, goPrev, goNext, slides.length])

  if (slides.length === 0) return null

  const currentSrc = slides[slideIndex]!
  const isLayout = variant === 'layout'
  const multiple = slides.length > 1

  const previewImgClass = isLayout
    ? layoutPreviewImgClass
    : 'max-h-[min(70vh,520px)] w-full max-w-full object-contain transition-opacity group-hover:opacity-95'

  const stageClass = isLayout
    ? 'relative bg-surface px-2 py-4 sm:px-4 sm:py-5'
    : 'relative bg-surface-muted/40 px-2 py-4 sm:px-4 md:min-h-[480px] md:py-6'

  return (
    <>
      <div
        className="border border-border bg-surface-soft"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
      >
        <div
          className={stageClass}
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current
            const end = e.changedTouches[0]?.clientX
            touchStartX.current = null
            if (start == null || end == null || !multiple) return
            const delta = end - start
            if (Math.abs(delta) < 40) return
            if (delta > 0) goPrev()
            else goNext()
          }}
        >
          <div
            className={`mx-auto grid w-full max-w-[56rem] items-center gap-2 ${
              multiple
                ? 'grid-cols-[minmax(2.75rem,auto)_minmax(0,1fr)_minmax(2.75rem,auto)]'
                : 'grid-cols-1'
            }`}
          >
            {multiple ? (
              <button
                type="button"
                className="flex size-11 shrink-0 items-center justify-center border border-border bg-surface text-ink shadow-sm transition-colors hover:bg-surface-alt"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
            ) : null}

            <div className="flex min-w-0 justify-center">
              {isLayout ? (
                <img
                  src={currentSrc}
                  alt={getImageAlt(slideIndex)}
                  className={previewImgClass}
                  loading={slideIndex === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ) : (
                <button
                  type="button"
                  className="group relative flex w-full cursor-zoom-in justify-center"
                  onClick={openLightbox}
                  aria-label={`Zoom — ${getImageAlt(slideIndex)}`}
                >
                  <img
                    src={currentSrc}
                    alt={getImageAlt(slideIndex)}
                    className={previewImgClass}
                    loading={slideIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <span className="pointer-events-none absolute bottom-3 right-3 bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-wider text-surface md:bottom-4 md:right-4">
                    Tap to zoom
                  </span>
                </button>
              )}
            </div>

            {multiple ? (
              <button
                type="button"
                className="flex size-11 shrink-0 items-center justify-center border border-border bg-surface text-ink shadow-sm transition-colors hover:bg-surface-alt"
                onClick={goNext}
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            ) : null}
          </div>
        </div>

        {isLayout && (
          <div className="border-t border-border bg-surface">
            <button
              type="button"
              onClick={openLightbox}
              className="flex w-full items-center justify-center gap-2.5 px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink sm:py-4 sm:text-base"
            >
              <ZoomIn className="size-5 shrink-0" aria-hidden />
              Zoom to view details
            </button>
          </div>
        )}

        {multiple && isLayout ? (
          <div className="flex justify-center gap-2 border-t border-border px-4 py-3">
            {slides.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setSlideIndex(index)}
                className={`size-2.5 rounded-full transition-colors ${
                  index === slideIndex ? 'bg-ink' : 'bg-border hover:bg-ink/40'
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === slideIndex}
              />
            ))}
          </div>
        ) : null}

        {multiple ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-title-muted md:px-5">
            <span>
              Image {slideIndex + 1} of {slides.length}
            </span>
            <span className="hidden sm:inline">
              {isLayout
                ? 'Use arrows or swipe · zoom for detail'
                : 'Use arrows or swipe · click image to zoom'}
            </span>
          </div>
        ) : null}

        {multiple && !isLayout ? (
          <GalleryThumbRow
            slides={slides}
            activeIndex={slideIndex}
            onSelect={setSlideIndex}
          />
        ) : null}
      </div>

      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-ink/92"
            role="dialog"
            aria-modal="true"
            aria-label={`${label} zoom`}
          >
            {multiple ? (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-surface/30 text-surface md:left-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-surface/30 text-surface md:right-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            ) : null}
            <button
              type="button"
              className="flex min-h-0 flex-1 cursor-zoom-out items-center justify-center overflow-hidden p-4 md:p-8"
              onClick={closeLightbox}
              aria-label="Close zoom view"
            >
              <img
                src={currentSrc}
                alt={getImageAlt(slideIndex)}
                className="h-auto max-h-full w-auto max-w-full object-contain"
              />
            </button>
            <div className="shrink-0 border-t border-surface/15 bg-ink px-4 py-3 text-center sm:py-4">
              {multiple ? (
                <p className="text-sm text-surface/90 sm:text-base">
                  Image {slideIndex + 1} of {slides.length} · Tap to close
                </p>
              ) : (
                <p className="text-sm text-surface/90 sm:text-base">Tap anywhere to close</p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

function GalleryThumbRow({
  slides,
  activeIndex,
  onSelect,
}: {
  slides: string[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="border-t border-border px-4 py-3 md:px-5">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
        {slides.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`relative size-16 shrink-0 snap-start overflow-hidden border md:size-20 ${
              index === activeIndex ? 'border-ink ring-1 ring-ink' : 'border-border opacity-80'
            }`}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === activeIndex}
          >
            <img src={src} alt="" className="size-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}