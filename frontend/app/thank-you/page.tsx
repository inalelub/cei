import Link from "next/link";
import { Check } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-svh flex-col bg-[#f4f3ed] text-stone-900">
      <header className="border-b border-stone-300">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link className="text-sm font-bold tracking-wide text-emerald-950" href="/">CEI / VOTE</Link>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
        <span className="mb-7 grid size-14 place-items-center rounded-full bg-emerald-900 text-white">
          <Check aria-hidden="true" size={28} />
        </span>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Vote recorded</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Thank you for taking part.</h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-stone-600">Your vote has been submitted. Your participation helps shape the future of your community.</p>
        <Link className="mt-9 inline-flex min-h-12 items-center justify-center self-start bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800" href="/">
          Return to home
        </Link>
      </section>
    </main>
  );
}