"use client";

import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import type { PartyDefinition } from "@/lib/definitions";

export default function VotePage() {
  const { partyId } = useParams<{ partyId: string }>();
  const [party, setParty] = useState<PartyDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadParty() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/voting/parties`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(response.status === 401 || response.status === 403
            ? "Sign in to cast your vote."
            : "The selected party could not be loaded.");
        }

        const parties = await response.json() as PartyDefinition[];
        const selectedParty = parties.find((item) => String(item.id) === partyId);
        if (!selectedParty) throw new Error("The selected party could not be found.");
        setParty(selectedParty);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(fetchError instanceof Error ? fetchError.message : "The selected party could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadParty();
    return () => controller.abort();
  }, [partyId]);

  async function castVote() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/voting/votes?partyId=${encodeURIComponent(partyId)}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 409) {
        throw new Error("Our records show that you have already voted.");
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error("Sign in to cast your vote.");
      }
      if (!response.ok) throw new Error("Your vote could not be submitted. Please try again.");

      redirect("/thank-you");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Your vote could not be submitted. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-[#f4f3ed] text-stone-900">
      <header className="border-b border-stone-300">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link className="text-sm font-bold tracking-wide text-emerald-950" href="/">CEI / VOTE</Link>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Review your choice</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Confirm your vote</h1>
        {isLoading ? (
          <p role="status" className="mt-6 text-stone-600">Loading party...</p>
        ) : party ? (
          <>
            <p className="mt-6 text-xl font-semibold">{party.partyName ?? party.name ?? `Party ${party.id}`}</p>
            {party.partyAbbreviation && <p className="mt-1 text-sm text-stone-600">{party.partyAbbreviation}</p>}
            <p className="mt-5 max-w-lg text-base leading-7 text-stone-600">Your vote can only be submitted once.</p>
            {error && <p role="alert" className="mt-5 text-sm font-medium text-red-800">{error}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="inline-flex min-h-12 items-center justify-center bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={castVote}
                type="button"
              >
                {isSubmitting ? "Submitting..." : "Cast vote"}
              </button>
              <Link className="inline-flex min-h-12 items-center justify-center border border-stone-400 px-5 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-white" href="/parties">
                Back to parties
              </Link>
            </div>
          </>
        ) : (
          <>
            <p role="alert" className="mt-6 text-sm font-medium text-red-800">{error}</p>
            <Link className="mt-6 self-start text-sm font-semibold text-emerald-900 underline" href="/parties">Return to parties</Link>
          </>
        )}
      </section>
    </main>
  );
}