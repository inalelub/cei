import { PageShell } from "@/components/page-shell"
import { RegisterForm } from "@/components/register-form"

export default function Page() {
  return (
    <PageShell widthClass="max-w-3xl">
      <RegisterForm />
    </PageShell>
  )
}
