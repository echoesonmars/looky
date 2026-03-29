/**
 * Client-side background removal for garment images.
 * Uses @imgly/background-removal (ONNX/WebAssembly, no server needed).
 * Results are cached by source URL to avoid reprocessing.
 */

import type { removeBackground as RemoveBgFn } from "@imgly/background-removal"

type RemoveBgType = typeof RemoveBgFn

let _removeBg: RemoveBgType | null = null

async function getRemoveBgFn(): Promise<RemoveBgType> {
  if (_removeBg) return _removeBg
  const mod = await import("@imgly/background-removal")
  _removeBg = mod.removeBackground
  return _removeBg!
}

/** Per-session object-URL cache: imageUrl → transparent PNG object URL */
const _cache = new Map<string, string>()

export type BgRemovalProgress = {
  /** 0..1 fraction, or null while model is still loading */
  fraction: number | null
  label: string
}

/**
 * Remove background from a garment image URL.
 * Returns a same-origin object URL pointing to a transparent PNG.
 * Caches results for the session so the same item is only processed once.
 */
export async function removeGarmentBackground(
  imageUrl: string,
  onProgress?: (p: BgRemovalProgress) => void,
): Promise<string> {
  if (_cache.has(imageUrl)) return _cache.get(imageUrl)!

  onProgress?.({ fraction: null, label: "Загрузка модели удаления фона…" })

  const removeBg = await getRemoveBgFn()

  const resultBlob = await removeBg(imageUrl, {
    model: "isnet_quint8",
    output: { format: "image/png", quality: 1 },
    progress: (key: string, current: number, total: number) => {
      onProgress?.({
        fraction: total > 0 ? current / total : null,
        label: key.startsWith("fetch") ? "Загрузка модели…" : "Удаление фона…",
      })
    },
  })

  const objectUrl = URL.createObjectURL(resultBlob)
  _cache.set(imageUrl, objectUrl)
  return objectUrl
}

/** Release all cached object URLs (call on unmount if needed). */
export function clearBgRemovalCache() {
  for (const url of _cache.values()) URL.revokeObjectURL(url)
  _cache.clear()
}
