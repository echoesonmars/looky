"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { RiCameraLine, RiDownload2Line, RiImageAddLine, RiRefreshLine } from "react-icons/ri"

import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"
import { removeGarmentBackground } from "@/lib/try-on/remove-background"

// ──────────────────────────────────────────────────────────
// MediaPipe types — loaded dynamically to avoid SSR issues
// ──────────────────────────────────────────────────────────

type NormalizedLandmark = { x: number; y: number; z: number; visibility?: number }
type PoseLandmarkerResult = { landmarks: NormalizedLandmark[][] }
type PoseLandmarkerInstance = { detect(img: HTMLElement): PoseLandmarkerResult }

// ──────────────────────────────────────────────────────────
// Skeleton connections (MediaPipe 33-point body model)
// ──────────────────────────────────────────────────────────
const SKELETON_CONNECTIONS: [number, number][] = [
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  [11, 23], [12, 24], // torso sides
  [23, 24], // hips
  [23, 25], [25, 27], // left leg
  [24, 26], [26, 28], // right leg
]

const MEDIAPIPE_CDN_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
const MEDIAPIPE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"

let _landmarkerPromise: Promise<PoseLandmarkerInstance> | null = null

async function getPoseLandmarker(): Promise<PoseLandmarkerInstance> {
  if (_landmarkerPromise) return _landmarkerPromise
  _landmarkerPromise = (async () => {
    const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision")
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_CDN_WASM)
    return PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MEDIAPIPE_MODEL, delegate: "GPU" },
      runningMode: "IMAGE",
      numPoses: 1,
    }) as unknown as PoseLandmarkerInstance
  })()
  return _landmarkerPromise
}

// ──────────────────────────────────────────────────────────

export type WardrobeItemMin = {
  id: string
  title: string
  category: string
  imageUrl: string | null
}

