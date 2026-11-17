'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { register } from '@/app/actions/auth'
import { RegisterFormState } from '@/lib/definitions'
import { AuthCard, AuthCardHeader } from '@/components/auth-shell'
import { FormAlert, PasswordField, PasswordRules, SubmitButton, TextField } from '@/components/auth-fields'

const initialState: RegisterFormState = {
  errors: {},
  values: {
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    identitynumber: '',
    phonenumber: '',
  },
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialState)
  const [password, setPassword] = useState('')
  const errors = state?.errors ?? {}
  const values = state?.values ?? initialState.values

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<UserPlus className="size-6" aria-hidden />}
        title="Create your voter account"
        description="Enter your details as they appear on your South African ID."
      />

      <form action={action} className="flex flex-col gap-5" noValidate>
        {state?.message ? <FormAlert>{state.message}</FormAlert> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="firstname" label="First name" autoComplete="given-name" placeholder="John"
            defaultValue={values.firstname} errors={errors.firstname} required />
          <TextField name="lastname" label="Last name" autoComplete="family-name" placeholder="Doe"
            defaultValue={values.lastname} errors={errors.lastname} required />
          <TextField name="identitynumber" label="ID number" inputMode="numeric" maxLength={13} placeholder="8001015009087"
            defaultValue={values.identitynumber} errors={errors.identitynumber}
            hint="13 digits. You must be 18 or older to register." required />
          <TextField name="phonenumber" label="Phone number" type="tel" inputMode="numeric" maxLength={10}
            autoComplete="tel" placeholder="0754863125" defaultValue={values.phonenumber}
            errors={errors.phonenumber} optional />
          <TextField name="username" label="Username" autoComplete="username" placeholder="johndoe"
            defaultValue={values.username} errors={errors.username} required />
          <TextField name="email" label="Email" type="email" autoComplete="email" placeholder="johndoe@example.com"
            defaultValue={values.email} errors={errors.email}
            hint="We'll send a confirmation link to this address." required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <PasswordField name="password" label="Password" autoComplete="new-password"
              errors={errors.password?.length ? [`Password must ${errors.password.join(', ')}.`] : undefined}
              onChange={(e) => setPassword(e.target.value)} required />
            <PasswordRules value={password} />
          </div>
          <PasswordField name="confirmpassword" label="Confirm password" autoComplete="new-password"
            errors={errors.confirmpassword} required />
        </div>

        <SubmitButton pending={pending} pendingLabel="Creating account…">Register</SubmitButton>

        <p className="text-center text-[13px] text-cei-gray">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-cei-blue hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  )
}
