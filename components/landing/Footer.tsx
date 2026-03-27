"use client";

import { motion } from "motion/react";
import { RiGithubLine, RiTwitterXLine, RiInstagramLine, RiArrowUpLine } from "react-icons/ri";
import { BlurFade } from "@/components/ui/blur-fade";
import { Meteors } from "@/components/ui/meteors";
import Link from "next/link";

const footerColumns = [
  {
    title: "Продукт",
    links: [
      { label: "Virtual Try-On", href: "#try-on" },
      { label: "AI-Стилист", href: "#stylist" },
      { label: "Свайп-сетинг", href: "#swipe" },
      { label: "Интеграция", href: "#business" },
    ],
  },
  {
    title: "Ресурсы",
    links: [
      { label: "Документация", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "SDKs & Библиотеки", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Связь",
    links: [
      { label: "Поддержка", href: "#" },
      { label: "Контакты", href: "#" },
      { label: "Медиакит", href: "#" },
    ],
  },
];

const socials = [
  { icon: RiGithubLine, href: "#", label: "GitHub" },
  { icon: RiTwitterXLine, href: "#", label: "Twitter" },
  { icon: RiInstagramLine, href: "#", label: "Instagram" },
];

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-border/10 bg-black pt-16 sm:pt-24 pb-8 overflow-hidden text-zinc-400">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <Meteors number={30} className="hidden sm:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12 sm:gap-16 mb-16 sm:mb-24">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                LOOKY
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 align-super"
                  style={{ background: "var(--accent-orange)" }}
                />
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-geist-secondary">
              Мы убиваем онлайн-шопинг в его текущем виде. Никаких примерочных. Система определяет силуэт и накладывает одежду прямо на вас. Вы видите правду.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 w-full md:w-auto flex-1 md:max-w-[600px]">
            {footerColumns.map((col, idx) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold tracking-widest text-zinc-300 uppercase font-geist-secondary mb-1">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm hover:text-white transition-colors font-geist-secondary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-900">
          <p className="text-xs font-geist-secondary">
            © {new Date().getFullYear()} Looky. Все права защищены.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-xs hover:text-white transition-colors font-geist-secondary">Политика конфиденциальности</a>
            <a href="#" className="text-xs hover:text-white transition-colors font-geist-secondary">Условия использования</a>
            
            <motion.button
              onClick={scrollTop}
              className="ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs hover:text-white hover:border-zinc-700 transition-all font-geist-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RiArrowUpLine className="w-3.5 h-3.5" />
              Наверх
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
