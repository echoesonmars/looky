"use client"

import { clothingTipShort, weatherConditionLabel } from "@/lib/home-weather-tip"
import type { HomeWeatherResult } from "@/lib/weather"

export function HomeDayContext({ weather }: { weather: HomeWeatherResult }) {
  const code = weather.ok ? weather.weatherCode : null
  const temp = weather.ok ? weather.tempC : null
  const label = weatherConditionLabel(code)
  const tip = clothingTipShort(code, temp)

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {temp !== null ? (
          <span className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "var(--grid-foreground)" }}>
            {Math.round(temp)}°
          </span>
        ) : (
          <span className="text-xl font-medium sm:text-2xl" style={{ color: "var(--grid-muted)" }}>
            —
          </span>
        )}
        <span className="text-base font-geist-secondary sm:text-lg lg:text-xl" style={{ color: "var(--grid-muted)" }}>
          {label}
        </span>
      </div>
      <p className="max-w-2xl text-base font-geist-secondary leading-relaxed sm:text-lg lg:text-xl lg:leading-relaxed" style={{ color: "var(--grid-foreground)" }}>
        {tip}
      </p>
    </div>
  )
}
