import { clothingTipFromWeather, weatherConditionLabel } from "@/lib/home-weather-tip"
import type { HomeWeatherResult } from "@/lib/weather"

export function HomeDayContext({ weather }: { weather: HomeWeatherResult }) {
  const code = weather.ok ? weather.weatherCode : null
  const temp = weather.ok ? weather.tempC : null
  const label = weatherConditionLabel(code)
  const tip = clothingTipFromWeather(code, temp)

  return (
    <section className="space-y-3" aria-labelledby="home-day-heading">
      <h2 id="home-day-heading" className="text-xs font-geist-secondary uppercase tracking-[0.2em]" style={{ color: "var(--grid-muted)" }}>
        Контекст дня
      </h2>
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: "var(--grid-border)",
          background: "color-mix(in oklab, var(--grid-cell-bg) 94%, transparent)",
        }}
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {temp !== null ? (
            <span className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl" style={{ color: "var(--grid-foreground)" }}>
              {Math.round(temp)}°
            </span>
          ) : (
            <span className="text-lg font-medium" style={{ color: "var(--grid-muted)" }}>
              —
            </span>
          )}
          <span className="text-sm font-geist-secondary sm:text-base" style={{ color: "var(--grid-muted)" }}>
            {label}
          </span>
        </div>
        <p className="mt-5 max-w-2xl text-sm font-geist-secondary leading-relaxed sm:text-base" style={{ color: "var(--grid-foreground)" }}>
          {tip}
        </p>
      </div>
    </section>
  )
}
