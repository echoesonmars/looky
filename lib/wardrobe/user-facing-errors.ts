/** Короткие сообщения для UI; без внутренних кодов API. */
export function humanizeWardrobeFlowError(raw: string): string {
  const s = raw.trim()
  if (!s) return "Что-то пошло не так. Попробуйте ещё раз."
  if (/loading_timeout/i.test(s)) return "Нейросеть просыпается, попробуйте отправить фото еще раз."
  if (/^unauthorized$/i.test(s)) return "Вы не авторизованы. Пожалуйста, войдите в аккаунт."
  if (/^hf_proxy_|^hf_inference_|^hf_upstream_/i.test(s)) return "Не удалось распознать фото. Попробуйте другое изображение или подождите."
  if (/^openai_|^hf_invalid|^hf_token/i.test(s)) return "Не удалось обработать. Попробуйте ещё раз."
  if (/not_configured|missing|token_not/i.test(s)) return "Сервис временно недоступен. Проверьте настройки проекта."
  if (/^Ошибка \d+$/.test(s) || /^Ошибка сохранения$/i.test(s)) return "Не удалось сохранить. Попробуйте ещё раз."
  if (s.length > 120) return "Не удалось выполнить операцию. Попробуйте ещё раз."
  return s
}

