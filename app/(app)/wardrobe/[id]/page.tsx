import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"
import { formatRelativeRuPast } from "@/lib/format-relative-ru"
import { getWardrobeItem, WARDROBE_DB_UNAVAILABLE_RU } from "@/lib/wardrobe-queries"
import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Вещь" }
}

export default async function WardrobeItemPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/wardrobe")
  }

  const result = await getWardrobeItem(session.user.id, id)
  if (!result.ok) {
    return (
      <>
        <AppPageHeader title="Гардероб" description="Не удалось загрузить данные." />
        <p
          className="mb-6 max-w-xl rounded-xl border p-5 text-sm font-geist-secondary leading-relaxed"
          style={{
            borderColor: "color-mix(in oklab, var(--accent-orange) 35%, var(--grid-border))",
            background: "color-mix(in oklab, var(--accent-orange) 8%, var(--grid-cell-bg))",
            color: "var(--grid-foreground)",
          }}
        >
          {WARDROBE_DB_UNAVAILABLE_RU}
        </p>
        <Button asChild variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
          <Link href="/wardrobe">← К гардеробу</Link>
        </Button>
      </>
    )
  }

  const item = result.item
  if (!item) {
    notFound()
  }

  return (
    <>
      <AppPageHeader title={item.title} description={`${wardrobeCategoryLabel(item.category)} · добавлено ${formatRelativeRuPast(item.createdAt)}`} />
      <p className="mb-6 text-sm font-geist-secondary leading-relaxed" style={{ color: "var(--grid-muted)" }}>
        Карточка вещи: фото, состав и учёт носки — в следующих версиях.
      </p>
      <Button asChild variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/wardrobe">← К гардеробу</Link>
      </Button>
    </>
  )
}
