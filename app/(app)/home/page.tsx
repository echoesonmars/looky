import type { Metadata } from "next"

import { auth } from "@/auth"
import { HomeBento } from "@/components/app/home/HomeBento"
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

  return <HomeBento summary={summary} loggedIn={loggedIn} />
}
