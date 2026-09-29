import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ServicesSection from "@/components/ServicesSection";
import Cinematic3DSection from "@/components/Cinematic3DSection";
import SolutionSection from "@/components/SolutionSection";
import ContactForm from "@/components/ContactForm";
import FinalCTA from "@/components/FinalCTA";

export default function Services() {
  return (
    <main className="min-h-screen bg-transparent pt-16 md:pt-20">
      <div className="px-4 sm:px-6 pt-2 max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Home
          </Button>
        </Link>
        <Badge variant="outline" className="text-[10px] text-gold border-gold/30">
          <Sparkles className="w-3 h-3 mr-1 text-gold" /> AI Production Suite
        </Badge>
      </div>

      <ServicesSection />
      <Cinematic3DSection />
      <SolutionSection />
      <ContactForm />
      <FinalCTA />
    </main>
  );
}
