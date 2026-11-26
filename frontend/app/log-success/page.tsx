import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Panel, PanelHeader } from "@/components/panel";

export default function Page() {
  return (
    <PageShell widthClass="max-w-md">
      <Panel>
        <PanelHeader
          icon={<CircleCheck className="size-6" aria-hidden />}
          title="You're signed in"
          description="You can now cast your vote."
        />
        <Link
          href="/parties"
          className="inline-flex h-12 w-full items-center justify-center rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase hover:bg-cei-blue-dark"
        >
          View parties
        </Link>
      </Panel>
    </PageShell>
  )
}
