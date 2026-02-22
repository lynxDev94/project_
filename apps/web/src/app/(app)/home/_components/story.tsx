import { motion } from "framer-motion";

const scrollIn = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const Story = () => {
  return (
    <motion.section
      className="relative py-24"
      {...scrollIn}
    >
      <div className="from-background-dark-alt to-background-dark absolute inset-0 bg-gradient-to-b" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:gap-20">
          <div className="shrink-0">
            <div className="relative inline-block">
              <div
                className="h-48 w-48 overflow-hidden rounded-full border-2 border-white/20 bg-slate-700"
                style={{ boxShadow: "0 0 30px rgba(var(--sj-brand-rgb), 0.4)" }}
              >
                {/* Placeholder: replace with actual founder image */}
                <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800" />
              </div>
              <span className="bg-brand absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-medium text-white">
                Solo Developer
              </span>
            </div>
          </div>
          <div className="flex-1">
            <span className="text-brand mb-3 block text-xs font-bold tracking-widest uppercase">
              Behind the Shadow
            </span>
            <h2 className="font-headline mb-10 text-3xl font-bold text-white md:text-4xl">
              Why I built this.
            </h2>
            <blockquote className="font-sans text-xl leading-relaxed text-white/90 italic md:text-2xl">
              I spent years running from myself. Distraction, overworking,
              intellectualizing—anything to avoid the quiet. When I finally hit
              a wall, I turned to Jung. But books were dense, and therapists
              were expensive. I built Shadow Journal because I needed a mirror
              that wouldn&apos;t shatter, a place to safely dismantle the
              persona and find what was real underneath.
            </blockquote>
            <p className="font-headline mt-10 text-3xl text-white md:text-4xl">
              Alex V.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
