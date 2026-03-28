import type { Metadata } from "next"
import Link from "next/link"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Главная",
}

export default function HomeAppPage() {
  return (
    <>
      <AppPageHeader
        title="Главная"
        description="Быстрые действия и скоро — персональный дайджест гардероба."
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Button asChild className="h-12 min-h-11 justify-center" style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}>
          <Link href="/try-on">Примерка</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 min-h-11 justify-center border" style={{ borderColor: "var(--grid-border)" }}>
          <Link href="/stylist">Стилист</Link>
        </Button>
      </div>
      <p className="mt-8 text-sm font-geist-secondary border-t pt-6" style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}>
        Сводки и подсказки по гардеробу появятся здесь.
      </p>
    </>
  )
}
