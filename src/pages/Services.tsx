import { ArrowLeft, Sparkles, Layers, Video } from "lucide-react";
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
    <main className="min-h-screen bg-background pt-24">
      <div className="p-4 max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="pt-6 pb-12 px-6 max-w-5xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-4 h-4 mr-2 text-primary" /> End-to-End Production
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-wider mb-4">
          Our <span className="shimmer-text">Services</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          From 4K hyper-realistic CGI commercial renders to high-converting social video ads, explore our full spectrum of AI production capabilities.
        </p>
      </div>

      <ServicesSection />
      <Cinematic3DSection />
      <SolutionSection />
      <ContactForm />
      <FinalCTA />
    </main>
  );
}
