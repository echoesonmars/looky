import { WARDROBE_CATEGORY_IDS, type WardrobeCategoryId } from "@/lib/wardrobe-categories"

export type AnalyzedItem = {
  title: string
  category: WardrobeCategoryId
  tags: string[]
}

type OpenAiContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }

export async function analyzeClothingCropsWithOpenAI(
  crops: { base64: string; mimeType: string }[],
): Promise<AnalyzedItem[]> {
  const key = process.env.OPENAI_API_KEY
  if (!key?.trim()) {
    throw new Error("missing_openai_key")
  }

  const n = crops.length
  const cats = WARDROBE_CATEGORY_IDS.join(", ")
  const text = [
    `You are given exactly ${n} clothing crop image(s) in order (after this message).`,
    `Return a JSON object with key "items": an array of exactly ${n} objects.`,
    `Each object: "title" (short Russian, max 80 chars), "category" (exactly one of: ${cats}), "tags" (array of short strings, e.g. color:black, style:casual).`,
    "No extra keys at root level besides items.",
  ].join(" ")

  const content: OpenAiContentPart[] = [{ type: "text", text }]
  for (const c of crops) {
    const mime = c.mimeType || "image/jpeg"
    content.push({
      type: "image_url",
      image_url: { url: `data:${mime};base64,${c.base64}` },
    })
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content }],
      max_tokens: 800,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`openai_${res.status}${errText ? `: ${errText.slice(0, 300)}` : ""}`)
  }

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const raw = body.choices?.[0]?.message?.content
  if (typeof raw !== "string") {
    throw new Error("openai_empty_content")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    throw new Error("openai_invalid_json")
  }

  if (typeof parsed !== "object" || parsed === null || !("items" in parsed)) {
    throw new Error("openai_bad_shape")
  }

  const itemsUnknown = (parsed as { items: unknown }).items
  if (!Array.isArray(itemsUnknown)) {
    throw new Error("openai_items_not_array")
  }

  const allowed = new Set<string>(WARDROBE_CATEGORY_IDS)
  const out: AnalyzedItem[] = []

  for (let i = 0; i < n; i++) {
    const row = itemsUnknown[i]
    if (typeof row !== "object" || row === null) {
      throw new Error(`openai_item_${i}`)
    }
    const o = row as Record<string, unknown>
    const title = String(o.title ?? "").trim().slice(0, 120)
    const category = String(o.category ?? "").trim()
    const tagsRaw = o.tags
    const tags: string[] = Array.isArray(tagsRaw)
      ? tagsRaw.map((t) => String(t).trim()).filter((t) => t.length > 0 && t.length <= 64).slice(0, 24)
      : []

    if (title.length < 1 || !allowed.has(category)) {
      throw new Error(`openai_item_invalid_${i}`)
    }
    out.push({
      title,
      category: category as WardrobeCategoryId,
      tags,
    })
  }

  return out
}
