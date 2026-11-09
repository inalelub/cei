import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import ceiLogo from '@/assets/cei-logo.svg'

type AuthShellProps = {
  children: ReactNode
  /** Tailwind max-width class for the card, e.g. "max-w-md" */
  widthClass?: string
}

/** Shared page chrome for login, register and their success screens (matches the Paper Home View header/footer). */
export function AuthShell({ children, widthClass = 'max-w-md' }: AuthShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-[#f4f7fb]">
      <header className="bg-cei-header">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="CEI Commission home">
            <Image src={ceiLogo} alt="CEI of South Africa" height={40} className="h-10 w-auto" priority />
          </Link>
          <nav className="flex gap-6 text-sm text-white">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/parties" className="hover:underline">Parties</Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 md:py-16">
        <div className={`w-full ${widthClass}`}>{children}</div>
      </main>

      <footer className="bg-cei-header">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-white">
          <span>© (CEI) 2026</span>
          <span>Ensuring free and fair elections</span>
        </div>
      </footer>
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
