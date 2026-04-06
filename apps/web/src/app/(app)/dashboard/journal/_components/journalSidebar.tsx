import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Brain, Plus, X } from "lucide-react";
import { MIN_WORDS_FOR_ANALYSIS } from "@/lib/constants";
import { AI_BENEFITS } from "../deps";
import type { JournalTag } from "../types";

type JournalSidebarProps = {
  creditsLoading: boolean;
  credits: number | null;
  tags: JournalTag[];
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (id: string) => void;
};

export function JournalSidebar({
  creditsLoading,
  credits,
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
}: JournalSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="border-dashboard-stroke shadow-card-layered overflow-hidden rounded-2xl border bg-white">
        <div className="border-dashboard-stroke bg-brand/5 flex items-center gap-2 border-b px-5 py-3.5">
          <Brain className="text-brand h-5 w-5 shrink-0" />
          <h2 className="text-brand font-sans text-sm font-bold tracking-wider uppercase">
            AI Insight
          </h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-600">
            When you click <span className="text-brand font-semibold">Analyze with AI</span>, Shadow Journal
            will read this entry, surface recurring themes, and suggest prompts
            for your next session. Each run uses{" "}
            <span className="font-medium text-slate-800">1 credit</span>. Your
            reflection needs at least{" "}
            <span className="font-medium text-slate-800">
              {MIN_WORDS_FOR_ANALYSIS} words
            </span>{" "}
            in the body so the analysis has enough to work with.
          </p>
          {!creditsLoading && credits !== null && credits < 1 && (
            <p className="mt-3 text-sm text-amber-800">
              You&apos;re out of credits.{" "}
              <Link
                href="/dashboard/pricing"
                className="text-brand font-semibold underline-offset-2 hover:underline"
              >
                Go to Pricing
              </Link>{" "}
              to subscribe or top up.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {AI_BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="bg-brand/10 text-brand mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-dashboard-stroke shadow-card-layered rounded-2xl border bg-white p-5">
        <h2 className="font-sans text-sm font-bold text-slate-800">Tags & motifs</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Optional—helps AI notice patterns across entries.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-brand/10 text-brand inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => onRemoveTag(tag.id)}
                className="hover:bg-brand/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1.5 transition-colors hover:border-slate-400">
            <Input
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddTag()}
              placeholder="Add tag..."
              className="h-6 w-20 border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus-visible:ring-0"
            />
            <button
              type="button"
              onClick={onAddTag}
              className="hover:bg-brand/10 hover:text-brand rounded-full p-0.5 text-slate-500 transition-colors"
              aria-label="Add tag"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
