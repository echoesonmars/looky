/** Slug хранится в БД; подписи — для UI. */
export const WARDROBE_CATEGORIES = [
  { id: "top", label: "Верх" },
  { id: "bottom", label: "Низ" },
  { id: "shoes", label: "Обувь" },
  { id: "outer", label: "Верхняя одежда" },
  { id: "accessory", label: "Аксессуар" },
  { id: "other", label: "Другое" },
] as const

export type WardrobeCategoryId = (typeof WARDROBE_CATEGORIES)[number]["id"]

export const WARDROBE_CATEGORY_IDS: WardrobeCategoryId[] = WARDROBE_CATEGORIES.map((c) => c.id)

export function wardrobeCategoryLabel(id: string): string {
  const row = WARDROBE_CATEGORIES.find((c) => c.id === id)
  return row?.label ?? id
}

export function isWardrobeCategoryId(v: string): v is WardrobeCategoryId {
  return (WARDROBE_CATEGORY_IDS as readonly string[]).includes(v)
}
