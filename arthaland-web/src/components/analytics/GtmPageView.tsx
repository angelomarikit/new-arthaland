import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Pushes virtual page views on client-side route changes for GTM (GA4 / Google Ads).
 * The initial load is handled by the GTM container snippet in index.html.
 */
export function GtmPageView() {
  const location = useLocation()
  const skipFirst = useRef(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.dataLayer = window.dataLayer || []
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    window.dataLayer.push({
      event: 'page_view',
      page_location: window.location.href,
      page_path: location.pathname + location.search + location.hash,
      page_title: document.title,
    })
  }, [location.pathname, location.search, location.hash])

  return null
}