'use server'

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
        throw new Error('Invalid email or password')
    }

    redirect("/")
}