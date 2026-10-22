import MarketTape from "@/components/landing/MarketTape";
import SiteHeader from "@/components/landing/SiteHeader";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import LiveDemo from "@/components/landing/LiveDemo";
import BotsSection from "@/components/landing/BotsSection";
import Transparency from "@/components/landing/Transparency";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import SiteFooter from "@/components/landing/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas font-body text-fg">
      <MarketTape />
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <LiveDemo />
        <BotsSection />
        <Transparency />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
