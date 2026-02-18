"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowRight,
  Eye,
  Settings,
  Check,
  X,
  Mail,
  Sparkles,
  Lock,
  Shield,
  Repeat,
  Flame,
  Lightbulb,
  Heart,
  ChevronDown,
  Moon,
  VenetianMask
} from "lucide-react";

const LOGO_WIRED =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqFVrByc0Y9xNYa0yMzpaYpH-twMCrQbr1cWV2u7bDyMTdbj_JxIPD_qAdlUKhHt4SaoufN10pffLoN3zOF0vxl4O6jf8dQ8IHJEL0GbnVQisDrMEe_wpnh_D9KRQ0F3UNpkVS9FfvSPH2n0s_FIhRC2khL78X1IjWv-YL8TNq01E0_uCD7mK_Qj6JZ-C8qDnOKEV_MiRLE4kab4u5wb4PAPVzUSbRMFAffwevCRplBEaFdc9KUZI7X5pYNmktkNEW4_QXtb40fVQ";
const LOGO_NYT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDECab8G_xDLBIrH3tc5S9sjsvjlsKS67Lk7ttPU9vXtJfVtUyFfARY3UzrLeB9y3R90uwBPlR75VQvuPSf5g6VcfEJVxxATvug0MvfiMha4M55ZAvWmtn7wabnWYU3aCJklq-t4FNq41MGR0JfvRWcRhT5oCB3uqyB1rwioXTY7fVqAn9vKHYy3r1uP1xebBFhYwTA8Bn8e52D01IAUsWwbAR5WB6A7GDkwAzObEFwjERyvz_Yd2vRfUYJ9Gr8T2mf8YIEPXLx95A";
const LOGO_FORTUNE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB3-65uTrYRUS0HlhSzduBEvZ-SXajlneMkEOILTIGNkGYzc25bV1cwLCft7-T4x7f4Q9zxRmevblJrb4SRoi9clG6aPk_t1LLm2Xp-0wZ1KFLEnlidJKwIQptf7nQzwdtXCDXbiSaHHKEPoyMg-jmLJO8h5ahXPAhQH_IMFH0xdrYVmkgAjXwR7QLXI4vTTaYrWHC1otxKh5bvLRGqpFdeE9psvmx6p_v7Ln8nS-OkKroKhoIfEjoOQpSsx9By9JkFSr9YeL50bAE";
const LOGO_FASTCO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvUar9koklJLZ6U_Svkg6uvt66HDenL6Cq7y0jCWglD4XhtEiFgIDYkaWkCAjXtgKjiwCoj1CiQ0EmzZUJEvWvujDUACC-tC7Dhiv-Czy7uqnyFpkyG9uHuX6Tl1jqC-OUmYNG8psEAecOMNbVXzChcbcMO3Ggw9dJ_JKTJCVskaUSsem_XY2g3KEoh5e1kpGdVKJ43DLTiN-NZPjp6is7WfeAGxY5UT3h5X101uzfDFdm1FyBxZIN01qmeU_PJZ5MyN6pDWNvhcM";
const IMG_FOREST =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcEdce9vHsAw1z3zfI4M_RJBz0hYmtm-x5dXfMsTpQV7o_yClAKJUcZ0dLUOFY8Md8IaAGB37N4AQfGzT1o1iI1tnEHmdu4MTJ8qiuydFeA4aSTfT2oAqB1FQ-ACUwFI0Kef4ZYIelfxG6NuIu1DJnCHSaXxdMFXZzdlCaYDufC_4QRgeKv3FOLf61bLTpIypJtp-pSkKyge2T-prFNUfaNeQuyPPMCwcgvsPmx1qBGep8AgT8lgHMNyYavmf7EMvQuvao3DTKLuk";
const IMG_MIRROR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJh9emEfDLWpvY1AB5V6xP8cWWANhWFtE_ob9mqM6xoJQelv4nPuN6Ou0tIB-b2vg3PPwi6Qgz2g-AMsjFi4tXsZihqWjZ1b8_qcUttq-jd6ckGPvkdCENnTT4574VivNY98JZeUIq233BgjVHH5gyFKa4hwps6fyDle5K5K8o8CwzcPAPe8wm13vwfSjG_B6fbBpvgpYGlO4uIVGddHKc9qYXkgiE0VxZutPsSekSW5pN9rp32IGXXr7kRruPGIjk3GKNMmPW14Y";
const IMG_TWITTER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCznsD47nj4ZXtXBduvxgYYmp9P4qHIHIS7x2ne454gzFU3v8fMA52jSuN3YTqVTHIL9gJGYsk9Sw-JY_gnGSZRIP2DAnp2WSNEwl6mZ5aTrPYv_Npz7N4rJiMncA56b135hcmk8WzcADvsKM0N79Rjl6zA4SmsJwW6mk8mjBmck5lgWzVOQWUtLacNRKzQYH8Gy0IAn0kNbfS43zlBNUEHakE_phRWHQamuvOZ8m4Vlg2Loa_mkzT2m_yMKTs7iTkKHiSscXL6zcI";

