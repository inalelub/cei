import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { API_INTERNAL_BASE_URL } from '@/lib/api'

export type CurrentUser = {
    identityNumber: string
    email: string
    firstName: string
    lastName: string
}

export type VotingStatus = {
    userId: string
    hasVoted: boolean
}

/** ASP.NET Identity's auth cookie name (large tickets are split into `...C1`, `...C2` chunks). */
export const IDENTITY_COOKIE_PREFIX = '.AspNetCore.Identity.Application'

/** The browser's cookies as a `Cookie` header, so server-side API calls act as the signed-in user. */
export async function cookieHeader() : Promise<string> {
    const cookieStore = await cookies()
    return cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ')
}

async function hasIdentityCookie() : Promise<boolean> {
    const cookieStore = await cookies()
    return cookieStore.getAll().some(({ name }) => name.startsWith(IDENTITY_COOKIE_PREFIX))
}

/** GETs an authenticated API route as the current user; `null` when signed out or on any failure. */
async function getAsUser<T>(path: string): Promise<T | null> {
    if (!(await hasIdentityCookie())) return null

    try {
        const response = await fetch(`${API_INTERNAL_BASE_URL}${path}`, {
            headers: { Cookie: await cookieHeader() },
            cache: 'no-store',
            // An expired session makes Identity answer with a 302 to its login page; treat that as signed out.
            redirect: 'manual',
        })
        return response.ok ? ((await response.json()) as T) : null
    } catch {
        return null
    }
}

/**
 * The signed-in user, or `null` when there is no valid session.
 * Wrapped in `cache` so the header and the page share one `/api/auth/me` call per request.
 */
export const getCurrentUser = cache(() => getAsUser<CurrentUser>('/api/auth/me'))

/** Whether the signed-in user has already voted, or `null` when signed out. */
export const getVotingStatus = cache(() => getAsUser<VotingStatus>('/api/voting/status'))

/**
 * Guards the voting flow: signed-out visitors go to sign in, and voters who have
 * already voted go to their profile instead of a ballot they can't use.
 */
export async function requireVoterWhoHasNotVoted() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const status = await getVotingStatus()
    if (status?.hasVoted) redirect('/profile')

    return user
}
