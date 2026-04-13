import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type WelcomeCardProps = {
  moodValue: number;
  moodLoading: boolean;
  submitLoading: boolean;
  submittedToday: boolean;
  onMoodChange: (value: number) => void;
  onSubmitMood: () => void;
};

export function WelcomeCard({
  moodValue,
  moodLoading,
  submitLoading,
  submittedToday,
  onMoodChange,
  onSubmitMood,
}: WelcomeCardProps) {
  return (
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
            &ldquo;Your visions will become clear only when you can look into
            your own heart.&rdquo;
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
              onChange={(e) => onMoodChange(Number(e.target.value))}
              disabled={moodLoading}
              className="accent-brand h-2 flex-1 appearance-none rounded-full bg-slate-200 disabled:opacity-60"
            />
            <Button
              size="sm"
              variant="secondary"
              className="shrink-0 rounded-xl"
              disabled={submitLoading || moodLoading}
              onClick={onSubmitMood}
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
  );
}
