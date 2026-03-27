import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Verifies Supabase env + optional `items` table readability (anon + RLS).
 */
export async function GET() {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, itemsCount: count ?? 0 });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
        hint: "Copy .env.example to .env.local and set Supabase keys",
      },
      { status: 503 }
    );
  }
}
