/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

/** @type {{ key: string }[]} */
const TAG_DEFS = [
  { key: "style:casual" },
  { key: "style:formal" },
  { key: "style:street" },
  { key: "fit:oversize" },
  { key: "fit:slim" },
  { key: "color:black" },
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
]

/** @type {{ title: string; category: string; imageSeed: string; tagKeys: string[] }[]} */
const ITEMS = [
  { title: "Оверсайз худи графит", category: "Верх", imageSeed: "looky-h1", tagKeys: ["style:casual", "fit:oversize", "color:black", "category:knit", "season:winter"] },
  { title: "Льняное платье миди", category: "Платья", imageSeed: "looky-d1", tagKeys: ["style:casual", "fit:slim", "color:neutral", "material:linen", "season:summer", "category:dress"] },
  { title: "Шерстяной пальто camel", category: "Верх", imageSeed: "looky-o1", tagKeys: ["style:formal", "fit:slim", "color:neutral", "material:wool", "season:winter", "category:outer"] },
  { title: "Винтажные джинсы", category: "Низ", imageSeed: "looky-j1", tagKeys: ["style:street", "fit:slim", "color:blue", "material:denim", "category:bottom"] },
  { title: "Чёрная водолазка", category: "Верх", imageSeed: "looky-t1", tagKeys: ["style:formal", "fit:slim", "color:black", "category:knit", "season:winter"] },
  { title: "Белая футболка heavy", category: "Верх", imageSeed: "looky-t2", tagKeys: ["style:casual", "fit:oversize", "color:neutral", "season:summer", "category:knit"] },
  { title: "Юбка миди плиссе", category: "Низ", imageSeed: "looky-s1", tagKeys: ["style:formal", "fit:slim", "color:bright", "season:summer", "category:bottom"] },
  { title: "Кардиган бежевый", category: "Верх", imageSeed: "looky-k1", tagKeys: ["style:casual", "fit:oversize", "color:neutral", "material:wool", "category:knit"] },
  { title: "Кожаная куртка", category: "Верх", imageSeed: "looky-l1", tagKeys: ["style:street", "fit:slim", "color:black", "category:outer", "season:winter"] },
  { title: "Широкие брюки", category: "Низ", imageSeed: "looky-p1", tagKeys: ["style:formal", "fit:oversize", "color:neutral", "category:bottom"] },
  { title: "Платье-сорочка хаки", category: "Платья", imageSeed: "looky-d2", tagKeys: ["style:casual", "fit:slim", "color:neutral", "season:summer", "category:dress"] },
  { title: "Свитер косами", category: "Верх", imageSeed: "looky-k2", tagKeys: ["style:casual", "fit:oversize", "color:bright", "material:wool", "category:knit"] },
  { title: "Рубашка в полоску", category: "Верх", imageSeed: "looky-r1", tagKeys: ["style:formal", "fit:slim", "color:neutral", "season:summer"] },
  { title: "Шорты чинос", category: "Низ", imageSeed: "looky-sh1", tagKeys: ["style:casual", "fit:slim", "color:neutral", "season:summer", "category:bottom"] },
  { title: "Пуховик короткий", category: "Верх", imageSeed: "looky-pu1", tagKeys: ["style:street", "fit:oversize", "color:black", "category:outer", "season:winter"] },
  { title: "Макси-платье цветочное", category: "Платья", imageSeed: "looky-d3", tagKeys: ["style:casual", "fit:slim", "color:bright", "season:summer", "category:dress"] },
  { title: "Гольфы меланж", category: "Верх", imageSeed: "looky-g1", tagKeys: ["style:casual", "fit:slim", "color:neutral", "category:knit"] },
  { title: "Джинсовая куртка", category: "Верх", imageSeed: "looky-dj1", tagKeys: ["style:street", "fit:oversize", "material:denim", "category:outer", "season:summer"] },
  { title: "Классические брюки", category: "Низ", imageSeed: "looky-tr1", tagKeys: ["style:formal", "fit:slim", "color:black", "category:bottom"] },
  { title: "Топ на бретелях", category: "Верх", imageSeed: "looky-top1", tagKeys: ["style:casual", "fit:slim", "color:neutral", "season:summer"] },
  { title: "Парка оливковая", category: "Верх", imageSeed: "looky-pk1", tagKeys: ["style:street", "fit:oversize", "color:neutral", "category:outer", "season:winter"] },
  { title: "Юбка-карандаш", category: "Низ", imageSeed: "looky-sk1", tagKeys: ["style:formal", "fit:slim", "color:black", "category:bottom"] },
  { title: "Худи tie-dye", category: "Верх", imageSeed: "looky-td1", tagKeys: ["style:street", "fit:oversize", "color:bright", "category:knit"] },
  { title: "Пальто в клетку", category: "Верх", imageSeed: "looky-pl1", tagKeys: ["style:formal", "fit:slim", "color:bright", "category:outer", "season:winter"] },
  { title: "Комбинезон деним", category: "Платья", imageSeed: "looky-c1", tagKeys: ["style:street", "fit:slim", "material:denim", "category:dress"] },
]

async function main() {
  const tagByKey = new Map()
  for (const t of TAG_DEFS) {
    const row = await prisma.tag.upsert({
      where: { key: t.key },
      create: { key: t.key },
      update: {},
    })
    tagByKey.set(t.key, row.id)
  }

  // Optional: clear catalog for idempotent re-seed in dev
  await prisma.catalogItemTag.deleteMany({})
  await prisma.catalogItem.deleteMany({})

  for (const item of ITEMS) {
    const imageUrl = `https://picsum.photos/seed/${item.imageSeed}/720/960`
    const created = await prisma.catalogItem.create({
      data: {
        title: item.title,
        category: item.category,
        imageUrl,
        isActive: true,
        source: "seed",
        tags: {
          create: item.tagKeys
            .filter((k) => tagByKey.has(k))
            .map((key) => ({ tagId: tagByKey.get(key) })),
        },
      },
    })
    void created
  }

  console.log(`Seeded ${ITEMS.length} catalog items, ${TAG_DEFS.length} tags.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
