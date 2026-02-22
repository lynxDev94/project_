import { Sparkles, Settings, Eye } from "lucide-react";

export const JournalDemo = () => {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-brand text-xs font-bold tracking-widest uppercase">
            A Mirror for the Mind
          </span>
          <h2 className="font-headline mt-4 text-3xl font-light md:text-5xl">
            The Digital Altar
          </h2>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="from-brand/30 to-background-dark absolute -inset-1 rounded-xl bg-gradient-to-r opacity-30 blur-2xl" />
          <div className="glass-panel relative overflow-hidden rounded-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs font-medium text-slate-500">
                SESSION 042: THE DESCENT
              </div>
              <div className="flex items-center gap-4">
                <Eye className="h-4 w-4 text-slate-500" />
                <Settings className="h-4 w-4 text-slate-500" />
              </div>
            </div>
            <div className="flex flex-col gap-12 p-8 md:flex-row md:p-12">
              <div className="flex-1 space-y-6">
                <div className="h-4 w-1/3 rounded bg-white/10" />
                <p className="text-lg leading-relaxed text-slate-300 italic opacity-80">
                  I keep dreaming about the shoreline. The waves aren&apos;t
                  water, they&apos;re something heavier, like liquid ink. I
                  stand there holding a key that doesn&apos;t belong to any door
                  I know...
                </p>
                <div className="flex items-center gap-2">
                  <span className="bg-brand h-6 w-1 animate-pulse rounded" />
                  <span className="text-slate-500 italic">
                    Exploring the feeling of the key...
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-4 md:w-80">
                <div className="border-brand/20 bg-brand/10 rounded-lg border p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="text-brand h-4 w-4" />
                    <span className="text-brand text-xs font-bold tracking-wider uppercase">
                      Shadow Mirror
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    The <span className="font-medium text-white">ink-sea</span>{" "}
                    suggests a fear of being overwhelmed by repressed emotions.
                    The <span className="font-medium text-white">key</span>{" "}
                    represents a latent potential you are currently disowning.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <span className="mb-2 block text-[10px] font-bold text-slate-500 uppercase">
                    Archetype Mapping
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">The Explorer</span>
                    <span className="text-brand text-xs">82% Match</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="bg-brand h-full rounded-full"
                      style={{ width: "82%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
