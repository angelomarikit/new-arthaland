export function setMetaContent(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function setLinkRel(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function removeLinkRel(rel: string) {
  document.querySelector(`link[rel="${rel}"]`)?.remove()
}

export function setRobots(content: string) {
  setMetaContent('name', 'robots', content)
}

export function setJsonLdScript(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id)
  if (!data) {
    existing?.remove()
    return
  }
  const el = existing ?? document.createElement('script')
  el.id = id
  el.setAttribute('type', 'application/ld+json')
  el.textContent = JSON.stringify(data)
  if (!existing) document.head.appendChild(el)
}