'use server'

import { RegisterFormState, RegisterFormScheme, LoginFormState } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export async function login(prevState: LoginFormState, formData: FormData) {

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
        credentials: 'include'
    })
    
    if (!response.ok) {
        return {
            error: "Invalid username or password",
            message: "Login failed"
        }
    }

    redirect("/log-success")
}

export async function register(prevState: RegisterFormState, formData: FormData) {

    const values = {
        username: String(formData.get('username') ?? ""),
        email: String(formData.get('email') ?? ""),
        firstname: String(formData.get('firstname') ?? ""),
        lastname: String(formData.get('lastname') ?? ""),
        identitynumber: String(formData.get('identitynumber') ?? ""),
        phonenumber: String(formData.get('phonenumber') ?? ""),
        password: String(formData.get('password') ?? ""),
    }

    // Validate form inputs
    const validatedForm = RegisterFormScheme.safeParse(Object.fromEntries(formData));

    // If validation fails, return the errors to the form
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            values,
        }
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedForm.data),
        credentials: 'include'
    })

    if (!response.ok) {
        const errorData = await response.json();
        return { 
            errors: errorData.errors ?? {}, 
            values,
            message: errorData.message ?? "Registration failed" 
        }
    }

    redirect("/reg-success")
}