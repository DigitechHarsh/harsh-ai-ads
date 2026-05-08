import { motion } from "framer-motion";
import { EyeOff, TrendingDown, ThumbsDown } from "lucide-react";

const problems = [
  { icon: ThumbsDown, text: "Your product looks ordinary" },
  { icon: EyeOff, text: "Customers ignore your ads" },
  { icon: TrendingDown, text: "Low engagement & low sales" },
];

const ProblemSection = () => (
  <section className="py-10 md:py-16 px-4">
    <div className="container max-w-4xl">
      <motion.h2
        className="text-2xl md:text-4xl font-display font-bold text-center mb-8"
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
            className="bg-card border border-border rounded-xl p-8 text-center hover:border-destructive/30 transition-colors group"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: i * 0.15,
              ease: "easeOut"
            }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <p.icon className="w-10 h-10 text-destructive mx-auto mb-4 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
            </motion.div>
            <p className="text-lg font-medium text-foreground">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
