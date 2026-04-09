import { motion } from "framer-motion";
import Image from "next/image";

const scrollIn = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

/** Self-hosted (Unsplash-sourced); replace under public/images/home for your brand. */
const IMG_FOREST = "/images/home/process-forest.jpg";
// const IMG_MIRROR = "/images/home/process-reflection.jpg";
const JOURNAL_SCREEN = "/images/journalScreen.png";

export const Process = () => {
  return (
    <motion.section
      id="process"
      className="bg-surface-dark/30 relative py-32"
      {...scrollIn}
    >
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 overflow-hidden opacity-10">
        <img
          alt="Moody dark forest"
          className="h-full object-cover"
          src={IMG_FOREST}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-20 md:grid-cols-2">
          <div>
            <h2 className="font-headline mb-8 text-4xl font-light md:text-5xl">
              The Process
            </h2>
            <p className="mb-12 text-lg text-slate-400">
              A simple loop: write privately, reflect clearly, repeat
              consistently.
            </p>
            <div className="border-brand/20 relative space-y-24 border-l pl-8">
              <div className="from-brand via-brand/50 absolute top-0 -left-px h-full w-0.5 bg-gradient-to-b to-transparent" />
              <div className="relative">
                <div className="border-brand bg-background-dark absolute top-0 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4 shadow-[0_0_15px_rgba(var(--sj-brand-rgb),0.5)]" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                  Write a Private Entry
                </h3>
                <p className="text-slate-400">
                  Capture what happened and how it felt. No public feed, no
                  performance, just your own private space.
                </p>
              </div>
              <div className="relative">
                <div className="border-brand/40 bg-background-dark absolute top-0 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                  Get One Focused Reflection
                </h3>
                <p className="text-slate-400">
                  Run AI analysis to surface patterns, blind spots, and one
                  clear direction for your next step.
                </p>
              </div>
              <div className="relative">
                <div className="border-brand/20 bg-background-dark absolute top-0 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                  Build Your Inner Map Over Time
                </h3>
                <p className="text-slate-400">
                  Keep writing and reviewing your patterns so change is visible,
                  not just felt.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="relative h-[250px] w-full max-w-md overflow-hidden rounded-2xl border border-2 border-white/10">
              {/* <img
                alt="Woman looking into a mirror reflection representing self-discovery"
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                src={IMG_MIRROR}
              /> */}
              <Image
                src={JOURNAL_SCREEN}
                alt="Journal analysis preview"
                fill
                className="object-cover object-left grayscale transition-all duration-700 hover:grayscale-0"
                sizes="(max-width: 1024px) 100vw, 448px"
              />
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
                <p className="font-headline text-brand text-3xl font-bold italic">
                  &quot;Grow.&quot;
                </p>
                <p className="text-xs tracking-widest text-slate-400 uppercase">
                  The Ultimate Goal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
