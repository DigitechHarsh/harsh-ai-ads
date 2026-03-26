import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import SamplesSection from "@/components/SamplesSection";
import OfferSection from "@/components/OfferSection";
import ContactForm from "@/components/ContactForm";
import TrustSection from "@/components/TrustSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <main className="min-h-screen bg-background">
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <SamplesSection />
    <OfferSection />
    <TrustSection />
    <ContactForm />
    <FinalCTA />
    <Footer />
    <WhatsAppButton />
  </main>
);

export default Index;
