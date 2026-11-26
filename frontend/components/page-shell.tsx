import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'

type PageShellProps = {
  children: ReactNode
  widthClass?: string
}

/**
 * Server-only page chrome: site header, a centered content column and the footer.
 * Client components must not import this, since SiteHeader reads the session on the server.
 */
export function PageShell({ children, widthClass = 'max-w-md' }: PageShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-[#f4f7fb]">
      <SiteHeader />

      <main className="flex flex-1 items-start justify-center px-4 py-10 md:py-16">
        <div className={`w-full ${widthClass}`}>{children}</div>
      </main>

      <SiteFooter />
    </div>
  )
}
