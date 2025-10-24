import HeroSection from "@/components/ui/HeroSection"
import FeaturesSection from "@/components/ui/FeaturesSection"
import PropertySlider from "@/components/ui/PropertySlider"
import TestimonialsSection from "@/components/ui/TestimonialsSection"
import CTASection from "@/components/ui/CTASection"
import SubscriptionForm from "@/components/SubscriptionForm"
// axasasxihais
export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PropertySlider />
      <TestimonialsSection />
      <CTASection />
      
      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <SubscriptionForm />
        </div>
      </section>
    </div>
  );
}