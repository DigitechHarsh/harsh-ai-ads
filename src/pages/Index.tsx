import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ProcessSection from "@/components/ProcessSection";
import SamplesSection from "@/components/SamplesSection";
import ContactForm from "@/components/ContactForm";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
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
          if (id) {
            // If we are in the samples section, only update hash if not already on a sub-tab
            const currentHash = window.location.hash;
            if (id === "samples" && (currentHash === "#aiimages" || currentHash === "#aivideos")) {
              return;
            }
            navigate(`/#${id}`, { replace: true });
          }
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <main className="min-h-screen bg-background relative">
      <div id="home" className="absolute top-0 w-full h-10 pointer-events-none" />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ProcessSection />
      <SamplesSection />
      <TestimonialsSection />
      <TrustSection />
      <FAQSection />
      <ContactForm />
      <FinalCTA />
    </main>
  );
};

export default Index;
