"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import type { PartyDefinition } from "@/lib/definitions";

export function PartyList() {
  const [parties, setParties] = useState<PartyDefinition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadParties() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/voting/parties`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(response.status === 401 || response.status === 403
            ? "Sign in to view the ballot."
            : "The party list could not be loaded.");
        }

        setParties(await response.json() as PartyDefinition[]);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(fetchError instanceof Error ? fetchError.message : "The party list could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadParties();
    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <p role="status" className="text-sm text-stone-600">Loading parties...</p>;
  }

  if (error) {
    return <p role="alert" className="text-sm font-medium text-red-800">{error}</p>;
  }

  if (parties.length === 0) {
    return <p className="text-sm text-stone-600">No parties are available.</p>;
  }

  return (
    <ul className="divide-y divide-stone-300 border-y border-stone-300">
      {parties.map((party) => (
        <li key={party.id} className="flex items-center justify-between gap-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">{party.partyName ?? party.name ?? `Party ${party.id}`}</h2>
            {party.partyAbbreviation && (
              <p className="mt-1 text-sm text-stone-600">{party.partyAbbreviation}</p>
            )}
          </div>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center justify-center bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            href={`/vote/${party.id}`}
          >
            Choose
          </Link>
        </li>
      ))}
    </ul>
  );
}