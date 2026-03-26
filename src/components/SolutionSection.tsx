import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SolutionSection = () => (
  <section className="py-20 px-4">
    <div className="container max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Sparkles className="w-12 h-12 text-gold mx-auto mb-6" />
        <h2 className="text-2xl md:text-4xl font-display font-bold mb-6">
          The <span className="text-gold-gradient">Solution</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          We create high-end cinematic ads using AI that make your product look{" "}
          <span className="text-foreground font-semibold">premium</span> and{" "}
          <span className="text-foreground font-semibold">increase conversions</span>.
        </p>
      </motion.div>
    </div>
  </section>
);

export default SolutionSection;
