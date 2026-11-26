import { PageShell } from "@/components/page-shell"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <PageShell widthClass="max-w-md">
      <LoginForm />
    </PageShell>
  )
}
