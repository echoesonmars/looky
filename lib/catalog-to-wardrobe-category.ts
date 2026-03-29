import type { WardrobeCategoryId } from "@/lib/wardrobe-categories"

type TagRow = { tag: { key: string } }

/**
 * CatalogItem.category в сиде — русские ярлыки; WardrobeItem.category — slug из WARDROBE_CATEGORIES.
 */
export function mapCatalogToWardrobeCategory(
  catalogCategory: string,
  tagRows: TagRow[],
): WardrobeCategoryId {
  const keys = new Set(tagRows.map((r) => r.tag.key))
  const c = catalogCategory.trim()

  if (c === "Низ") return "bottom"
  if (c === "Платья") return "other"

  if (c === "Верх") {
    if (keys.has("category:outer")) return "outer"
    return "top"
  }

  if (c === "Обувь") return "shoes"
  if (c === "Аксессуар") return "accessory"

  if (keys.has("category:bottom")) return "bottom"
  if (keys.has("category:outer")) return "outer"
  if (keys.has("category:dress")) return "other"

  return "other"
}
