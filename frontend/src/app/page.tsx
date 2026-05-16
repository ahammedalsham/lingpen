import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProblemStatement from '@/components/home/ProblemStatement';
import PlatformOverview from '@/components/home/PlatformOverview';
import InteractiveDemo from '@/components/home/InteractiveDemo';
import LanguageEcosystem from '@/components/home/LanguageEcosystem';
import ResearchInfrastructure from '@/components/home/ResearchInfrastructure';
import CommunitySection from '@/components/home/CommunitySection';
import EducationPathway from '@/components/home/EducationPathway';
import StatsStrip from '@/components/home/StatsStrip';
import FeaturedTreebank from '@/components/home/FeaturedTreebank';
import CallToAction from '@/components/home/CallToAction';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 font-sans">
      <Navbar />
      <Hero />
      <ProblemStatement />
      <PlatformOverview />
      <InteractiveDemo />
      <LanguageEcosystem />
      <ResearchInfrastructure />
      <CommunitySection />
      <EducationPathway />
      <StatsStrip />
      <FeaturedTreebank />
      <CallToAction />  
      <Footer />
    </main>
  );
}