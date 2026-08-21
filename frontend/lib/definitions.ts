import * as z from 'zod'
 
export const RegisterFormScheme = z.object({
    username: z.string().min(3, { error: 'Username must be at least 3 characters long.' }).trim(),
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    firstname: z.string().min(2, { error: 'First name must be at least 2 characters long.' }).trim(),
    lastname: z.string().min(2, { error: 'Last name must be at least 2 characters long.' }).trim(),
    identitynumber: z.string().min(13, { error: 'ID number should be 13 characters long. '}),
    phonenumber: z.string().min(10, { error: 'Cell phone number must be 10 characters long.' }).max(10),
    password: z.string().min(8, { error: 'Be at least 8 characters long' }).trim()
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { error: 'Contain at least one special character.', }).trim(),
})

export type RegisterFormState = {
  errors?: {
    username?: string[]
    email?: string[]
    firstname?: string[]
    lastname?: string[]
    identitynumber?: string[]
    phonenumber?: string[]
    password?: string[]
  }
  values: {
    username: string
    email: string
    firstname: string
    lastname: string
    identitynumber: string
    phonenumber: string
    password: string
  }
  message?: string
}

export type LoginFormState = {
  error?: string
  message?: string
}