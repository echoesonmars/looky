import { auth } from "@/auth"
import { buildHfObjectDetectUrl } from "@/lib/wardrobe/hf-detr"

export const maxDuration = 60

const MAX_BYTES = 6 * 1024 * 1024

const DEFAULT_MODEL = "facebook/detr-resnet-50"

/**
 * Прокси к Hugging Face object-detection (Inference Providers / router). CORS с браузера к HF нет — только сервер.
 * Токен: HF_INFERENCE_TOKEN (не NEXT_PUBLIC_*). URL: buildHfObjectDetectUrl → router.huggingface.co/hf-inference по умолчанию.
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const token = process.env.HF_INFERENCE_TOKEN?.trim()
  if (!token) {
    return Response.json({ error: "hf_inference_token_not_configured" }, { status: 503 })
  }

  const url = new URL(req.url)
  const model =
    url.searchParams.get("model")?.trim() ||
    process.env.HF_DETECT_MODEL?.trim() ||
    DEFAULT_MODEL

  const buf = await req.arrayBuffer()
  if (buf.byteLength === 0) {
    return Response.json({ error: "empty_body" }, { status: 400 })
  }
  if (buf.byteLength > MAX_BYTES) {
    return Response.json({ error: "payload_too_large" }, { status: 413 })
  }

  const contentType = req.headers.get("content-type")?.trim() || "image/jpeg"

  const hfUrl = buildHfObjectDetectUrl(model)
  let hfRes: Response
  try {
    hfRes = await fetch(hfUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
      body: buf,
    })
  } catch (e) {
    return Response.json(
      { error: "hf_network_error", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    )
  }

  const text = await hfRes.text()
  if (!hfRes.ok) {
    // Return the actual status so the client knows if it's 503 (Model Loading) or 429 (Rate Limit), etc.
    const statusCode = hfRes.status >= 400 && hfRes.status < 600 ? hfRes.status : 502;
    return Response.json(
      { error: `hf_upstream_${hfRes.status}`, detail: text.slice(0, 400) },
      { status: statusCode },
    )
  }

  let json: unknown
  try {
    json = JSON.parse(text) as unknown
  } catch {
    return Response.json({ error: "hf_invalid_json" }, { status: 500 })
  }

  return Response.json(json)
}
