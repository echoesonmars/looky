"use client"

import { useCallback, useEffect, useState } from "react"

import { HomeActionQueue } from "./HomeActionQueue"
import { HomeDayContext } from "./HomeDayContext"
import { HomeWearGrid } from "./HomeWearGrid"

import type { HomeWeatherResult } from "@/lib/weather"

type WearRecent = { id: string; title: string; category: string }

type ApiPayload = HomeWeatherResult & { source?: string }

function normalizeWeather(p: ApiPayload): HomeWeatherResult {
  if (p.ok) {
    return { ok: true, tempC: p.tempC, weatherCode: p.weatherCode }
  }
  return { ok: false, tempC: null, weatherCode: null }
}

async function fetchWeatherByCoords(lat: number, lon: number): Promise<HomeWeatherResult> {
  const r = await fetch(`/api/weather?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`)
  const j = (await r.json()) as ApiPayload
  return normalizeWeather(j)
}

export function HomeWeatherWithGeo({
  recent,
  wardrobeCount,
  loggedIn,
}: {
  recent: WearRecent[]
  wardrobeCount: number
  loggedIn: boolean
}) {
  const [weather, setWeather] = useState<HomeWeatherResult | null>(null)
  const [locationHint, setLocationHint] = useState<string | null>(null)
  const [geoDenied, setGeoDenied] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)

  const requestGeolocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationHint("Геолокация в браузере недоступна — используется запасной город (см. LOOKY_WEATHER_LAT / LON).")
      setGeoDenied(true)
      return
    }
    setGeoLoading(true)
    setLocationHint("Запрос доступа к местоположению…")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void (async () => {
          try {
            const w = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
            setWeather(w)
            setLocationHint("Прогноз по вашему местоположению.")
            setGeoDenied(false)
          } catch {
            setLocationHint((prev) => prev ?? "Не удалось обновить погоду по координатам.")
          } finally {
            setGeoLoading(false)
          }
        })()
      },
      () => {
        setGeoLoading(false)
        setGeoDenied(true)
        setLocationHint(
          "Геолокация отклонена — показан запасной прогноз. Разрешите доступ в настройках сайта или задайте LOOKY_WEATHER_LAT / LON в .env.local.",
        )
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 15_000 },
    )
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const r = await fetch("/api/weather")
        const j = (await r.json()) as ApiPayload
        if (cancelled) return
        setWeather(normalizeWeather(j))
        setLocationHint("Уточняем по геолокации…")
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              void (async () => {
                try {
                  const w = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
                  if (cancelled) return
                  setWeather(w)
                  setLocationHint("Прогноз по вашему местоположению.")
                  setGeoDenied(false)
                } catch {
                  if (!cancelled) {
                    setLocationHint((prev) => prev ?? "Не удалось обновить погоду по координатам.")
                  }
                }
              })()
            },
            () => {
              if (cancelled) return
              setGeoDenied(true)
              setLocationHint(
                "Геолокация отклонена — показан запасной прогноз. Разрешите доступ в настройках сайта или задайте LOOKY_WEATHER_LAT / LON в .env.local.",
              )
            },
            { enableHighAccuracy: false, maximumAge: 300_000, timeout: 15_000 },
          )
        } else {
          setLocationHint("Геолокация недоступна — показан запасной прогноз.")
          setGeoDenied(true)
        }
      } catch {
        if (!cancelled) {
          setWeather({ ok: false, tempC: null, weatherCode: null })
          setLocationHint("Не удалось загрузить погоду.")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const code = weather?.ok ? weather.weatherCode : null
  const temp = weather?.ok ? weather.tempC : null
  const displayWeather: HomeWeatherResult = weather ?? { ok: false, tempC: null, weatherCode: null }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <HomeDayContext weather={displayWeather} locationHint={locationHint} />
        {geoDenied ? (
          <button
            type="button"
            onClick={() => requestGeolocation()}
            disabled={geoLoading}
            className="min-h-11 rounded-full border px-4 text-sm font-geist-secondary transition-opacity disabled:opacity-50"
            style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
          >
            {geoLoading ? "Запрос…" : "Снова запросить геолокацию"}
          </button>
        ) : null}
      </div>
      <HomeWearGrid recent={recent} weatherCode={code} tempC={temp} loggedIn={loggedIn} />
      <HomeActionQueue wardrobeCount={wardrobeCount} weatherCode={code} loggedIn={loggedIn} />
    </div>
  )
}