function Nav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/home" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brandLogo.png"
            alt="Shadow Journal"
            className="h-8 w-8 object-contain rounded-full"
          />
          <span className="font-sans text-xl font-bold tracking-tight">
          <span className="text-brand"> Shadow</span><span className="text-white font-extralight">Journal</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <Link href="#" className="transition-colors hover:text-brand">
            Philosophy
          </Link>
          <Link href="#" className="transition-colors hover:text-brand">
            The Process
          </Link>
          <Link href="#" className="transition-colors hover:text-brand">
            Safety
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="rounded-full border border-brand/20 bg-brand/10 px-5 py-2 text-white transition-all hover:bg-brand/20"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-brand px-5 py-2 text-white transition-all hover:bg-brand/90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function HeroJournalSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Left page */}
      <path
        d="M0 12v136c0 6.6 5.4 12 12 12h116c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12z"
        fill="rgba(var(--sj-white-rgb), 0.04)"
        stroke="rgba(var(--sj-white-rgb), 0.12)"
        strokeWidth="1"
      />
      {/* Left page lines */}
      {[28, 44, 60, 76, 92].map((y, i) => (
        <line key={i} x1="24" y1={y} x2="100" y2={y} stroke="rgba(var(--sj-white-rgb), 0.08)" strokeWidth="1" />
      ))}
      {/* Spine */}
      <path
        d="M128 0h24c6.6 0 12 5.4 12 12v136c0 6.6-5.4 12-12 12h-24V0z"
        fill="rgba(var(--sj-surface-dark-rgb), 0.9)"
        stroke="rgba(var(--sj-white-rgb), 0.15)"
        strokeWidth="1"
      />
      {/* Right page */}
      <path
        d="M152 0h116c6.6 0 12 5.4 12 12v136c0 6.6-5.4 12-12 12H152V0z"
        fill="rgba(var(--sj-white-rgb), 0.04)"
        stroke="rgba(var(--sj-white-rgb), 0.12)"
        strokeWidth="1"
      />
      {/* Right page lines */}
      {[28, 44, 60, 76, 92].map((y, i) => (
        <line key={i} x1="168" y1={y} x2="244" y2={y} stroke="rgba(var(--sj-white-rgb), 0.08)" strokeWidth="1" />
      ))}
      {/* Ribbon bookmark */}
      <path
        d="M140 0v50c0 4 3 7 7 7s7-3 7-7V0"
        fill="rgba(var(--sj-brand-rgb), 0.6)"
        stroke="rgba(var(--sj-white-rgb), 0.2)"
        strokeWidth="1"
      />
    </svg>
  );
}

