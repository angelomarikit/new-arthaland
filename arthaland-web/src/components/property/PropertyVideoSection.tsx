import { ExternalLink } from 'lucide-react'
import type { Development } from '../../domain/development/types'
import type { PropertyVideoInfo } from '../../domain/propertyDetail/types'
import { parseVideoEmbedUrl } from '../../lib/video/videoEmbed'
import { Eyebrow } from '../ui/Eyebrow'

type PropertyVideoSectionProps = {
  development: Development
  video?: PropertyVideoInfo
}

export function PropertyVideoSection({ development, video }: PropertyVideoSectionProps) {
  const url = video?.url ?? development.videoUrl
  const poster = video?.poster ?? development.videoPoster
  if (!url) return null

  const embed = parseVideoEmbedUrl(url)
  const isExternal = video?.source === 'external'
  const isDirectFile =
    !embed &&
    /\.(mp4|webm|ogg)(\?|$)/i.test(url.split('#')[0] ?? url)

  return (
    <section className="py-16 md:py-24" id="video">
      <div className="section-x mx-auto max-w-[1200px] px-6">
        <Eyebrow>Project film</Eyebrow>
        <h2 className="text-heading-3 mt-4">Showcase video</h2>
        <p className="mt-3 max-w-xl text-sm text-title-muted">
          Project showcase — overview of the address and lifestyle (not a unit-specific
          walk-through unless noted).
        </p>
        <div className="mt-8 flex justify-center">
          {embed ? (
            <div className="aspect-video w-full max-w-4xl overflow-hidden border border-border bg-ink/5">
              <iframe
                src={embed.embedUrl}
                title={`${development.name} showcase video`}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : isExternal || !isDirectFile ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[200px] w-full max-w-4xl flex-col items-center justify-center gap-2 border border-border bg-surface-soft px-6 py-10 text-ink transition-colors hover:bg-surface-alt"
            >
              <ExternalLink className="size-6 text-title-muted" aria-hidden />
              <span className="text-base font-medium underline underline-offset-4">
                Watch showcase video
              </span>
              <span className="text-xs text-title-muted">Opens in a new tab</span>
            </a>
          ) : (
            <video
              src={url}
              poster={poster}
              controls
              playsInline
              preload="metadata"
              className="block w-auto max-w-full object-contain object-center"
              style={{ height: 'min(75svh, 720px)' }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
