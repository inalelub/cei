import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'

type AuthShellProps = {
  children: ReactNode
  /** Tailwind max-width class for the card, e.g. "max-w-md" */
  widthClass?: string
}

/** Shared page chrome for login, register and their success screens */
export function AuthShell({ children, widthClass = 'max-w-md' }: AuthShellProps) {
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

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-cei-border bg-white p-6 shadow-[0_1px_5px_#0000000a] md:p-8">
      {children}
    </div>
  )
}

export function AuthCardHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cei-blue-tint text-cei-blue">
        {icon}
      </div>
      <div>
        <h1 className="text-[23px] leading-[1.2] font-medium text-cei-navy">{title}</h1>
        <p className="mt-0.5 text-[13px] leading-[1.45] text-cei-gray">{description}</p>
      </div>
    </div>
  )
}
