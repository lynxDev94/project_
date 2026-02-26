"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

const SNIPPET_LENGTH = 120;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate().toString(),
    year: d.getFullYear().toString(),
  };
}

function truncate(body: string, maxLen: number): string {
  const trimmed = body.trim();
  if (trimmed.length <= maxLen) return trimmed;
  const cut = trimmed.slice(0, maxLen).lastIndexOf(" ");
  const end = cut > maxLen / 2 ? cut : maxLen;
  return trimmed.slice(0, end) + "…";
}

type Entry = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  entry_date: string;
  created_at: string;
};

export default function EntriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const url = debouncedSearch
        ? `/api/entries?search=${encodeURIComponent(debouncedSearch)}`
        : "/api/entries";
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="mx-auto max-w-4xl font-sans text-slate-800">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
            Journal History
          </p>
          <h1 className="font-headline mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
            Your Reflections
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A journey through your shadow self.
          </p>
        </div>
        <div className="relative w-full min-w-[200px] sm:w-auto">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-4 pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : entries.length === 0 ? (
        <div className="border-dashboard-stroke rounded-2xl border border-dashed bg-slate-50/50 p-12 text-center">
          <p className="text-sm font-medium text-slate-600">
            {debouncedSearch
              ? "No entries match your search."
              : "No entries yet."}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {debouncedSearch ? (
              "Try a different search term."
            ) : (
              <Link href="/dashboard/journal" className="text-brand hover:underline">
                Start your first reflection
              </Link>
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const { month, day, year } = formatDate(entry.entry_date || entry.created_at);
            const snippet = truncate(entry.body || "", SNIPPET_LENGTH);
            return (
              <Link
                key={entry.id}
                href={`/dashboard/entries/${entry.id}`}
                className="block"
              >
                <article className="border-dashboard-stroke shadow-card-layered flex gap-6 rounded-2xl border bg-white p-5 transition-shadow hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] md:p-6">
                  <div className="border-dashboard-stroke flex shrink-0 flex-col items-center justify-center border-r pr-6 text-center">
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      {month}
                    </span>
                    <span className="font-headline text-3xl leading-none font-bold text-slate-900">
                      {day}
                    </span>
                    <span className="mt-1 text-xs font-medium text-slate-500">
                      {year}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-sans text-lg font-bold text-slate-900">
                      {entry.title || "Untitled reflection"}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {snippet || "No content"}
                    </p>
                    {entry.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
