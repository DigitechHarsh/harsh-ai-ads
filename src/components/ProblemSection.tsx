import { motion } from "framer-motion";
import { EyeOff, TrendingDown, ThumbsDown } from "lucide-react";

const problems = [
  { icon: ThumbsDown, text: "Your product looks ordinary" },
  { icon: EyeOff, text: "Customers ignore your ads" },
  { icon: TrendingDown, text: "Low engagement & low sales" },
];

const ProblemSection = () => (
  <section className="py-20 px-4">
    <div className="container max-w-4xl">
      <motion.h2
        className="text-2xl md:text-4xl font-display font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Sound <span className="text-gold-gradient">Familiar?</span>
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            className="bg-card border border-border rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <p.icon className="w-10 h-10 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
