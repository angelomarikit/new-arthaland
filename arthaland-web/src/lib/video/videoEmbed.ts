export type VideoEmbed = {
  provider: 'youtube' | 'vimeo'
  embedUrl: string
}

function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1`
}

/**
 * Maps common YouTube/Vimeo page URLs to an iframe embed URL.
 * Works regardless of admin "upload" vs "external" when editors paste a platform link.
 */
export function parseVideoEmbedUrl(url: string): VideoEmbed | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, '')

  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com'
  ) {
    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v')
      if (id) return { provider: 'youtube', embedUrl: youtubeEmbedUrl(id) }
    }
    const shorts = parsed.pathname.match(/^\/shorts\/([^/?]+)/)
    if (shorts?.[1]) return { provider: 'youtube', embedUrl: youtubeEmbedUrl(shorts[1]) }
    const embedded = parsed.pathname.match(/^\/embed\/([^/?]+)/)
    if (embedded?.[1]) return { provider: 'youtube', embedUrl: youtubeEmbedUrl(embedded[1]) }
  }

  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1).split('/')[0]
    if (id) return { provider: 'youtube', embedUrl: youtubeEmbedUrl(id) }
  }

  if (host === 'vimeo.com') {
    const id = parsed.pathname.match(/^\/(\d+)/)?.[1]
    if (id) return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` }
  }

  if (host === 'player.vimeo.com') {
    const id = parsed.pathname.match(/^\/video\/(\d+)/)?.[1]
    if (id) return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` }
  }

  return null
}