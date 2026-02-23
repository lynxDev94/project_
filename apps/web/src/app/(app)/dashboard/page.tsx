"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Check,
  Star,
  EyeOff,
  FileText,
  PenLine,
  Calendar,
  ArrowRight,
  Menu,
} from "lucide-react";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_FILLED = [true, true, true, true, true, false, false];
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
          <stop
            offset="0%"
            stopColor="rgb(108, 43, 238)"
            stopOpacity="0.25"
          />
          <stop
            offset="100%"
            stopColor="rgb(108, 43, 238)"
            stopOpacity="0.02"
          />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill="url(#mood-fill)"
      />
      <polyline
        points={linePoints}
        fill="none"
        stroke="rgb(108, 43, 238)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r="4"
          fill="rgb(108, 43, 238)"
        />
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
  const [moodValue, setMoodValue] = useState(70);

  return (
    <div className="font-sans text-slate-800">
      <h1 className="font-headline mb-2 text-3xl font-bold text-slate-800 md:text-4xl">
        Good morning, Alex.
      </h1>
      <p className="mb-8 text-lg text-slate-600">
        Where shall we go within today?
      </p>

      <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="border-dashboard-stroke shadow-card-layered relative flex min-h-[170px] w-full flex-col overflow-hidden rounded-3xl border bg-white md:min-h-[190px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: "url('/images/welcome-card-bg.png')",
              filter: "brightness(1.2) contrast(0.85) saturate(0.6) sepia(0.2)",
            }}
            aria-hidden
          />
          <div
            className="to-brand/20 absolute inset-0 bg-gradient-to-r from-white/95 via-white/80"
            aria-hidden
          />

          <div className="relative z-10 flex flex-1 flex-col justify-between px-6 py-5 md:px-7 md:py-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Daily prompt menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Daily Prompt
              </span>
            </div>

            <div className="mt-4">
              <h2 className="font-headline mb-3 text-2xl font-bold text-slate-800 md:text-3xl">
                Welcome
              </h2>
              <p className="font-headline text-lg leading-relaxed text-slate-700 italic">
                &ldquo;Your visions will become clear only when you can look
                into your own heart.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                — Carl Jung
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/dashboard/journal">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2 rounded-xl"
                >
                  Start Writing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex min-w-[180px] flex-1 items-center gap-3">
                <span className="text-sm font-medium text-slate-600">
                  Mood Check-in
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={moodValue}
                  onChange={(e) => setMoodValue(Number(e.target.value))}
                  className="accent-brand h-2 flex-1 appearance-none rounded-full bg-slate-200"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <div className="border-dashboard-stroke shadow-card-layered min-w-0 overflow-hidden rounded-2xl border bg-white px-4 py-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="shrink-0 font-sans text-sm font-bold text-slate-900">
                Weekly Streak
              </h2>
              <span className="bg-brand/10 text-brand shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
                5 days
              </span>
            </div>
            <div className="grid grid-cols-7 gap-x-1 gap-y-2">
              {WEEKDAYS.map((day, i) => {
                const filled = STREAK_FILLED[i];
                return (
                  <div
                    key={day + i}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium sm:h-6 sm:w-6 sm:text-[10px] ${
                        filled
                          ? "bg-brand text-white"
                          : "border border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {filled ? <Check className="h-3 w-3" /> : day}
                    </div>
                    <span className="truncate text-[9px] font-medium text-slate-500 sm:text-[10px]">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-sans text-sm font-bold text-slate-400">
              Insights
            </h2>
            <div className="divide-dashboard-stroke border-dashboard-stroke shadow-card-layered pointer-events-none divide-y overflow-hidden rounded-2xl border bg-white/70 opacity-60 backdrop-blur-md select-none">
              <div className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  <Sparkles className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Dominant archetype
                  </p>
                  <p className="mt-1 font-semibold text-slate-500">The Sage</p>
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
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
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
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    AI observation
                  </p>
                </div>
                <p className="text-sm text-slate-500 italic">
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
        </div>
      </div>

      <div className="border-dashboard-stroke shadow-card-layered mb-8 rounded-2xl border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-sans text-lg font-bold text-slate-800">
            Mood Trend
          </h3>
          <span className="text-sm font-medium text-slate-500">
            Last 7 Days
          </span>
        </div>
        <div className="h-40 w-full">
          <MoodTrendChart
            points={MOOD_POINTS}
            labels={CHART_DAYS}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border-dashboard-stroke shadow-card-layered rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Entries Written
              </p>
              <p className="font-headline text-2xl font-bold text-slate-900">
                12
              </p>
            </div>
          </div>
        </div>
        <div className="border-dashboard-stroke shadow-card-layered rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <PenLine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Words</p>
              <p className="font-headline text-2xl font-bold text-slate-900">
                8,240
              </p>
            </div>
          </div>
        </div>
        <div className="border-dashboard-stroke shadow-card-layered rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Most Active Day
              </p>
              <p className="font-headline text-lg font-bold text-slate-900">
                Thursday
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
