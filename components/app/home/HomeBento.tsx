"use client"

import dynamic from "next/dynamic"

import { HomeActionQueue } from "./HomeActionQueue"
import { HomeDayContext } from "./HomeDayContext"
import { HomeGreeting } from "./HomeGreeting"
import { HomeWardrobeStatus } from "./HomeWardrobeStatus"
import { HomeWearGrid } from "./HomeWearGrid"
import { useHomeWeather } from "./use-home-weather"

import { BentoGrid, BentoTile } from "@/components/ui/bento-grid"
import type { WardrobeSummary } from "@/lib/wardrobe-queries"

const HomeWeatherMap = dynamic(() => import("./HomeWeatherMap").then((m) => m.HomeWeatherMap), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 animate-pulse bg-[color-mix(in_oklab,var(--accent-orange)_12%,var(--grid-cell-bg))]" aria-hidden />,
})

export function HomeBento({ summary, loggedIn }: { summary: WardrobeSummary; loggedIn: boolean }) {
  const { weather, geoLoading, code, temp, showSkeleton, userLat, userLon } = useHomeWeather()
  const hasUserMap = userLat !== null && userLon !== null

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      <HomeGreeting />
      <BentoGrid>
        <BentoTile className="col-span-full min-h-[16rem] overflow-hidden xl:col-span-7 xl:row-span-2 xl:min-h-[26rem]">
          <div className="absolute inset-0 z-0">
            {hasUserMap ? (
              <HomeWeatherMap key={`${userLat}-${userLon}`} lat={userLat} lon={userLon} />
            ) : (
              <div
                className="h-full min-h-full w-full bg-gradient-to-br from-[color-mix(in_oklab,var(--accent-orange)_20%,var(--grid-cell-bg))] via-[var(--grid-cell-bg)] to-[color-mix(in_oklab,var(--accent-orange)_12%,var(--grid-cell-bg))]"
                aria-hidden
              />
            )}
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_75%_at_50%_48%,transparent_0%,transparent_42%,color-mix(in_oklab,var(--grid-cell-bg)_35%,transparent)_72%,color-mix(in_oklab,var(--grid-cell-bg)_92%,transparent)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 z-[1] bg-gradient-to-t from-[color-mix(in_oklab,var(--grid-cell-bg)_96%,transparent)] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex h-full min-h-[inherit] flex-1 flex-col justify-between p-6 sm:p-7 lg:p-8">
            {showSkeleton || !weather ? (
              <div className="flex flex-1 flex-col gap-5" aria-busy="true" aria-label="Загрузка">
                <div className="h-16 w-28 animate-pulse rounded-lg opacity-40" style={{ background: "var(--grid-border)" }} />
                <div className="h-5 w-48 max-w-full animate-pulse rounded opacity-30" style={{ background: "var(--grid-border)" }} />
                {geoLoading ? (
                  <div className="mt-auto h-1 max-w-28 overflow-hidden rounded-full opacity-40" style={{ background: "var(--grid-border)" }} aria-hidden />
                ) : null}
              </div>
            ) : (
              <>
                <HomeDayContext weather={weather} />
                {geoLoading ? (
                  <div className="mt-auto pt-5" aria-live="polite" aria-busy="true">
                    <div className="h-1 max-w-28 overflow-hidden rounded-full" style={{ background: "var(--grid-border)" }}>
                      <div
                        className="h-full w-1/3 animate-pulse rounded-full"
                        style={{ background: "var(--accent-orange)" }}
                      />
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </BentoTile>

        <BentoTile className="col-span-full min-h-[15rem] xl:col-span-5 xl:col-start-8 xl:row-start-1 xl:min-h-0">
          <HomeWardrobeStatus
            count={summary.count}
            lastAddedAt={summary.lastAddedAt}
            loggedIn={loggedIn}
            loadError={summary.loadError}
          />
        </BentoTile>

        <BentoTile className="col-span-full min-h-[14rem] xl:col-span-5 xl:col-start-8 xl:row-start-2 xl:min-h-0">
          <HomeActionQueue wardrobeCount={summary.count} weatherCode={code} loggedIn={loggedIn} />
        </BentoTile>

        <BentoTile className="col-span-full xl:col-span-12">
          <HomeWearGrid recent={summary.recent} weatherCode={code} tempC={temp} loggedIn={loggedIn} />
        </BentoTile>
      </BentoGrid>
    </div>
  )
}
