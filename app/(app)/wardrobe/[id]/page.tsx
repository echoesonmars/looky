import type { Metadata } from "next"
import Link from "next/link"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Вещь ${id}` }
}

export default async function WardrobeItemPage({ params }: Props) {
  const { id } = await params

  return (
    <>
      <AppPageHeader
        title={`Вещь · ${id}`}
        description="Карточка вещи: состав, теги и учёт носки — в следующих версиях."
      />
      <Button asChild variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/wardrobe">← К гардеробу</Link>
      </Button>
    </>
  )
}
