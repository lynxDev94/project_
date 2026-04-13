import { Calendar, FileText, PenLine } from "lucide-react";
import type { DashboardStats } from "../types";

type DashboardStatsGridProps = {
  stats: DashboardStats | null;
};

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
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
  );
}
