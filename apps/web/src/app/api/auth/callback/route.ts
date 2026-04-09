import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSafeRedirect(rawRedirect: string | null): string {
  if (!rawRedirect) return "/";
  if (!rawRedirect.startsWith("/")) return "/";
  if (rawRedirect.startsWith("//")) return "/";
  return rawRedirect;
}

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const redirectTo = getSafeRedirect(requestUrl.searchParams.get("redirect"));

    if (!code) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase URL or anon key");
    }

    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code for session:", error);
      throw error;
    }

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);

    const errorUrl = new URL("/signin", request.url);
    errorUrl.searchParams.set(
      "error",
      "Authentication failed. Please try again.",
    );

    return NextResponse.redirect(errorUrl);
  }
}
