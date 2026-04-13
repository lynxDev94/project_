import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MoodTrendChartProps = {
  points: (number | null)[];
  labels: string[];
};

export function MoodTrendChart({ points, labels }: MoodTrendChartProps) {
  const data = labels.map((label, index) => ({
    label,
    mood: points[index] ?? null,
  }));

  if (points.length === 0 || points.every((p) => p == null)) {
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
