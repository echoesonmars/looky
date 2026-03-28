import type { Metadata } from "next"

import { auth } from "@/auth"
import { HomeActionQueue } from "@/components/app/home/HomeActionQueue"
import { HomeDayContext } from "@/components/app/home/HomeDayContext"
import { HomeGreeting } from "@/components/app/home/HomeGreeting"
import { HomeWardrobeStatus } from "@/components/app/home/HomeWardrobeStatus"
import { HomeWearGrid } from "@/components/app/home/HomeWearGrid"
import type { WardrobeSummary } from "@/lib/wardrobe-queries"
import { getWardrobeSummary } from "@/lib/wardrobe-queries"
import { getHomeWeather } from "@/lib/weather"

const emptyWardrobeSummary: WardrobeSummary = { count: 0, lastAddedAt: null, recent: [], loadError: null }

export const metadata: Metadata = {
  title: "Главная",
}

export const dynamic = "force-dynamic"

export default async function HomeAppPage() {
  const session = await auth()
  const userId = session?.user?.id

  const [weather, summary] = await Promise.all([
    getHomeWeather(),
    userId ? getWardrobeSummary(userId) : Promise.resolve(emptyWardrobeSummary),
  ])

  const code = weather.ok ? weather.weatherCode : null
  const temp = weather.ok ? weather.tempC : null
  const loggedIn = Boolean(userId)

  return (
    <div className="space-y-8 sm:space-y-10">
      <HomeGreeting />
      <HomeDayContext weather={weather} />
      <HomeWearGrid recent={summary.recent} weatherCode={code} tempC={temp} loggedIn={loggedIn} />
      <HomeWardrobeStatus
        count={summary.count}
        lastAddedAt={summary.lastAddedAt}
        loggedIn={loggedIn}
        loadError={summary.loadError}
      />
      <HomeActionQueue wardrobeCount={summary.count} weatherCode={code} loggedIn={loggedIn} />
    </div>
  )
}
