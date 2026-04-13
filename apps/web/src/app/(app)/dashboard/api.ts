import type { DashboardMood, DashboardStats } from "./types";

function toMoodTrend(raw: unknown): DashboardMood["trend"] {
  const trend = (raw ?? {}) as {
    labels?: unknown;
    points?: unknown;
  };
  const labels = Array.isArray(trend.labels)
    ? trend.labels.filter((x): x is string => typeof x === "string")
    : [];
  const points = Array.isArray(trend.points)
    ? trend.points.map((x) => (typeof x === "number" ? x : null))
    : [];
  return { labels, points };
}

export async function fetchDashboardMood(days = 7): Promise<DashboardMood> {
  const response = await fetch(`/api/mood?days=${days}`);
  if (!response.ok) {
    throw new Error("Failed to load mood trend.");
  }
  const data = (await response.json()) as {
    trend?: unknown;
    submittedToday?: unknown;
    todayMood?: unknown;
  };

  return {
    trend: toMoodTrend(data.trend),
    submittedToday: Boolean(data.submittedToday),
    todayMood: typeof data.todayMood === "number" ? data.todayMood : null,
  };
}

export async function submitMoodScore(moodScore: number): Promise<void> {
  const response = await fetch("/api/mood", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moodScore }),
  });
  if (!response.ok) {
    throw new Error("Failed to save mood check-in.");
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/entries/stats");
  if (!response.ok) {
    throw new Error("Failed to load stats.");
  }
  const data = (await response.json()) as Partial<DashboardStats>;
  return {
    totalEntries: data.totalEntries ?? 0,
    totalWords: data.totalWords ?? 0,
    streak: data.streak ?? 0,
    mostActiveDay: data.mostActiveDay ?? "—",
    weekDays: Array.isArray(data.weekDays)
      ? data.weekDays
      : Array(7).fill(false),
  };
}
