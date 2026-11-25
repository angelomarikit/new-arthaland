import { useMemo } from 'react'
import { PropertyImageCarousel } from './PropertyImageCarousel'

type PropertyGalleryProps = {
  images: string[]
  developmentName: string
}

function uniqueImages(urls: string[]) {
  return [...new Set(urls.filter(Boolean))]
}

export function PropertyGallery({ images, developmentName }: PropertyGalleryProps) {
  const slides = useMemo(() => uniqueImages(images), [images])

  if (slides.length === 0) {
    return (
      <div className="border border-border bg-surface-soft px-8 py-16 text-center">
        <p className="text-heading-3">Gallery</p>
        <p className="mx-auto mt-4 max-w-md text-title-muted">
          Additional photography for {developmentName} is available through the sales
          team and official ARTHALAND materials.
        </p>
      </div>
    )
  }

  return (
    <PropertyImageCarousel
      images={slides}
      label={`${developmentName} gallery`}
      getImageAlt={(index) => `${developmentName} — image ${index + 1}`}
      variant="gallery"
    />
  )
}