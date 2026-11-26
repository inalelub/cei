import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Panel, PanelHeader } from "@/components/panel";

export default function ThankYouPage() {
  return (
    <PageShell widthClass="max-w-md">
      <Panel>
        <PanelHeader
          icon={<CircleCheck className="size-6" aria-hidden />}
          title="Thank you for taking part"
          description="Your vote has been recorded."
        />
        <p className="mb-6 text-sm leading-relaxed text-cei-ink">
          Your participation helps shape the future of your community.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 w-full items-center justify-center rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase hover:bg-cei-blue-dark"
        >
          Return to home
        </Link>
      </Panel>
    </PageShell>
  );
}
