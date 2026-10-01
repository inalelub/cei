import Link from "next/link";


export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center py-1">Welcome to the CEI Portal</h1>
      <p className="text-center p-2">Please login or register to continue.</p>
      <div className="flex justify-center gap-4">
        <Link href={"/register"} className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </Link>
        <Link href={"/login"} className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </Link>
      </div>
    </>
  );
}
