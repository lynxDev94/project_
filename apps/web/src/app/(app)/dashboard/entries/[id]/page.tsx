"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Lightbulb,
  Wind,
  Link2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const MOCK_ENTRIES: Record<
  string,
  {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    tags: { label: string; dotColor: string | null }[];
    analysis: {
      shadowProjection: string;
      complexes: { title: string; description: string }[];
      imagery: { symbol: string; meaning: string }[];
    };
  }
> = {
  "1": {
    id: "1",
    title: "The Shadow in the Dream",
    body: `I woke up feeling uneasy about the figure in the hallway. It wasn't menacing, but it stood there with a heavy silence that felt like judgment. When I tried to speak to it, my voice caught in my throat, a familiar sensation of paralysis that I've felt in real life when confronting authority.

The figure was wearing the same coat my grandfather used to wear. It's strange because I haven't thought about him in years. He was always a stern man, rarely speaking, but his presence filled the room. In the dream, the figure didn't move, but the shadows around it seemed to breathe, expanding and contracting with my own heartbeat.

I realized halfway through the dream that I was holding a small, fragile bird in my hands. I was terrified of crushing it, yet my hands were squeezing tighter involuntarily. The more the figure stared, the tighter my grip became. I wanted to let go, but my muscles wouldn't obey.

Waking up, the feeling of helplessness lingered. Is the bird my own vulnerability? And is the silent figure the part of me that despises weakness? I feel like I'm constantly at war with myself—one part wanting to protect what's fragile, another part wanting to crush it before it can be used against me.`,
    createdAt: new Date("2023-10-24T08:45:00"),
    tags: [
      { label: "Fear", dotColor: "bg-brand" },
      { label: "Dreams", dotColor: null },
      { label: "The Shadow", dotColor: null },
    ],
    analysis: {
      shadowProjection:
        'The silent figure likely represents your Senex aspect—the authoritarian judge. By projecting this onto your grandfather\'s image, you distance yourself from your own internal critic.',
      complexes: [
        {
          title: "The Authority Complex",
          description:
            "Triggered by feelings of judgment. Manifests as physical paralysis in the dream state.",
        },
        {
          title: "The Victim/Tyrant Dyad",
          description:
            "The struggle with the bird reflects the tension between your vulnerability (victim) and your capacity to destroy it (tyrant).",
        },
      ],
      imagery: [
        {
          symbol: "The Bird",
          meaning:
            "Symbolizes the soul or spiritual aspiration, fragile and currently in danger of being crushed by the ego's fear.",
        },
        {
          symbol: "The Coat",
          meaning:
            "A mantle of generational expectation and traditional masculine stoicism.",
        },
      ],
    },
  },
  "2": {
    id: "2",
    title: "Workplace Conflict",
    body: `The meeting today brought up old feelings. I noticed how quickly I judged my colleague's approach, and it made me wonder what part of myself I'm projecting onto her. The frustration felt disproportionate to the situation.

I've been reflecting on why her confidence bothers me so much. Is it envy? Or am I seeing in her something I've suppressed—the part of me that could speak up without second-guessing every word?

Maybe the shadow here is my own unexpressed assertiveness. I'll sit with this.`,
    createdAt: new Date("2023-10-22T14:30:00"),
    tags: [
      { label: "Projection", dotColor: "bg-amber-500" },
      { label: "The Persona", dotColor: null },
    ],
    analysis: {
      shadowProjection:
        "The colleague may embody your disowned assertiveness. The disproportionate reaction suggests an activated complex around visibility and competence.",
      complexes: [
        {
          title: "The Competence Complex",
          description:
            "Triggers around situations where others appear more confident or vocal than you feel.",
        },
      ],
      imagery: [
        {
          symbol: "The Meeting Room",
          meaning:
            "A collective space where the persona is performed—often where shadow material surfaces.",
        },
      ],
    },
  },
  "3": {
    id: "3",
    title: "The Golden Shadow",
    body: `I've been noticing the qualities I admire in others—creativity, spontaneity, boldness—and wondering if I've suppressed those in myself. Jung wrote about the golden shadow, the positive traits we disown. Perhaps it's time to reclaim them.`,
    createdAt: new Date("2023-10-18T09:15:00"),
    tags: [
      { label: "Creativity", dotColor: null },
      { label: "Envy", dotColor: "bg-amber-400" },
    ],
    analysis: {
      shadowProjection:
        "Admiration often points to disowned potential. Your envy of creativity may signal a latent creative impulse seeking expression.",
      complexes: [],
      imagery: [],
    },
  },
  "4": {
    id: "4",
    title: "Recurring Anger",
    body: `Another moment where I snapped at something small. I've been tracking these outbursts. They seem to cluster around times when I feel unheard or undervalued. The anger masks something else—maybe grief, or a longing to be seen.`,
    createdAt: new Date("2023-09-30T19:00:00"),
    tags: [
      { label: "Repression", dotColor: null },
      { label: "The Shadow", dotColor: null },
    ],
    analysis: {
      shadowProjection:
        "Anger as a secondary emotion—often protecting grief, shame, or unmet needs. The 'small' triggers suggest accumulated resentment.",
      complexes: [
        {
          title: "The Invalidation Complex",
          description:
            "Activated when feeling unseen or undervalued. Expresses as disproportionate anger.",
        },
      ],
      imagery: [],
    },
  },
};

function formatDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

export default function EntryReadPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;
  const entry = id ? MOCK_ENTRIES[id] : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-4xl font-sans text-slate-800">
        <Link
          href="/dashboard/entries"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Link>
        <p className="mt-8 text-slate-600">Entry not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl font-sans text-slate-800">
      <Link
        href="/dashboard/entries"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        {/* Left: Entry content */}
        <div className="rounded-2xl border border-dashboard-stroke bg-white p-6 shadow-card-layered md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {formatDateTime(entry.createdAt)}
              </p>
              <h1 className="mt-2 font-headline text-3xl font-bold text-slate-900 md:text-4xl">
                {entry.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Edit entry">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                aria-label="Delete entry"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
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

          <div className="prose prose-slate mt-8 max-w-none">
            {entry.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-base leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right: AI Analysis */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-dashboard-stroke bg-white shadow-card-layered">
            <div className="flex items-center gap-2 border-b border-dashboard-stroke bg-brand/5 px-5 py-3.5">
              <Lightbulb className="h-5 w-5 shrink-0 text-brand" />
              <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-brand">
                AI Analysis
              </h2>
              <span className="rounded-full bg-brand/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                Jungian Lens
              </span>
            </div>
            <div className="space-y-6 p-5">
              {/* Shadow Projection */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Wind className="h-4 w-4 text-brand" />
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600">
                    Shadow Projection
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {entry.analysis.shadowProjection.split("Senex").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <span className="font-medium text-brand">Senex</span>
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>

              {/* Active Complexes */}
              {entry.analysis.complexes.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-brand" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600">
                      Active Complexes
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {entry.analysis.complexes.map((c) => (
                      <div key={c.title}>
                        <p className="font-sans text-sm font-semibold text-slate-800">
                          {c.title}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {c.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Archetypal Imagery */}
              {entry.analysis.imagery.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600">
                      Archetypal Imagery
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {entry.analysis.imagery.map((item) => (
                      <li key={item.symbol}>
                        <span className="font-semibold text-slate-800">
                          {item.symbol}:
                        </span>{" "}
                        <span className="text-sm text-slate-600">
                          {item.meaning}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                variant="primary"
                className="mt-4 w-full gap-2 rounded-xl bg-brand text-white hover:bg-brand/90"
              >
                <MessageCircle className="h-4 w-4" />
                Dialogue with this Shadow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
