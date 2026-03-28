import type { Metadata } from "next"
import Link from "next/link"

import { WardrobeAddForm } from "@/components/wardrobe/WardrobeAddForm"
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
        description="Краткое название и категория — дальше появятся фото и теги."
      />
      <WardrobeAddForm />
      <Button asChild variant="outline" className="mt-8 min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/wardrobe">← Назад в гардероб</Link>
      </Button>
    </>
  )
}
