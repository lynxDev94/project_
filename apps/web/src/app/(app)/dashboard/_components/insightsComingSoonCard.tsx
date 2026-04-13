import { EyeOff, Sparkles, Star } from "lucide-react";

export function InsightsComingSoonCard() {
  return (
    <div>
      <h2 className="mb-4 font-sans text-sm font-bold text-slate-400">
        Insights
      </h2>
      <div className="divide-dashboard-stroke border-dashboard-stroke shadow-card-layered pointer-events-none divide-y overflow-hidden rounded-2xl border bg-white/70 opacity-60 backdrop-blur-md select-none">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Dominant archetype
            </p>
            <p className="mt-1 font-semibold text-slate-500">The Sage</p>
            <p className="text-xs text-slate-400">72% presence this week</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
            <EyeOff className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Shadow focus
            </p>
            <p className="mt-1 font-semibold text-slate-500">
              Professional Envy
            </p>
            <p className="text-xs text-slate-400">
              Primary area of integration
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-500" />
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              AI observation
            </p>
          </div>
          <p className="text-sm text-slate-500 italic">
            Your recent entries suggest a transition from the
            &lsquo;Anima&rsquo; projection to personal empowerment. Consider
            writing about your childhood mentors next.
          </p>
        </div>
        <p className="py-3 text-center text-xs text-slate-400">
          Premium feature — coming soon
        </p>
      </div>
    </div>
  );
}
