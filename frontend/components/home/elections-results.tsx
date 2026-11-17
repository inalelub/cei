import Link from 'next/link'
import { ArrowRight, ChartColumn } from 'lucide-react'

export type ResultsLink = {
  title: string
  description: string
  note?: string
  href: string
  /** Label for the action button. */
  cta?: string
  icon: React.ReactNode
  tone: { card: string; badge: string; icon: string }
}

const iconClass = 'size-9'

// TODO: Create a new "Results" section on the IEC website to show the actual results on who voted for what and where. We'd have a map of South Africa with the results for each province and municipality. The link below should point to that page.
export const defaultResultsLinks: ResultsLink[] = [
  {
    title: 'Election Results',
    description: 'View live and previous election results.',
    href: '#',
    cta: 'View results',
    icon: <ChartColumn className={iconClass} aria-hidden />,
    tone: { card: 'bg-[#fff8e6] hover:bg-[#fff1d0]', badge: 'bg-[#f8e8b7]', icon: 'text-[#9a7010]' },
  },
]

/** Three tinted quick-link cards under a section heading (Paper: Quick Links). */
export function ResultsLinks({
  title = 'Results',
  items = defaultResultsLinks,
  className = '',
}: {
  title?: string
  items?: ResultsLink[]
  className?: string
}) {
  return (
    <section aria-label={title} className={className}>
      <h2 className="mb-4 text-2xl font-medium text-cei-navy">{title}</h2>
      <ul className={`grid gap-4 ${items.length > 1 ? "lg:grid-cols-3" : ""}`}>
        {items.map((item) => (
          <li key={item.title}>
            <div
              className={`flex min-h-22.5 items-center gap-4 rounded-lg px-4.5 py-3.5 transition-colors ${item.tone.card}`}
            >
              <span className={`flex size-14.5 shrink-0 items-center justify-center rounded-full ${item.tone.badge} ${item.tone.icon}`}>
                {item.icon}
              </span>

              <span className="min-w-0 flex-1 text-cei-navy">
                <span className="block text-[17px] leading-[1.43] font-bold">{item.title}</span>
                <span className="block text-[13px] leading-[1.43] text-cei-gray">
                  {item.description}
                  {item.note ? <em className="mt-1 block">{item.note}</em> : null}
                </span>
              </span>

              <Link
                href={item.href}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_3px_1px_-2px_#00000033,0_2px_2px_#00000024,0_1px_5px_#0000001f] hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
              >
                {item.cta ?? 'View'} <ArrowRight className="size-5" aria-hidden />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
