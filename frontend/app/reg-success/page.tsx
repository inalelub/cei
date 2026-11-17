import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthCard, AuthCardHeader, AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell widthClass="max-w-md">
      <AuthCard>
        <AuthCardHeader
          icon={<MailCheck className="size-6" aria-hidden />}
          title="Registration successful"
          description="One more step before you can sign in."
        />
        <p className="mb-6 text-sm leading-relaxed text-cei-ink">
          We&apos;ve sent a confirmation link to your email address. Confirm your email, then sign in to your account.
        </p>
        <Link
          href="/login"
          className="inline-flex h-12 w-full items-center justify-center rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase hover:bg-cei-blue-dark"
        >
          Go to sign in
        </Link>
      </AuthCard>
    </AuthShell>
  )
}
