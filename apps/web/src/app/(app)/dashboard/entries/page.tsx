"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Entry } from "./types";
import { EntriesHeader } from "./_components/entriesHeader";
import { EntriesEmptyState } from "./_components/entriesEmptyState";
import { EntryCard } from "./_components/entryCard";

async function fetchEntries(searchTerm: string): Promise<Entry[]> {
  const url = searchTerm
    ? `/api/entries?search=${encodeURIComponent(searchTerm)}`
    : "/api/entries";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load entries.");
  }

  const data = await response.json();
  return data.entries ?? [];
}

export default function EntriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const entriesQuery = useQuery({
    queryKey: ["entries", debouncedSearch],
    queryFn: () => fetchEntries(debouncedSearch),
  });

  const entries = entriesQuery.data ?? [];
  const loading = entriesQuery.isLoading;

  return (
    <div className="mx-auto max-w-4xl font-sans text-slate-800">
      <EntriesHeader
        search={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="border-brand h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      ) : entriesQuery.isError ? (
        <div className="border-dashboard-stroke rounded-2xl border border-dashed bg-slate-50/50 p-12 text-center">
          <p className="text-sm font-medium text-slate-600">
            Could not load entries right now.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please refresh and try again.
          </p>
        </div>
      ) : entries.length === 0 ? (
        <EntriesEmptyState hasSearch={Boolean(debouncedSearch)} />
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
