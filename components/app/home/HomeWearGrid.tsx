"use client"

import Link from "next/link"
import { RiArrowRightUpLine, RiShirtFill } from "react-icons/ri"

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
    <div className="relative z-10 flex h-full min-h-0 flex-col p-6 sm:p-7 lg:p-8">
      <div className="mb-5 flex items-center gap-4">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl border sm:size-16"
          style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 92%, var(--accent-orange))" }}
        >
          <RiShirtFill className="size-8 sm:size-9" style={{ color: "var(--accent-orange)" }} aria-hidden />
        </div>
        <span className="text-lg font-semibold sm:text-xl lg:text-2xl" style={{ color: "var(--grid-foreground)" }}>
          Образ
        </span>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4 lg:gap-5">
        {slots.map((slot, idx) =>
          slot.kind === "item" && slot.item ? (
            <Link
              key={slot.item.id}
              href={`/wardrobe/${slot.item.id}`}
              className="group/wear flex min-h-[9rem] flex-col justify-between rounded-xl border p-5 transition-[border-color,background-color,box-shadow] hover:border-[color-mix(in_oklab,var(--accent-orange)_30%,var(--grid-border))] hover:bg-[color-mix(in_oklab,var(--grid-cell-bg)_92%,var(--accent-orange))] hover:shadow-[0_2px_12px_color-mix(in_oklab,var(--accent-orange)_8%,transparent)] sm:min-h-[10rem] sm:p-6 lg:min-h-[11rem]"
              style={{
                borderColor: "var(--grid-border)",
                background: "color-mix(in oklab, var(--grid-cell-bg) 96%, transparent)",
              }}
            >
              <div>
                <span className="text-[11px] font-geist-secondary uppercase tracking-[0.14em] sm:text-xs" style={{ color: "var(--accent-orange)" }}>
                  {wardrobeCategoryLabel(slot.item.category)}
                </span>
                <p className="mt-1.5 text-lg font-semibold leading-snug sm:text-xl" style={{ color: "var(--grid-foreground)" }}>
                  {slot.item.title}
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-0.5 text-sm font-medium opacity-80 transition-[gap,opacity,transform] group-hover/wear:gap-1 group-hover/wear:opacity-100" style={{ color: "var(--grid-muted)" }}>
                Открыть
                <RiArrowRightUpLine className="size-4 transition-transform duration-200 group-hover/wear:translate-x-0.5 group-hover/wear:-translate-y-0.5 sm:size-5" aria-hidden />
              </span>
            </Link>
          ) : (
            <div
              key={`ph-${idx}`}
              className="flex min-h-[9rem] flex-col justify-between rounded-xl border border-dashed p-5 sm:min-h-[10rem] sm:p-6 lg:min-h-[11rem]"
              style={{
                borderColor: "var(--grid-border)",
                background: "color-mix(in oklab, var(--grid-cell-bg) 88%, transparent)",
              }}
            >
              <div>
                <p className="text-lg font-semibold sm:text-xl" style={{ color: "var(--grid-foreground)" }}>
                  {slot.placeholder?.title}
                </p>
                <p className="mt-2 text-sm font-geist-secondary leading-snug sm:text-base" style={{ color: "var(--grid-muted)" }}>
                  {slot.placeholder?.hint}
                </p>
              </div>
              {loggedIn ? (
                <Link
                  href="/wardrobe/add"
                  className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-[box-shadow,transform] hover:shadow-[0_2px_10px_color-mix(in_oklab,var(--grid-foreground)_15%,transparent)] active:scale-[0.98] sm:text-base"
                  style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
                >
                  В гардероб
                </Link>
              ) : (
                <Link
                  href="/login?callbackUrl=/home"
                  className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-[border-color,background-color,box-shadow] hover:border-[color-mix(in_oklab,var(--accent-orange)_25%,var(--grid-border))] hover:bg-[color-mix(in_oklab,var(--grid-cell-bg)_75%,transparent)] hover:shadow-sm active:scale-[0.98] sm:text-base"
                  style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
                >
                  Вход
                </Link>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
