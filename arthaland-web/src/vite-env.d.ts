/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: (
      action: string,
      event?: string,
      params?: Record<string, unknown>,
    ) => void
  }
}

export {}
