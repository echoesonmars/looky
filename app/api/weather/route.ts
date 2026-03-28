import { NextRequest } from "next/server"

import { fetchOpenMeteoCurrent, getHomeWeather } from "@/lib/weather"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams
  const latRaw = qs.get("lat")
  const lonRaw = qs.get("lon")

  if (latRaw !== null && lonRaw !== null && latRaw !== "" && lonRaw !== "") {
    const lat = Number.parseFloat(latRaw)
    const lon = Number.parseFloat(lonRaw)
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return Response.json({ error: "invalid_coordinates" }, { status: 400 })
    }
    const result = await fetchOpenMeteoCurrent(lat, lon)
    return Response.json({ ...result, source: "coords" as const })
  }

  const result = await getHomeWeather()
  return Response.json({ ...result, source: "default" as const })
}
