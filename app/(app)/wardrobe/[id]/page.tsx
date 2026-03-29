import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"
import { formatRelativeRuPast } from "@/lib/format-relative-ru"
import { getWardrobeItem, WARDROBE_DB_UNAVAILABLE_RU } from "@/lib/wardrobe-queries"
import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"
import { WardrobeImageLightbox } from "@/components/wardrobe/WardrobeImageLightbox"
import { WardrobeItemImage } from "@/components/wardrobe/WardrobeItemImage"
import { WardrobeDeleteButton } from "@/components/wardrobe/WardrobeDeleteButton"

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
      <AppPageHeader
        title={item.title}
        description={`${wardrobeCategoryLabel(item.category)} · ${formatRelativeRuPast(item.createdAt)}`}
      />
      {item.source === "ai_photo" ? (
        <p className="mb-3 text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
          Заполнено по фото
        </p>
      ) : null}
      {item.imageUrl ? (
        <WardrobeImageLightbox src={item.imageUrl} alt={item.title} />
      ) : (
        <div className="mb-6">
          <WardrobeItemImage imageUrl={null} title={item.title} variant="hero" />
        </div>
      )}
      {item.tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="border px-2 py-1 text-xs font-geist-secondary"
              style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
          <Link href="/wardrobe">← К гардеробу</Link>
        </Button>
        <WardrobeDeleteButton itemId={item.id} />
      </div>
    </>
  )
}
