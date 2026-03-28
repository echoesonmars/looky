"use client"

import { useCallback, useEffect, useState } from "react"

import type { HomeWeatherResult } from "@/lib/weather"

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

export function useHomeWeather() {
  const [weather, setWeather] = useState<HomeWeatherResult | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLon, setUserLon] = useState<number | null>(null)

  const loadDefault = useCallback(async () => {
    try {
      const w = await fetchWeatherDefault()
      setWeather(w)
    } catch {
      setWeather({ ok: false, tempC: null, weatherCode: null })
    }
  }, [])

  useEffect(() => {
    void loadDefault()
  }, [loadDefault])

  const loadByGeolocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setUserLat(lat)
        setUserLon(lon)
        void (async () => {
          try {
            const w = await fetchWeatherByCoords(lat, lon)
            setWeather(w)
          } catch {
            /* keep current */
          } finally {
            setGeoLoading(false)
          }
        })()
      },
      () => {
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 20_000 },
    )
  }, [])

  const code = weather?.ok ? weather.weatherCode : null
  const temp = weather?.ok ? weather.tempC : null
  const showSkeleton = weather === null

  return { weather, geoLoading, loadByGeolocation, code, temp, showSkeleton, userLat, userLon }
}
