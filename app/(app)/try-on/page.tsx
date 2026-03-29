import type { Metadata } from "next"

import { auth } from "@/auth"
import { AppPageHeader } from "@/components/app/AppPageHeader"
import { TryOnCanvas } from "@/components/app/try-on/TryOnCanvas"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Примерка",
}

export default async function TryOnPage() {
  const session = await auth()

  const wardrobeItems = session?.user?.id
    ? await prisma.wardrobeItem.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 40,
        select: { id: true, title: true, category: true, imageUrl: true },
      })
    : []

  return (
    <>
      <AppPageHeader
        title="Примерка"
        description="Загрузите фото, AI определит вашу позу и наложит одежду из гардероба."
      />
      <TryOnCanvas wardrobeItems={wardrobeItems} />
    </>
  )
}
