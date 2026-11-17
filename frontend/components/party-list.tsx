"use client";

import Link from "next/link";
import Image from 'next/image'
import { useEffect, useId, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Lock, RotateCw, Search, WifiOff, TriangleAlert } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import type { PartyDefinition } from "@/lib/definitions";
import preloader from '@/assets/preloader.gif'

type LoadError = "network" | "unauthorized" | "server";

const errorCopy: Record<Exclude<LoadError, "unauthorized">, { title: string; body: string }> = {
  network: {
    title: "We couldn't reach the server",
    body: "Check your internet connection, then try again. If you're online, the service may be temporarily unavailable.",
  },
  server: {
    title: "The party list could not be loaded",
    body: "Something went wrong on our side. Please try again in a moment.",
  },
};

// Monogram tints, borrowed from the home page Quick Links tones.
const monogramTones = [
  "bg-cei-blue-tint text-cei-header",
  "bg-[#d7f5ee] text-[#007a65]",
  "bg-[#f8e8b7] text-[#7a5608]",
];

function partyName(party: PartyDefinition) {
  return party.partyName ?? party.name ?? `Party ${party.id}`;
}

function PartyMonogram({ party, tone }: { party: PartyDefinition; tone: string }) {

  if (party.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logos are arbitrary external URLs
      <img src={party.logoUrl} alt="" className="size-13 shrink-0 rounded-full border border-cei-border bg-white object-contain p-1" />
    );
  }

  const label = String(party.partyAbbreviation ?? partyName(party).slice(0, 3)).toUpperCase();

  return (
    <span aria-hidden className={`flex size-13 shrink-0 items-center justify-center rounded-full text-[15px] font-bold tracking-[0.02em] ${tone}`}>
      {label.slice(0, 4)}
    </span>
  );
}

export function PartyList() {

  const id = useId();
  const [parties, setParties] = useState<PartyDefinition[]>([]);
  const [error, setError] = useState<LoadError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [attempt, setAttempt] = useState(0); // Bumped by "Try again" to re-run the fetch effect.


  useEffect(() => {

    const controller = new AbortController();

    async function loadParties() {

      let response: Response;

      try {
        response = await fetch(`${API_BASE_URL}/api/voting/parties`, {
          credentials: "include",
          signal: controller.signal,
        });
      } catch {
        // fetch only rejects when no response arrived at all (offline, server down, CORS),
        // e.g. Firefox's "NetworkError when attempting to fetch resource."
        if (!controller.signal.aborted) {
          setError("network");
          setIsLoading(false);
        }
        return;
      }

      if (controller.signal.aborted) return;

      if (!response.ok) {
        setError(response.status === 401 || response.status === 403 ? "unauthorized" : "server");
        setIsLoading(false);
        return;
      }

      try {
        setParties(await response.json() as PartyDefinition[]);
      } catch {
        if (!controller.signal.aborted) setError("server");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadParties();
    return () => controller.abort();

  }, [attempt]);

  function retry() {
    setError(null);
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }

  const visibleParties = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return parties.map((party, index) => ({ party, index }));
    return parties
      .map((party, index) => ({ party, index }))
      .filter(({ party }) =>
        partyName(party).toLowerCase().includes(term) || String(party.partyAbbreviation ?? "").toLowerCase().includes(term));
  }, [parties, query]);

  if (isLoading) {
    return (
      <div role="status" className="flex flex-col items-center justify-center gap-3 py-16">
        <Image src={preloader} alt="" unoptimized priority className="h-16 w-auto" />
        <p className="text-sm text-cei-gray">Loading parties…</p>
      </div>
    );
  }

  if (error === "unauthorized") {
    return (
      <p role="alert" className="rounded-control bg-cei-error-tint px-3.5 py-3 text-sm font-medium text-cei-error">
        Sign in to view the ballot.{" "}
        <Link href="/login" className="font-semibold underline">Sign in</Link>
      </p>
    );
  }

  if (error) {
    const { title, body } = errorCopy[error];
    const Icon = error === "network" ? WifiOff : TriangleAlert;

    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-card border border-cei-border bg-white px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-cei-error-tint text-cei-error">
          <Icon className="size-6" aria-hidden />
        </span>
        <h2 className="text-[17px] font-medium text-cei-navy">{title}</h2>
        <p className="max-w-md text-[13px] leading-[1.45] text-cei-gray">{body}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-control bg-cei-blue px-5 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_2px_2px_#00000024,0_1px_5px_#0000001f] hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
        >
          <RotateCw className="size-4" aria-hidden /> Try again
        </button>
      </div>
    );
  }

  if (parties.length === 0) {
    return <p className="text-sm text-cei-gray">No parties are available.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-90">
          <label htmlFor={`${id}-search`} className="sr-only">Search parties</label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-cei-gray" aria-hidden />
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by party name or abbreviation"
            autoComplete="off"
            className="h-10 w-full rounded-control border border-cei-border bg-white pr-3.5 pl-10 text-sm text-cei-ink outline-none placeholder:text-cei-ink/40 focus:border-cei-blue focus:ring-1 focus:ring-cei-blue"
          />
        </div>
        <p role="status" className="text-[13px] text-cei-gray">
          <span className="font-bold text-cei-navy">{visibleParties.length}</span>
          {query.trim() ? ` of ${parties.length}` : ""} {parties.length === 1 ? "party" : "parties"} on this ballot
        </p>
      </div>

      {visibleParties.length === 0 ? (
        <p className="border-y border-cei-border py-8 text-center text-sm text-cei-gray">
          No parties match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <ul className="border-t border-cei-border">
          {visibleParties.map(({ party, index }) => {
            const name = partyName(party);
            return (
              <li key={party.id} className="flex flex-wrap items-center gap-4 border-b border-cei-border px-1 py-4 sm:flex-nowrap">
                <PartyMonogram party={party} tone={monogramTones[index % monogramTones.length]} />

                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] leading-6 font-medium text-cei-navy">{name}</h2>
                  <p className="text-[13px] leading-[1.45] text-cei-gray">
                    {party.partyAbbreviation ? `${party.partyAbbreviation} · ` : ""}Ballot no. {index + 1}
                  </p>
                </div>

                <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                  <span className="w-30 shrink-0">
                    {party.partyUrl ? (
                      <a
                        href={party.partyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-cei-blue hover:underline"
                      >
                        Website <ArrowUpRight className="size-4" aria-hidden />
                        <span className="sr-only">(opens {name} website in a new tab)</span>
                      </a>
                    ) : null}
                  </span>

                  <Link
                    href={`/vote/${party.id}`}
                    aria-label={`Vote for ${name}`}
                    className="inline-flex h-10 w-30 shrink-0 items-center justify-center gap-1.5 rounded-control bg-cei-blue text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_2px_2px_#00000024,0_1px_5px_#0000001f] hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue"
                  >
                    Vote <ArrowRight className="size-4.5" aria-hidden />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-[13px] text-cei-gray">
        <Lock className="size-4 shrink-0 text-cei-success" aria-hidden />
        Your vote is secret. Nobody, including the CEI, can see who you voted for.
      </p>
    </div>
  );
}
