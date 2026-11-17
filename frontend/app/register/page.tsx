import { AuthShell } from "@/components/auth-shell"
import { RegisterForm } from "@/components/register-form"

export default function Page() {
  return (
    <AuthShell widthClass="max-w-3xl">
      <RegisterForm />
    </AuthShell>
  )
}
