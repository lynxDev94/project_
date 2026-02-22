import { Moon, VenetianMask, Lightbulb } from "lucide-react";

export const Features = () => {
  const cards = [
    {
      icon: Moon,
      title: "Shadow Work",
      desc: "Explore the thoughts you avoid, the emotions you suppress, and the patterns you repeat, without feeling overwhelmed.",
    },
    {
      icon: VenetianMask,
      title: "Jungian Archetypes",
      desc: "The AI detects archetypes in your writing - like The Shadow, The Child, The Hero, or The Lover, and shows what they reveal about you.",
    },
    {
      icon: Lightbulb,
      title: "Self-Reflection With AI Insights",
      desc: "Turn journal entries into clarity. Get summaries, emotional patterns, and questions that help you think deeper.",
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
            Write like a normal journal - but get deeper insights. <br />
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
