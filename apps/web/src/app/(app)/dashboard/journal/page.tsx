"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Check,
  Plus,
  X,
  Brain,
  Lightbulb,
  MessageCircleQuestion,
  TrendingUp,
  EyeOff,
  PenLine,
  Shuffle,
  Leaf,
  Moon,
  Users,
  Baby,
} from "lucide-react";

const PROMPT_CATEGORIES = [
  {
    id: "shadow",
    title: "The Shadow",
    icon: Leaf,
    prompts: [
      "What trait do I judge most in others, and why does it trigger me?",
      "When did I last feel envious? What does that envy reveal about my desires?",
      "What am I currently hiding from my closest friends or partner?",
    ],
  },
  {
    id: "dream",
    title: "Dream Work",
    icon: Moon,
    prompts: [
      "Describe a recurring symbol in your dreams. What might it represent?",
      "What dominant emotion did you feel upon waking up today?",
      "If the person in your dream was a part of you, which part would they be?",
    ],
  },
  {
    id: "relationships",
    title: "Relationships",
    icon: Users,
    prompts: [
      "Who am I trying to please right now, and at what cost to myself?",
      "What conversation am I avoiding having, and what am I afraid will happen?",
    ],
  },
  {
    id: "inner-child",
    title: "Inner Child",
    icon: Baby,
    prompts: [
      "When did I last feel truly playful? What allowed or blocked that?",
      "What did younger me need to hear that I can offer myself now?",
      "Where in my life am I still seeking external approval I never got?",
    ],
  },
];

const SAMPLE_TAGS = [
  { id: "1", label: "fear" },
  { id: "2", label: "insecurity" },
  { id: "3", label: "resilience" },
];

