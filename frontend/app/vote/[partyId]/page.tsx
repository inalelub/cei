"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Lock, TriangleAlert } from "lucide-react";
import { AuthCard, AuthCardHeader, AuthShell } from "@/components/auth-shell";
import { API_BASE_URL } from "@/lib/api";
import type { PartyDefinition } from "@/lib/definitions";
import preloader from "@/assets/preloader.gif";

export default function VotePage() {
  const { partyId } = useParams<{ partyId: string }>();
  const router = useRouter();
  const [party, setParty] = useState<PartyDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadParty() {
      let response: Response;

      try {
        response = await fetch(`${API_BASE_URL}/api/voting/parties`, {
          credentials: "include",
          signal: controller.signal,
        });
      } catch {
        // fetch only rejects when no response arrived at all (offline, server down, CORS).
        if (!controller.signal.aborted) {
          setError("We could not reach the server. Please try again shortly.");
          setIsLoading(false);
        }
        return;
      }

      if (controller.signal.aborted) return;

      if (!response.ok) {
        setError(response.status === 401 || response.status === 403
          ? "Sign in to cast your vote."
          : "The selected party could not be loaded.");
        setIsLoading(false);
        return;
      }

      let parties: PartyDefinition[];
      try {
        parties = await response.json() as PartyDefinition[];
      } catch {
        if (!controller.signal.aborted) {
          setError("The selected party could not be loaded.");
          setIsLoading(false);
        }
        return;
      }

      if (controller.signal.aborted) return;

      const selectedParty = parties.find((item) => String(item.id) === partyId);
      if (selectedParty) setParty(selectedParty);
      else setError("The selected party could not be found.");
      setIsLoading(false);
    }

    void loadParty();
    return () => controller.abort();
  }, [partyId]);

  async function castVote() {
    setIsSubmitting(true);
    setError(null);

    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/api/voting/votes?partyId=${encodeURIComponent(partyId)}`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // fetch only rejects when no response arrived at all (offline, server down, CORS).
      setError("We could not reach the server. Please try again shortly.");
      setIsSubmitting(false);
      return;
    }

    if (!response.ok) {
      if (response.status === 409) {
        setError("Our records show that you have already voted.");
      } else if (response.status === 401 || response.status === 403) {
        setError("Sign in to cast your vote.");
      } else {
        setError("Your vote could not be submitted. Please try again.");
      }
      setIsSubmitting(false);
      return;
    }

    // Keep isSubmitting true so the button can't be pressed again.
    router.push("/thank-you");
  }

  const name = party ? (party.partyName ?? party.name ?? `Party ${party.id}`) : "";

  return (
    <AuthShell>
      <AuthCard>
        <AuthCardHeader
          icon={<CheckCircle2 className="size-6" aria-hidden />}
          title="Confirm your vote"
          description="Review your choice before it is cast."
        />

        {isLoading ? (
          <div role="status" className="flex flex-col items-center justify-center gap-3 py-10">
            <Image src={preloader} alt="" unoptimized priority className="h-16 w-auto" />
            <p className="text-sm text-cei-gray">Loading party…</p>
          </div>
        ) : party ? (
          <>
            <div className="flex items-center gap-4 rounded-card border border-cei-border bg-cei-stat-grey px-4 py-4">
              {party.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logos are arbitrary external URLs
                <img src={party.logoUrl} alt="" className="size-13 shrink-0 rounded-full border border-cei-border bg-white object-contain p-1" />
              ) : (
                <span aria-hidden className="flex size-13 shrink-0 items-center justify-center rounded-full bg-cei-blue-tint text-[15px] font-bold tracking-[0.02em] text-cei-header">
                  {String(party.partyAbbreviation ?? name.slice(0, 3)).toUpperCase().slice(0, 4)}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[17px] leading-6 font-medium text-cei-navy">{name}</p>
                {party.partyAbbreviation && (
                  <p className="text-[13px] leading-[1.45] text-cei-gray">{party.partyAbbreviation}</p>
                )}
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-[1.45] text-cei-gray">
              Your vote can only be submitted once and cannot be changed afterwards.
            </p>

            {error && (
              <p role="alert" className="mt-4 rounded-control bg-cei-error-tint px-3.5 py-3 text-sm font-medium text-cei-error">
                {error}{" "}
                {error === "Sign in to cast your vote." && (
                  <Link href="/login" className="font-semibold underline">Sign in</Link>
                )}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/parties"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-control border border-cei-border bg-white px-5 text-sm font-semibold tracking-[0.03em] text-cei-navy uppercase hover:bg-cei-stat-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
              >
                <ArrowLeft className="size-4" aria-hidden /> Back to parties
              </Link>
              <button
                type="button"
                onClick={castVote}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-control bg-cei-blue px-5 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_2px_2px_#00000024,0_1px_5px_#0000001f] hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting…" : "Cast vote"}
              </button>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-center text-[13px] text-cei-gray">
              <Lock className="size-4 shrink-0 text-cei-success" aria-hidden />
              Your vote is secret. Nobody, including the CEI, can see who you voted for.
            </p>
          </>
        ) : (
          <div role="alert" className="flex flex-col items-center gap-3 px-2 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-cei-error-tint text-cei-error">
              <TriangleAlert className="size-6" aria-hidden />
            </span>
            <p className="max-w-md text-sm text-cei-gray">{error}</p>
            <div className="flex gap-4 text-sm font-semibold">
              {error === "Sign in to cast your vote." && (
                <Link href="/login" className="text-cei-blue hover:underline">Sign in</Link>
              )}
              <Link href="/parties" className="text-cei-blue hover:underline">Return to parties</Link>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthShell>
  );
}