const HERO_BG_IMAGE = "/images/hero-writing.png";
const FAQ_BG_IMAGE = "/images/faq-pen-writing.png";

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Photo: writing/journal on desk — full bleed, then darkened for obsidian theme */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HERO_BG_IMAGE})`,
          backgroundPosition: "center 40%",
        }}
      />
      {/* Dark overlay: modern, darker mood so image supports (not competes with) type */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: [
            `linear-gradient(180deg, rgba(var(--sj-background-dark-rgb), 0.92) 0%, rgba(var(--sj-background-dark-rgb), 0.88) 50%, rgba(var(--sj-background-dark-rgb), 0.94) 100%)`,
            `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 30%, rgba(var(--sj-background-dark-rgb), 0.4) 100%)`,
          ].join(", "),
        }}
      />
      {/* Layered depth: soft gradients; center stays clear for text */}
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
      {/* Subtle ink-in-water: small soft shapes that drift, away from center */}
      <motion.div
        className="absolute left-[15%] top-[25%] h-64 w-64 rounded-full bg-brand/20 blur-[80px]"
        animate={{
          opacity: [0.06, 0.12, 0.06],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[20%] bottom-[30%] h-48 w-48 rounded-full bg-brand/15 blur-[60px]"
        animate={{
          opacity: [0.08, 0.14, 0.08],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } },
          hidden: {},
        }}
      >
        {/* <motion.div
          className="mb-8 w-full max-w-[200px] md:max-w-[280px]"
          initial={{ opacity: 0, x: -80, rotate: -10 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <HeroJournalSVG className="w-full drop-shadow-[0_8px_32px_rgba(0,0,0,0.4)]" />
        </motion.div> */}
        <h1 className="mb-8 font-sans text-5xl font-extralight leading-[1.25] tracking-tight md:text-7xl">
          <motion.span className="block" variants={heroItem}>
          Meet the version of you
          </motion.span>
          <motion.span
            className="glow-text block font-bold bg-gradient-to-r from-brand via-white to-brand/80 bg-clip-text text-transparent"
            variants={heroItem}
          >
            you've been hiding
          </motion.span>
        </h1>
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
          variants={heroItem}
        >
         Write privately. Get AI-guided Jungian reflections to support shadow integration.
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
            <Button variant="primary" size="xl" className="group gap-2">
              Step into the Shadow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="outlineDark" size="xl">
          How It Works
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="relative z-10 border-y border-white/5 bg-background-dark/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
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
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 shadow-card-layered transition-transform transition-colors hover:-translate-y-0.5 hover:border-brand/50 hover:bg-brand/20"
                    aria-label={item.label}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="bg-slate-900 text-slate-50 border border-white/10"
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
}

function UnseenBurden() {
  const cards = [
    {
      icon: Moon,
      title: "Shadow Work",
      desc: "Explore the thoughts you avoid, the emotions you suppress, and the patterns you repeat, without feeling overwhelmed.",
    },
    {
      icon: VenetianMask,
      title: "Jungian Archetypes",
      desc: "The AI detects archetypes in your writing - like The Shadow, The Child, The Hero, or The Lover, and shows what they reveal about you."
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
          <h2 className="mb-4 font-headline text-3xl font-bold text-slate-100 md:text-4xl">
          AI Journaling for Shadow Work & Self-Discovery
          </h2>
          <p className="mx-auto max-w-2xl text-center text-lg text-slate-400">
          Write like a normal journal - but get deeper insights. <br/>
          {/* Discover emotional patterns, hidden beliefs, and Jungian archetypes through guided prompts and AI analysis. */}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-[border-color] duration-300 hover:border-white/20"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 shadow-sm">
                <Icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-3 font-sans text-xl font-bold text-slate-100">
                {title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DigitalAltar() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            A Mirror for the Mind
          </span>
          <h2 className="mt-4 font-headline text-3xl font-light md:text-5xl">
            The Digital Altar
          </h2>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-brand/30 to-background-dark opacity-30 blur-2xl" />
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
                <p className="text-lg leading-relaxed italic text-slate-300 opacity-80">
                  I keep dreaming about the shoreline. The waves aren&apos;t
                  water, they&apos;re something heavier, like liquid ink. I stand
                  there holding a key that doesn&apos;t belong to any door I
                  know...
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 animate-pulse rounded bg-brand" />
                  <span className="italic text-slate-500">
                    Exploring the feeling of the key...
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-4 md:w-80">
                <div className="rounded-lg border border-brand/20 bg-brand/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">
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
                  <span className="mb-2 block text-[10px] font-bold uppercase text-slate-500">
                    Archetype Mapping
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">The Explorer</span>
                    <span className="text-xs text-brand">82% Match</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-brand"
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
}

const scrollIn = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

function Journey() {
  return (
    <motion.section
      className="relative bg-surface-dark/30 py-32"
      {...scrollIn}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Moody dark forest"
          className="h-full object-cover"
          src={IMG_FOREST}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-20 md:grid-cols-2">
          <div>
            <h2 className="mb-8 font-headline text-4xl font-light md:text-5xl">
            The Process
            </h2>
            <p className="mb-12 text-lg text-slate-400">
            Write honestly. Track your patterns. Let AI help you see what you can’t.
            </p>
            <div className="relative space-y-24 border-l border-brand/20 pl-8">
              <div className="absolute -left-px top-0 h-full w-0.5 bg-gradient-to-b from-brand via-brand/50 to-transparent" />
              <div className="relative">
                <div className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-brand bg-background-dark shadow-[0_0_15px_rgba(var(--sj-brand-rgb),0.5)]" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">Start With a Quick Check-In</h3>
                <p className="text-slate-400">
                Answer a few questions about your goals, emotions, and what you want to work on.
                We personalize prompts and archetype insights based on your focus.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-brand/40 bg-background-dark" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">
                Journal Freely, Track Your Growth
                </h3>
                <p className="text-slate-400">
                Write entries in your private space and watch your progress over time.
                Your dashboard keeps everything organized - moods, themes, and consistency.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-brand/20 bg-background-dark" />
                <h3 className="mb-3 font-sans text-2xl font-bold text-slate-100">Get Jungian Insights & Archetype Analysis</h3>
                <p className="text-slate-400">
                Let AI analyze your writing for emotional patterns, recurring themes, and Jungian archetypes.
                Receive reflections, blind spots, and prompts to go deeper.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Woman looking into a mirror reflection representing self-discovery"
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                src={IMG_MIRROR}
              />
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
                <p className="font-headline text-3xl font-bold italic text-brand">
                  &quot;Grow.&quot;
                </p>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  The Ultimate Goal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Privacy() {
  return (
    <section className="relative border-y border-white/5 bg-surface-dark/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-brand">
            Built for Privacy
            </span>
            <h2 className="mb-6 font-headline text-3xl font-light md:text-4xl">
              Your Thoughts Stay Private
            </h2>
            <p className="mb-8 text-lg text-slate-400">
            Your journal is personal - it should stay that way.
            We use secure authentication, encrypted connections, and privacy-first design so your entries stay protected and under your control.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <h4 className="font-sans font-bold text-slate-100">Encrypted Connection (HTTPS)</h4>
                  <p className="text-sm text-slate-400">Your entries are protected while being sent and saved.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <h4 className="font-sans font-bold text-slate-100">Private Access Only</h4>
                  <p className="text-sm text-slate-400">Only you can view your entries — protected by secure authentication.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <h4 className="font-sans font-bold text-slate-100">Delete Anytime</h4>
                  <p className="text-sm text-slate-400">You can delete entries or your account whenever you want.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/privacy.png"
              alt="Locked journal on a desk"
              className="mx-auto mb-4 h-24 w-auto rounded-xl object-cover"
            />
            <p className="mb-2 font-sans text-sm font-semibold text-slate-100">
              Private by Design
            </p>
            <p className="text-xs text-slate-500">
              Your entries stay encrypted and in your control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type BillingPeriod = "monthly" | "quarterly" | "yearly";

const REFLECT_PRICES: Record<BillingPeriod, { amount: number; label: string; save?: string }> = {
  monthly: { amount: 14, label: "/ month" },
  quarterly: { amount: 36, label: "/ quarter", save: "Save 14%" },
  yearly: { amount: 140, label: "/ year", save: "2 months free" },
};

const INITIATE_PRICES: Record<BillingPeriod, { amount: number; label: string; save?: string }> = {
  monthly: { amount: 29, label: "/ month" },
  quarterly: { amount: 75, label: "/ quarter", save: "Save 14%" },
  yearly: { amount: 290, label: "/ year", save: "2 months free" },
};

const INTEGRATOR_PRICES: Record<BillingPeriod, { amount: number; label: string; save?: string }> = {
  monthly: { amount: 59, label: "/ month" },
  quarterly: { amount: 149, label: "/ quarter", save: "Save 16%" },
  yearly: { amount: 590, label: "/ year", save: "2 months free" },
};

function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-block rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-bold text-brand">
          LIMITED ALPHA ACCESS
        </div>
        <h2 className="mb-12 font-headline text-4xl font-extralight md:text-6xl">
          Ready to meet yourself?
        </h2>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {(["monthly", "quarterly", "yearly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setBillingPeriod(period)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors capitalize ${
                billingPeriod === period
                  ? "bg-brand text-white"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {/* Free: journal only */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 md:p-6">
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">The Seeker</h3>
            <p className="mb-4 text-sm text-slate-400">
              Free journaling. No AI analysis.
            </p>
            <div className="mb-5 text-2xl font-bold">
              $0 <span className="text-sm font-normal text-slate-500">/ forever</span>
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" />
                Unlimited journaling
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <X className="h-4 w-4 shrink-0" />
                AI analyses
              </li>
            </ul>
            <div className="mt-auto">
              <Button variant="muted" size="lg" className="w-full">
                Start Free
              </Button>
            </div>
          </div>

          {/* Entry: journal + 10 analyses */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-brand/30 md:p-6">
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">The Reflect</h3>
            <p className="mb-4 text-sm text-slate-400">
              Journaling plus 10 AI reflections per month.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">${REFLECT_PRICES[billingPeriod].amount}</span>
              <span className="text-sm font-normal text-slate-500">{REFLECT_PRICES[billingPeriod].label}</span>
              {REFLECT_PRICES[billingPeriod].save && (
                <span className="ml-2 text-xs font-medium text-brand">{REFLECT_PRICES[billingPeriod].save}</span>
              )}
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" />
                Unlimited journaling
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" />
                10 AI analyses per month
              </li>
            </ul>
            <div className="mt-auto">
              <Link href="/pricing">
                <Button variant="outlineDark" size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Recommended: 30 analyses + extras */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand/40 bg-gradient-to-br from-brand/20 to-surface-dark p-5 md:p-6">
            <div className="absolute right-3 top-3 rounded bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-tighter">
              Recommended
            </div>
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">The Initiate</h3>
            <p className="mb-4 text-sm text-slate-400">
              30 AI analyses per month, export & priority support.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">${INITIATE_PRICES[billingPeriod].amount}</span>
              <span className="text-sm font-normal text-slate-500">{INITIATE_PRICES[billingPeriod].label}</span>
              {INITIATE_PRICES[billingPeriod].save && (
                <span className="ml-2 text-xs font-medium text-brand">{INITIATE_PRICES[billingPeriod].save}</span>
              )}
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" />
                Unlimited journaling
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" />
                30 AI analyses per month
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" />
                Export & priority support
              </li>
            </ul>
            <div className="mt-auto">
              <Link href="/pricing">
                <Button variant="primary" size="lg" className="w-full">
                  Begin Integration
                </Button>
              </Link>
            </div>
          </div>

          {/* Premium: unlimited analyses, anchoring — disabled until features ship */}
          <div className="relative flex flex-col rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-surface-dark p-5 md:p-6 opacity-95">
            <div className="absolute right-3 top-3 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-amber-300">
              Coming soon
            </div>
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">The Integrator</h3>
            <p className="mb-4 text-sm text-slate-400">
              Unlimited analyses. Deep work, no limits.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">${INTEGRATOR_PRICES[billingPeriod].amount}</span>
              <span className="text-sm font-normal text-slate-500">{INTEGRATOR_PRICES[billingPeriod].label}</span>
              {INTEGRATOR_PRICES[billingPeriod].save && (
                <span className="ml-2 text-xs font-medium text-amber-400">{INTEGRATOR_PRICES[billingPeriod].save}</span>
              )}
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Unlimited journaling
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Unlimited AI analyses
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Export & priority support
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Archetype deep-dives
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="outlineDark"
                size="lg"
                className="w-full cursor-not-allowed border-amber-500/30 text-amber-200/70 hover:bg-transparent hover:border-amber-500/30"
                disabled
              >
                Coming soon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <motion.section
      className="relative py-24"
      {...scrollIn}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark-alt to-background-dark" />
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
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white">
                Solo Developer
              </span>
            </div>
          </div>
          <div className="flex-1">
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-brand">
              Behind the Shadow
            </span>
            <h2 className="mb-10 font-headline text-3xl font-bold text-white md:text-4xl">
              Why I built this.
            </h2>
            <blockquote className="font-sans text-xl italic leading-relaxed text-white/90 md:text-2xl">
              I spent years running from myself. Distraction, overworking,
              intellectualizing—anything to avoid the quiet. When I finally hit a
              wall, I turned to Jung. But books were dense, and therapists were
              expensive. I built Shadow Journal because I needed a mirror that
              wouldn&apos;t shatter, a place to safely dismantle the persona and
              find what was real underneath.
            </blockquote>
            <p className="mt-10 font-headline text-3xl text-white md:text-4xl">
              Alex V.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is my data safe with AI?",
    a: "Yes. Entries are stored encrypted. If you use ‘Analyze,’ that entry is decrypted and sent for that single analysis; we don’t use it for training and we don’t store the decrypted copy / we only process it in a secure environment.",
  },
  {
    q: "How does Jungian analysis work in practice?",
    a: "You write or speak freely; our system looks for recurring symbols, themes, and emotional patterns. We surface connections to Jungian concepts (shadow, persona, archetypes) so you can reflect on them—we don't diagnose, we mirror.",
  },
  {
    q: "Can I use Shadow Journal alongside therapy?",
    a: "Absolutely. Many users treat Shadow Journal as a place to reflect between sessions. It's not a replacement for therapy; it's a tool for self-inquiry. We recommend sharing insights with your therapist if you find that helpful.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You keep access until the end of your billing period. After that, your data remains stored and you can export it anytime. You can continue with the free tier (The Seeker) and re-subscribe later if you choose.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24">
      {/* Background: pen on paper — darkened so FAQ copy stays readable */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${FAQ_BG_IMAGE})` }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: [
            `linear-gradient(180deg, rgba(var(--sj-background-dark-rgb), 0.94) 0%, rgba(var(--sj-background-dark-rgb), 0.9) 100%)`,
            `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(var(--sj-background-dark-rgb), 0.6) 100%)`,
          ].join(", "),
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <h2 className="mb-2 text-center font-headline text-3xl font-bold text-slate-100">
          Common Questions
        </h2>
        <p className="mb-12 text-center text-xs uppercase tracking-widest text-slate-500">
          Understanding the intersection of technology and the psyche
        </p>
        <ul className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-[border-color] duration-300 hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-sans font-medium text-slate-100">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/10 px-6 pb-5 pt-2 text-slate-400 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background-dark py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-6 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brandLogo.png"
                alt="Shadow Journal"
                className="h-6 w-6 object-contain rounded-full"
              />
              <span className="font-sans text-lg font-bold tracking-tight">
                Shadow<span className="text-brand">Journal</span>
              </span>
            </div>
            <p className="mb-6 max-w-sm text-slate-500">
              Shadow Journal is a Jungian journal dedicated to the
              democratization of depth psychology tools. We believe everyone
              deserves a mirror to help them understand themselves better.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-brand/20"
              >
                <Mail className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-6 font-sans font-bold text-slate-100">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link href="#" className="transition-colors hover:text-brand">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-brand">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-brand">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 font-sans font-bold text-slate-100">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link href="#" className="transition-colors hover:text-brand">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-brand">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-600 md:flex-row">
          <p>
            © 2026 Shadow Journal. For personal growth purposes only. Not a
            substitute for medical therapy.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-background-dark font-sans text-slate-100">
      <Nav />
      <Hero />
      <TrustBar />
      <UnseenBurden />
      <DigitalAltar />
      <Journey />
      <Privacy />
      <Pricing />
      <Founder />
      <FAQ />
      <Footer />
    </div>
  );
}
