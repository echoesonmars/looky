"use client"

import Link from "next/link"

import { wearPlaceholderHints } from "@/lib/home-weather-tip"
import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"

type Recent = { id: string; title: string; category: string }

export function HomeWearGrid({
  recent,
  weatherCode,
  tempC,
  loggedIn,
}: {
  recent: Recent[]
  weatherCode: number | null
  tempC: number | null
  loggedIn: boolean
}) {
  const placeholders = wearPlaceholderHints(weatherCode, tempC)
  const slots: { kind: "item" | "placeholder"; item?: Recent; placeholder?: { title: string; hint: string } }[] = []

  for (let i = 0; i < 3; i++) {
    const r = recent[i]
    if (r) {
      slots.push({ kind: "item", item: r })
    } else {
      const ph = placeholders[i % placeholders.length]
      slots.push({ kind: "placeholder", placeholder: ph })
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="home-wear-heading">
      <h2 id="home-wear-heading" className="text-xs font-geist-secondary uppercase tracking-[0.2em]" style={{ color: "var(--grid-muted)" }}>
        Что надеть
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot, idx) =>
          slot.kind === "item" && slot.item ? (
            <Link
              key={slot.item.id}
              href={`/wardrobe/${slot.item.id}`}
              className="group flex min-h-[140px] flex-col justify-between rounded-2xl border p-5 transition-opacity hover:opacity-95"
              style={{
                borderColor: "var(--grid-border)",
                background: "color-mix(in oklab, var(--grid-cell-bg) 96%, transparent)",
              }}
            >
              <div>
                <span
                  className="text-[10px] font-geist-secondary uppercase tracking-[0.18em]"
                  style={{ color: "var(--accent-orange)" }}
                >
                  {wardrobeCategoryLabel(slot.item.category)}
                </span>
                <p className="mt-2 text-lg font-semibold leading-snug tracking-tight" style={{ color: "var(--grid-foreground)" }}>
                  {slot.item.title}
                </p>
              </div>
              <span className="mt-4 text-xs font-geist-secondary group-hover:underline" style={{ color: "var(--grid-muted)" }}>
                Открыть вещь →
              </span>
            </Link>
          ) : (
            <div
              key={`ph-${idx}`}
              className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-dashed p-5"
              style={{
                borderColor: "var(--grid-border)",
                background: "color-mix(in oklab, var(--grid-cell-bg) 88%, transparent)",
              }}
            >
              <div>
                <p className="text-lg font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
                  {slot.placeholder?.title}
                </p>
                <p className="mt-2 text-sm font-geist-secondary leading-relaxed" style={{ color: "var(--grid-muted)" }}>
                  {slot.placeholder?.hint}
                </p>
              </div>
              {loggedIn ? (
                <Link
                  href="/wardrobe/add"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
                >
                  Добавить вещь
                </Link>
              ) : (
                <Link
                  href="/login?callbackUrl=/home"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium"
                  style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
                >
                  Войти и собрать гардероб
                </Link>
              )}
            </div>
          ),
        )}
      </div>
    </section>
  )
}
