"use client";

import { motion } from "motion/react";
import { RiSmartphoneLine, RiRobot2Line, RiShapesLine, RiSparklingLine } from "react-icons/ri";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { Meteors } from "@/components/ui/meteors";

const TABS = [
  { label: "Верх", active: true },
  { label: "Низ", active: false },
  { label: "Обувь", active: false },
];

export function BentoGridSection() {
  return (
    <section
      id="solution"
      className="w-full max-w-6xl mx-auto border-x border-b"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      <div className="border-b grid grid-cols-[auto_1fr]" style={{ borderColor: "var(--grid-border)" }}>
        <div
          className="px-6 sm:px-8 py-4 border-r text-[11px] tracking-widest uppercase font-geist-secondary"
          style={{ borderColor: "var(--grid-border)", color: "var(--accent-orange)" }}
        >
          01-02 / экосистема looky
        </div>
        <div className="px-6 sm:px-8 py-4">
          <BlurFade delay={0} inView>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
              <AnimatedShinyText className="inline-block">virtual try-on + ai-стилист</AnimatedShinyText>
            </h2>
          </BlurFade>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-7 sm:py-8 border-b" style={{ borderColor: "var(--grid-border)" }}>
        <BlurFade delay={0.05} inView>
          <p className="max-w-4xl text-lg sm:text-xl leading-[1.32] font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
            Экосистема Looky соединяет примерку, сборку образов и бизнес-метрики в одном интерфейсе.
            Ниже блоки выстроены в единый grid без визуальных разрывов.
          </p>
        </BlurFade>
      </div>

      <div className="grid grid-cols-12 auto-rows-[240px] gap-px" style={{ background: "var(--grid-border)" }}>
        <BlurFade delay={0.1} inView className="col-span-12 md:col-span-7 md:row-span-2">
          <div className="h-full bg-(--grid-cell-bg)">
            <MagicCard
              className="relative p-8 sm:p-10 h-full w-full rounded-none flex flex-col justify-between overflow-hidden"
              gradientFrom="var(--accent-orange)"
              gradientTo="var(--accent-yellow)"
              gradientColor="rgba(251,86,7,0.06)"
            >
              <div className="absolute inset-0 bg-linear-to-br from-background/50 to-transparent z-10 pointer-events-none" />

              <div className="relative z-20">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-border bg-background shadow-sm">
                  <RiSmartphoneLine className="w-6 h-6" style={{ color: "var(--accent-orange)" }} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Virtual Try-On</h3>
                <p className="text-muted-foreground font-geist-secondary mb-6 max-w-sm">
                  Система определяет ваш силуэт по фото и реалистично накладывает 2D-одежду. Никаких возвратов из-за &quot;не сидит&quot;.
                </p>
              </div>

              {/* Decorative Mockup */}
              <div className="relative z-20 mt-auto flex-1 bg-foreground/5 rounded-t-2xl border-x border-t border-border/60 overflow-hidden shrink-0 min-h-[170px]">
                <BorderBeam size={100} duration={6} colorFrom="var(--accent-orange)" colorTo="var(--accent-yellow)" />
                <div className="absolute inset-x-0 bottom-0 top-6 bg-background rounded-t-2xl border-t border-border/80 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] mx-6 p-4">
                  <div className="flex gap-2 mb-4 justify-center">
                    {TABS.map((tab) => (
                      <div 
                        key={tab.label} 
                        className={cn(
                          "px-3 py-1 text-xs rounded-full font-geist-secondary font-medium transition-colors",
                          tab.active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {tab.label}
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-8 bg-muted rounded-full overflow-hidden flex items-center px-1">
                    <motion.div 
                      className="h-6 rounded-full w-24"
                      style={{ background: "var(--accent-orange)" }}
                      animate={{ x: [0, 80, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView className="col-span-12 md:col-span-5">
          <div className="h-full bg-(--grid-cell-bg)">
            <MagicCard
              className="relative p-8 h-full w-full rounded-none flex flex-col justify-between"
              gradientFrom="var(--accent-yellow)"
              gradientTo="var(--accent-orange)"
              gradientColor="rgba(255,190,11,0.06)"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-background shadow-sm">
                  <RiRobot2Line className="w-5 h-5" style={{ color: "var(--accent-yellow)" }} />
                </div>
                <div className="px-3 py-1 rounded-full border border-border/50 text-xs font-geist-secondary text-muted-foreground bg-muted/30">
                  Мгновенно
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-foreground mb-2">AI-Стилист</h3>
                <p className="text-sm text-muted-foreground font-geist-secondary">
                  Алгоритм комбинирует товары в полноценные визуальные образы (верх, низ, обувь) с учетом стиля и жизненного сценария.
                </p>
              </div>
            </MagicCard>
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView className="col-span-12 sm:col-span-6 md:col-span-5">
          <div className="h-full bg-(--grid-cell-bg)">
            <MagicCard
              className="relative p-7 h-full w-full rounded-none flex flex-col justify-between"
              gradientFrom="var(--accent-orange)"
              gradientTo="var(--accent-yellow)"
              gradientColor="rgba(251,86,7,0.08)"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-border bg-background shadow-sm">
                <RiShapesLine className="w-5 h-5" style={{ color: "var(--accent-orange)" }} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground leading-tight">Готовые образы</h3>
                <p className="text-sm font-geist-secondary text-muted-foreground leading-relaxed">
                  Пользователь получает не одиночные SKU, а полноценный комплект: верх, низ, обувь.
                </p>
              </div>
            </MagicCard>
          </div>
        </BlurFade>

        <BlurFade delay={0.4} inView className="col-span-12 sm:col-span-6 md:col-span-2">
          <div className="h-full bg-(--grid-cell-bg)">
            <div className="relative p-6 h-full w-full rounded-none flex flex-col justify-between overflow-hidden bg-foreground text-background border border-foreground">
              <Meteors number={12} className="opacity-40" />
              <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center bg-background/20 backdrop-blur-sm">
                <RiSparklingLine className="w-5 h-5 text-background" />
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-bold text-background mb-2 leading-tight">Умная персонализация</h3>
                <p className="text-sm font-medium text-background/75 font-geist-secondary">
                  Вкусы обучаются свайпами и контекстом.
                </p>
                <p className="text-xs mt-3 text-background/55 font-geist-secondary">
                  Меньше шума в каталоге, выше вероятность точного выбора.
                </p>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
