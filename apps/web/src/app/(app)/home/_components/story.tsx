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
      id="philosophy"
      className="relative py-24"
      {...scrollIn}
    >
      <div className="from-background-dark-alt to-background-dark absolute inset-0 bg-gradient-to-b" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-brand mb-3 block text-xs font-bold tracking-widest uppercase">
            Why People Trust Shadow Journal
          </span>
          <h2 className="font-headline mb-4 text-3xl font-bold text-white md:text-4xl">
            Built for honest reflection, not attention.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
            Shadow Journal is designed to help you think clearly and go deeper,
            without social pressure or performance. The name nods to Carl Jung’s
            idea of the shadow—the traits and feelings we tend to push away—and
            our AI reads your entries through that Jungian lens: patterns,
            symbols, and archetypes as prompts for reflection, not a verdict on
            who you are.
          </p>

          <div className="grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-brand mb-2 text-xs font-semibold tracking-wider uppercase">
                Private by default
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Your entries are for you. No public feed, no likes, no
                algorithmic pressure.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-brand mb-2 text-xs font-semibold tracking-wider uppercase">
                You stay in control
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                You can edit or delete entries anytime, and manage your account
                and billing directly in-app.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-brand mb-2 text-xs font-semibold tracking-wider uppercase">
                Reflection, not diagnosis
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                AI insights are designed to support self-inquiry and pattern
                awareness, not replace professional care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
