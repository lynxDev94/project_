import { MoodTrendChart } from "./moodTrendChart";

type MoodTrendCardProps = {
  loading: boolean;
  labels: string[];
  points: (number | null)[];
};

export function MoodTrendCard({ loading, labels, points }: MoodTrendCardProps) {
  return (
    <div className="border-dashboard-stroke shadow-card-layered mb-8 rounded-2xl border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-lg font-bold text-slate-800">
          Mood Trend
        </h3>
        <span className="text-sm font-medium text-slate-500">Last 7 Days</span>
      </div>
      <div className="h-40 w-full">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="border-brand h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : (
          <MoodTrendChart
            points={points}
            labels={labels}
          />
        )}
      </div>
    </div>
  );
}
