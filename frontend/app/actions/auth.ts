'use server'

import { FormState, RegisterFormScheme } from "@/lib/definitions";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {

    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch('http://localhost:5102/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    })
    
    if (!response.ok) {
        // TODO: Handle error response properly and return errors to the form or the UI to show the login was unsuccessful.
        throw new Error(response.statusText || 'Login failed');
    }

    redirect("/log-success")
}

export async function register(state: FormState, formData: FormData) {

    // Validate form inputs
    const validatedForm = RegisterFormScheme.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        identitynumber: formData.get('identitynumber'),
        phonenumber: formData.get('phonenumber'),
        password: formData.get('password'),
    })

    // If validation fails, return the errors to the form
    if (!validatedForm.success) {
        const errors = validatedForm.error.flatten().fieldErrors;
        return { errors }
    }

    const { username, email, firstname, lastname, identitynumber, phonenumber, password } = validatedForm.data;

    const response = await fetch('http://localhost:5102/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, firstname, lastname, identitynumber, phonenumber, password }),
        credentials: 'include'
    })

    // TODO: Handle error response properly and return errors to the form or the UI to show the login was unsuccessful.
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors, message: errorData.message }
    }

    redirect("/reg-success")
}