import { motion } from "framer-motion";
import { HeroJournalSVG } from "./heroJournalSvg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const HERO_BG_IMAGE = "/images/hero-writing.png";

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HERO_BG_IMAGE})`,
          backgroundPosition: "center 40%",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: [
            `linear-gradient(180deg, rgba(var(--sj-background-dark-rgb), 0.92) 0%, rgba(var(--sj-background-dark-rgb), 0.88) 50%, rgba(var(--sj-background-dark-rgb), 0.94) 100%)`,
            `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 30%, rgba(var(--sj-background-dark-rgb), 0.4) 100%)`,
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: [
            `radial-gradient(ellipse 85% 55% at 50% 35%, rgba(var(--sj-brand-glow-rgb), 0.18) 0%, transparent 55%)`,
            `radial-gradient(ellipse 70% 60% at 50% 75%, rgba(var(--sj-brand-deep-rgb), 0.2) 0%, transparent 55%)`,
            `radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, rgba(var(--sj-background-dark-rgb), 0.35) 100%)`,
          ].join(", "),
        }}
      />
      <motion.div
        className="bg-brand/20 absolute top-[25%] left-[15%] h-64 w-64 rounded-full blur-[80px]"
        animate={{
          opacity: [0.06, 0.12, 0.06],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-brand/15 absolute right-[20%] bottom-[30%] h-48 w-48 rounded-full blur-[60px]"
        animate={{
          opacity: [0.08, 0.14, 0.08],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.7 },
          },
          hidden: {},
        }}
      >
        <h1 className="mb-8 font-sans text-5xl leading-[1.25] font-extralight tracking-tight md:text-7xl">
          <motion.span
            className="block"
            variants={heroItem}
          >
            Meet the version of you
          </motion.span>
          <motion.span
            className="glow-text from-brand to-brand/80 block bg-gradient-to-r via-white bg-clip-text font-bold text-transparent"
            variants={heroItem}
          >
            you've been hiding
          </motion.span>
        </h1>
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
          variants={heroItem}
        >
          Write privately. Get AI-guided Jungian reflections to support shadow
          integration.
        </motion.p>
        <motion.div
          className="mb-8 w-full max-w-[200px] md:max-w-[280px]"
          initial={{ opacity: 0, x: -80, rotate: -10 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <HeroJournalSVG className="w-full drop-shadow-[0_8px_32px_rgba(0,0,0,0.4)]" />
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
          variants={heroItem}
        >
          <Link href="/">
            <Button
              variant="primary"
              size="xl"
              className="group gap-2"
            >
              Step into the Shadow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            variant="outlineDark"
            size="xl"
          >
            How It Works
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
