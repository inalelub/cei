// This is a code sample to use when you have a onSubmit hook on a form
export async function login(email: string, password: string) {

    const response = await fetch('http://localhost:5102/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    })
    
    if (!response.ok) {
        throw new Error('Invalid email or password')
    }

    return response;
}