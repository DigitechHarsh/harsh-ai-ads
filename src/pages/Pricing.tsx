import { ArrowLeft, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import PricingSection from "@/components/PricingSection";
import TrustSection from "@/components/TrustSection";
import ContactForm from "@/components/ContactForm";
import FinalCTA from "@/components/FinalCTA";

export default function Pricing() {
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
          <Tag className="w-4 h-4 mr-2 text-primary" /> Transparent Packages
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-wider mb-4">
          Simple, <span className="shimmer-text">High-ROI Pricing</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hollywood-grade 3D cinematic AI video ads starting at just ₹999. Pick the ideal tier for your growth goals.
        </p>
      </div>

      <PricingSection />
      <TrustSection />
      <ContactForm />
      <FinalCTA />
    </main>
  );
}
