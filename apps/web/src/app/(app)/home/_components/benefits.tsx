import { Sparkles } from "lucide-react";
import { Moon } from "lucide-react";
import { VenetianMask } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const Benefits = () => {
  return (
    <div className="bg-background-dark/50 relative z-10 border-y border-white/5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="mb-8 text-center text-xs font-semibold tracking-widest text-slate-500 uppercase">
          Everything You Need for Inner Work
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            {
              label: "Privacy",
              icon: Lock,
              emoji: "🔒",
              desc: "Private by design. Your entries stay yours.",
            },
            {
              label: "AI Insights",
              icon: Sparkles,
              emoji: "🧠",
              desc: "Get emotional patterns, summaries, and blind spots.",
            },
            {
              label: "Shadow Work",
              icon: Moon,
              emoji: "🌓",
              desc: "Explore suppressed emotions and repeating triggers safely.",
            },
            {
              label: "Archetypes",
              icon: VenetianMask,
              emoji: "🎭",
              desc: "Detect Jungian archetypes and inner roles shaping your behavior.",
            },
            {
              label: "Prompts",
              icon: Lightbulb,
              emoji: "✍️",
              desc: "Get guided prompts when you don’t know what to write.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="shadow-card-layered hover:border-brand/50 hover:bg-brand/20 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition-colors transition-transform hover:-translate-y-0.5"
                    aria-label={item.label}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="border border-white/10 bg-slate-900 text-slate-50"
                >
                  <p className="mb-1 text-xs font-semibold">
                    {item.emoji} {item.label}
                  </p>
                  <p className="max-w-xs text-[11px] text-slate-100/90">
                    {item.desc}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};
