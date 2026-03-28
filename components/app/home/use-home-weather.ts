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

function requestGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("no_geolocation"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 60_000,
      timeout: 20_000,
    })
  })
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

  const tryGeolocation = useCallback(async () => {
    try {
      setGeoLoading(true)
      const pos = await requestGeolocation()
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setUserLat(lat)
      setUserLon(lon)
      try {
        const w = await fetchWeatherByCoords(lat, lon)
        setWeather(w)
      } catch {
        /* оставляем текущий прогноз */
      }
    } catch {
      /* тихий фолбэк — уже есть default */
    } finally {
      setGeoLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDefault()
    void tryGeolocation()
  }, [loadDefault, tryGeolocation])

  const code = weather?.ok ? weather.weatherCode : null
  const temp = weather?.ok ? weather.tempC : null
  const showSkeleton = weather === null

  return { weather, geoLoading, code, temp, showSkeleton, userLat, userLon }
}
