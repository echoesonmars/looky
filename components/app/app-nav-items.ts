import type { IconType } from "react-icons"
import {
  RiHome5Line,
  RiCompass3Line,
  RiTShirt2Line,
  RiChat3Line,
  RiUser3Line,
  RiImageAddLine,
} from "react-icons/ri"

export type AppNavItem = { href: string; label: string; Icon: IconType }

/** Полный список для сайдбара и активных состояний (порядок важен). */
export const APP_NAV_ITEMS: AppNavItem[] = [
  { href: "/home", label: "Главная", Icon: RiHome5Line },
  { href: "/discover", label: "Лента", Icon: RiCompass3Line },
  { href: "/wardrobe", label: "Гардероб", Icon: RiTShirt2Line },
  { href: "/stylist", label: "Стилист", Icon: RiChat3Line },
  { href: "/try-on", label: "Примерка", Icon: RiImageAddLine },
  { href: "/profile", label: "Профиль", Icon: RiUser3Line },
]

const DOCK_PRIMARY_HREFS = ["/home", "/discover", "/wardrobe", "/stylist"] as const
const DOCK_MORE_HREFS = ["/profile", "/try-on"] as const

/** Нижний док: четыре основных пункта. */
export const APP_DOCK_PRIMARY: AppNavItem[] = DOCK_PRIMARY_HREFS.map((href) => {
  const item = APP_NAV_ITEMS.find((i) => i.href === href)
  if (!item) throw new Error(`Missing nav item for dock primary: ${href}`)
  return item
})

/** Нижний док: лист «Ещё» (порядок — профиль, затем примерка). */
export const APP_DOCK_MORE: AppNavItem[] = DOCK_MORE_HREFS.map((href) => {
  const item = APP_NAV_ITEMS.find((i) => i.href === href)
  if (!item) throw new Error(`Missing nav item for dock more: ${href}`)
  return item
})

/** Секции сайдбара: навигация без профиля, затем аккаунт. */
export const APP_SIDEBAR_SECTIONS: { title: string; items: AppNavItem[] }[] = [
  {
    title: "Навигация",
    items: APP_NAV_ITEMS.filter((i) => i.href !== "/profile"),
  },
  {
    title: "Аккаунт",
    items: APP_NAV_ITEMS.filter((i) => i.href === "/profile"),
  },
]
