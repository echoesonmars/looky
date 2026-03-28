const DEFAULT_LAT = 55.7558
const DEFAULT_LON = 37.6173

export type HomeWeatherResult = {
  ok: true
  tempC: number
  weatherCode: number
} | {
  ok: false
  tempC: null
  weatherCode: null
}

function parseCoord(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

export async function getHomeWeather(): Promise<HomeWeatherResult> {
  const lat = parseCoord(process.env.LOOKY_WEATHER_LAT, DEFAULT_LAT)
  const lon = parseCoord(process.env.LOOKY_WEATHER_LON, DEFAULT_LON)

  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", String(lat))
  url.searchParams.set("longitude", String(lon))
  url.searchParams.set("current", "temperature_2m,weather_code")
  url.searchParams.set("timezone", "auto")

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 },
    })
    if (!res.ok) {
      return { ok: false, tempC: null, weatherCode: null }
    }
    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number }
    }
    const t = data.current?.temperature_2m
    const c = data.current?.weather_code
    if (typeof t !== "number" || typeof c !== "number") {
      return { ok: false, tempC: null, weatherCode: null }
    }
    return { ok: true, tempC: t, weatherCode: c }
  } catch {
    return { ok: false, tempC: null, weatherCode: null }
  }
}
