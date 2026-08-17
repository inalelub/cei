import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Login Successful</h1>
          <p className="mb-4">You have successfully logged in. You can now access your account.</p>
          <Link href={'/'} className="text-blue-500 hover:underline">Go to Home</Link>
      </div>
    </div>
  )
}