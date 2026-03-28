import type { Metadata } from "next"

import { auth } from "@/auth"
import { HomeGreeting } from "@/components/app/home/HomeGreeting"
import { HomeWardrobeStatus } from "@/components/app/home/HomeWardrobeStatus"
import { HomeWeatherWithGeo } from "@/components/app/home/HomeWeatherWithGeo"
import type { WardrobeSummary } from "@/lib/wardrobe-queries"
import { getWardrobeSummary } from "@/lib/wardrobe-queries"

const emptyWardrobeSummary: WardrobeSummary = { count: 0, lastAddedAt: null, recent: [], loadError: null }

export const metadata: Metadata = {
  title: "Главная",
}

export const dynamic = "force-dynamic"

export default async function HomeAppPage() {
  const session = await auth()
  const userId = session?.user?.id

  const summary = userId ? await getWardrobeSummary(userId) : emptyWardrobeSummary
  const loggedIn = Boolean(userId)

  return (
    <div className="space-y-8 sm:space-y-10">
      <HomeGreeting />
      <HomeWeatherWithGeo recent={summary.recent} wardrobeCount={summary.count} loggedIn={loggedIn} />
      <HomeWardrobeStatus
        count={summary.count}
        lastAddedAt={summary.lastAddedAt}
        loggedIn={loggedIn}
        loadError={summary.loadError}
      />
    </div>
  )
}
