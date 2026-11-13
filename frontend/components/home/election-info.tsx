import Link from 'next/link'
import { ArrowUpRight, BookOpen, FileText, Info, Newspaper, TriangleAlert } from 'lucide-react'

export type InfoLink = {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const iconClass = 'size-9 shrink-0 text-cei-blue'

// TODO: Get the actual links from the IEC website or redirect them to a dummy information page on our site. 
export const defaultInfoLinks: InfoLink[] = [
  {
    title: 'Report Election Disinformation',
    description: 'Report suspected election disinformation.',
    href: '#',
    icon: <TriangleAlert className={iconClass} aria-hidden />,
  },
  {
    title: 'About the Elections',
    description: 'Watch a video about the Local Government Elections.',
    href: '#',
    icon: <Info className={iconClass} aria-hidden />,
  },
  {
    title: "Election Day Do's and Don'ts",
    description: "Watch the Election Day Do's and Don'ts video.",
    href: '#',
    icon: <FileText className={iconClass} aria-hidden />,
  },
  {
    title: 'How to Vote',
    description: 'Watch the step-by-step guide on how to vote.',
    href: '#',
    icon: <BookOpen className={iconClass} aria-hidden />,
  }
]

/** "More Election Information" grid of link cards (Paper: More Election Information). */
export function MoreElectionInfo({
  title = 'More Election Information',
  items = defaultInfoLinks,
  className = '',
}: {
  title?: string
  items?: InfoLink[]
  className?: string
}) {
  return (
    <section aria-label={title} className={className}>
      <h2 className="mb-4 text-2xl font-medium text-cei-navy">{title}</h2>
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="flex min-h-26.25 items-start gap-2.5 rounded-lg bg-[#f1f8ff] p-3.5 transition-colors hover:bg-[#e3f0ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
            >
              {item.icon}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[13px] leading-[1.43] font-bold text-cei-navy">{item.title}</span>
                <span className="mt-1 text-[11px] leading-[1.43] text-cei-gray">{item.description}</span>
              </span>
              <ArrowUpRight className="size-6 shrink-0 text-cei-navy" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
