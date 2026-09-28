import Link from "next/link";
import { PartyList } from "@/components/party-list";

export default function PartiesPage() {
  return (
    <main className="min-h-svh bg-[#f4f3ed] text-stone-900">
      <header className="border-b border-stone-300 bg-[#f4f3ed]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link className="text-sm font-bold tracking-wide text-emerald-950" href="/">CEI / VOTE</Link>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">Official ballot</span>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 md:pt-20">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Your voice matters</p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Choose the party you want to represent you.</h1>
        <p className="mb-10 mt-4 max-w-xl text-base leading-7 text-stone-600">Select a party to review your choice before casting your vote.</p>
        <PartyList />
      </section>
    </main>
  );
}