import { Vote } from "lucide-react";
import { PartyList } from "@/components/party-list";
import { requireVoterWhoHasNotVoted } from "@/lib/session";
import { PageShell } from "@/components/page-shell";
import { Panel, PanelHeader } from "@/components/panel";

/** Ballot: lists the parties a signed-in voter can choose from. */
export default async function PartiesPage() {
  await requireVoterWhoHasNotVoted();

  return (
    <PageShell widthClass="max-w-3xl">
      <Panel>
        <PanelHeader
          icon={<Vote className="size-6" aria-hidden />}
          title="Choose your party"
          description="Select the party you want to represent you. You will review your choice before your vote is cast."
        />
        <PartyList />
      </Panel>
    </PageShell>
  );
}
