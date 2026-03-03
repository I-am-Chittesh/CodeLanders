import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;

    if (code) {
      const supabase = await createClient();

      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Redirect to dashboard on successful auth
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }

    // Redirect to login on error
    return NextResponse.redirect(`${origin}/auth/login`);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${new URL(request.url).origin}/auth/login`);
  }
}
