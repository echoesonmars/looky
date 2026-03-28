import type { IconType } from "react-icons"
import {
  RiHome5Line,
  RiCompass3Line,
  RiTShirt2Line,
  RiChat3Line,
  RiUser3Line,
} from "react-icons/ri"

export const APP_NAV_ITEMS: { href: string; label: string; Icon: IconType }[] = [
  { href: "/home", label: "Главная", Icon: RiHome5Line },
  { href: "/discover", label: "Лента", Icon: RiCompass3Line },
  { href: "/wardrobe", label: "Гардероб", Icon: RiTShirt2Line },
  { href: "/stylist", label: "Стилист", Icon: RiChat3Line },
  { href: "/profile", label: "Профиль", Icon: RiUser3Line },
]
