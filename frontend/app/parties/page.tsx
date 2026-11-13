import { Vote } from "lucide-react";
import { AuthCard, AuthCardHeader, AuthShell } from "@/components/auth-shell";
import { PartyList } from "@/components/party-list";

/** Ballot: lists the parties a signed-in voter can choose from (Paper: Parties Page). */
export default function PartiesPage() {
  return (
    <AuthShell widthClass="max-w-3xl">
      <AuthCard>
        <AuthCardHeader
          icon={<Vote className="size-6" aria-hidden />}
          title="Choose your party"
          description="Select the party you want to represent you. You will review your choice before your vote is cast."
        />
        <PartyList />
      </AuthCard>
    </AuthShell>
  );
}
