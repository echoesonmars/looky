"use client"

import { useState, useTransition } from "react"
import { RiDeleteBinLine, RiLoader4Line } from "react-icons/ri"

import { deleteWardrobeItemAction } from "@/app/actions/wardrobe"

export function WardrobeDeleteButton({ itemId }: { itemId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteWardrobeItemAction(itemId)
      if (result?.error) {
        setError(result.error)
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
          Удалить навсегда?
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "#ef4444", color: "#fff" }}
        >
          {isPending ? <RiLoader4Line className="h-4 w-4 animate-spin" /> : null}
          {isPending ? "Удаление…" : "Да, удалить"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setConfirming(false)}
          className="rounded-md border px-4 py-2 text-sm font-medium transition-[border-color,color] hover:border-[color-mix(in_oklab,var(--grid-foreground)_25%,var(--grid-border))]"
          style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
        >
          Отмена
        </button>
        {error ? (
          <p className="w-full text-xs font-geist-secondary" style={{ color: "#ef4444" }}>
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-[border-color,color] hover:border-red-400/60 hover:text-red-400"
      style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
    >
      <RiDeleteBinLine className="h-4 w-4" />
      Удалить
    </button>
  )
}
