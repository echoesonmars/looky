import { randomUUID } from "crypto"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { analyzeClothingCropsWithOpenAI } from "@/lib/openai-analyze-clothing"
import { prisma } from "@/lib/prisma"
import { isSupabaseConfigured } from "@/utils/supabase/env"
import { createServiceRoleClient, isServiceRoleConfigured } from "@/utils/supabase/service"

export const maxDuration = 60

const WARDROBE_BUCKET = "wardrobe"
const MAX_CROPS = 6
const MAX_BODY_CHARS = 12_000_000

type CropPayload = { base64: string; mimeType?: string }

function decodeBase64Image(b64: string): Buffer {
  const clean = b64.replace(/\s/g, "")
  return Buffer.from(clean, "base64")
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 })
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ error: "supabase_public_env_missing" }, { status: 503 })
  }

  if (!isServiceRoleConfigured()) {
    return Response.json({ error: "supabase_service_role_not_configured" }, { status: 503 })
  }

  const text = await req.text()
  if (text.length > MAX_BODY_CHARS) {
    return Response.json({ error: "payload_too_large" }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(text) as unknown
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 })
  }

  if (typeof body !== "object" || body === null || !("crops" in body)) {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const cropsRaw = (body as { crops: unknown }).crops
  if (!Array.isArray(cropsRaw) || cropsRaw.length === 0) {
    return Response.json({ error: "no_crops" }, { status: 400 })
  }

  const crops: CropPayload[] = []
  for (const c of cropsRaw.slice(0, MAX_CROPS)) {
    if (typeof c !== "object" || c === null) continue
    const o = c as Record<string, unknown>
    const base64 = typeof o.base64 === "string" ? o.base64 : ""
    const mimeType = typeof o.mimeType === "string" ? o.mimeType : "image/jpeg"
    if (base64.length < 32) continue
    crops.push({ base64, mimeType })
  }

  if (crops.length === 0) {
    return Response.json({ error: "no_valid_crops" }, { status: 400 })
  }

  let analyzed
  try {
    analyzed = await analyzeClothingCropsWithOpenAI(
      crops.map((c) => ({ base64: c.base64, mimeType: c.mimeType ?? "image/jpeg" })),
    )
  } catch (e) {
    console.error("Analyze Clothing Error:", e)
    const msg = e instanceof Error ? e.message : "analyze_failed"
    return Response.json({ error: msg }, { status: 502 })
  }

  if (analyzed.length !== crops.length) {
    return Response.json({ error: "openai_length_mismatch" }, { status: 502 })
  }

  const supabase = createServiceRoleClient()
  const created: { id: string; title: string; category: string; imageUrl: string | null; tags: string[] }[] = []

  for (let i = 0; i < crops.length; i++) {
    const buf = decodeBase64Image(crops[i].base64)
    if (buf.length > 6 * 1024 * 1024) {
      return Response.json({ error: "crop_too_large" }, { status: 413 })
    }

    const path = `${userId}/${randomUUID()}.jpg`
    const { error: upErr } = await supabase.storage.from(WARDROBE_BUCKET).upload(path, buf, {
      contentType: "image/jpeg",
      upsert: false,
    })
    if (upErr) {
      return Response.json({ error: "storage_upload_failed", detail: upErr.message }, { status: 502 })
    }

    const { data: pub } = supabase.storage.from(WARDROBE_BUCKET).getPublicUrl(path)
    const imageUrl = pub?.publicUrl ?? null

    const row = analyzed[i]
    const item = await prisma.wardrobeItem.create({
      data: {
        userId,
        title: row.title,
        category: row.category,
        imageUrl,
        tags: row.tags,
        source: "ai_photo",
      },
    })
    created.push({
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      tags: item.tags,
    })
  }

  revalidatePath("/wardrobe")
  revalidatePath("/home")

  return Response.json({ created })
}