const AI_BENEFITS = [
  {
    icon: Lightbulb,
    text: "Highlight possible shadow patterns and projections.",
  },
  {
    icon: MessageCircleQuestion,
    text: "Suggest questions for deeper integration work.",
  },
  {
    icon: TrendingUp,
    text: "Track how your tone and themes shift over time.",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export default function JournalPage() {
  const [title, setTitle] = useState("Untitled reflection");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState(SAMPLE_TAGS);
  const [newTag, setNewTag] = useState("");
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [referencePrompt, setReferencePrompt] = useState<string | null>(null);
  const [shuffledCategories, setShuffledCategories] = useState(PROMPT_CATEGORIES);

  const wordCount = body.split(/\s+/).filter(Boolean).length;

  const handleShuffleSuggestions = useCallback(() => {
    const shuffled = shuffleArray(PROMPT_CATEGORIES).map((cat) => ({
      ...cat,
      prompts: shuffleArray(cat.prompts),
    }));
    setShuffledCategories(shuffled);
    setSelectedPrompt(null);
  }, []);

  const handleApplyPrompt = useCallback(() => {
    if (selectedPrompt) {
      setReferencePrompt(selectedPrompt);
      setPromptModalOpen(false);
      setSelectedPrompt(null);
    }
  }, [selectedPrompt]);

  const removeTag = (id: string) => {
    setTags((t) => t.filter((tag) => tag.id !== id));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const label = newTag.trim();
    setTags((t) => [...t, { id: String(Date.now()), label }]);
    setNewTag("");
  };

  return (
    <div className="mx-auto max-w-6xl font-sans text-slate-800">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Journal
        </p>
        <h1 className="mt-1 font-headline text-3xl font-bold text-slate-900 md:text-4xl">
          New reflection
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Capture what surfaced today. You can always return to refine, annotate, or
          ask the AI to help you see patterns underneath the words.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)]">
        {/* Main writing area */}
        <div className="group flex min-h-[440px] flex-col overflow-hidden rounded-3xl border border-dashboard-stroke bg-white shadow-card-layered transition-shadow focus-within:shadow-[0_0_0_1px_rgba(108,43,238,0.15),0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="relative flex-1 px-6 pb-4 pt-6 md:px-8 md:pt-7">
            <div className="absolute right-4 top-6 flex items-center gap-1 md:right-6">
              <button
                type="button"
                onClick={() => setPromptModalOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand/10 hover:text-brand"
                aria-label="Open prompt ideas"
              >
                <Lightbulb className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Private entry"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled reflection"
              className="mb-3 w-[calc(100%-2rem)] pr-2 font-headline text-2xl font-semibold tracking-tight text-slate-900 placeholder:text-slate-300 md:text-3xl focus:outline-none"
            />
            <p className="mb-5 text-sm italic text-slate-400">
              Begin your journey into the subconscious. Describe the dream, memory,
              or feeling that keeps returning to you.
            </p>
            {referencePrompt && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 p-4">
                <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="flex-1 text-sm font-medium text-slate-700">
                  {referencePrompt}
                </p>
                <button
                  type="button"
                  onClick={() => setReferencePrompt(null)}
                  className="rounded p-1 text-slate-400 hover:bg-brand/10 hover:text-slate-600"
                  aria-label="Remove reference prompt"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the dream or the feeling that lingers in the corners of your mind..."
              className="min-h-[240px] w-full resize-none border-0 bg-transparent p-0 text-base leading-[1.7] text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 md:min-h-[320px]"
            />
          </div>

          {/* Bottom bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashboard-stroke bg-slate-50/90 px-6 py-3.5 md:px-8">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Words
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {wordCount} words
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
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
                className="gap-2 rounded-xl bg-brand px-6 text-white shadow-sm hover:bg-brand/90"
              >
                <Sparkles className="h-4 w-4" />
                Analyze with AI
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="gap-2 rounded-xl bg-brand px-6 text-white shadow-sm hover:bg-brand/90"
              >
                <Check className="h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>

        {/* Right column: AI & tags */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-dashboard-stroke bg-white shadow-card-layered">
            <div className="flex items-center gap-2 border-b border-dashboard-stroke bg-brand/5 px-5 py-3.5">
              <Brain className="h-5 w-5 shrink-0 text-brand" />
              <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-brand">
                AI Insight
              </h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600">
                When you click{" "}
                <span className="font-semibold text-brand">Analyze with AI</span>,
                Shadow Journal will read this entry, surface recurring themes, and
                suggest prompts for your next session.
              </p>
              <ul className="mt-4 space-y-3">
                {AI_BENEFITS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-dashboard-stroke bg-white p-5 shadow-card-layered">
            <h2 className="font-sans text-sm font-bold text-slate-800">
              Tags & motifs
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Optional—helps AI notice patterns across entries.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand"
                >
                  {tag.label}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="rounded-full p-0.5 transition-colors hover:bg-brand/20"
                    aria-label={`Remove ${tag.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1.5 transition-colors hover:border-slate-400">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag..."
                  className="h-6 w-20 border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-full p-0.5 text-slate-500 transition-colors hover:bg-brand/10 hover:text-brand"
                  aria-label="Add tag"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={promptModalOpen}
        onOpenChange={(open) => {
          setPromptModalOpen(open);
          if (!open) setSelectedPrompt(null);
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div>
                <DialogTitle className="font-headline text-xl">
                  Prompt Ideas
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Select a theme to guide your journaling session.
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-2"
                onClick={handleShuffleSuggestions}
              >
                <Shuffle className="h-4 w-4" />
                Shuffle Suggestions
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {shuffledCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-sans text-sm font-bold text-slate-800">
                      {category.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {category.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() =>
                          setSelectedPrompt(selectedPrompt === prompt ? null : prompt)
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          selectedPrompt === prompt
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-dashboard-stroke bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter className="flex-row gap-2 border-t border-dashboard-stroke pt-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setPromptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="gap-2 rounded-xl bg-brand text-white hover:bg-brand/90"
              onClick={handleApplyPrompt}
              disabled={!selectedPrompt}
            >
              <PenLine className="h-4 w-4" />
              Apply to Journal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
