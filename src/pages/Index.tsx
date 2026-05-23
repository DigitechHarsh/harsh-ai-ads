import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import SamplesSection from "@/components/SamplesSection";
import ContactForm from "@/components/ContactForm";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Cinematic3DSection from "@/components/Cinematic3DSection";

// Import assets for slider
import beforeImg from "@/assets/before.png";
import afterImg from "@/assets/after.png";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Delay observer start to let initial hash-based navigation settle
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll("section[id], div[id='form'], div[id='home']");
      const options = {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const currentHash = window.location.hash;
            
            // Critical: Don't override sub-tabs in samples section
            if (id === "samples" && (currentHash === "#aiimages" || currentHash === "#aivideos")) {
              return;
            }

            if (id && `#${id}` !== currentHash) {
              navigate(`/#${id}`, { replace: true });
            }
          }
        });
      }, options);

      sections.forEach((section) => observer.observe(section));

      return () => {
        sections.forEach((section) => observer.unobserve(section));
      };
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background relative">
      <div id="home" className="absolute top-0 w-full h-10 pointer-events-none" />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BeforeAfterSlider beforeImage={beforeImg} afterImage={afterImg} />
      <ServicesSection />
      <Cinematic3DSection />
      <ProcessSection />
      <SamplesSection />
      <TestimonialsSection />
      <PricingSection />
      <TrustSection />
      <FAQSection />
      <ContactForm />
      <FinalCTA />
    </main>
  );
};

export default Index;
