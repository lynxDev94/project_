"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ArchetypeId =
  | "Persona"
  | "Shadow"
  | "Self"
  | "Trickster"
  | "Hero"
  | "WiseOldOne"
  | "Child"
  | "GreatMother";

type PendingArchetype = {
  id: ArchetypeId;
  label: string;
  version: number;
  computedAt: string;
  scores: Record<ArchetypeId, number>;
};

const STORAGE_KEY = "pending_archetype_v1";
const QUIZ_VERSION = 2;

type Option = {
  label: string;
  scores: Partial<Record<ArchetypeId, number>>;
};

type Question = {
  prompt: string;
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "When you feel stuck, what helps most?",
    options: [
      { label: "Owning the part of me I avoid", scores: { Shadow: 2 } },
      { label: "Taking one brave step forward", scores: { Hero: 2 } },
      {
        label: "Zooming out until the pattern makes sense",
        scores: { WiseOldOne: 2 },
      },
      {
        label: "Letting my playful side disrupt the loop",
        scores: { Trickster: 2 },
      },
    ],
  },
  {
    prompt: "In groups, you most often find yourself…",
    options: [
      { label: "Fitting the role people expect of me", scores: { Persona: 2 } },
      { label: "Challenging what feels fake", scores: { Shadow: 2 } },
      { label: "Protecting the vulnerable parts", scores: { GreatMother: 2 } },
      {
        label: "Keeping things light when tension builds",
        scores: { Trickster: 2 },
      },
    ],
  },
  {
    prompt: "When you’re under pressure, your instinct is to…",
    options: [
      { label: "Put on a mask and perform competence", scores: { Persona: 2 } },
      { label: "Fight for what matters", scores: { Hero: 2 } },
      { label: "Retreat inward and observe", scores: { Self: 2 } },
      { label: "Seek comfort and reassurance", scores: { Child: 2 } },
    ],
  },
  {
    prompt: "Your biggest growth edge lately is…",
    options: [
      { label: "Dropping the mask and being real", scores: { Persona: 2 } },
      { label: "Integrating the parts I judge", scores: { Shadow: 2 } },
      { label: "Staying centered when life is loud", scores: { Self: 2 } },
      { label: "Asking for help without shame", scores: { Child: 2 } },
    ],
  },
  {
    prompt: "When you journal, you’re usually trying to…",
    options: [
      { label: "Understand who I am beneath roles", scores: { Self: 2 } },
      {
        label: "Say what I’m not allowed to say out loud",
        scores: { Shadow: 2 },
      },
      {
        label: "Encourage myself like a caring parent",
        scores: { GreatMother: 2 },
      },
      {
        label: "Turn chaos into a story with meaning",
        scores: { WiseOldOne: 2 },
      },
    ],
  },
  {
    prompt: "A recurring theme in your life is…",
    options: [
      { label: "Trying to live up to an image", scores: { Persona: 2 } },
      { label: "Facing a fear and leveling up", scores: { Hero: 2 } },
      {
        label: "Being the one who holds everyone together",
        scores: { GreatMother: 2 },
      },
      {
        label: "Breaking patterns by being weirdly honest",
        scores: { Trickster: 2 },
      },
    ],
  },
  {
    prompt: "What do you wish you had more of?",
    options: [
      { label: "Playfulness", scores: { Trickster: 2 } },
      { label: "Courage", scores: { Hero: 2 } },
      { label: "Peace", scores: { Self: 2 } },
      { label: "Care", scores: { GreatMother: 2 } },
    ],
  },
  {
    prompt: "When you feel most alive, it’s usually when you’re…",
    options: [
      { label: "Becoming the person you’re meant to be", scores: { Self: 2 } },
      { label: "Rising to a challenge", scores: { Hero: 2 } },
      {
        label: "Learning and teaching what matters",
        scores: { WiseOldOne: 2 },
      },
      { label: "Feeling safe enough to be soft", scores: { Child: 2 } },
    ],
  },
];

function emptyScores(): Record<ArchetypeId, number> {
  return {
    Persona: 0,
    Shadow: 0,
    Self: 0,
    Trickster: 0,
    Hero: 0,
    WiseOldOne: 0,
    Child: 0,
    GreatMother: 0,
  };
}

function pickWinner(scores: Record<ArchetypeId, number>): ArchetypeId {
  const ordered: ArchetypeId[] = [
    "Self",
    "Shadow",
    "Persona",
    "Hero",
    "WiseOldOne",
    "Trickster",
    "GreatMother",
    "Child",
  ];
  let best: ArchetypeId = ordered[0];
  for (const k of ordered) {
    if (scores[k] > scores[best]) best = k;
  }
  return best;
}

const ARCHETYPE_COPY: Record<
  ArchetypeId,
  { title: string; subtitle: string; prompt: string }
