import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="py-20 px-4">
    <div className="container max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-4xl font-display font-bold mb-6">
          Don't Let Your Product Look <span className="text-destructive">Cheap</span>
        </h2>
        <a
          href="#form"
          className="inline-block bg-gold-gradient text-primary-foreground font-bold px-10 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity animate-pulse-glow"
        >
          Get Started Now for ₹399
        </a>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
