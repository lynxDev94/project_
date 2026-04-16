"use client";

import { useAuthContext } from "@/providers/Auth";
import { DashboardHeader } from "./_components/dashboardHeader";
import { DashboardStatsGrid } from "./_components/dashboardStatsGrid";
import { InsightsComingSoonCard } from "./_components/insightsComingSoonCard";
import { MoodTrendCard } from "./_components/moodTrendCard";
import { WeeklyStreakCard } from "./_components/weeklyStreakCard";
import { WelcomeCard } from "./_components/welcomeCard";
import { useDashboardData } from "./hooks/useDashboardData";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const {
    moodValue,
    setMoodValue,
    submittedToday,
    trendLabels,
    trendPoints,
    trendLoading,
    moodLoading,
    submitLoading,
    stats,
    onSubmitMood,
  } = useDashboardData();

  const greetingName =
    user?.firstName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "there";

  const archetypeLabel =
    (user?.metadata as Record<string, any> | undefined)?.archetype?.label ??
    null;

  return (
    <div className="font-sans text-slate-800">
      <DashboardHeader
        greetingName={greetingName}
        archetypeLabel={archetypeLabel}
      />

      <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <WelcomeCard
          moodValue={moodValue}
          moodLoading={moodLoading}
          submitLoading={submitLoading}
          submittedToday={submittedToday}
          onMoodChange={setMoodValue}
          onSubmitMood={onSubmitMood}
        />

        <div className="flex flex-col gap-6">
          <WeeklyStreakCard
            streak={stats?.streak ?? 0}
            weekDays={stats?.weekDays ?? Array(7).fill(false)}
          />
          <InsightsComingSoonCard />
        </div>
      </div>

      <MoodTrendCard
        loading={trendLoading}
        labels={trendLabels}
        points={trendPoints}
      />
      <DashboardStatsGrid stats={stats} />
    </div>
  );
}
