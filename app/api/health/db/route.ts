import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** Health check: env + optional `items` table count. */
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
        hint: "Configure .env.local from .env.example",
      },
      { status: 503 }
    );
  }
}
