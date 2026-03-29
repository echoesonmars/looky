"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { cropDetectionsToBase64, fileToScaledCanvas } from "@/lib/wardrobe/canvas-crops"
import { canvasToJpegArrayBuffer } from "@/lib/wardrobe/canvas-export"
import {
  filterDetections,
  hfObjectDetectViaProxy,
  parseAllowedLabels,
} from "@/lib/wardrobe/hf-detr"
import { humanizeWardrobeFlowError } from "@/lib/wardrobe/user-facing-errors"

const MAX_SIDE = 1024
const MAX_CROPS = 6

type CropRow = { base64: string; mimeType: string; selected: boolean }

function readPublicEnv() {
  const model = process.env.NEXT_PUBLIC_HF_DETECT_MODEL?.trim() || "facebook/detr-resnet-50"
  const minScore = Number.parseFloat(process.env.NEXT_PUBLIC_HF_MIN_SCORE ?? "0.7")
  const allowed = parseAllowedLabels(process.env.NEXT_PUBLIC_HF_ALLOWED_LABELS)
  return {
    model,
    minScore: Number.isFinite(minScore) ? minScore : 0.7,
    allowed,
  }
}

export function WardrobePhotoAnalyzeFlow() {
  const router = useRouter()
  const { model, minScore, allowed } = readPublicEnv()

  const [phase, setPhase] = useState<"idle" | "detecting" | "ready" | "uploading" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [cropRows, setCropRows] = useState<CropRow[] | null>(null)

  const runPipeline = useCallback(
    async (file: File) => {
      setMessage(null)

      setPhase("detecting")
      try {
        const canvas = await fileToScaledCanvas(file, MAX_SIDE)
        setPreviewSrc(canvas.toDataURL("image/jpeg", 0.88))
        const jpegBuf = await canvasToJpegArrayBuffer(canvas, 0.92)
        const raw = await hfObjectDetectViaProxy(jpegBuf, model)
        const filtered = filterDetections(raw, minScore, allowed)
        const crops = cropDetectionsToBase64(canvas, filtered, MAX_CROPS)
        setCropRows(crops.map((c) => ({ ...c, selected: true })))
        setPhase("ready")
        if (filtered.length === 0) {
          setMessage("Отправляем всё фото.")
        }
      } catch (e) {
        setPhase("error")
        setMessage(humanizeWardrobeFlowError(e instanceof Error ? e.message : ""))
        setCropRows(null)
        setPreviewSrc(null)
      }
    },
    [allowed, minScore, model],
  )

  const onPickFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      e.target.value = ""
      if (f) void runPipeline(f)
    },
    [runPipeline],
  )

  const toggleCrop = useCallback((index: number) => {
    setCropRows((prev) =>
      prev?.map((row, i) => (i === index ? { ...row, selected: !row.selected } : row)) ?? null,
    )
  }, [])

  const sendToServer = useCallback(async () => {
    if (!cropRows?.length) return
    const payload = cropRows.filter((r) => r.selected).map(({ base64, mimeType }) => ({ base64, mimeType }))
    if (payload.length === 0) {
      setMessage("Выберите хотя бы один фрагмент.")
      return
    }
    setPhase("uploading")
    setMessage(null)
    try {
      const res = await fetch("/api/analyze-clothing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ crops: payload }),
      })
      const errBody = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(errBody.error || `Ошибка ${res.status}`)
      }
      router.push("/wardrobe")
      router.refresh()
    } catch (e) {
      setPhase("error")
      setMessage(humanizeWardrobeFlowError(e instanceof Error ? e.message : ""))
    }
  }, [cropRows, router])

  const reset = useCallback(() => {
    setPhase("idle")
    setMessage(null)
    setPreviewSrc(null)
    setCropRows(null)
  }, [])

  const showReview = cropRows && (phase === "ready" || phase === "uploading" || phase === "error")

  return (
    <div
      className="flex max-w-lg flex-col gap-4 rounded-xl border p-5"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      <h2 className="text-base font-semibold" style={{ color: "var(--grid-foreground)" }}>
        По фото
      </h2>

      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer">
          <input type="file" accept="image/*" className="sr-only" onChange={onPickFile} disabled={phase === "detecting" || phase === "uploading"} />
          <span
            className="inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-medium"
            style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
          >
            {phase === "detecting" ? "Загрузка…" : "Выбрать фото"}
          </span>
        </label>
        <label className="inline-flex cursor-pointer">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={onPickFile}
            disabled={phase === "detecting" || phase === "uploading"}
          />
          <span
            className="inline-flex min-h-11 items-center justify-center rounded-md border px-4 text-sm font-medium"
            style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
          >
            Снять камерой
          </span>
        </label>
        {showReview ? (
          <Button type="button" variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }} onClick={reset}>
            Сброс
          </Button>
        ) : null}
      </div>

      {previewSrc && showReview ? (
        <div className="space-y-3">
          <p className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
            Исходник
          </p>
          <img src={previewSrc} alt="" className="max-h-48 w-full rounded-lg border object-contain" style={{ borderColor: "var(--grid-border)" }} />
        </div>
      ) : null}

      {showReview && cropRows ? (
        <div className="space-y-2">
          <p className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
            Фрагменты — снимите галочку, чтобы исключить
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
            {cropRows.map((row, i) => {
              const src = `data:${row.mimeType};base64,${row.base64}`
              return (
                <label
                  key={i}
                  className="relative shrink-0 cursor-pointer rounded-lg border-2 transition-opacity"
                  style={{
                    borderColor: row.selected ? "var(--accent-orange)" : "var(--grid-border)",
                    opacity: row.selected ? 1 : 0.55,
                  }}
                >
                  <input type="checkbox" className="sr-only" checked={row.selected} onChange={() => toggleCrop(i)} />
                  <img src={src} alt="" className="h-24 w-20 rounded-md object-cover" />
                  <span
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded border text-[10px] font-bold"
                    style={{
                      borderColor: "var(--grid-border)",
                      background: row.selected ? "var(--accent-orange)" : "var(--grid-cell-bg)",
                      color: row.selected ? "#fff" : "var(--grid-muted)",
                    }}
                  >
                    {row.selected ? "✓" : ""}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ) : null}

      {showReview ? (
        <Button
          type="button"
          className="min-h-11 w-full cursor-pointer sm:w-auto"
          disabled={phase === "uploading"}
          onClick={() => void sendToServer()}
        >
          {phase === "uploading" ? "Сохранение…" : "Сохранить в гардероб"}
        </Button>
      ) : null}

      {message ? (
        <p className="text-sm font-geist-secondary leading-relaxed" role="status" style={{ color: "var(--grid-muted)" }}>
          {message}
        </p>
      ) : null}
    </div>
  )
}
