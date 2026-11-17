'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { UserRound } from 'lucide-react'
import { login } from '@/app/actions/auth'
import { LoginFormState } from '@/lib/definitions'
import { AuthCard, AuthCardHeader } from '@/components/auth-shell'
import { FormAlert, PasswordField, SubmitButton, TextField } from '@/components/auth-fields'

const initialState: LoginFormState = {}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState)

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<UserRound className="size-6" aria-hidden />}
        title="Sign in to your account"
        description="Sign in to view parties and cast your vote."
      />

      <form action={action} className="flex flex-col gap-4" noValidate>
        {state?.error ? <FormAlert>{state.error}</FormAlert> : null}

        <TextField
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="Your username"
          defaultValue={state?.username ?? ''}
          hint="Use the username you registered with. If you didn't choose one, use your email address."
          required
        />

        <div className="flex flex-col gap-1.5">
          <PasswordField name="password" label="Password" autoComplete="current-password" placeholder="Your password" required />
          <Link href="/forgot-password" className="self-end text-[13px] text-cei-blue hover:underline">
            Forgot your password?
          </Link>
        </div>

        <SubmitButton pending={pending} pendingLabel="Signing in…">Sign in</SubmitButton>

        <p className="text-center text-[13px] text-cei-gray">
          New here?{' '}
          <Link href="/register" className="font-medium text-cei-blue hover:underline">Register to vote</Link>
        </p>
      </form>
    </AuthCard>
  )
}
