import { ArrowLeft, GitFork, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ProcessSection from "@/components/ProcessSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ContactForm from "@/components/ContactForm";
import FinalCTA from "@/components/FinalCTA";

import beforeImg from "@/assets/before.png";
import afterImg from "@/assets/after.png";

export default function Process() {
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
          <GitFork className="w-4 h-4 mr-2 text-primary" /> Seamless Execution
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-wider mb-4">
          How It <span className="shimmer-text">Works</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          From photo submission to cinematic render in 4 streamlined steps. Zero shooting equipment needed.
        </p>
      </div>

      <ProcessSection />
      <BeforeAfterSlider beforeImage={beforeImg} afterImage={afterImg} />
      <ContactForm />
      <FinalCTA />
    </main>
  );
}
