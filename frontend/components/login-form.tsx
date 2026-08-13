'use client'

import { cn } from "@/lib/utils"
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
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { login } from "@/app/actions/auth"

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username / Email</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* TODO: implement the forgot password view */}
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                {/* {error ? <p className="text-sm text-red-600">{error}</p> : null} */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href={'/register'}>Sign up</Link> 
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
