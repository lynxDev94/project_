import { Moon, VenetianMask, Lightbulb } from "lucide-react";

export const Features = () => {
  const cards = [
    {
      icon: Moon,
      title: "See Recurring Patterns",
      desc: "Surface the triggers, emotions, and loops that keep repeating in your entries.",
    },
    {
      icon: VenetianMask,
      title: "Jungian Lens, Not Diagnosis",
      desc: "Carl Jung used archetypes (e.g. Shadow, Child, Hero) as mirrors for the psyche—not labels. We use that same reflective lens to deepen self-inquiry, not to diagnose.",
    },
    {
      icon: Lightbulb,
      title: "Clear Next Steps",
      desc: "Turn raw entries into practical insights with summaries, key themes, and prompts for your next session.",
    },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-headline mb-4 text-3xl font-bold text-slate-100 md:text-4xl">
            AI Journaling for Shadow Work & Self-Discovery
          </h2>
          <p className="mx-auto max-w-2xl text-center text-lg text-slate-400">
            Write for 5–10 minutes. One focused reflection, using language and
            frames drawn from Carl Jung’s work on the unconscious and archetypes.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-[border-color] duration-300 hover:border-white/20"
            >
              <div className="bg-brand/20 mb-5 flex h-12 w-12 items-center justify-center rounded-full shadow-sm">
                <Icon className="text-brand h-6 w-6" />
              </div>
              <h3 className="mb-3 font-sans text-xl font-bold text-slate-100">
                {title}
              </h3>
              <p className="leading-relaxed text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
