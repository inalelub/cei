'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Menu } from '@base-ui/react/menu'
import { ChevronDown, LogOut, UserRound, Vote } from 'lucide-react'
import { logout } from '@/app/actions/auth'

type AccountMenuProps = {
  firstName: string
  lastName: string
  email: string
}

const itemClass = 'flex w-full cursor-default items-center gap-2.5 rounded-control px-3 py-2 text-sm text-cei-ink outline-none select-none data-highlighted:bg-cei-blue-tint data-highlighted:text-cei-header data-disabled:opacity-60'

/** Signed-in account dropdown in the site header: profile, ballot and sign out. */
export function AccountMenu({ firstName, lastName, email }: AccountMenuProps) {

  const [isSigningOut, startSignOut] = useTransition()
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?'

  return (
    <Menu.Root>
      <Menu.Trigger
        className="flex items-center gap-2 rounded-control px-2 py-1.5 text-sm font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-popup-open:bg-white/10"
        aria-label={`Account menu for ${firstName}`}
      >
        <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-white text-[13px] font-bold text-cei-header">
          {initials}
        </span>
        <span className="max-w-32 truncate">{firstName}</span>
        <ChevronDown className="size-4" aria-hidden />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
          <Menu.Popup className="w-64 origin-(--transform-origin) rounded-card border border-cei-border bg-white p-1.5 shadow-[0_4px_16px_#0000001f] transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="px-3 pt-2 pb-2.5">
              <p className="truncate text-sm font-medium text-cei-navy">{firstName} {lastName}</p>
              <p className="truncate text-[13px] text-cei-gray">{email}</p>
            </div>

            <Menu.Separator className="my-1 h-px bg-cei-border" />

            <Menu.LinkItem closeOnClick className={itemClass} render={<Link href="/profile" />}>
              <UserRound className="size-4" aria-hidden /> My profile
            </Menu.LinkItem>
            <Menu.LinkItem closeOnClick className={itemClass} render={<Link href="/parties" />}>
              <Vote className="size-4" aria-hidden /> Ballot
            </Menu.LinkItem>

            <Menu.Separator className="my-1 h-px bg-cei-border" />

            <Menu.Item
              className={itemClass}
              disabled={isSigningOut}
              onClick={() => startSignOut(() => logout())}
            >
              <LogOut className="size-4" aria-hidden /> {isSigningOut ? 'Signing out…' : 'Sign out'}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
