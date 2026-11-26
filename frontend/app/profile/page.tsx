import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CircleCheck, CircleDashed, UserRound } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Panel, PanelHeader } from "@/components/panel";
import { getCurrentUser, getVotingStatus } from "@/lib/session";

function maskIdentityNumber(identityNumber: string) : string {
  return identityNumber.length > 4 ? `${"•".repeat(identityNumber.length - 4)}${identityNumber.slice(-4)}` : identityNumber;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const status = await getVotingStatus();

  const details = [
    { label: "First name", value: user.firstName },
    { label: "Last name", value: user.lastName },
    { label: "Email", value: user.email },
    { label: "ID number", value: maskIdentityNumber(user.identityNumber) },
  ];

  return (
    <PageShell widthClass="max-w-2xl">
      <div className="flex flex-col gap-6">
        <Panel>
          <PanelHeader
            icon={<UserRound className="size-6" aria-hidden />}
            title={`${user.firstName} ${user.lastName}`}
            description="Your voter account details."
          />

          <dl className="divide-y divide-cei-border border-y border-cei-border">
            {details.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:gap-6">
                <dt className="w-32 shrink-0 text-[13px] text-cei-gray">{label}</dt>
                <dd className="min-w-0 truncate text-sm font-medium text-cei-navy">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel>
          {status === null ? (
            <p role="alert" className="rounded-control bg-cei-error-tint px-3.5 py-3 text-sm font-medium text-cei-error">
              We could not load your voting status. Please refresh the page to try again.
            </p>
          ) : status.hasVoted ? (
            <PanelHeader
              icon={<CircleCheck className="size-6 text-cei-success" aria-hidden />}
              title="You have voted"
              description="Your vote has been recorded. Each voter can vote once, so the ballot is now closed to you."
            />
          ) : (
            <>
              <PanelHeader
                icon={<CircleDashed className="size-6" aria-hidden />}
                title="You haven't voted yet"
                description="Choose a party on the ballot and confirm your choice. You can only vote once."
              />
              <Link
                href="/parties"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control bg-cei-blue px-5 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_2px_2px_#00000024,0_1px_5px_#0000001f] hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
              >
                Go to the ballot <ArrowRight className="size-4.5" aria-hidden />
              </Link>
            </>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}
