import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function getStreak(entryDates: string[]): number {
  const dates = new Set(entryDates);
  let count = 0;
  const d = new Date();
  for (let i = 0; i < 7; i++) {
    const dateStr = d.toISOString().slice(0, 10);
    if (dates.has(dateStr)) count++;
    else if (i > 0) break;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return count;
}

/** Mon=0 .. Sun=6, true if that weekday in the current week has an entry */
function getWeekDays(entryDates: string[]): boolean[] {
  const dates = new Set(entryDates);
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const result: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + mondayOffset + i);
    result.push(dates.has(d.toISOString().slice(0, 10)));
  }
  return result;
}

function getMostActiveDay(entryDates: string[]): string {
  const dayCounts: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
  };
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (const dateStr of entryDates) {
    const d = new Date(dateStr);
    const day = d.getDay();
    dayCounts[day] = (dayCounts[day] ?? 0) + 1;
  }

  let maxDay = 0;
  let maxCount = 0;
  for (let i = 0; i < 7; i++) {
    if ((dayCounts[i] ?? 0) > maxCount) {
      maxCount = dayCounts[i] ?? 0;
      maxDay = i;
    }
  }
  return dayNames[maxDay];
}

/** GET /api/entries/stats - Aggregations for dashboard */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in." },
        { status: 401 },
      );
    }

    const { data: entries, error } = await supabase
      .from("entries")
      .select("body, entry_date")
      .eq("user_id", user.id);

    if (error) {
      console.error("Entries stats error:", error);
      return NextResponse.json(
        { error: "Failed to fetch stats" },
        { status: 500 },
      );
    }

    const list = entries ?? [];
    const totalEntries = list.length;
    const totalWords = list.reduce((sum, e) => sum + wordCount(e.body || ""), 0);
    const entryDates = list.map((e) => e.entry_date);
    const streak = getStreak(entryDates);
    const mostActiveDay = totalEntries > 0 ? getMostActiveDay(entryDates) : "—";
    const weekDays = getWeekDays(entryDates);

    return NextResponse.json({
      totalEntries,
      totalWords,
      streak,
      mostActiveDay,
      weekDays,
    });
  } catch (err) {
    console.error("Entries stats error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
