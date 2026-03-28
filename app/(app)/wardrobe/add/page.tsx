import type { Metadata } from "next"
import Link from "next/link"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Добавить вещь",
}

export default function WardrobeAddPage() {
  return (
    <>
      <AppPageHeader
        title="Добавить вещь"
        description="Загрузка с камеры или галереи и подсказки по категории — скоро."
      />
      <Button asChild variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/wardrobe">← Назад в гардероб</Link>
      </Button>
    </>
  )
}
