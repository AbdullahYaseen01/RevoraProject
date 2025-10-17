import HeroSection from "@/components/ui/HeroSection"
import FeaturesSection from "@/components/ui/FeaturesSection"
import PropertySlider from "@/components/ui/PropertySlider"
import TestimonialsSection from "@/components/ui/TestimonialsSection"
import CTASection from "@/components/ui/CTASection"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PropertySlider />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}