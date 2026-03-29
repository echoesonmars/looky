"use client"

import { useCallback, useEffect, useState } from "react"

export function WardrobeImageLightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onKeyDown])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative mb-6 w-full max-w-sm cursor-zoom-in overflow-hidden rounded-xl border p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--accent-orange)_65%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-(--grid-cell-bg)"
        style={{ borderColor: "var(--grid-border)" }}
        aria-label="Открыть фото"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="aspect-3/4 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" loading="eager" decoding="async" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[min(92dvh,920px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
