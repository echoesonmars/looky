import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { colorHarmonyLabel, outfitColorScore } from "@/lib/stylist/color-compat"
import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"
import { fetchOpenMeteoCurrent, getDefaultWeatherCoords } from "@/lib/weather"
import { prisma } from "@/lib/prisma"

export const maxDuration = 60

const SCENARIO_LABELS: Record<string, string> = {
  work: "работа / офис",
  casual: "повседневная прогулка",
  event: "мероприятие / свидание",
  sport: "спорт / активный отдых",
}

const WEATHER_CODE_DESC: Record<number, string> = {
  0: "ясно",
  1: "в основном ясно",
  2: "переменная облачность",
  3: "пасмурно",
  45: "туман",
  48: "туман с инеем",
  51: "лёгкая морось",
  61: "небольшой дождь",
  63: "умеренный дождь",
  65: "сильный дождь",
  71: "небольшой снег",
  73: "умеренный снег",
  75: "сильный снег",
  80: "ливень",
  95: "гроза",
}

function weatherDesc(code: number): string {
  // Find closest code
  if (code in WEATHER_CODE_DESC) return WEATHER_CODE_DESC[code]!
  const key = Object.keys(WEATHER_CODE_DESC)
    .map(Number)
    .sort((a, b) => Math.abs(a - code) - Math.abs(b - code))[0]
  return key !== undefined ? (WEATHER_CODE_DESC[key] ?? "неизвестно") : "неизвестно"
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return NextResponse.json({ error: "openai_not_configured" }, { status: 503 })

  let body: { message?: string; scenario?: string; history?: { role: string; content: string }[] }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const userMessage = String(body.message ?? "").trim().slice(0, 800)
  const scenario = String(body.scenario ?? "").trim()
  const history = Array.isArray(body.history) ? body.history.slice(-8) : []

  // Fetch wardrobe
  const wardrobeItems = await prisma.wardrobeItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, title: true, category: true, imageUrl: true, tags: true },
  })

  // Fetch weather
  const { lat, lon } = getDefaultWeatherCoords()
  const weather = await fetchOpenMeteoCurrent(lat, lon)
  const weatherText = weather.ok
    ? `${weather.tempC}°C, ${weatherDesc(weather.weatherCode)}`
    : "погода неизвестна"

  // Build wardrobe context
  const wardrobeText = wardrobeItems.length === 0
    ? "Гардероб пользователя пуст."
    : wardrobeItems
        .map(
          (it) =>
            `ID:${it.id} | ${wardrobeCategoryLabel(it.category)} | "${it.title}"${it.tags.length ? ` | теги: ${it.tags.join(", ")}` : ""}`,
        )
        .join("\n")

  const scenarioText = scenario ? ` Сценарий: ${SCENARIO_LABELS[scenario] ?? scenario}.` : ""

  const systemPrompt = [
    "Ты — AI-стилист модного маркетплейса.",
    "Ты помогаешь пользователю подобрать образ из его гардероба.",
    `Текущая погода: ${weatherText}.${scenarioText}`,
    "",
    "Гардероб пользователя (ID | категория | название | теги):",
    wardrobeText,
    "",
    "Правила ответа:",
    "1. Отвечай по-русски, дружелюбно и по делу.",
    "2. Предложи конкретный образ: укажи точные ID вещей из гардероба в поле outfit.",
    "3. Всегда возвращай JSON-объект в поле `data` вида:",
    '   { "message": "текст ответа", "outfit": [{"id":"...","role":"верх/низ/обувь/аксессуар"}], "tips": ["совет 1", "совет 2"] }',
    "4. Учитывай погоду: не предлагай майку в мороз.",
    "5. Если гардероб пуст — скажи об этом и дай общие советы по стилю.",
    "6. Максимальная длина message — 300 символов. tips — 1-3 пункта.",
  ].join("\n")

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage || "Подбери мне образ" },
  ]

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages,
      max_tokens: 700,
      temperature: 0.55,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    return NextResponse.json({ error: `openai_${res.status}`, detail: errText.slice(0, 200) }, { status: 502 })
  }

  const completion = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const raw = completion.choices?.[0]?.message?.content ?? ""

  let parsed: { message?: string; outfit?: { id: string; role: string }[]; tips?: string[] }
  try {
    const clean = raw.replace(/^```json/i, "").replace(/```$/i, "").trim()
    // Support top-level `data` wrapper or plain
    const top = JSON.parse(clean) as Record<string, unknown>
    parsed = (top.data as typeof parsed) ?? top
  } catch {
    // Fallback: plain text response
    parsed = { message: raw.slice(0, 400), outfit: [], tips: [] }
  }

  // Resolve outfit items to full objects
  const outfitIds = (parsed.outfit ?? []).map((o) => o.id).filter(Boolean)
  const wardrobeMap = new Map(wardrobeItems.map((it) => [it.id, it]))
  const resolvedOutfit = (parsed.outfit ?? [])
    .filter((o) => wardrobeMap.has(o.id))
    .map((o) => ({
      id: o.id,
      role: o.role,
      title: wardrobeMap.get(o.id)!.title,
      category: wardrobeMap.get(o.id)!.category,
      imageUrl: wardrobeMap.get(o.id)!.imageUrl,
      tags: wardrobeMap.get(o.id)!.tags,
    }))

  // Color score
  const colorScore = outfitColorScore(resolvedOutfit)
  const colorLabel = colorHarmonyLabel(colorScore)

  return NextResponse.json({
    message: parsed.message ?? "",
    outfit: resolvedOutfit,
    tips: parsed.tips ?? [],
    colorScore: Math.round(colorScore * 100),
    colorLabel,
    weather: weatherText,
  })
}
