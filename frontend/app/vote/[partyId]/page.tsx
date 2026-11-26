import { PageShell } from "@/components/page-shell";
import { VoteConfirmation } from "@/components/vote-confirmation";
import { requireVoterWhoHasNotVoted } from "@/lib/session";

export default async function VotePage({ params }: PageProps<"/vote/[partyId]">) {
  await requireVoterWhoHasNotVoted();
  const { partyId } = await params;

  return (
    <PageShell>
      <VoteConfirmation partyId={partyId} />
    </PageShell>
  );
}
