"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Lightbulb,
  MessageCircle,
} from "lucide-react";

type Entry = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  entry_date: string;
  created_at: string;
};

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return d.toLocaleDateString("en-US", options);
}

export default function EntryReadPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/entries/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.entry) setEntry(data.entry);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteOpen(false);
        router.push("/dashboard/entries");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl font-sans text-slate-800">
        <Link
          href="/dashboard/entries"
          className="hover:text-brand mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Link>
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-4xl font-sans text-slate-800">
        <Link
          href="/dashboard/entries"
          className="hover:text-brand mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors"
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
        className="hover:text-brand mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        {/* Left: Entry content */}
        <div className="border-dashboard-stroke shadow-card-layered rounded-2xl border bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {formatDateTime(entry.created_at)}
              </p>
              <h1 className="font-headline mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                {entry.title || "Untitled reflection"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/journal?edit=${entry.id}`}>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Edit entry"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                aria-label="Delete entry"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {entry.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
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

          <div className="prose prose-slate mt-8 max-w-none">
            {(entry.body || "")
              .split("\n\n")
              .filter(Boolean)
              .map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-4 text-base leading-relaxed text-slate-700"
                >
                  {paragraph}
                </p>
              ))}
            {!entry.body?.trim() && (
              <p className="text-slate-500 italic">No content</p>
            )}
          </div>
        </div>

        {/* Right: AI Analysis placeholder */}
        <div className="space-y-4">
          <div className="border-dashboard-stroke shadow-card-layered rounded-2xl border bg-white">
            <div className="border-dashboard-stroke bg-brand/5 flex items-center gap-2 border-b px-5 py-3.5">
              <Lightbulb className="text-brand h-5 w-5 shrink-0" />
              <h2 className="text-brand font-sans text-sm font-bold tracking-wider uppercase">
                AI Analysis
              </h2>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm text-slate-600">
                AI-powered insights, shadow projections, and archetypal imagery
                coming soon.
              </p>
              <Button
                variant="primary"
                className="bg-brand hover:bg-brand/90 w-full gap-2 rounded-xl text-white"
                disabled
              >
                <MessageCircle className="h-4 w-4" />
                Dialogue with this Shadow
              </Button>
              <p className="text-center text-xs text-slate-400">
                Premium feature — coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete entry</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The entry will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
