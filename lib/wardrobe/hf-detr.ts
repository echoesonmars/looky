/**
 * Детекция объектов (ответ HF / COCO-style).
 * В браузере вызывайте `hfObjectDetectViaProxy` — прямой запрос к HF из браузера блокируется CORS.
 */

/** Базовый URL Inference Providers (см. @huggingface/inference: router + hf-inference). */
const DEFAULT_HF_INFERENCE_API_BASE = "https://router.huggingface.co/hf-inference"

/** Полный URL POST для object-detection по модели (сырое тело изображения). */
export function buildHfObjectDetectUrl(model: string): string {
  const raw =
    typeof process !== "undefined" ? process.env.HF_INFERENCE_API_BASE?.trim() : undefined
  const base = (raw && raw.length > 0 ? raw : DEFAULT_HF_INFERENCE_API_BASE).replace(/\/$/, "")
  return `${base}/models/${encodeURIComponent(model)}`
}

export type HfDetectionBox = {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

export type HfDetection = {
  score: number
  label: string
  box: HfDetectionBox
}

function parseDetections(payload: unknown): HfDetection[] {
  if (!Array.isArray(payload)) return []
  const out: HfDetection[] = []
  for (const row of payload) {
    if (typeof row !== "object" || row === null) continue
    const r = row as Record<string, unknown>
    const score = typeof r.score === "number" ? r.score : Number(r.score)
    const label = typeof r.label === "string" ? r.label : String(r.label ?? "")
    const box = r.box as Record<string, unknown> | undefined
    if (!box || typeof box !== "object") continue
    const xmin = Number(box.xmin)
    const ymin = Number(box.ymin)
    const xmax = Number(box.xmax)
    const ymax = Number(box.ymax)
    if (!Number.isFinite(score) || !label || !Number.isFinite(xmin)) continue
    out.push({ score, label, box: { xmin, ymin, xmax, ymax } })
  }
  return out
}

/** Сервер или Node: прямой вызов HF (в браузере не использовать — CORS). */
export async function hfObjectDetect(
  imageBytes: ArrayBuffer,
  model: string,
  token: string,
): Promise<HfDetection[]> {
  const url = buildHfObjectDetectUrl(model)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/jpeg",
    },
    body: imageBytes,
  })
  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(`hf_inference_${res.status}${t ? `: ${t.slice(0, 200)}` : ""}`)
  }
  const json: unknown = await res.json()
  return parseDetections(json)
}

/** Браузер: тот же origin → `/api/hf-detect` → HF (токен только на сервере). */
export async function hfObjectDetectViaProxy(imageBytes: ArrayBuffer, model: string): Promise<HfDetection[]> {
  const qs = new URLSearchParams({ model })
  const res = await fetch(`/api/hf-detect?${qs}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "image/jpeg" },
    body: imageBytes,
  })
  const data: unknown = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = typeof data === "object" && data !== null && "error" in data ? String((data as { error?: string }).error) : ""
    throw new Error(err || `hf_proxy_${res.status}`)
  }
  return parseDetections(data)
}

export function parseAllowedLabels(raw: string | undefined): Set<string> {
  const s = raw?.trim() || "tie,handbag,backpack,suitcase"
  return new Set(
    s
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function filterDetections(
  dets: HfDetection[],
  minScore: number,
  allowed: Set<string>,
): HfDetection[] {
  return dets
    .filter((d) => d.score >= minScore && allowed.has(d.label.trim().toLowerCase()))
    .sort((a, b) => b.score - a.score)
}
