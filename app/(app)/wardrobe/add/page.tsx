import type { Metadata } from "next"
import Link from "next/link"

import { WardrobeAddForm } from "@/components/wardrobe/WardrobeAddForm"
import { WardrobePhotoAnalyzeFlow } from "@/components/wardrobe/WardrobePhotoAnalyzeFlow"
import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Добавить вещь",
}

export default function WardrobeAddPage() {
  return (
    <>
      <AppPageHeader title="Добавить вещь" />
      <WardrobePhotoAnalyzeFlow />
      <div
        className="my-10 border-t pt-10 font-geist-secondary text-xs uppercase tracking-widest"
        style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
      >
        Вручную
      </div>
      <WardrobeAddForm />
      <Button asChild variant="outline" className="mt-8 min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/wardrobe">← Назад в гардероб</Link>
      </Button>
    </>
  )
}
