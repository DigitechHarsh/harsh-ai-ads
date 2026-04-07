import { motion } from "framer-motion";
import { Upload, Sparkles, Send } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Images",
    description: "Fill the quick form and upload up to 5 high-quality images of your product.",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: Sparkles,
    title: "AI Magic",
    description: "Our experts use premium AI models and cinematic editing to transform your visuals.",
    color: "from-gold/20 to-yellow-600/20",
  },
  {
    icon: Send,
    title: "Fast Delivery",
    description: "Get your high-converting cinematic ad delivered via WhatsApp within 24-48 hours.",
    color: "from-green-500/20 to-emerald-600/20",
  },
];

const ProcessSection = () => (
  <section className="py-24 px-6 relative overflow-hidden bg-secondary/20">
    <div className="container max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 italic">
          How It <span className="text-gold-gradient">Works</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Our streamlined process ensures you get premium results with zero effort. 
          From upload to final ad in just 3 simple steps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
        {/* Connector lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
        
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative z-10 text-center group"
          >
            <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} border border-white/5 flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
              <step.icon className="w-10 h-10 text-gold" />
            </div>
            
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border border-gold/30 flex items-center justify-center text-xs font-bold text-gold">
              0{index + 1}
            </div>

            <h3 className="text-xl font-bold mb-4 group-hover:text-gold transition-colors">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;
