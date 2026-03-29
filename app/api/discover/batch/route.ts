import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const BATCH_SIZE = 10
const MAX_EXCLUDE = 80

function parseExcludeIds(searchParams: URLSearchParams): string[] {
  const raw = searchParams.get("exclude")
  if (!raw) return []
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_EXCLUDE)
}

export async function GET(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const excludeIds = parseExcludeIds(new URL(req.url).searchParams)

  const swiped = await prisma.discoverSwipe.findMany({
    where: { userId },
    select: { catalogItemId: true },
  })
  const swipedSet = new Set(swiped.map((s) => s.catalogItemId))
  for (const id of excludeIds) {
    swipedSet.add(id)
  }
  const notInIds = [...swipedSet]

  const weights = await prisma.userTagWeight.findMany({
    where: { userId },
    select: { tagId: true, weight: true },
  })
  const weightByTag = new Map(weights.map((w) => [w.tagId, w.weight]))

  const candidates = await prisma.catalogItem.findMany({
    where: {
      isActive: true,
      ...(notInIds.length > 0 ? { id: { notIn: notInIds } } : {}),
    },
    include: {
      tags: { include: { tag: true } },
    },
  })

  const scored = candidates.map((item) => {
    const score = item.tags.reduce((acc, ct) => acc + (weightByTag.get(ct.tagId) ?? 0), 0)
    return { item, score, tie: Math.random() }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.tie - a.tie
  })

  const slice = scored.slice(0, BATCH_SIZE).map(({ item }) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    category: item.category,
    tags: item.tags.map((ct) => ct.tag.key),
  }))

  return Response.json({ items: slice })
}
