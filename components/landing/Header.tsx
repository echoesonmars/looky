"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";

const navLinks = [
  { label: "проблема", href: "#problem" },
  { label: "решение", href: "#solution" },
  { label: "свайпы", href: "#swipe" },
];

const ctaButtonClass =
  "inline-flex items-center justify-center text-sm px-4 py-2 font-medium transition-all duration-150";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <header
        className="w-full max-w-6xl mx-auto sticky top-0 z-50 border-b transition-colors duration-200"
        style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 90%, transparent)" }}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center px-6 sm:px-8 py-3.5">
          {/* Logo cell */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
                looky
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 align-super"
                  style={{ background: "var(--accent-orange)" }}
                />
              </span>
            </Link>
          </div>

          {/* Nav cell - desktop */}
          <div className="hidden sm:flex items-center justify-center gap-8">
            <Link
              href="/home"
              className="text-sm tracking-tight font-geist-secondary transition-colors duration-150 hover:text-(--grid-foreground)"
              style={{ color: "var(--grid-muted)" }}
            >
              приложение
            </Link>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-tight font-geist-secondary transition-colors duration-150 hover:text-(--grid-foreground)"
                style={{ color: "var(--grid-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA cell */}
          <div className="flex items-center justify-end gap-3">
            {status === "loading" ? (
              <span className="hidden sm:inline-block h-9 w-20 rounded-sm opacity-40" style={{ background: "var(--grid-border)" }} aria-hidden />
            ) : session?.user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/profile"
                  className={`hidden sm:inline-flex ${ctaButtonClass}`}
                  style={{
                    background: "transparent",
                    color: "var(--grid-foreground)",
                    border: "1px solid var(--grid-border)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-orange)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-orange)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--grid-border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--grid-foreground)";
                  }}
                >
                  профиль
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login?callbackUrl=/home"
                  className={ctaButtonClass}
                  style={{
                    background: "var(--grid-foreground)",
                    color: "var(--grid-on-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-orange)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--grid-foreground)";
                    (e.currentTarget as HTMLElement).style.color = "var(--grid-on-foreground)";
                  }}
                >
                  войти
                </Link>
                <Link
                  href="/register"
                  className={`${ctaButtonClass} border`}
                  style={{
                    background: "transparent",
                    color: "var(--grid-foreground)",
                    borderColor: "var(--grid-border)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-orange)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-orange)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--grid-border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--grid-foreground)";
                  }}
                >
                  регистрация
                </Link>
              </div>
            )}
            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2"
              style={{ color: "var(--grid-foreground)" }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="sm:hidden overflow-hidden border-t"
              style={{ borderColor: "var(--grid-border)" }}
            >
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                className="border-b"
                style={{ borderColor: "var(--grid-border)" }}
              >
                <Link
                  href="/home"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-6 py-4 text-sm font-geist-secondary transition-colors hover:text-(--grid-foreground)"
                  style={{ color: "var(--grid-muted)" }}
                >
                  приложение
                </Link>
              </motion.div>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 1) * 0.05 }}
                  className="flex items-center border-b px-6 py-4 text-sm font-geist-secondary transition-colors hover:text-(--grid-foreground)"
                  style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="p-5 px-6 flex flex-col gap-2">
                {session?.user ? (
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3 text-sm font-medium border"
                    style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
                  >
                    профиль
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login?callbackUrl=/home"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 text-sm font-medium"
                      style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
                    >
                      войти
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 text-sm font-medium border"
                      style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
                    >
                      регистрация
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
