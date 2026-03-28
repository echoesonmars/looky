/** WMO Weather interpretation codes (Open-Meteo). */
export function weatherConditionLabel(code: number | null): string {
  if (code === null) return "Погода уточняется"
  if (code === 0) return "Ясно"
  if (code <= 3) return "Переменная облачность"
  if (code <= 48) return "Туман или изморось"
  if (code <= 57) return "Морось"
  if (code <= 67) return "Дождь"
  if (code <= 77) return "Снег"
  if (code <= 82) return "Ливень"
  if (code <= 86) return "Снегопад"
  if (code <= 99) return "Гроза или град"
  return "Осадки"
}

export function clothingTipFromWeather(weatherCode: number | null, tempC: number | null): string {
  const t = tempC ?? 15
  const code = weatherCode ?? 1

  const cold = t < 5
  const cool = t >= 5 && t < 12
  const mild = t >= 12 && t < 20
  const warm = t >= 20

  const rain =
    (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)
  const snow = (code >= 71 && code <= 77) || code === 85 || code === 86
  const storm = code >= 95

  if (storm) return "Сегодня лучше плотный верхний слой и устойчивая обувь — небо непредсказуемо."
  if (snow || cold) return "Теплый промежуточный слой и верхняя одежда с запасом — комфорт важнее тренда."
  if (rain) return "Водостойкий верх или зонт; обувь с устойчивой подошвой — лужи не должны портить день."
  if (cool) return "Лёгкий слой + кардиган или пиджак — легко снять, если станет теплее."
  if (mild) return "Один аккуратный слой и при необходимости лёгкая куртка на вечер."
  if (warm) return "Дышащие ткани и минимум слоёв — пусть кожа чувствует воздух."
  return "Сбалансируйте комфорт и контекст дня — один акцент в образе достаточно."
}

/** Одна короткая строка для компактного UI (bento и т.п.). */
export function clothingTipShort(weatherCode: number | null, tempC: number | null): string {
  const t = tempC ?? 15
  const code = weatherCode ?? 1
  const cold = t < 5
  const cool = t >= 5 && t < 12
  const mild = t >= 12 && t < 20
  const warm = t >= 20
  const rain =
    (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)
  const snow = (code >= 71 && code <= 77) || code === 85 || code === 86
  const storm = code >= 95
  if (storm) return "Плотный верх, устойчивая обувь."
  if (snow || cold) return "Теплый слой и куртка с запасом."
  if (rain) return "Водостойкий верх, надёжная обувь."
  if (cool) return "Лёгкий слой + накидка на снятие."
  if (mild) return "Один слой, куртка на вечер."
  if (warm) return "Дышащие ткани, минимум слоёв."
  return "Один акцент в образе — достаточно."
}

export function weatherSuggestsOuterLayer(weatherCode: number | null): boolean {
  if (weatherCode === null) return false
  const rain =
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82) ||
    (weatherCode >= 95 && weatherCode <= 99)
  const snow = (weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86
  return rain || snow
}

/** Подсказки для пустых слотов «что надеть» (заголовок + подзаголовок). */
export function wearPlaceholderHints(
  weatherCode: number | null,
  tempC: number | null,
): { title: string; hint: string }[] {
  const t = tempC ?? 15
  const outer = weatherSuggestsOuterLayer(weatherCode)
  const warm = t >= 22

  const hints: { title: string; hint: string }[] = []
  if (outer) {
    hints.push({
      title: "Верхний слой",
      hint: "Плащ или пальто под погоду.",
    })
  } else if (warm) {
    hints.push({
      title: "Лёгкий верх",
      hint: "Лён или хлопок.",
    })
  } else {
    hints.push({
      title: "Базовый верх",
      hint: "Нейтральная основа + акцент.",
    })
  }
  hints.push({
    title: "Обувь",
    hint: "Пара под маршрут и погоду.",
  })
  hints.push({
    title: "Акцент",
    hint: "Одна деталь завершает образ.",
  })
  return hints
}
