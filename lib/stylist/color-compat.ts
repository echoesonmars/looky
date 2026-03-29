/**
 * Rule-based color compatibility for outfit items.
 * Extracts color:* tags from wardrobe items and gives a compatibility score.
 */

type ColorFamily =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "brown"
  | "white"
  | "black"
  | "grey"
  | "beige"
  | "navy"

const COLOR_MAP: Record<string, ColorFamily> = {
  red: "red",
  crimson: "red",
  burgundy: "red",
  maroon: "red",
  coral: "red",
  orange: "orange",
  amber: "orange",
  rust: "orange",
  yellow: "yellow",
  mustard: "yellow",
  gold: "yellow",
  green: "green",
  olive: "green",
  khaki: "green",
  mint: "green",
  teal: "green",
  emerald: "green",
  blue: "blue",
  sky: "blue",
  cyan: "blue",
  denim: "blue",
  cobalt: "blue",
  purple: "purple",
  violet: "purple",
  lavender: "purple",
  lilac: "purple",
  pink: "pink",
  blush: "pink",
  fuchsia: "pink",
  magenta: "pink",
  brown: "brown",
  tan: "brown",
  caramel: "brown",
  mocha: "brown",
  chocolate: "brown",
  white: "white",
  cream: "white",
  ivory: "white",
  off_white: "white",
  black: "black",
  grey: "grey",
  gray: "grey",
  silver: "grey",
  charcoal: "grey",
  beige: "beige",
  sand: "beige",
  nude: "beige",
  oatmeal: "beige",
  navy: "navy",
  indigo: "navy",
}

const NEUTRALS = new Set<ColorFamily>(["white", "black", "grey", "beige", "navy"])

// Color wheel index for complementary / analogous logic
const COLOR_WHEEL: ColorFamily[] = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]

function colorWheelIndex(c: ColorFamily): number {
  return COLOR_WHEEL.indexOf(c)
}

function isNeutral(c: ColorFamily): boolean {
  return NEUTRALS.has(c)
}

function pairScore(a: ColorFamily, b: ColorFamily): number {
  // neutrals go with everything
  if (isNeutral(a) || isNeutral(b)) return 1.0
  if (a === b) return 1.0 // monochrome
  const ai = colorWheelIndex(a)
  const bi = colorWheelIndex(b)
  if (ai === -1 || bi === -1) return 0.7
  const dist = Math.min(Math.abs(ai - bi), COLOR_WHEEL.length - Math.abs(ai - bi))
  if (dist === 1) return 0.85 // analogous
  if (dist === 3 || dist === 4) return 0.9 // complementary (opposite)
  if (dist === 2) return 0.7 // split complementary
  return 0.55
}

/** Extract the color family from a tag string like "color:navy blue" → "navy" */
function extractColor(tag: string): ColorFamily | null {
  const lower = tag.toLowerCase()
  if (!lower.startsWith("color:")) return null
  const val = lower.slice(6).trim().replace(/\s+/g, "_")
  // Try exact
  if (val in COLOR_MAP) return COLOR_MAP[val]!
  // Try first word
  const firstWord = val.split("_")[0]!
  return COLOR_MAP[firstWord] ?? null
}

export type ColoredItem = { id: string; tags: string[] }

/**
 * Returns a [0..1] score for the outfit's color harmony.
 * 1.0 = perfect, 0.0 = clash.
 */
export function outfitColorScore(items: ColoredItem[]): number {
  const families = items
    .flatMap((it) => it.tags)
    .map(extractColor)
    .filter((c): c is ColorFamily => c !== null)

  if (families.length < 2) return 1.0 // no data → assume ok

  const uniqueFamilies = [...new Set(families)]

  if (uniqueFamilies.length === 1) return 1.0 // monochrome

  let total = 0
  let count = 0
  for (let i = 0; i < uniqueFamilies.length; i++) {
    for (let j = i + 1; j < uniqueFamilies.length; j++) {
      total += pairScore(uniqueFamilies[i]!, uniqueFamilies[j]!)
      count++
    }
  }
  return count > 0 ? total / count : 1.0
}

/** Human-readable color harmony label */
export function colorHarmonyLabel(score: number): string {
  if (score >= 0.9) return "Отличное сочетание цветов"
  if (score >= 0.75) return "Хорошее сочетание цветов"
  if (score >= 0.6) return "Приемлемое сочетание"
  return "Цвета могут конфликтовать"
}
