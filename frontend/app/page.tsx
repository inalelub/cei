import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { VoterStats } from "@/components/home/voter-stats";
import { MoreElectionInfo } from "@/components/home/election-info";
import { ResultsLinks } from "@/components/home/elections-results";
import { RegistrationStatusBar } from "@/components/home/status-bar";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10">
        <RegistrationStatusBar />
        <ResultsLinks />
        <VoterStats />
        <MoreElectionInfo />
      </main>

      <SiteFooter />
    </>
  );
}
