"use client"

import { useCallback, useState } from "react"

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

async function fetchWeatherDefault(): Promise<HomeWeatherResult> {
  const r = await fetch("/api/weather")
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
  /** null = пользователь ещё не выбрал источник (ни гео, ни запасной город) */
  const [weather, setWeather] = useState<HomeWeatherResult | null>(null)
  const [locationHint, setLocationHint] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [fallbackLoading, setFallbackLoading] = useState(false)
  /** true после отказа в гео — показываем запасной вариант */
  const [geoDenied, setGeoDenied] = useState(false)

  const loadByGeolocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoDenied(true)
      setLocationHint("В этом браузере геолокация недоступна. Используйте кнопку ниже — прогноз по городу из настроек.")
      return
    }
    setGeoLoading(true)
    setLocationHint("Откроется запрос браузера: разрешите доступ к местоположению — так мы подставим точные координаты в прогноз.")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void (async () => {
          try {
            const w = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
            setWeather(w)
            setLocationHint("Прогноз по координатам с вашего устройства.")
            setGeoDenied(false)
          } catch {
            setWeather({ ok: false, tempC: null, weatherCode: null })
            setLocationHint("Не удалось загрузить погоду по координатам. Попробуйте ещё раз или выберите город по умолчанию.")
          } finally {
            setGeoLoading(false)
          }
        })()
      },
      () => {
        setGeoLoading(false)
        setGeoDenied(true)
        setLocationHint(
          "Доступ к геолокации не дан. Нажмите «Запросить снова» или «Без геолокации» — тогда возьмём город из LOOKY_WEATHER_LAT / LON (или Москва).",
        )
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 20_000 },
    )
  }, [])

  const loadFallbackCity = useCallback(() => {
    setFallbackLoading(true)
    setLocationHint("Загружаем прогноз по запасному городу…")
    void (async () => {
      try {
        const w = await fetchWeatherDefault()
        setWeather(w)
        setLocationHint("Прогноз по запасным координатам (.env: LOOKY_WEATHER_LAT / LON или Москва).")
        setGeoDenied(false)
      } catch {
        setWeather({ ok: false, tempC: null, weatherCode: null })
        setLocationHint("Не удалось получить прогноз. Проверьте сеть.")
      } finally {
        setFallbackLoading(false)
      }
    })()
  }, [])

  const code = weather?.ok ? weather.weatherCode : null
  const temp = weather?.ok ? weather.tempC : null
  const showWeatherCard = weather !== null

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="space-y-4">
        {!showWeatherCard ? (
          <section className="space-y-3" aria-labelledby="home-geo-prompt-heading">
            <h2 id="home-geo-prompt-heading" className="text-xs font-geist-secondary uppercase tracking-[0.2em]" style={{ color: "var(--grid-muted)" }}>
              Контекст дня
            </h2>
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                borderColor: "var(--grid-border)",
                background: "color-mix(in oklab, var(--grid-cell-bg) 94%, transparent)",
              }}
            >
              <p className="text-base font-geist-secondary leading-relaxed sm:text-lg" style={{ color: "var(--grid-foreground)" }}>
                Чтобы показать погоду <strong className="font-semibold">рядом с вами</strong>, нужен доступ к геолокации. Нажмите кнопку — браузер спросит разрешение, координаты уйдут только в запрос прогноза (Open-Meteo), без отдельного ключа API.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => loadByGeolocation()}
                  disabled={geoLoading || fallbackLoading}
                  className="min-h-11 rounded-full px-6 text-sm font-medium transition-opacity disabled:opacity-50"
                  style={{ background: "var(--accent-orange)", color: "#fff" }}
                >
                  {geoLoading ? "Ждём ответ браузера…" : "Разрешить геолокацию и показать погоду"}
                </button>
                <button
                  type="button"
                  onClick={() => loadFallbackCity()}
                  disabled={geoLoading || fallbackLoading}
                  className="min-h-11 rounded-full border px-6 text-sm font-geist-secondary transition-opacity disabled:opacity-50"
                  style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
                >
                  {fallbackLoading ? "Загрузка…" : "Без геолокации — город по умолчанию"}
                </button>
              </div>
              {locationHint ? (
                <p className="mt-4 text-xs font-geist-secondary leading-relaxed" style={{ color: "var(--grid-muted)" }}>
                  {locationHint}
                </p>
              ) : null}
            </div>
          </section>
        ) : (
          <>
            <HomeDayContext weather={weather} locationHint={locationHint} />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadByGeolocation()}
                disabled={geoLoading || fallbackLoading}
                className="min-h-11 rounded-full border px-4 text-sm font-geist-secondary transition-opacity disabled:opacity-50"
                style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
              >
                {geoLoading ? "Запрос геолокации…" : "Обновить по геолокации"}
              </button>
              <button
                type="button"
                onClick={() => loadFallbackCity()}
                disabled={geoLoading || fallbackLoading}
                className="min-h-11 rounded-full border px-4 text-sm font-geist-secondary transition-opacity disabled:opacity-50"
                style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
              >
                {fallbackLoading ? "…" : "Переключить на город по умолчанию"}
              </button>
            </div>
            {geoDenied ? (
              <p className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                Геолокация отклонена — можно снова нажать «Обновить по геолокации» или выбрать город по умолчанию.
              </p>
            ) : null}
          </>
        )}
      </div>
      <HomeWearGrid recent={recent} weatherCode={code} tempC={temp} loggedIn={loggedIn} />
      <HomeActionQueue wardrobeCount={wardrobeCount} weatherCode={code} loggedIn={loggedIn} />
    </div>
  )
}
