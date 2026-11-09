import * as z from 'zod'

/**
 * Mirrors backend/Helpers/IdentityNumberParser.cs: YYMMDD + 4 digits + [01] + 2 digits.
 * A two-digit year greater than the current YY is read as 19YY, otherwise 20YY.
 */
export function getBirthDateFromIdNumber(id: string): Date | null {
    if (!/^\d{13}$/.test(id)) return null

    const yy = Number(id.slice(0, 2))
    const month = Number(id.slice(2, 4))
    const day = Number(id.slice(4, 6))
    if (id[10] !== '0' && id[10] !== '1') return null

    const currentYY = new Date().getFullYear() % 100
    const year = yy > currentYY ? 1900 + yy : 2000 + yy
    const date = new Date(year, month - 1, day)

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null
    }
    return date
}

export function isAtLeast18(birthDate: Date): boolean {
    const cutoff = new Date()
    cutoff.setFullYear(cutoff.getFullYear() - 18)
    return birthDate <= cutoff
}

export const RegisterFormScheme = z
    .object({
        username: z.string().trim().min(3, { error: 'Username must be at least 3 characters long.' }),
        email: z.email({ error: 'Please enter a valid email address.' }).trim(),
        firstname: z.string().trim().min(2, { error: 'First name must be at least 2 characters long.' })
            .regex(/^[a-zA-Z\-éèêëÉÈÊË\s]+$/, { error: 'First name can only contain letters, spaces and hyphens.' }),
        lastname: z.string().trim().min(2, { error: 'Last name must be at least 2 characters long.' })
            .regex(/^[a-zA-Z\-éèêëÉÈÊË\s]+$/, { error: 'Last name can only contain letters, spaces and hyphens.' }),
        identitynumber: z.string().trim()
            .regex(/^\d{13}$/, { error: 'ID number must be exactly 13 digits.' })
            .refine((id) => !/^\d{13}$/.test(id) || getBirthDateFromIdNumber(id) !== null, {
                error: 'ID number must start with a valid birth date (YYMMDD).',
            })
            .refine((id) => {
                const birthDate = getBirthDateFromIdNumber(id)
                return birthDate === null || isAtLeast18(birthDate)
            }, { error: 'You must be at least 18 years old to register.' }),
        phonenumber: z.string().trim()
            .regex(/^(\d{10})?$/, { error: 'Phone number must be 10 digits.' }),
        password: z.string()
            .min(8, { error: 'be at least 8 characters long' })
            .regex(/[A-Z]/, { error: 'contain an uppercase letter' })
            .regex(/[a-z]/, { error: 'contain a lowercase letter' })
            .regex(/[0-9]/, { error: 'contain a number' })
            .regex(/[^a-zA-Z0-9]/, { error: 'contain a special character' }),
        confirmpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmpassword, {
        path: ['confirmpassword'],
        error: 'Passwords do not match.',
    })

export type RegisterFormErrors = {
    username?: string[]
    email?: string[]
    firstname?: string[]
    lastname?: string[]
    identitynumber?: string[]
    phonenumber?: string[]
    password?: string[]
    confirmpassword?: string[]
}

export type RegisterFormState = {
    errors?: RegisterFormErrors
    values: {
        username: string
        email: string
        firstname: string
        lastname: string
        identitynumber: string
        phonenumber: string
    }
    message?: string
}

export type LoginFormState = {
    error?: string
    message?: string
    username?: string
}

export type PartyDefinition = {
  id: number
  partyName?: string
  name?: string
  partyAbbreviation?: string | number
  partyUrl?: string | null
  logoUrl?: string | null
}
