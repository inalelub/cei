'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { KeyRound, Mail } from 'lucide-react'
import { forgotPassword } from '@/app/actions/auth'
import { ForgotPasswordFormState } from '@/lib/definitions'
import { AuthCard, AuthCardHeader } from '@/components/auth-shell'
import { FormAlert, SubmitButton, TextField } from '@/components/auth-fields'

const initialState: ForgotPasswordFormState = {}

export function ForgotPasswordForm() {
  // Changing the key remounts the form, which resets its action state ("Try another email").
  const [attempt, setAttempt] = useState(0)

  return <ForgotPasswordFlow key={attempt} onRestart={() => setAttempt((n) => n + 1)} />
}

function ForgotPasswordFlow({ onRestart }: { onRestart: () => void }) {
  const [state, action, pending] = useActionState(forgotPassword, initialState)

  if (state.sent) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<Mail className="size-6" aria-hidden />}
          title="Check your email"
          description="Your reset link is on its way."
        />

        <div className="flex flex-col gap-4">
          <div role="status" className="flex flex-col gap-3 rounded-control border border-cei-border bg-[#f4f7fb] p-4">
            <p className="text-sm leading-normal text-cei-ink">
              If an account exists for <span className="font-semibold text-cei-navy">{state.email}</span>, we&apos;ve
              sent a link to reset your password.
            </p>
            <p className="text-xs leading-[1.45] text-cei-gray">
              The link expires after a while, so use it soon. Check your spam folder if you can&apos;t find the email.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_3px_1px_-2px_#00000033,0_2px_2px_#00000024,0_1px_5px_#0000001f] transition-colors hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
          >
            Back to sign in
          </Link>

          <p className="text-center text-[13px] text-cei-gray">
            Didn&apos;t get it?{' '}
            <button type="button" onClick={onRestart} className="font-medium text-cei-blue hover:underline">
              Try another email
            </button>
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<KeyRound className="size-6" aria-hidden />}
        title="Forgot your password?"
        description="Enter your email and we'll send you a link to reset it."
      />

      <form action={action} className="flex flex-col gap-4" noValidate>
        {state.error ? <FormAlert>{state.error}</FormAlert> : null}

        <TextField
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.email ?? ''}
          hint="Use the email address you registered with."
          required
        />

        <SubmitButton pending={pending} pendingLabel="Sending…">Send reset link</SubmitButton>

        <p className="text-center text-[13px] text-cei-gray">
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-cei-blue hover:underline">Back to sign in</Link>
        </p>
      </form>
    </AuthCard>
  )
}
