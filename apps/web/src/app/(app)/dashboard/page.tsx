"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/providers/Auth";
import {
  Brain,
  Plus,
  Settings,
  Cloud,
  Ghost,
  Sun,
  Sparkles,
  Check,
  User,
  Star,
  EyeOff,
  BookOpen,
  LineChart,
  ArrowRight,
  LogOut,
} from "lucide-react";

const RECENT_ENTRIES = [
  {
    id: "1",
    title: "Integrating the Persona",
    date: "Oct 24",
    sentiment: "Calm",
    icon: User,
    active: true,
  },
  {
    id: "2",
    title: "Morning Dream Fragment",
    date: "Oct 23",
    sentiment: "Curious",
    icon: Cloud,
    active: false,
  },
  {
    id: "3",
    title: "Meeting the Shadow Self",
    date: "Oct 22",
    sentiment: "Reflective",
    icon: Ghost,
    active: false,
  },
  {
    id: "4",
    title: "The Anima Projection",
    date: "Oct 21",
    sentiment: "Hopeful",
    icon: Sun,
    active: false,
  },
];

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_FILLED = [true, true, true, true, true, false, false];

// Mood trend sample: 7 points for S M T W T F S (0–100 scale)
const MOOD_POINTS = [45, 62, 58, 72, 68, 85, 78];
const CHART_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function MoodTrendChart({
  points,
  labels,
}: {
  points: number[];
  labels: string[];
}) {
  const width = 400;
  const height = 120;
  const padding = { top: 8, right: 8, bottom: 24, left: 8 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = chartWidth / (points.length - 1);

  const coords = points.map((y, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + chartHeight - ((y - min) / range) * chartHeight,
  }));
  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaD = `M ${padding.left} ${padding.top + chartHeight} ${coords.map((c) => `L ${c.x} ${c.y}`).join(" ")} L ${padding.left + chartWidth} ${padding.top + chartHeight} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="mood-fill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="rgb(108, 43, 238)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(108, 43, 238)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#mood-fill)" />
      <polyline
        points={linePoints}
        fill="none"
        stroke="rgb(108, 43, 238)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="4" fill="rgb(108, 43, 238)" />
      ))}
      {labels.map((label, i) => (
        <text
          key={label + i}
          x={padding.left + i * stepX}
          y={height - 6}
          textAnchor="middle"
          className="fill-slate-400 text-[10px] font-medium"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-dashboard-main-bg font-sans text-slate-800">
      <div className="flex min-h-screen">
        {/* Left sidebar */}
        <aside className="flex w-64 flex-col border-r border-dashboard-stroke bg-dashboard-sidebar-bg py-6 pl-6 pr-4">
          <Link href="/home" className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block font-sans text-base font-bold tracking-tight text-slate-800">
                Shadow Journal
              </span>
              <span className="block text-xs text-slate-500">
                Jungian Insights
              </span>
            </div>
          </Link>

          <Link href="/journal">
            <Button
              variant="primary"
              size="lg"
              className="mb-8 w-full justify-center gap-2 rounded-xl"
            >
              <Plus className="h-5 w-5" />
              New Reflection
            </Button>
          </Link>

          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent entries
          </h2>
          <ul className="space-y-2">
            {RECENT_ENTRIES.map((entry) => {
              const Icon = entry.icon;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors shadow-card-layered ${
                      entry.active
                        ? "border-white/60 bg-brand/10"
                        : "border-dashboard-stroke bg-white/70 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        entry.active ? "bg-brand text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {entry.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {entry.date} · {entry.sentiment}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-auto bg-dashboard-main-bg">
          {/* Top bar: breadcrumb + settings + profile */}
          <header className="flex shrink-0 items-center justify-between border-b border-dashboard-stroke bg-dashboard-main-bg px-8 py-4">
            <nav className="text-xs font-medium uppercase tracking-wider text-slate-500">
              <span className="text-slate-400">Workspace</span>
              <span className="mx-1.5 text-slate-400">/</span>
              <span className="text-slate-800">Dashboard</span>
            </nav>
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-dashboard-stroke bg-white px-3 py-2 shadow-card-layered">
                <Avatar className="h-8 w-8 rounded-full border border-white shadow-sm">
                  <AvatarImage src="" alt="Alex Chen" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-200 to-emerald-500 text-sm font-semibold text-emerald-900">
                    AC
                  </AvatarFallback>
                </Avatar>
                <span className="font-sans text-sm font-semibold text-slate-800">
                  Alex Chen
                </span>
              </div>
              <Link
                href="/settings"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Log out"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 hover:text-red-600" />
              </button>
            </div>
          </header>

          <div className="flex-1 px-8 py-8">
          <h1 className="mb-2 font-headline text-3xl font-bold text-slate-800 md:text-4xl">
            Good morning, Alex.
          </h1>
          <p className="mb-8 text-lg text-slate-600">
            Where shall we go within today?
          </p>

          {/* Welcome: bg image (writing hands) with light overlay, text on left */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-8 flex min-h-[220px] w-full max-w-full overflow-hidden rounded-3xl border border-dashboard-stroke shadow-card-layered"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/welcome-card-bg.png')",
                filter: "brightness(1.2) contrast(0.85) saturate(0.6) sepia(0.2)",
              }}
              aria-hidden
            />
            {/* Light overlay with purple tint to match dashboard accents */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-brand/30"
              aria-hidden
            />
            {/* Welcome text on the left */}
            <div className="relative z-10 flex max-w-xl flex-col justify-center p-8 md:p-10">
              <h2 className="mb-4 font-headline text-2xl font-bold text-slate-800 md:text-3xl">
                Welcome
              </h2>
              <p className="font-headline text-lg italic leading-relaxed text-slate-700">
                &ldquo;Your visions will become clear only when you can look into
                your own heart.&rdquo;
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                — Carl Jung
              </p>
            </div>
          </motion.div>

          {/* Feature cards */}
          {/* <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-dashboard-stroke bg-white p-6 shadow-card-layered">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-sans text-lg font-bold text-slate-800">
                Dream Analysis
              </h3>
              <p className="mb-4 text-sm text-slate-500">
                Decode your subconscious symbols
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Start decoding
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-dashboard-stroke bg-white p-6 shadow-card-layered">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-sans text-lg font-bold text-slate-800">
                Pattern Tracker
              </h3>
              <p className="mb-4 text-sm text-slate-500">
                Visualize recurring shadow themes
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                View patterns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div> */}

          {/* Mood Trend card */}
          <div className="rounded-2xl border border-dashboard-stroke bg-white p-6 shadow-card-layered">
            <h3 className="mb-6 font-sans text-lg font-bold text-slate-800">
              Mood Trend
            </h3>
            <div className="h-40 w-full">
              <MoodTrendChart points={MOOD_POINTS} labels={CHART_DAYS} />
            </div>
          </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="flex w-72 flex-col gap-6 border-l border-dashboard-stroke bg-dashboard-panel py-8 pl-6 pr-8">
          {/* Weekly Streak */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-dashboard-stroke bg-white px-4 py-5 shadow-card-layered">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="shrink-0 font-sans text-sm font-bold text-slate-900">
                Weekly Streak
              </h2>
              <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                5 days
              </span>
            </div>
            <div className="grid grid-cols-7 grid-rows-[auto_auto] gap-x-1 gap-y-1">
              {WEEKDAYS.map((day, i) => {
                const filled = STREAK_FILLED[i];
                return (
                  <div
                    key={day + i}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                        filled
                          ? "bg-brand text-white"
                          : "border border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {filled ? <Check className="h-3 w-3" /> : day}
                    </div>
                    <span className="truncate text-[10px] font-medium text-slate-500">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights (disabled / premium placeholder) */}
          <div className="">
            <h2 className="mb-4 font-sans text-sm font-bold text-slate-400">
              Insights
            </h2>
            <div className="pointer-events-none select-none divide-y divide-dashboard-stroke overflow-hidden rounded-2xl border border-dashboard-stroke bg-white/70 opacity-60 shadow-card-layered backdrop-blur-md">
              <div className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  <Sparkles className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Dominant archetype
                  </p>
                  <p className="mt-1 font-semibold text-slate-500">
                    The Sage
                  </p>
                  <p className="text-xs text-slate-400">
                    72% presence this week
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  <EyeOff className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    AI observation
                  </p>
                </div>
                <p className="text-sm italic text-slate-500">
                  Your recent entries suggest a transition from the
                  &lsquo;Anima&rsquo; projection to personal empowerment.
                  Consider writing about your childhood mentors next.
                </p>
              </div>
              <p className="py-3 text-center text-xs text-slate-400">
                Premium feature — coming soon
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
