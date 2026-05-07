import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ProcessSection from "@/components/ProcessSection";
import SamplesSection from "@/components/SamplesSection";

import ContactForm from "@/components/ContactForm";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";

const Index = () => (
  <main className="min-h-screen bg-background">
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <ProcessSection />
    <SamplesSection />

    <TrustSection />
    <FAQSection />
    <ContactForm />
    <FinalCTA />
  </main>
);

export default Index;
