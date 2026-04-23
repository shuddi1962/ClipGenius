import Navigation from '@/components/marketing/navigation';
import HeroSection from '@/components/marketing/hero-section';
import SocialProofBar from '@/components/marketing/social-proof-bar';
import FeatureHighlights from '@/components/marketing/feature-highlights';
import AdsManagementSection from '@/components/marketing/ads-management-section';
import AnimatedStatsSection from '@/components/marketing/animated-stats-section';
import TestimonialsSection from '@/components/marketing/testimonials-section';
import Footer from '@/components/marketing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <SocialProofBar />
        <FeatureHighlights />
        <AdsManagementSection />
        <AnimatedStatsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}