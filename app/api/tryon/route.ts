import { auth } from "@/auth"

export const maxDuration = 300

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN ?? ""
const REPLICATE_PREDICTIONS = "https://api.replicate.com/v1/predictions"
const IDM_VTON_VERSION = "3b032a70c29aef7b9c3222f2e40b71660201d8c288336475ba326f3ca278a3e1"

type ReplicatePrediction = {
  id: string
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled"
  output?: string | string[]
  error?: string
}

function mapCategory(cat: string): string {
  const lower = cat.toLowerCase()
  if (lower === "bottom" || lower === "pants" || lower === "skirt" || lower === "shorts") return "lower_body"
  if (lower === "dress" || lower === "dresses" || lower === "jumpsuit") return "dresses"
  return "upper_body" // top, outer, hoodie, jacket, coat, shirt, default
}

async function pollPrediction(id: string): Promise<ReplicatePrediction> {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 2_000))
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    })
    const pred = (await res.json()) as ReplicatePrediction
    if (pred.status === "succeeded" || pred.status === "failed" || pred.status === "canceled") {
      return pred
    }
  }
  throw new Error("Prediction timed out after 4 min")
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  if (!REPLICATE_TOKEN) {
    return Response.json({ error: "REPLICATE_API_TOKEN not set in environment" }, { status: 503 })
  }

  let body: {
    person_b64: string
    garment_url?: string
    garment_b64?: string
    garment_title?: string
    category?: string
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 })
  }

  if (!body.person_b64 || (!body.garment_url && !body.garment_b64)) {
    return Response.json({ error: "person_b64 and garment_url or garment_b64 are required" }, { status: 400 })
  }

  const category = mapCategory(body.category ?? "top")

  // Create prediction — Prefer: wait asks Replicate to respond synchronously (up to ~60s)
  let prediction: ReplicatePrediction
  try {
    const res = await fetch(REPLICATE_PREDICTIONS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        version: IDM_VTON_VERSION,
        input: {
          human_img: body.person_b64,
          garm_img: body.garment_b64 ?? body.garment_url,
          garment_des: body.garment_title ?? "clothing item",
          is_checked: true,
          is_checked_crop: true,
          denoise_steps: 30,
          seed: Math.floor(Math.random() * 2147483647),
          category,
        },
      }),
      signal: AbortSignal.timeout(65_000),
    })
    const predText = await res.text()
    if (!res.ok) {
      return Response.json(
        { error: "replicate_error", detail: predText.slice(0, 500) },
        { status: res.status },
      )
    }
    prediction = JSON.parse(predText) as ReplicatePrediction
  } catch (e) {
    return Response.json(
      { error: "replicate_unreachable", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    )
  }

  // If not yet complete, poll
  if (prediction.status !== "succeeded" && prediction.status !== "failed") {
    try {
      prediction = await pollPrediction(prediction.id)
    } catch (e) {
      return Response.json({ error: "timeout", detail: String(e) }, { status: 504 })
    }
  }

  if (prediction.status !== "succeeded" || !prediction.output) {
    return Response.json({ error: "inference_failed", detail: prediction.error }, { status: 500 })
  }

  // Fetch the result image and return as base64 so the frontend doesn't need the Replicate URL
  const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
  const imgBuf = await fetch(outputUrl).then((r) => r.arrayBuffer())
  const result_b64 = Buffer.from(imgBuf).toString("base64")

  return Response.json({ result_b64 })
}
