import Image from 'next/image'
import Link from 'next/link'
import ceiLogo from '@/assets/cei-logo.svg'

// TODO: Create a dropdown on top of the nav bar that links to the "Voters", "Parties and candidates", "Political funding", "Elections", and "About the CEI" pages on the IEC website. The links below should point to those pages.
const navItems = [
  { label: 'Voters', href: '/' },
  { label: 'Parties and candidates', href: '/parties' },
  { label: 'Political funding', href: '#' },
  { label: 'Elections', href: '#' },
  { label: 'About the CEI', href: '#' },
]

export function SiteHeader() {
  return (
    <header className="bg-cei-header text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 py-3">
        <Link href="/" aria-label="CEI home" className="shrink-0">
          <Image src={ceiLogo} alt="CEI of South Africa" height={44} className="h-11 w-auto" preload />
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-8 gap-y-1 text-base">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="py-2 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/login" className="rounded-control px-3 py-2 hover:underline">Sign in</Link>
          <Link href="/register" className="rounded-control bg-white px-4 py-2 text-cei-header hover:bg-cei-blue-tint">
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}
