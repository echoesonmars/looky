/**
 * Browser-only: draw image to canvas (max side), run detection coords, export JPEG base64 crops.
 */

import type { HfDetection } from "./hf-detr"

const JPEG_QUALITY = 0.88

export async function fileToScaledCanvas(file: File, maxSide: number): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file)
  const w = bitmap.width
  const h = bitmap.height
  const scale = Math.min(1, maxSide / Math.max(w, h))
  const cw = Math.max(1, Math.round(w * scale))
  const ch = Math.max(1, Math.round(h * scale))
  const canvas = document.createElement("canvas")
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas_2d_unavailable")
  ctx.drawImage(bitmap, 0, 0, cw, ch)
  bitmap.close()
  return canvas
}

function canvasToJpegBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY)
  const i = dataUrl.indexOf(",")
  if (i < 0) throw new Error("invalid_data_url")
  return dataUrl.slice(i + 1)
}

/** If box coords look normalized 0–1, scale to canvas pixels. */
function pixelBox(
  box: HfDetection["box"],
  cw: number,
  ch: number,
): { x0: number; y0: number; x1: number; y1: number } {
  let { xmin, ymin, xmax, ymax } = box
  const norm = xmax <= 1.01 && ymax <= 1.01 && xmax > 0 && ymax > 0
  if (norm) {
    xmin *= cw
    xmax *= cw
    ymin *= ch
    ymax *= ch
  }
  const x0 = Math.max(0, Math.floor(xmin))
  const y0 = Math.max(0, Math.floor(ymin))
  const x1 = Math.min(cw, Math.ceil(xmax))
  const y1 = Math.min(ch, Math.ceil(ymax))
  return { x0, y0, x1, y1: Math.max(y0 + 1, y1) }
}

export function cropDetectionsToBase64(
  sourceCanvas: HTMLCanvasElement,
  detections: HfDetection[],
  maxCrops: number,
): { base64: string; mimeType: string }[] {
  const cw = sourceCanvas.width
  const ch = sourceCanvas.height
  const slice = detections.slice(0, maxCrops)
  if (slice.length === 0) {
    return [{ base64: canvasToJpegBase64(sourceCanvas), mimeType: "image/jpeg" }]
  }

  const out: { base64: string; mimeType: string }[] = []
  const tmp = document.createElement("canvas")
  const tctx = tmp.getContext("2d")
  if (!tctx) throw new Error("canvas_2d_unavailable")

  for (const det of slice) {
    const { x0, y0, x1, y1 } = pixelBox(det.box, cw, ch)
    const w = Math.max(1, x1 - x0)
    const h = Math.max(1, y1 - y0)
    tmp.width = w
    tmp.height = h
    tctx.drawImage(sourceCanvas, x0, y0, w, h, 0, 0, w, h)
    out.push({ base64: canvasToJpegBase64(tmp), mimeType: "image/jpeg" })
  }
  return out
}
