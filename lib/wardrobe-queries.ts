import { prisma } from "@/lib/prisma"
import { isPrismaConnectionError } from "@/lib/prisma-db-error"

export type WardrobeItemRow = {
  id: string
  title: string
  category: string
  imageUrl: string | null
  tags: string[]
  source: string | null
  createdAt: Date
}

export type WardrobeSummary = {
  count: number
  lastAddedAt: Date | null
  recent: WardrobeItemRow[]
  loadError?: string | null
}

const EMPTY: WardrobeSummary = {
  count: 0,
  lastAddedAt: null,
  recent: [],
  loadError: null,
}

export const WARDROBE_DB_UNAVAILABLE_RU =
  "База данных сейчас недоступна. Проверьте интернет и переменные DATABASE_URL / пулер Supabase в .env.local."

export async function getWardrobeSummary(userId: string): Promise<WardrobeSummary> {
  try {
    const [count, recent, lastRow] = await Promise.all([
      prisma.wardrobeItem.count({ where: { userId } }),
      prisma.wardrobeItem.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          category: true,
          imageUrl: true,
          tags: true,
          source: true,
          createdAt: true,
        },
      }),
      prisma.wardrobeItem.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ])

    return {
      count,
      lastAddedAt: lastRow?.createdAt ?? null,
      recent,
      loadError: null,
    }
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[looky] getWardrobeSummary: DB unreachable", e)
      }
      return { ...EMPTY, loadError: WARDROBE_DB_UNAVAILABLE_RU }
    }
    throw e
  }
}

export type GetWardrobeItemResult =
  | { ok: true; item: WardrobeItemRow | null }
  | { ok: false; dbUnavailable: true }

export async function getWardrobeItem(userId: string, id: string): Promise<GetWardrobeItemResult> {
  try {
    const item = await prisma.wardrobeItem.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        category: true,
        imageUrl: true,
        tags: true,
        source: true,
        createdAt: true,
      },
    })
    return { ok: true, item }
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[looky] getWardrobeItem: DB unreachable", e)
      }
      return { ok: false, dbUnavailable: true }
    }
    throw e
  }
}

export type ListWardrobeItemsResult = {
  items: WardrobeItemRow[]
  loadError: string | null
}

export async function listWardrobeItems(userId: string): Promise<ListWardrobeItemsResult> {
  try {
    const items = await prisma.wardrobeItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        imageUrl: true,
        tags: true,
        source: true,
        createdAt: true,
      },
    })
    return { items, loadError: null }
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[looky] listWardrobeItems: DB unreachable", e)
      }
      return { items: [], loadError: WARDROBE_DB_UNAVAILABLE_RU }
    }
    throw e
  }
}
