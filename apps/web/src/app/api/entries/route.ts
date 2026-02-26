import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** GET /api/entries?search=... - List entries with optional search */
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

    const search = request.nextUrl.searchParams.get("search")?.trim() || "";

    let query = supabase
      .from("entries")
      .select("id, title, body, tags, entry_date, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (search) {
      const safe = search.replace(/[*%.]/g, "").slice(0, 100);
      if (safe) {
        query = query.or(`title.ilike.%${safe}%,body.ilike.%${safe}%`);
      }
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error("Entries list error:", error);
      return NextResponse.json(
        { error: "Failed to fetch entries" },
        { status: 500 },
      );
    }

    return NextResponse.json({ entries: entries ?? [] });
  } catch (err) {
    console.error("Entries GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** POST /api/entries - Create a new entry */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const title =
      typeof body.title === "string" ? body.title.trim() || "Untitled reflection" : "Untitled reflection";
    const entryBody =
      typeof body.body === "string" ? body.body : "";
    const tags = Array.isArray(body.tags)
      ? body.tags
          .filter((t: unknown) => typeof t === "string" && t.trim())
          .map((t: string) => t.trim().toLowerCase())
      : [];
    const entryDate =
      typeof body.entryDate === "string" && body.entryDate
        ? body.entryDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("entries")
      .insert({
        user_id: user.id,
        title,
        body: entryBody,
        tags,
        entry_date: entryDate,
      })
      .select()
      .single();

    if (error) {
      console.error("Entry create error:", error);
      return NextResponse.json(
        { error: "Failed to save entry" },
        { status: 500 },
      );
    }

    return NextResponse.json({ entry: data });
  } catch (err) {
    console.error("Entries POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
