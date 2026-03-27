import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoGridSection } from "@/components/landing/BentoGridSection";
import { SwipeSection } from "@/components/landing/SwipeSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      
      {/* 
        The Problem sets the stage. 
        Then we show the Bento solution. 
        Then we dive deep into the Swipe/Tinder logic feature. 
      */}
      <ProblemSection />
      <BentoGridSection />
      <SwipeSection />
      
      <Footer />
    </main>
  );
}
