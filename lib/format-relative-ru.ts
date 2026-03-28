/** Короткая фраза для даты добавления вещи. */
export function formatRelativeRuPast(date: Date): string {
  const diff = Date.now() - date.getTime()
  if (diff < 0) return "только что"
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "только что"
  if (minutes < 60) return `${minutes} мин. назад`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ч. назад`
  const days = Math.floor(hours / 24)
  if (days === 1) return "вчера"
  if (days < 7) return `${days} дн. назад`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} нед. назад`
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}
