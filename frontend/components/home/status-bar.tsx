'use client'

import { useId, useState } from 'react'
import { ArrowRight, UserRound } from 'lucide-react'
import { useIdNumberCheck } from '@/lib/use-id-number-check'

type RegistrationStatusBarProps = {
  title?: string
  description?: string
  /** Called with a valid 13-digit ID number once the user passes the checks. */
  onCheck?: (idNumber: string) => void
  className?: string
}


// TODO: This page will result in a page that has your ID registration status and your information. Include a real Captcha check to prevent bots from scraping the data. It will probably be a server actions page also.
export function RegistrationStatusBar({
  title = 'Check Your Registration Status',
  description = 'Enter your South African ID number to check if you are registered to vote.',
  onCheck,
  className = '',
}: RegistrationStatusBarProps) {

  const id = useId()
  const { error, notice, check } = useIdNumberCheck(onCheck)
  const [humanError, setHumanError] = useState(false)

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`rounded-card border border-cei-border bg-white p-5 shadow-[0_1px_5px_#0000000a] ${className}`}
    >
      <div className="mb-3.5 flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cei-blue-tint text-cei-blue">
          <UserRound className="size-6" aria-hidden />
        </div>
        <div>
          <h2 id={`${id}-title`} className="text-[23px] leading-[1.2] font-medium text-cei-navy">{title}</h2>
          <p className="mt-0.5 text-[13px] leading-[1.43] text-cei-gray">{description}</p>
        </div>
      </div>

      <form
        noValidate
        className="grid items-center gap-4 md:grid-cols-[minmax(300px,1.6fr)_minmax(220px,0.9fr)_minmax(180px,0.8fr)]"
        onSubmit={(event) => {

          event.preventDefault()
          const data = new FormData(event.currentTarget)

          if (!data.get('human')) {
            setHumanError(true)
            return
          }

          setHumanError(false)

          check(String(data.get('identitynumber') ?? ''))
        }}
      >
        <div>
          <label htmlFor={`${id}-input`} className="sr-only">South African ID number</label>
          <input
            id={`${id}-input`}
            name="identitynumber"
            inputMode="numeric"
            maxLength={13}
            autoComplete="off"
            placeholder="e.g. 8001015009087"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="h-10 w-full rounded-control border border-cei-border bg-white px-3.5 text-sm text-cei-ink outline-none placeholder:text-cei-ink/40 focus:border-2 focus:border-cei-blue focus:px-3.25 aria-invalid:border-cei-error"
          />
        </div>

        <label className="flex items-center gap-3 text-base text-cei-ink">
          <input type="checkbox" name="human" className="size-5 accent-cei-blue" />
          I&apos;m not a robot
        </label>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_3px_1px_-2px_#00000033,0_2px_2px_#00000024,0_1px_5px_#0000001f] hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
        >
          Check status <ArrowRight className="size-5" aria-hidden />
        </button>

        {error ? <p id={`${id}-error`} role="alert" className="text-sm text-cei-error md:col-span-3">{error}</p> : null}
        {humanError ? <p role="alert" className="text-sm text-cei-error md:col-span-3">Please confirm you are not a robot.</p> : null}
        {notice ? <p role="status" className="text-sm text-cei-gray md:col-span-3">{notice}</p> : null}
      </form>
    </section>
  )
}
