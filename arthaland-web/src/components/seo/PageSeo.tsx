import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type PageSeoState = {
  title?: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

type PageSeoContextValue = {
  seo: PageSeoState | null
  setSeo: (seo: PageSeoState | null) => void
}

const PageSeoContext = createContext<PageSeoContextValue | null>(null)

export function PageSeoProvider({ children }: { children: ReactNode }) {
  const [seo, setSeo] = useState<PageSeoState | null>(null)
  const value = useMemo(() => ({ seo, setSeo }), [seo])
  return <PageSeoContext.Provider value={value}>{children}</PageSeoContext.Provider>
}

export function usePageSeoOverride(): PageSeoState | null {
  return useContext(PageSeoContext)?.seo ?? null
}

/** Per-page title, description, and robots overrides (property listings, featured units, etc.). */
export function useSetPageSeo(seo: PageSeoState | null) {
  const ctx = useContext(PageSeoContext)
  useEffect(() => {
    if (!ctx) return
    ctx.setSeo(seo)
    return () => ctx.setSeo(null)
  }, [
    ctx,
    seo?.title,
    seo?.description,
    seo?.ogImage,
    seo?.noIndex,
  ])
}