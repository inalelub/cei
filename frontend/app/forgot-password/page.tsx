import { AuthShell } from "@/components/auth-shell"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function Page() {
  return (
    <AuthShell widthClass="max-w-md">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
