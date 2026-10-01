'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { register } from '@/app/actions/auth'
import { useActionState } from 'react'
import { RegisterFormState } from '@/lib/definitions'

const initialState: RegisterFormState = {
  errors: {},
  values: {
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    identitynumber: '',
    phonenumber: '',
    password: ''
  }
}

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {

  const [state, action, pending] = useActionState(register, initialState);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input 
              id="username" 
              name='username' 
              type="text" 
              placeholder="johndoe" 
              defaultValue={state?.values?.username ?? ''}
              required />
            </Field>
            {state?.errors?.username && (
              <p className="text-red-500 text-sm">{state.errors.username}</p>
            )}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input 
              id="email" 
              type="email" 
              name='email' 
              placeholder="johndoe@example.com"
              defaultValue={state?.values?.email ?? ''}
               />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            {state?.errors?.email && (
              <p className="text-red-500 text-sm">{state.errors.email}</p>
            )}
            <Field>
              <FieldLabel htmlFor="name">First Name</FieldLabel>
              <Input 
                id="name" 
                name="firstname" 
                type="text" 
                placeholder="John" 
                defaultValue={state?.values?.firstname ?? ''}
                required 
              />
            </Field>
            {state?.errors?.firstname && (
              <p className="text-red-500 text-sm">{state.errors.firstname}</p>
            )}
            <Field>
              <FieldLabel htmlFor="surname">Last Name</FieldLabel>
              <Input 
                id="surname" 
                type="text" 
                name='lastname' 
                placeholder="Doe" 
                defaultValue={state?.values?.lastname ?? ''}
                required 
              />
            </Field>
            {state?.errors?.lastname && (
              <p className="text-red-500 text-sm">{state.errors.lastname}</p>
            )}
            <Field>
              <FieldLabel htmlFor="id">Identity Number</FieldLabel>
              <Input 
                id="id" 
                type="text" 
                name='identitynumber' 
                placeholder="9812315477071" 
                defaultValue={state?.values?.identitynumber ?? ''}
                required 
              />
            </Field>
            {state?.errors?.identitynumber && (
              <p className="text-red-500 text-sm">{state.errors.identitynumber}</p>
            )}
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input 
                id="phone" 
                type="text" 
                name='phonenumber' 
                placeholder="0754863125" 
                defaultValue={state?.values?.phonenumber ?? ''}
              />
            </Field>
            {state?.errors?.phonenumber && (
              <p className="text-red-500 text-sm">{state.errors.phonenumber}</p>
            )}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input 
                id="password" 
                name='password' 
                type="password" 
                required 
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            {state?.errors?.password && (
              <div>
                <p>Password must:</p>
                  <ul>
                    {state.errors.password?.map((error: string) => (
                      <li key={error} className="text-red-500 text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
              id="confirm-password" 
              type="password" 
              required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button disabled={pending} type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href={'/login'}>Sign in</Link> 
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}