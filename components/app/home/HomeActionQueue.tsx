"use client"

import type { ElementType } from "react"
import Link from "next/link"
import {
  RiApps2Line,
  RiCameraLensLine,
  RiQuillPenLine,
  RiShoppingBag3Line,
  RiUmbrellaLine,
} from "react-icons/ri"

import { weatherSuggestsOuterLayer } from "@/lib/home-weather-tip"

type ActionItem = { href: string; label: string; Icon: ElementType; key: string }

export function HomeActionQueue({
  wardrobeCount,
  weatherCode,
  loggedIn,
}: {
  wardrobeCount: number
  weatherCode: number | null
  loggedIn: boolean
}) {
  const items: ActionItem[] = []

  if (loggedIn && wardrobeCount === 0) {
    items.push({ key: "first", href: "/wardrobe/add", label: "Первая вещь", Icon: RiShoppingBag3Line })
  }

  if (weatherSuggestsOuterLayer(weatherCode)) {
    items.push({ key: "outer", href: "/wardrobe/add", label: "Верх", Icon: RiUmbrellaLine })
  }

  items.push(
    { key: "tryon", href: "/try-on", label: "Примерка", Icon: RiCameraLensLine },
    { key: "stylist", href: "/stylist", label: "Стилист", Icon: RiQuillPenLine },
    { key: "discover", href: "/discover", label: "Лента", Icon: RiApps2Line },
  )

  return (
    <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-7 lg:p-8">
      <div className="grid w-full grid-cols-2 justify-items-stretch gap-3 sm:gap-4 lg:gap-4">
        {items.map((row) => (
          <Link
            key={row.key}
            href={row.href}
            className="group/action flex aspect-[5/4] min-h-[5.25rem] w-full flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center transition-[border-color,background-color,box-shadow,transform] hover:border-[color-mix(in_oklab,var(--accent-orange)_40%,var(--grid-border))] hover:bg-[color-mix(in_oklab,var(--grid-cell-bg)_88%,var(--accent-orange))] hover:shadow-[0_2px_12px_color-mix(in_oklab,var(--accent-orange)_12%,transparent)] active:scale-[0.98] sm:min-h-24 sm:py-4 lg:min-h-[6.5rem] lg:py-5"
            style={{
              borderColor: "var(--grid-border)",
              background: "color-mix(in oklab, var(--grid-cell-bg) 94%, transparent)",
            }}
          >
            <row.Icon
              className="size-8 shrink-0 transition-transform duration-200 group-hover/action:scale-110 sm:size-10 lg:size-11"
              style={{ color: "var(--accent-orange)" }}
              aria-hidden
            />
            <span className="text-sm font-medium leading-tight sm:text-base" style={{ color: "var(--grid-foreground)" }}>
              {row.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
