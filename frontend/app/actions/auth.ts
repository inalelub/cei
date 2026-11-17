'use server'

import {
    RegisterFormState,
    RegisterFormErrors,
    RegisterFormScheme,
    LoginFormState,
    ForgotPasswordFormState,
} from "@/lib/definitions";
import * as z from 'zod'
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { API_INTERNAL_BASE_URL } from "@/lib/api";

type IdentityError = { 
    code?: string; 
    description?: string 
}

type ProblemDetails = {
    title?: string
    detail?: string
    message?: string
    errors?: Record<string, string[]>
}

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!username || !password) {
        return { 
            error: 'Enter your username and password.',
            username 
        }
    }

    let response: Response

    try {
        response = await fetch(`${API_INTERNAL_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, password }),
            cache: 'no-store',
        })
    } catch {
        return { 
            error: 'We could not reach the server. Please try again shortly.', 
            username 
        }
    }

    if (!response.ok) {
        if (response.status === 401) {
            return { 
                error: 'Invalid username or password.', 
                username 
            }
        }

        const problem = await readJson<ProblemDetails>(response)

        return {
            error: problem?.detail ?? problem?.title ?? 'Login failed. Please try again.',
            username,
        }
    }

    await forwardSetCookies(response)
    redirect("/log-success")
}

export async function register(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {

    const values = {
        username: String(formData.get('username') ?? ""),
        email: String(formData.get('email') ?? ""),
        firstname: String(formData.get('firstname') ?? ""),
        lastname: String(formData.get('lastname') ?? ""),
        identitynumber: String(formData.get('identitynumber') ?? ""),
        phonenumber: String(formData.get('phonenumber') ?? ""),
    }

    const validatedForm = RegisterFormScheme.safeParse(Object.fromEntries(formData));

    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            values,
        }
    }

    const { username, email, firstname, lastname, identitynumber, phonenumber, password } = validatedForm.data

    let response: Response
    try {
        response = await fetch(`${API_INTERNAL_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: username,
                email,
                firstName: firstname,
                lastName: lastname,
                identityNumber: identitynumber,
                phoneNumber: phonenumber || undefined,
                password,
            }),
            cache: 'no-store',
        })
    } catch {
        return { 
            values, 
            message: 'We could not reach the server. Please try again shortly.' 
        }
    }

    if (!response.ok) {
        const body = await readJson<ProblemDetails | IdentityError[]>(response)

        // Identity failures (duplicate email, weak password...) come back as a bare array.
        if (Array.isArray(body)) {
            const { fieldErrors, message } = mapIdentityErrors(body)
            return {
                errors: fieldErrors,
                values,
                message: Object.keys(fieldErrors).length ? undefined : message ?? 'Registration failed.',
            }
        }

        // Framework validation (400) puts per-field errors under `errors` with PascalCase keys.
        const problemErrors: RegisterFormErrors = {}
        if (body?.errors) {
            for (const [key, messages] of Object.entries(body.errors)) {
                const field = key.toLowerCase() as keyof RegisterFormErrors
                if (field in values || field === 'password') problemErrors[field] = messages
            }
        }

        return {
            errors: problemErrors,
            values,
            message: Object.keys(problemErrors).length
                ? undefined
                : body?.detail ?? body?.message ?? body?.title ?? 'Registration failed. Please try again.',
        }
    }

    redirect("/reg-success")
}

export async function forgotPassword(prevState: ForgotPasswordFormState, formData: FormData): Promise<ForgotPasswordFormState> {
    const email = String(formData.get('email') ?? '').trim()

    if (!z.email().safeParse(email).success) {
        return { error: 'Enter a valid email address.', email }
    }

    let response: Response

    try {
        response = await fetch(`${API_INTERNAL_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            cache: 'no-store',
        })
    } catch {
        return { error: 'We could not reach the server. Please try again shortly.', email }
    }

    // A 404 means no account uses this email. Show the same confirmation anyway,
    // so the form can't be used to find out which emails are registered.
    if (response.ok || response.status === 404) {
        return { sent: true, email }
    }

    const problem = await readJson<ProblemDetails>(response)

    return {
        error: problem?.detail ?? problem?.title ?? 'We could not send the reset link. Please try again.',
        email,
    }
}

/**
 * The Identity cookie is issued to the server action, not the browser.
 * Re-issue it on the frontend response so later browser calls
 * (e.g. /api/voting/parties with credentials: "include") are authenticated.
 */
async function forwardSetCookies(response: Response) {
    const cookieStore = await cookies()

    for (const header of response.headers.getSetCookie()) {
        const [pair, ...attributes] = header.split(';').map((part) => part.trim())
        const separator = pair.indexOf('=')
        if (separator < 1) continue

        const name = pair.slice(0, separator)
        const value = pair.slice(separator + 1)
        const options: Parameters<typeof cookieStore.set>[2] = {}

        for (const attribute of attributes) {
            const [rawKey, ...rest] = attribute.split('=')
            const key = rawKey.toLowerCase()
            const attrValue = rest.join('=')

            if (key === 'path') options.path = attrValue
            else if (key === 'expires') options.expires = new Date(attrValue)
            else if (key === 'max-age') options.maxAge = Number(attrValue)
            else if (key === 'httponly') options.httpOnly = true
            else if (key === 'secure') options.secure = true
            else if (key === 'samesite') {
                const sameSite = attrValue.toLowerCase()
                if (sameSite === 'lax' || sameSite === 'strict' || sameSite === 'none') {
                    options.sameSite = sameSite
                }
            }
        }

        cookieStore.set(name, value, options)
    }
}

/** Maps ASP.NET Identity error codes onto the field they belong to. */
function mapIdentityErrors(errors: IdentityError[]): { fieldErrors: RegisterFormErrors; message?: string } {
    const fieldErrors: RegisterFormErrors = {}
    const unmapped: string[] = []

    for (const { code = '', description = '' } of errors) {
        if (code.startsWith('Password')) {
            fieldErrors.password = [...(fieldErrors.password ?? []), description]
        } else if (code === 'DuplicateEmail' || code === 'InvalidEmail') {
            fieldErrors.email = [...(fieldErrors.email ?? []), description]
        } else if (code === 'DuplicateUserName' || code === 'InvalidUserName') {
            fieldErrors.username = [...(fieldErrors.username ?? []), description]
        } else if (description) {
            unmapped.push(description)
        }
    }

    return { fieldErrors, message: unmapped.length ? unmapped.join(' ') : undefined }
}

/** Reads a JSON body without throwing on empty (e.g. bare 401) or non-JSON responses. */
async function readJson<T>(response: Response): Promise<T | null> {
    try {
        const text = await response.text()
        return text ? (JSON.parse(text) as T) : null
    } catch {
        return null
    }
}