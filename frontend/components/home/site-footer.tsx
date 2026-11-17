import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { Globe, Mail } from 'lucide-react'
import twitter from '@/assets/twitter.png'

type Channel = {
  label: string
  href: string
  icon: React.ReactNode
}

// TODO: The X icon doesn't appear on the site. Plan to fix
function ImageIcon({ src, alt }: { src: StaticImageData; alt: string }) {
  return <Image src={src} alt={alt} width={22} height={22} className="size-5.5 object-contain" />
}


const channels: Channel[] = [
  { label: 'info@elections.org.za', href: 'mailto:info@elections.org.za', icon: <Mail className="size-5.5" aria-hidden /> },
  { label: 'IEC Website', href: 'https://www.elections.org.za', icon: <Globe className="size-5.5" aria-hidden /> },
  { label: 'Personal Website', href: 'https://dev.bulelanibotman.com', icon: <Globe className="size-5.5" aria-hidden /> },
  { label: 'X', href: 'https://www.x.com/inalelub_', icon: <ImageIcon src={twitter} alt="" /> },
]

// TODO: Create a "Copyright", "Disclaimer", and "Privacy Policy" page on the IEC website. The links below should point to those pages.
export function SiteFooter() {
  return (
    <footer className="bg-cei-header text-white">
      <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-6">
        <h2 className="text-lg font-medium">Connect</h2>
        <p className="mt-1 text-sm text-white/85">Have a question?</p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <li key={channel.label}>
              <Link
                href={channel.href}
                className="flex h-10.5 items-center gap-3 rounded-control bg-white px-3 text-sm font-medium text-cei-navy hover:bg-cei-blue-tint"
              >
                <span className="flex size-5.5 shrink-0 items-center justify-center">{channel.icon}</span>
                {channel.label}
              </Link>
            </li>
          ))}
        </ul>


        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/30 pt-4 text-sm">
          <span>© (CEI) 2026</span>
          <span className="flex gap-3">
            <Link href="#" className="hover:underline">Copyright</Link>
            <span aria-hidden>|</span>
            <Link href="#" className="hover:underline">Disclaimer</Link>
            <span aria-hidden>|</span>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
