"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutList } from "lucide-react";
import Link from "next/link";

const MOCK_ENTRIES = [
  {
    id: "1",
    title: "The Shadow in the Dream",
    snippet:
      "I woke up feeling uneasy about the figure in the hallway. It wasn't menacing, but it stood there with a heavy silence that felt like judgment. When I tried to speak to it, my voice wouldn't come out. I realize now that figure might have been...",
    date: new Date("2023-10-24"),
    tags: [
      { label: "Fear", dotColor: "bg-brand" },
      { label: "Dreams", dotColor: null },
      { label: "The Shadow", dotColor: null },
    ],
  },
  {
    id: "2",
    title: "Workplace Conflict",
    snippet:
      "The meeting today brought up old feelings. I noticed how quickly I judged my colleague's approach, and it made me wonder what part of myself I'm projecting onto her. The frustration felt disproportionate to the situation...",
    date: new Date("2023-10-22"),
    tags: [
      { label: "Projection", dotColor: "bg-amber-500" },
      { label: "The Persona", dotColor: null },
    ],
  },
  {
    id: "3",
    title: "The Golden Shadow",
    snippet:
      "I've been noticing the qualities I admire in others—creativity, spontaneity, boldness—and wondering if I've suppressed those in myself. Jung wrote about the golden shadow, the positive traits we disown. Perhaps it's time to...",
    date: new Date("2023-10-18"),
    tags: [
      { label: "Creativity", dotColor: null },
      { label: "Envy", dotColor: "bg-amber-400" },
    ],
  },
  {
    id: "4",
    title: "Recurring Anger",
    snippet:
      "Another moment where I snapped at something small. I've been tracking these outbursts. They seem to cluster around times when I feel unheard or undervalued. The anger masks something else—maybe grief, or a longing to be seen...",
    date: new Date("2023-09-30"),
    tags: [
      { label: "Repression", dotColor: null },
      { label: "The Shadow", dotColor: null },
    ],
  },
];

function formatDate(date: Date) {
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
  };
}

export default function EntriesPage() {
  const [search, setSearch] = useState("");

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-w-[200px] pr-4 pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="default"
            className="gap-2"
          >
            <LayoutList className="h-4 w-4" />
            Filter by Tag
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ENTRIES.map((entry) => {
          const { month, day, year } = formatDate(entry.date);
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
                    {entry.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {entry.snippet}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag.dotColor && (
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${tag.dotColor}`}
                          />
                        )}
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
