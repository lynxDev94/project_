import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTodayUTC(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/** GET /api/mood?days=7 - Fetch mood trend for the last N days */
export async function GET(request: NextRequest) {
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

    const days = Math.min(30, Math.max(7, Number(request.nextUrl.searchParams.get("days") || 7)));
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    const { data: entries, error } = await supabase
      .from("mood_entries")
      .select("mood_score, entry_date, created_at")
      .eq("user_id", user.id)
      .gte("entry_date", startDate.toISOString().slice(0, 10))
      .order("entry_date", { ascending: true });

    if (error) {
      console.error("Mood trend fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch mood data" },
        { status: 500 },
      );
    }

    const byDate = new Map<string, number>();
    for (const e of entries || []) {
      byDate.set(e.entry_date, e.mood_score);
    }

    // Order by week: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const weekdayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon=1 .. Sun=0
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const labels: string[] = [];
    const points: (number | null)[] = [];
    for (let i = 0; i < days; i++) {
      const targetWeekday = weekdayOrder[i];
      for (let j = 0; j < days; j++) {
        const d = new Date(startDate);
        d.setUTCDate(d.getUTCDate() + j);
        if (d.getUTCDay() === targetWeekday) {
          const dateStr = d.toISOString().slice(0, 10);
          labels.push(dayLabels[i]);
          points.push(byDate.get(dateStr) ?? null);
          break;
        }
      }
    }

    const today = getTodayUTC();
    const todayEntry = entries?.find((e) => e.entry_date === today);

    return NextResponse.json({
      entries: (entries || []).map((e) => ({ date: e.entry_date, mood: e.mood_score })),
      trend: { labels, points },
      submittedToday: !!todayEntry,
      todayMood: todayEntry?.mood_score ?? null,
    });
  } catch (err) {
    console.error("Mood GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/mood - Submit or update mood for today (upsert) */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to submit mood." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const moodScore =
      typeof body.moodScore === "number" ? body.moodScore : Number(body.moodScore);

    if (Number.isNaN(moodScore) || moodScore < 1 || moodScore > 100) {
      return NextResponse.json(
        { error: "Invalid mood score. Must be between 1 and 100." },
        { status: 400 },
      );
    }

    const today = getTodayUTC();

    const { data, error } = await supabase
      .from("mood_entries")
      .upsert(
        {
          user_id: user.id,
          mood_score: Math.round(moodScore),
          entry_date: today,
        },
        { onConflict: "user_id,entry_date", ignoreDuplicates: false }
      )
      .select()
      .single();

    if (error) {
      console.error("Mood upsert error:", error);
      return NextResponse.json(
        { error: "Failed to save mood" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, mood: data });
  } catch (err) {
    console.error("Mood POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
