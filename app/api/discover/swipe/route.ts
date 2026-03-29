import { Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { mapCatalogToWardrobeCategory } from "@/lib/catalog-to-wardrobe-category"
import { prisma } from "@/lib/prisma"

const MIN_TAG_WEIGHT = -10

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 })
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { catalogItemId?: unknown }).catalogItemId !== "string" ||
    typeof (body as { liked?: unknown }).liked !== "boolean"
  ) {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const { catalogItemId, liked } = body as { catalogItemId: string; liked: boolean }

  const existing = await prisma.discoverSwipe.findUnique({
    where: {
      userId_catalogItemId: { userId, catalogItemId },
    },
  })
  if (existing) {
    return Response.json({ ok: true as const, duplicate: true as const })
  }

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.catalogItem.findUnique({
        where: { id: catalogItemId },
        include: { tags: { include: { tag: true } } },
      })
      if (!item) {
        throw new Error("NOT_FOUND")
      }

      await tx.discoverSwipe.create({
        data: { userId, catalogItemId, liked },
      })

      const delta = liked ? 1 : -1
      for (const ct of item.tags) {
        const cur = await tx.userTagWeight.findUnique({
          where: { userId_tagId: { userId, tagId: ct.tagId } },
        })
        const next = Math.max(MIN_TAG_WEIGHT, (cur?.weight ?? 0) + delta)
        await tx.userTagWeight.upsert({
          where: { userId_tagId: { userId, tagId: ct.tagId } },
          create: { userId, tagId: ct.tagId, weight: next },
          update: { weight: next },
        })
      }

      if (liked) {
        const dup = await tx.wardrobeItem.findFirst({
          where: { userId, catalogItemId },
        })
        if (!dup) {
          const category = mapCatalogToWardrobeCategory(item.category, item.tags)
          const tags = item.tags.map((ct) => ct.tag.key)
          await tx.wardrobeItem.create({
            data: {
              userId,
              title: item.title,
              category,
              catalogItemId,
              imageUrl: item.imageUrl,
              tags,
              source: "discover",
            },
          })
        }
      }
    })
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return Response.json({ error: "not_found" }, { status: 404 })
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return Response.json({ ok: true as const, duplicate: true as const })
    }
    throw e
  }

  return Response.json({ ok: true as const, duplicate: false as const })
}
