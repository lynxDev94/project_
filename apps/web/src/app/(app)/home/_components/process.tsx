import { motion } from "framer-motion";

const scrollIn = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const IMG_FOREST =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcEdce9vHsAw1z3zfI4M_RJBz0hYmtm-x5dXfMsTpQV7o_yClAKJUcZ0dLUOFY8Md8IaAGB37N4AQfGzT1o1iI1tnEHmdu4MTJ8qiuydFeA4aSTfT2oAqB1FQ-ACUwFI0Kef4ZYIelfxG6NuIu1DJnCHSaXxdMFXZzdlCaYDufC_4QRgeKv3FOLf61bLTpIypJtp-pSkKyge2T-prFNUfaNeQuyPPMCwcgvsPmx1qBGep8AgT8lgHMNyYavmf7EMvQuvao3DTKLuk";
const IMG_MIRROR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJh9emEfDLWpvY1AB5V6xP8cWWANhWFtE_ob9mqM6xoJQelv4nPuN6Ou0tIB-b2vg3PPwi6Qgz2g-AMsjFi4tXsZihqWjZ1b8_qcUttq-jd6ckGPvkdCENnTT4574VivNY98JZeUIq233BgjVHH5gyFKa4hwps6fyDle5K5K8o8CwzcPAPe8wm13vwfSjG_B6fbBpvgpYGlO4uIVGddHKc9qYXkgiE0VxZutPsSekSW5pN9rp32IGXXr7kRruPGIjk3GKNMmPW14Y";

export const Process = () => {
  return (
    <motion.section
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
              Write honestly. Track your patterns. Let AI help you see what you
              can’t.
            </p>
            <div className="border-brand/20 relative space-y-24 border-l pl-8">
              <div className="from-brand via-brand/50 absolute top-0 -left-px h-full w-0.5 bg-gradient-to-b to-transparent" />
              <div className="relative">
                <div className="border-brand bg-background-dark absolute top-0 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4 shadow-[0_0_15px_rgba(var(--sj-brand-rgb),0.5)]" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                  Start With a Quick Check-In
                </h3>
                <p className="text-slate-400">
                  Answer a few questions about your goals, emotions, and what
                  you want to work on. We personalize prompts and archetype
                  insights based on your focus.
                </p>
              </div>
              <div className="relative">
                <div className="border-brand/40 bg-background-dark absolute top-0 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                  Journal Freely, Track Your Growth
                </h3>
                <p className="text-slate-400">
                  Write entries in your private space and watch your progress
                  over time. Your dashboard keeps everything organized - moods,
                  themes, and consistency.
                </p>
              </div>
              <div className="relative">
                <div className="border-brand/20 bg-background-dark absolute top-0 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                  Get Jungian Insights & Archetype Analysis
                </h3>
                <p className="text-slate-400">
                  Let AI analyze your writing for emotional patterns, recurring
                  themes, and Jungian archetypes. Receive reflections, blind
                  spots, and prompts to go deeper.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-white/10">
              <img
                alt="Woman looking into a mirror reflection representing self-discovery"
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                src={IMG_MIRROR}
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
