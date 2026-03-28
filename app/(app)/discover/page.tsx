import type { Metadata } from "next"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"
import { SwipeSection } from "@/components/landing/SwipeSection"

export const metadata: Metadata = {
  title: "Лента",
}

export default function DiscoverPage() {
  return (
    <>
      <AppPageHeader
        title="Лента"
        description="Свайпайте вещи — так формируется ваш вкус. Поиск по фото скоро."
      />
      <div className="mb-4">
        <Button type="button" disabled className="min-h-11" variant="outline" style={{ borderColor: "var(--grid-border)" }}>
          Найти похожее по фото — скоро
        </Button>
      </div>
      <div className="min-h-[70dvh] max-h-[75dvh] md:max-h-[min(75dvh,720px)] -mx-4 md:mx-0 rounded-xl border overflow-hidden" style={{ borderColor: "var(--grid-border)" }}>
        <SwipeSection />
      </div>
    </>
  )
}
