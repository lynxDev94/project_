"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Brain,
  Lock,
  List,
  ImageIcon,
  Maximize2,
  Sparkles,
  Check,
  Plus,
  X,
} from "lucide-react";

const SAMPLE_TAGS = [
  { id: "1", label: "fear", color: "bg-sky-500 text-white" },
  { id: "2", label: "insecurity", color: "bg-red-500 text-white" },
  { id: "3", label: "resilience", color: "bg-amber-500 text-white" },
];

export default function JournalPage() {
  const [title, setTitle] = useState("The Shadow in the Stone");
  const [body, setBody] = useState(
    "Last night I dreamed of a wall—not a physical one, but something I carry. In the dream, I was presenting to a room full of colleagues, and my voice kept cracking. When I woke, I realized how much of my professional self is a performance. The \"together\" version. The shadow? The part that fears being seen as inadequate, that hides behind competence."
  );
  const [tags, setTags] = useState(SAMPLE_TAGS);
  const [newTag, setNewTag] = useState("");
  const [privateEntry, setPrivateEntry] = useState(true);
  const [resonance, setResonance] = useState(35);
  const wordCount = body.split(/\s+/).filter(Boolean).length;

  const removeTag = (id: string) => {
    setTags((t) => t.filter((tag) => tag.id !== id));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setTags((t) => [
      ...t,
      {
        id: String(Date.now()),
        label: newTag.trim(),
        color: "bg-brand text-white",
      },
    ]);
    setNewTag("");
  };

  return (
    <div className="min-h-screen bg-dashboard-main-bg font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-dashboard-stroke bg-dashboard-sidebar-bg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-slate-800">
                Shadow<span className="text-brand">Journal</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              >
                Dashboard
              </Link>
              <Link
                href="/journal"
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand"
              >
                Journal
              </Link>
              <Link
                href="#"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              >
                Archive
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">
                Private Entry
              </span>
              <Switch
                checked={privateEntry}
                onCheckedChange={setPrivateEntry}
                className="data-[state=checked]:bg-brand"
              />
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-slate-200 text-sm font-medium text-slate-600">
                AC
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Emotional Resonance slider */}
        <div className="mb-8">
          <p className="mb-2 text-center text-sm font-semibold text-brand">
            Emotional Resonance
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-slate-500">
              SHADOW / HEAVY
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={resonance}
              onChange={(e) => setResonance(Number(e.target.value))}
              className="h-3 max-w-md flex-1 cursor-pointer accent-brand"
            />
            <span className="text-xs font-medium text-slate-500">
              LIGHT / INTEGRATED
            </span>
          </div>
        </div>

        {/* Journal entry card */}
        <div className="flex gap-4">
          {/* Left toolbar */}
          <div className="flex shrink-0 flex-col gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="List"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Expand"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>

          <div className="min-w-0 flex-1 rounded-2xl border border-dashboard-stroke bg-white shadow-card-layered">
            <div className="p-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                className="mb-4 w-full text-2xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Begin your reflection..."
                className="min-h-[200px] resize-none border-0 px-0 text-slate-700 placeholder:text-slate-400 focus-visible:ring-0"
                rows={6}
              />

              {/* Tags */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Associated Shadows & Light
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${tag.color}`}
                    >
                      {tag.label}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="rounded-full p-0.5 hover:bg-white/20"
                        aria-label={`Remove ${tag.label}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      placeholder="Add tag..."
                      className="h-7 w-24 border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      aria-label="Add tag"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashboard-stroke bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Words
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {wordCount} words
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Saved
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-brand to-brand-deep"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                </Button>
                <Button variant="primary" size="lg" className="gap-2">
                  <Check className="h-4 w-4" />
                  Save Entry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