type Phase = "idle" | "loading_model" | "detecting" | "ready" | "inferring" | "error"

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  w: number,
  h: number,
) {
  ctx.save()
  ctx.strokeStyle = "rgba(255,140,0,0.75)"
  ctx.lineWidth = 2.5
  ctx.fillStyle = "rgba(255,140,0,0.9)"

  for (const [a, b] of SKELETON_CONNECTIONS) {
    const la = landmarks[a]
    const lb = landmarks[b]
    if (!la || !lb || (la.visibility ?? 1) < 0.3 || (lb.visibility ?? 1) < 0.3) continue
    ctx.beginPath()
    ctx.moveTo(la.x * w, la.y * h)
    ctx.lineTo(lb.x * w, lb.y * h)
    ctx.stroke()
  }
  for (const lm of landmarks) {
    if ((lm.visibility ?? 1) < 0.3) continue
    ctx.beginPath()
    ctx.arc(lm.x * w, lm.y * h, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// Resize canvas to fit within IDM-VTON's native 768×1024 resolution (never upscale)
function resizeForTryOn(canvas: HTMLCanvasElement): string {
  const TARGET_W = 768
  const TARGET_H = 1024
  const { width, height } = canvas
  const scale = Math.min(TARGET_W / width, TARGET_H / height, 1)
  const newW = Math.round(width * scale)
  const newH = Math.round(height * scale)
  const off = document.createElement("canvas")
  off.width = newW
  off.height = newH
  off.getContext("2d")!.drawImage(canvas, 0, 0, newW, newH)
  return off.toDataURL("image/jpeg", 0.92)
}

async function objectUrlToBase64(objectUrl: string): Promise<string> {
  const res = await fetch(objectUrl)
  const blob = await res.blob()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function TryOnCanvas({ wardrobeItems }: { wardrobeItems: WardrobeItemMin[] }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [phaseMsg, setPhaseMsg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null)
  const [inferError, setInferError] = useState<string | null>(null)
  const [bgRemovalMsg, setBgRemovalMsg] = useState<string | null>(null)
  const inferAbortRef = useRef<AbortController | null>(null)
  // Cache: garmentId → result data URL (cleared when new photo is loaded)
  const resultCacheRef = useRef<Map<string, string>>(new Map())

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceImgRef = useRef<HTMLImageElement | null>(null)
  const landmarksRef = useRef<NormalizedLandmark[] | null>(null)

  const selectedItem = wardrobeItems.find((it) => it.id === selectedItemId) ?? null

  // ── Composite render ──────────────────────────────────
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const src = sourceImgRef.current
    if (!canvas || !src) return

    canvas.width = src.naturalWidth
    canvas.height = src.naturalHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(src, 0, 0)

    if (showSkeleton && landmarksRef.current) {
      drawSkeleton(ctx, landmarksRef.current, canvas.width, canvas.height)
    }

  }, [showSkeleton])

  // Re-draw when skeleton toggle changes
  useEffect(() => {
    if (phase === "ready" || phase === "inferring") redrawCanvas()
  }, [phase, redrawCanvas, showSkeleton])

  // IDM-VTON inference: bg-removal → base64 garment → Replicate API
  useEffect(() => {
    inferAbortRef.current?.abort()
    inferAbortRef.current = null

    if (!selectedItem?.imageUrl) {
      setResultImageUrl(null)
      setInferError(null)
      return
    }

    // Return cached result instantly
    const cached = resultCacheRef.current.get(selectedItem.id)
    if (cached) {
      setResultImageUrl(cached)
      setPhase("ready")
      setInferError(null)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const personB64 = resizeForTryOn(canvas)
    const controller = new AbortController()
    inferAbortRef.current = controller

    setPhase("inferring")
    setResultImageUrl(null)
    setInferError(null)
    setBgRemovalMsg(null)

    const itemId = selectedItem.id
    const imageUrl = selectedItem.imageUrl
    const title = selectedItem.title
    const category = selectedItem.category

    void (async () => {
      // ── Step 1: remove background from garment (cached per URL) ──────────
      let garmentPayload: { garment_b64: string } | { garment_url: string }
      try {
        setBgRemovalMsg("Подготовка одежды…")
        const bgUrl = await removeGarmentBackground(imageUrl, (p) => {
          setBgRemovalMsg(p.label)
        })
        if (controller.signal.aborted) return
        const b64 = await objectUrlToBase64(bgUrl)
        garmentPayload = { garment_b64: b64 }
      } catch {
        if (controller.signal.aborted) return
        garmentPayload = { garment_url: imageUrl }
      }
      setBgRemovalMsg(null)

      // ── Step 2: call IDM-VTON on Replicate ──────────────────────────────
      try {
        const res = await fetch("/api/tryon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            person_b64: personB64,
            ...garmentPayload,
            garment_title: title,
            category,
          }),
        })
        if (controller.signal.aborted) return
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({ detail: res.statusText }))
          const detail = errBody?.detail ?? errBody?.error ?? `HTTP ${res.status}`
          throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail))
        }
        const data = (await res.json()) as { result_b64: string }
        if (controller.signal.aborted) return
        const url = `data:image/png;base64,${data.result_b64}`
        resultCacheRef.current.set(itemId, url)
        setResultImageUrl(url)
        setPhase("ready")
      } catch (e: unknown) {
        if ((e as Error)?.name === "AbortError") return
        console.error("[TryOn API]", e)
        setInferError(e instanceof Error ? e.message : "Ошибка AI примерки")
        setPhase("ready")
      }
    })()

    return () => { controller.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.imageUrl, selectedItem?.category])

  // ── Process photo ─────────────────────────────────────
  const processPhoto = useCallback(
    async (file: File) => {
      setPhase("loading_model")
      setPhaseMsg("Загрузка модели распознавания поз…")
      setError(null)
      setResultImageUrl(null)
      setInferError(null)
      setSelectedItemId(null)
      inferAbortRef.current?.abort()
      inferAbortRef.current = null
      resultCacheRef.current.clear()
      landmarksRef.current = null

      try {
        // Load photo
        const objectUrl = URL.createObjectURL(file)
        const img = new window.Image()
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error("Не удалось загрузить изображение"))
          img.src = objectUrl
        })
        sourceImgRef.current = img

        // Show photo immediately
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          canvas.getContext("2d")?.drawImage(img, 0, 0)
        }

        setPhase("detecting")
        setPhaseMsg("Определение позы (MediaPipe)…")

        const landmarker = await getPoseLandmarker()
        const result = landmarker.detect(img)
        const lm = result.landmarks?.[0] ?? null
        landmarksRef.current = lm

        URL.revokeObjectURL(objectUrl)

        setPhase("ready")
        setPhaseMsg("")
        setTimeout(() => redrawCanvas(), 50)
      } catch (e) {
        console.error("[TryOn]", e)
        setError(e instanceof Error ? e.message : "Ошибка обработки фото")
        setPhase("error")
        setPhaseMsg("")
      }
    },
    [redrawCanvas],
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ""
      if (file) void processPhoto(file)
    },
    [processPhoto],
  )

  const downloadResult = useCallback(() => {
    const link = document.createElement("a")
    link.download = "looky-tryon.png"
    link.href = resultImageUrl ?? canvasRef.current?.toDataURL("image/jpeg", 0.93) ?? ""
    link.click()
  }, [resultImageUrl])

  const reset = useCallback(() => {
    inferAbortRef.current?.abort()
    inferAbortRef.current = null
    resultCacheRef.current.clear()
    setPhase("idle")
    setPhaseMsg("")
    setError(null)
    setInferError(null)
    setResultImageUrl(null)
    setSelectedItemId(null)
    sourceImgRef.current = null
    landmarksRef.current = null
    const canvas = canvasRef.current
    if (canvas) {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = 0
      canvas.height = 0
    }
  }, [])

  const isProcessing = phase === "loading_model" || phase === "detecting"
  const isInferring = phase === "inferring"

  // ── UI ──────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-xl border p-4 space-y-3"
        style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--grid-muted)" }}>
          1 — Загрузите фото
        </p>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
              disabled={isProcessing}
            />
            <span
              className="inline-flex min-h-10 items-center gap-2 justify-center rounded-lg px-4 text-sm font-medium transition-opacity"
              style={{
                background: "var(--grid-foreground)",
                color: "var(--grid-on-foreground)",
                opacity: isProcessing ? 0.5 : 1,
              }}
            >
              <RiImageAddLine />
              Выбрать фото
            </span>
          </label>
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={onFileChange}
              disabled={isProcessing}
            />
            <span
              className="inline-flex min-h-10 items-center gap-2 justify-center rounded-lg border px-4 text-sm font-medium"
              style={{
                borderColor: "var(--grid-border)",
                color: "var(--grid-foreground)",
                opacity: isProcessing ? 0.5 : 1,
              }}
            >
              <RiCameraLine />
              Камера
            </span>
          </label>
          {phase !== "idle" && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-10 items-center gap-2 justify-center rounded-lg border px-4 text-sm font-medium"
              style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
            >
              <RiRefreshLine />
              Сброс
            </button>
          )}
        </div>

        {isProcessing && (
          <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
            {phaseMsg}
          </p>
        )}
        {error && (
          <p className="text-sm font-geist-secondary" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}
        {phase === "ready" && !landmarksRef.current && (
          <p className="text-sm font-geist-secondary" style={{ color: "#f59e0b" }}>
            ⚠️ Поза не определена. Попробуйте фото в полный рост на светлом фоне.
          </p>
        )}
      </div>

      {(phase === "ready" || isInferring) && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--grid-border)" }}>
          {resultImageUrl ? (
            <img
              src={resultImageUrl}
              alt="AI try-on result"
              className="w-full h-auto max-h-[min(70dvh,640px)] object-contain block"
              style={{ background: "var(--grid-border)" }}
            />
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-[min(70dvh,640px)] object-contain"
                style={{ background: "var(--grid-border)", display: "block" }}
              />
              {isInferring && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]"
                  style={{ background: "rgba(0,0,0,0.52)" }}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                    <div
                      className="absolute w-7 h-7 rounded-full border-2 border-white/10 border-b-white/70 animate-spin"
                      style={{ animationDirection: "reverse", animationDuration: "0.85s" }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 px-6">
                    <p className="text-white text-sm font-semibold text-center tracking-wide">
                      {bgRemovalMsg ?? "примеряем одежду"}
                    </p>
                    <p className="text-white/65 text-xs text-center font-geist-secondary">
                      {bgRemovalMsg ? "нейросеть убирает фон одежды…" : "дайте чуток времени ✦ ~30–60 сек"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ borderTop: "1px solid var(--grid-border)" }}
          >
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSkeleton}
                onChange={(e) => setShowSkeleton(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: "var(--accent-orange)" }}
              />
              <span className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                Показать скелет позы
              </span>
            </label>
            <button
              type="button"
              onClick={downloadResult}
              disabled={!resultImageUrl}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-40"
              style={{ background: "var(--accent-orange)", color: "#fff" }}
            >
              <RiDownload2Line />
              Скачать
            </button>
          </div>
        </div>
      )}
      {(phase === "ready" || isInferring) && (
        <div
          className="rounded-xl border p-4 space-y-3"
          style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--grid-muted)" }}>
            2 — Выберите вещь
          </p>
          {wardrobeItems.length === 0 ? (
            <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
              Гардероб пуст. Сначала добавьте вещи в раздел «Гардероб».
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {wardrobeItems.map((item) => {
                const isSelected = item.id === selectedItemId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                    className="shrink-0 flex flex-col items-center gap-1 rounded-lg border-2 p-1.5 transition-all"
                    style={{
                      borderColor: isSelected ? "var(--accent-orange)" : "var(--grid-border)",
                      background: isSelected
                        ? "color-mix(in oklab, var(--accent-orange) 10%, var(--grid-cell-bg))"
                        : "var(--grid-cell-bg)",
                      minWidth: 72,
                    }}
                    title={item.title}
                  >
                    <div
                      className="w-16 h-20 rounded overflow-hidden flex items-center justify-center"
                      style={{ background: "var(--grid-border)" }}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👕</span>
                      )}
                    </div>
                    <span
                      className="text-[10px] text-center leading-tight font-geist-secondary w-16"
                      style={{ color: "var(--grid-muted)" }}
                    >
                      {wardrobeCategoryLabel(item.category)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          {selectedItem && !isInferring && !inferError && resultImageUrl && (
            <p className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
              Результат:{" "}
              <span style={{ color: "var(--grid-foreground)", fontWeight: 500 }}>
                {selectedItem.title}
              </span>
            </p>
          )}
          {inferError && (
            <p className="text-sm font-geist-secondary" style={{ color: "#ef4444" }}>
              ⚠️ {inferError}
            </p>
          )}
        </div>
      )}
      {phase === "idle" && (
        <div
          className="rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 py-16 text-center"
          style={{ borderColor: "var(--grid-border)" }}
        >
          <span className="text-5xl">🪞</span>
          <p
            className="text-sm font-geist-secondary max-w-xs leading-relaxed"
            style={{ color: "var(--grid-muted)" }}
          >
            Загрузите фото в полный рост — нейросеть примерит выбранную вещь из вашего гардероба.
          </p>
        </div>
      )}
    </div>
  )}
