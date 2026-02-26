import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** DELETE /api/settings/delete-journal - Delete all journal entries and mood entries for the user */
export async function DELETE() {
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

    const { error: entriesError } = await supabase
      .from("entries")
      .delete()
      .eq("user_id", user.id);

    if (entriesError) {
      console.error("Delete journal entries error:", entriesError);
      return NextResponse.json(
        { error: "Failed to delete journal data" },
        { status: 500 },
      );
    }

    const { error: moodError } = await supabase
      .from("mood_entries")
      .delete()
      .eq("user_id", user.id);

    if (moodError) {
      console.error("Delete mood entries error:", moodError);
      return NextResponse.json(
        { error: "Failed to delete mood data" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete journal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
