/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Imports real clothing products from dummyjson.com into CatalogItem.
 * Run: npm run db:import
 * Safe to re-run — skips items already imported from this source.
 */
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

/** dummyjson slug → our Russian category label */
const CATEGORY_MAP = {
  tops: "Верх",
  "mens-shirts": "Верх",
  "womens-dresses": "Платья",
  "womens-bags": "Аксессуары",
  "womens-shoes": "Обувь",
  "mens-shoes": "Обувь",
  "womens-jewellery": "Аксессуары",
  sunglasses: "Аксессуары",
}

const TAG_DEFS = [
  { key: "style:casual" },
  { key: "style:formal" },
  { key: "style:street" },
  { key: "fit:oversize" },
  { key: "fit:slim" },
  { key: "color:black" },
  { key: "color:white" },
  { key: "color:neutral" },
  { key: "color:bright" },
  { key: "color:blue" },
  { key: "season:summer" },
  { key: "season:winter" },
  { key: "material:wool" },
  { key: "material:linen" },
  { key: "material:denim" },
  { key: "category:outer" },
  { key: "category:bottom" },
  { key: "category:dress" },
  { key: "category:knit" },
  { key: "gender:women" },
  { key: "gender:men" },
  { key: "type:bag" },
  { key: "type:shoes" },
  { key: "type:accessory" },
]

/** Infer our tag keys from dummyjson product data */
function inferTagKeys(dummyCat, title, description) {
  const text = `${title} ${description}`.toLowerCase()
  const tags = []

  // Gender
  if (dummyCat.includes("womens")) tags.push("gender:women")
  if (dummyCat.includes("mens")) tags.push("gender:men")

  // Category type
  if (dummyCat === "womens-dresses") tags.push("category:dress")
  if (dummyCat === "womens-bags") tags.push("type:bag")
  if (dummyCat.includes("shoes")) tags.push("type:shoes")
  if (dummyCat === "womens-jewellery" || dummyCat === "sunglasses") tags.push("type:accessory")
  if (dummyCat === "tops" || dummyCat === "mens-shirts") {
    if (text.includes("knit") || text.includes("sweater") || text.includes("wool")) {
      tags.push("category:knit")
    }
  }

  // Color
  if (text.includes("black")) tags.push("color:black")
  else if (text.includes("white") || text.includes("ivory") || text.includes("cream")) tags.push("color:white")
  else if (text.includes("blue") || text.includes("denim") || text.includes("navy")) tags.push("color:blue")
  else if (
    text.includes("red") ||
    text.includes("pink") ||
    text.includes("yellow") ||
    text.includes("bright") ||
    text.includes("orange") ||
    text.includes("purple")
  ) {
    tags.push("color:bright")
  } else {
    tags.push("color:neutral")
  }

  // Style
  if (
    text.includes("formal") ||
    text.includes("office") ||
    text.includes("classic") ||
    text.includes("elegant") ||
    text.includes("business")
  ) {
    tags.push("style:formal")
  } else if (
    text.includes("street") ||
    text.includes("urban") ||
    text.includes("cargo") ||
    text.includes("graphic")
  ) {
    tags.push("style:street")
  } else {
    tags.push("style:casual")
  }

  // Fit
  if (text.includes("slim") || text.includes("fitted") || text.includes("tight") || text.includes("skinny")) {
    tags.push("fit:slim")
  } else if (text.includes("oversized") || text.includes("loose") || text.includes("wide") || text.includes("baggy")) {
    tags.push("fit:oversize")
  }

  // Material
  if (text.includes("denim") || text.includes("jeans")) tags.push("material:denim")
  else if (text.includes("wool") || text.includes("knit") || text.includes("cashmere")) tags.push("material:wool")
  else if (text.includes("linen")) tags.push("material:linen")

  // Season
  if (text.includes("summer") || text.includes("light") || text.includes("breathable")) tags.push("season:summer")
  else if (text.includes("winter") || text.includes("warm") || text.includes("heavy") || text.includes("thick")) {
    tags.push("season:winter")
  }

  return tags
}

async function fetchCategory(slug) {
  const url = `https://dummyjson.com/products/category/${slug}?limit=100`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${slug}`)
  const data = await res.json()
  return data.products ?? []
}

async function main() {
  console.log("▶ Синхронизируем теги…")
  const tagByKey = new Map()
  for (const t of TAG_DEFS) {
    const row = await prisma.tag.upsert({
      where: { key: t.key },
      create: { key: t.key },
      update: {},
    })
    tagByKey.set(t.key, row.id)
  }
  console.log(`  ${TAG_DEFS.length} тегов готово`)

  let totalNew = 0
  let totalSkipped = 0

  for (const [slug, ourCategory] of Object.entries(CATEGORY_MAP)) {
    process.stdout.write(`\n▶ Загружаем «${slug}» → ${ourCategory}… `)
    let products
    try {
      products = await fetchCategory(slug)
    } catch (e) {
      console.warn(`ПРОПУЩЕНО (${e.message})`)
      continue
    }
    console.log(`${products.length} товаров`)

    for (const product of products) {
      const existing = await prisma.catalogItem.findFirst({
        where: { title: product.title, source: "dummyjson" },
        select: { id: true },
      })
      if (existing) {
        totalSkipped++
        continue
      }

      const tagKeys = inferTagKeys(slug, product.title, product.description ?? "")
      await prisma.catalogItem.create({
        data: {
          title: product.title,
          category: ourCategory,
          imageUrl: product.thumbnail ?? null,
          isActive: true,
          source: "dummyjson",
          tags: {
            create: tagKeys
              .filter((k) => tagByKey.has(k))
              .map((key) => ({ tagId: tagByKey.get(key) })),
          },
        },
      })
      totalNew++
    }
  }

  console.log(`\n✓ Готово — добавлено ${totalNew} новых, пропущено ${totalSkipped} дублей`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
