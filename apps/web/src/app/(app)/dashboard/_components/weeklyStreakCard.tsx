import { Check } from "lucide-react";
import { WEEKDAYS } from "../constants";

type WeeklyStreakCardProps = {
  streak: number;
  weekDays: boolean[];
};

export function WeeklyStreakCard({ streak, weekDays }: WeeklyStreakCardProps) {
  return (
    <div className="border-dashboard-stroke shadow-card-layered min-w-0 overflow-hidden rounded-2xl border bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="shrink-0 font-sans text-sm font-bold text-slate-900">
          Weekly Streak
        </h2>
        <span className="bg-brand/10 text-brand shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
          {streak} days
        </span>
      </div>
      <div className="grid grid-cols-7 gap-x-1 gap-y-2">
        {WEEKDAYS.map((day, i) => {
          const filled = weekDays?.[i] ?? false;
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
  );
}
