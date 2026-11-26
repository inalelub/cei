import type { ReactNode } from 'react'

// White content panel. Safe in server and client components, unlike page-shell.tsx,
// which pulls in SiteHeader and reads the session on the server.

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-cei-border bg-white p-6 shadow-[0_1px_5px_#0000000a] md:p-8">
      {children}
    </div>
  )
}

export function PanelHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
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