> = {
  Persona: {
    title: "Persona",
    subtitle: "Your social mask / role",
    prompt:
      "Ask: what do I perform to be accepted—and what does it cost me today?",
  },
  Shadow: {
    title: "Shadow",
    subtitle: "What you disown or avoid",
    prompt: "Ask: what trait do I judge in others that might live in me too?",
  },
  Self: {
    title: "Self",
    subtitle: "Wholeness and integration",
    prompt: "Ask: what would the most integrated version of me choose next?",
  },
  Trickster: {
    title: "Trickster",
    subtitle: "Disruption and truth-through-play",
    prompt: "Ask: where could humor reveal what control is hiding?",
  },
  Hero: {
    title: "Hero",
    subtitle: "Courage and the call to action",
    prompt: "Ask: what one brave step is available, even if it’s imperfect?",
  },
  WiseOldOne: {
    title: "Wise One",
    subtitle: "Insight, meaning, and guidance",
    prompt: "Ask: what pattern is trying to teach me something right now?",
  },
  Child: {
    title: "Child",
    subtitle: "Vulnerability, potential, renewal",
    prompt:
      "Ask: what would I do if I felt safe—and what support do I need to get there?",
  },
  GreatMother: {
    title: "Great Mother",
    subtitle: "Care, protection, holding",
    prompt: "Ask: where am I over-caring, and where do I need care myself?",
  },
};

export default function ArchetypePage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] =
    useState<Record<ArchetypeId, number>>(emptyScores());
  const [done, setDone] = useState(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(
    null,
  );

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  const result = useMemo(() => {
    if (!done) return null;
    const id = pickWinner(scores);
    const label = id;
    const payload: PendingArchetype = {
      id,
      label,
      version: QUIZ_VERSION,
      computedAt: new Date().toISOString(),
      scores,
    };
    return payload;
  }, [done, scores]);

  const applyOption = (opt: Option) => {
    const nextScores: Record<ArchetypeId, number> = { ...scores };
    for (const [k, v] of Object.entries(opt.scores)) {
      const key = k as ArchetypeId;
      nextScores[key] = (nextScores[key] ?? 0) + (v ?? 0);
    }
    setScores(nextScores);
    return nextScores;
  };

  const next = () => {
    if (selectedOptionIdx === null) return;
    const opt = q.options[selectedOptionIdx];
    const nextScores = applyOption(opt);

    if (step + 1 >= total) {
      setDone(true);
      try {
        const id = pickWinner(nextScores);
        const payload: PendingArchetype = {
          id,
          label: ARCHETYPE_COPY[id].title,
          version: QUIZ_VERSION,
          computedAt: new Date().toISOString(),
          scores: nextScores,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {}
      return;
    }

    setStep((s) => s + 1);
    setSelectedOptionIdx(null);
  };

  const restart = () => {
    setStep(0);
    setScores(emptyScores());
    setDone(false);
    setSelectedOptionIdx(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <main className="bg-background-dark min-h-screen font-sans text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/home"
            className="text-brand text-sm hover:underline"
          >
            ← Back
          </Link>
          <Link
            href="/signup?source=archetype"
            className="text-sm text-slate-300 hover:text-slate-100"
          >
            Sign up
          </Link>
        </div>

        <h1 className="font-headline text-4xl font-semibold text-white">
          Find your archetype
        </h1>
        <p className="mt-3 text-slate-400">
          A short reflection quiz inspired by Jungian themes. It’s a prompt for
          journaling, not a diagnosis.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
          {!done ? (
            <>
              <div className="flex items-center justify-between text-xs tracking-widest text-slate-500 uppercase">
                <span>
                  Question {step + 1} / {total}
                </span>
                <span>{Math.round(((step + 1) / total) * 100)}%</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="bg-brand h-full rounded-full transition-all"
                  style={{ width: `${((step + 1) / total) * 100}%` }}
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-slate-100">
                {q.prompt}
              </h2>

              <div className="mt-6 grid gap-3">
                {q.options.map((opt, idx) => {
                  const selected = idx === selectedOptionIdx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedOptionIdx(idx)}
                      className={[
                        "rounded-2xl border px-4 py-3 text-left text-slate-100 transition",
                        selected
                          ? "border-brand/60 bg-white/10"
                          : "bg-background-dark/30 border-white/10 hover:border-white/20 hover:bg-white/5",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="outlineDark"
                  onClick={restart}
                  type="button"
                >
                  Restart
                </Button>
                <div className="ml-auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={next}
                    disabled={selectedOptionIdx === null}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs tracking-widest text-slate-500 uppercase">
                Your result
              </p>
              <h2 className="font-headline mt-2 text-3xl font-bold text-white">
                {result?.id ? ARCHETYPE_COPY[result.id].title : "Your result"}
              </h2>
              {result?.id ? (
                <>
                  <p className="mt-2 text-slate-300">
                    {ARCHETYPE_COPY[result.id].subtitle}
                  </p>
                  <p className="mt-4 text-slate-300">
                    {ARCHETYPE_COPY[result.id].prompt}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-slate-300">
                  Use this as a prompt for reflection, not a label.
                </p>
              )}

              <div className="bg-background-dark/30 mt-6 rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">
                  Want to explore this in your journal?
                </p>
                <p className="mt-1 text-slate-400">
                  Join to save your result, journal with prompts tailored to
                  your archetype, and explore patterns like shadow and persona
                  over time.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="outlineDark"
                  onClick={restart}
                  type="button"
                >
                  Retake quiz
                </Button>
                <Link
                  href="/signup?source=archetype&redirect=%2Fdashboard"
                  className="ml-auto"
                >
                  <Button variant="primary">Join to save & journal</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
