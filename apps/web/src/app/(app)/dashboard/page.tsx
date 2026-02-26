"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/Auth";
import {
  Sparkles,
  Check,
  Star,
  EyeOff,
  FileText,
  PenLine,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function MoodTrendChart({
  points,
  labels,
  isEmpty,
}: {
  points: (number | null)[];
  labels: string[];
  isEmpty?: boolean;
}) {
  const data = labels.map((label, index) => ({
    label,
    mood: points[index] ?? null,
  }));

  if (isEmpty || points.every((p) => p == null)) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-slate-500">
          No mood entries yet this week
        </p>
        <p className="text-xs text-slate-400">
          Use the Mood Check-in above to log how you&apos;re feeling
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: 8, bottom: 16 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
          opacity={0.4}
        />
        <YAxis
          domain={[0, 100]}
          hide
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <Tooltip
          cursor={{ fill: "rgba(108, 43, 238, 0.08)" }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid rgba(148, 163, 184, 0.4)",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
          }}
          formatter={(value) => [
            value == null ? "–" : String(value),
            "Mood score",
          ]}
        />
        <Bar
          dataKey="mood"
          fill="rgb(108, 43, 238)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [moodValue, setMoodValue] = useState(50);
  const [submittedToday, setSubmittedToday] = useState(false);
  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [trendPoints, setTrendPoints] = useState<(number | null)[]>([]);
  const [moodLoading, setMoodLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [stats, setStats] = useState<{
    totalEntries: number;
    totalWords: number;
    streak: number;
    mostActiveDay: string;
    weekDays: boolean[];
  } | null>(null);

  const fetchMood = useCallback(async () => {
    setMoodLoading(true);
    try {
      const res = await fetch("/api/mood?days=7");
      if (!res.ok) return;
      const data = await res.json();
      setTrendLabels(data.trend?.labels ?? []);
      setTrendPoints(data.trend?.points ?? []);
      setSubmittedToday(data.submittedToday ?? false);
      if (data.todayMood != null) setMoodValue(data.todayMood);
    } catch {
      // ignore
    } finally {
      setMoodLoading(false);
      setTrendLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/entries/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        totalEntries: data.totalEntries ?? 0,
        totalWords: data.totalWords ?? 0,
        streak: data.streak ?? 0,
        mostActiveDay: data.mostActiveDay ?? "—",
        weekDays: Array.isArray(data.weekDays) ? data.weekDays : Array(7).fill(false),
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchMood();
    fetchStats();
  }, [fetchMood, fetchStats]);

  const handleSubmitMood = async () => {
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodScore: moodValue }),
      });
      await res.json();
      if (res.ok) {
        setSubmittedToday(true);
        await fetchMood();
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const greetingName =
    user?.firstName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="font-sans text-slate-800">
      <h1 className="font-headline mb-2 text-3xl font-bold text-slate-800 md:text-4xl">
        Good morning, {greetingName}.
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

            <div className="mt-6 flex flex-wrap items-center gap-6">
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
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Mood Check-in
                  </span>
                  <span className="text-brand font-headline w-10 text-lg font-bold">
                    {moodValue}
                  </span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={moodValue}
                  onChange={(e) => setMoodValue(Number(e.target.value))}
                  disabled={moodLoading}
                  className="accent-brand h-2 flex-1 appearance-none rounded-full bg-slate-200 disabled:opacity-60"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0 rounded-xl"
                  disabled={submitLoading || moodLoading}
                  onClick={handleSubmitMood}
                >
                  {submitLoading
                    ? "Saving..."
                    : submittedToday
                      ? "Update"
                      : "Submit"}
                </Button>
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
                {stats?.streak ?? 0} days
              </span>
            </div>
            <div className="grid grid-cols-7 gap-x-1 gap-y-2">
              {WEEKDAYS.map((day, i) => {
                const filled = stats?.weekDays?.[i] ?? false;
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
          {trendLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="border-brand h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          ) : (
            <MoodTrendChart
              points={trendPoints}
              labels={trendLabels}
              isEmpty={
                trendPoints.length === 0 || trendPoints.every((p) => p == null)
              }
            />
          )}
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
                {stats?.totalEntries ?? "—"}
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
                {stats?.totalWords != null
                  ? stats.totalWords.toLocaleString()
                  : "—"}
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
                {stats?.mostActiveDay ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
